import DeliveryAssignment from '../models/deliveryAssignmentModel.js';
import Order_model from '../models/Order_model.js';
import Shop from '../models/shop_models.js';
import User from '../models/usermodel.js';
import mongoose from 'mongoose';

export const placeOrder = async (req, res) => {
    try {
        const { cartItems, paymentMethod, deliveryAddress, totalAmount } = req.body;
        if (!Array.isArray(cartItems) || cartItems.length === 0) return res.status(400).json({ message: 'Cart is empty' });
        if (!deliveryAddress?.text || deliveryAddress.latitude == null || deliveryAddress.longitude == null) {
            return res.status(400).json({ message: 'Complete Delivery address is required' });
        }

        const groupItemsByShop = {};
        cartItems.forEach(item => {
            const shopId = item.shopId || item.shop;
            if (!shopId) throw new Error(`Cart item has no shop: ${item.name || item._id || item.id}`);
            groupItemsByShop[shopId] ??= [];
            groupItemsByShop[shopId].push(item);
        });

        const shopOrders = await Promise.all(Object.keys(groupItemsByShop).map(async shopId => {
            const shop = await Shop.findById(shopId).populate('owner');
            if (!shop) throw new Error(`Shop not found: ${shopId}`);
            const items = groupItemsByShop[shopId];
            return {
                shopName: shop._id,
                owner: shop.owner._id,
                subTotal: items.reduce((sum, item) => sum + Number(item.price) * Number(item.quantity), 0),
                shopOrderItems: items.map(item => ({ item: item._id || item.id, price: item.price, quantity: item.quantity, name: item.name }))
            };
        }));

        const newOrder = await Order_model.create({ user: req.userId, paymentMethod, deliveryAddress, totalAmount, shopOrders });
        return res.status(201).json(newOrder);
    } catch (error) {
        return res.status(500).json({ message: 'Error placing order', error });
    }
};

export const getMyOrders = async (req, res) => {
    try {
        const user = await User.findById(req.userId).select('role');
        if (!user) return res.status(401).json({ message: 'User not found' });
        let query;
        if (user.role === 'owner') {
            query = { 'shopOrders.owner': req.userId };
        } else if (user.role === 'deliveryBoy') {
            const assignments = await DeliveryAssignment.find({
                $or: [{ broadcastedTo: req.userId }, { assignedTo: req.userId }]
            }).select('order');
            query = { _id: { $in: assignments.map(assignment => assignment.order) } };
        } else {
            query = { user: req.userId };
        }
        const orders = await Order_model.find(query).sort({ createdAt: -1 })
            .populate({ path: 'shopOrders.shopName', select: 'name' })
            .populate({ path: 'shopOrders.owner', select: 'Name Email' })
            .populate('user')
            .populate({ path: 'shopOrders.shopOrderItems.item', select: 'name image price' })
            .populate({ path: 'shopOrders.assignment', populate: { path: 'broadcastedTo', select: 'Name mobile location' } });

        if (user.role === 'deliveryBoy') return res.status(200).json(orders);
        if (user.role !== 'owner') return res.status(200).json(orders);
        const ownerOrders = orders.map(order => {
            const ownerOrder = order.toObject();
            ownerOrder.shopOrders = ownerOrder.shopOrders.filter(shopOrder => String(shopOrder.owner?._id || shopOrder.owner) === String(req.userId));
            return ownerOrder;
        });
        return res.status(200).json(ownerOrders);
    } catch (error) {
        return res.status(500).json({ message: 'Error fetching user orders', error });
    }
};

export const changeOrderStatus = async (req, res) => {
    try {
        const { orderId, shopId } = req.params;
        const { status } = req.body;
        const allowedStatuses = ['pending', 'processing', 'out for delivery', 'delivered'];
        if (!mongoose.Types.ObjectId.isValid(orderId) || !mongoose.Types.ObjectId.isValid(shopId)) return res.status(400).json({ message: 'Invalid order id' });

        if (!allowedStatuses.includes(status)) return res.status(400).json({ message: 'Invalid order status' });

        const order = await Order_model.findOne({
            _id: orderId,
            'shopOrders._id': shopId,
            'shopOrders.owner': req.userId
        });
        if (!order) return res.status(404).json({ message: 'Order not found' });
        const shopOrder = order.shopOrders.id(shopId);

        let availableBoys = [];
        let deliveryboyPayload = [];

        if (status === 'out for delivery' && !shopOrder.assignment) {
            const { latitude, longitude } = order.deliveryAddress;
            const nearbyDeliveryBoys = await User.find({
                role: 'deliveryBoy',
                location: {
                    $near: {
                        $geometry: { type: 'Point', coordinates: [longitude, latitude] },
                        $maxDistance: 5000
                    }
                }
            }).select('Name mobile location');

            const nearbyIds = nearbyDeliveryBoys.map(person => person._id);
            const busyIds = await DeliveryAssignment.find({
                assignedTo: { $in: nearbyIds },
                status: 'assigned'
            }).select('assignedTo');  //measn of select here ??
            const busyIdsSet = new Set(busyIds.map(id => String(id.assignedTo)));
            availableBoys = nearbyDeliveryBoys.filter(person => !busyIdsSet.has(String(person._id)));

            const candidateIds = availableBoys.map(person => person._id);
            if (candidateIds.length > 0) {
                const deliveryAssignment = await DeliveryAssignment.create({
                    order: order._id,
                    shop: shopOrder.shopName,
                    shopOrderId: shopOrder._id,
                    broadcastedTo: candidateIds,
                    status: 'broadcasted',

                });
                shopOrder.assignment = deliveryAssignment._id;
                shopOrder.assignedDeliveryBoy = deliveryAssignment.assignedTo;

                deliveryboyPayload = availableBoys.map((boy) => ({
                    id: boy._id,
                    Name: boy.Name,
                    mobile: boy.mobile,
                    longitude: boy.location.coordinates[0],
                    latitude: boy.location.coordinates[1]
                }));
            }

        }

        shopOrder.status = status;
        await order.save();
        const updatedShopOrder = order.shopOrders.id(shopId);

        return res.status(200).json({
            message: availableBoys.length === 0 && status === 'out for delivery'
                ? 'Order status updated; no available delivery boys found'
                : 'Order status updated',
            shopOrder: updatedShopOrder,
            availableBoys,
            availableDeliveryBoys: deliveryboyPayload,
            assignedDeliveryBoy: updatedShopOrder.assignedDeliveryBoy,
            assignment: updatedShopOrder.assignment
        });
    } catch (error) {
        return res.status(500).json({ message: 'Error updating order status', error: error.message });
    }
};

export const getDeliveryBoyAssignment=async (req,res)=>{
    try{
        const deliveryBoyId=req.userId
        const assognments=await DeliveryAssignment.find({
            broadcastedTo:deliveryBoyId,
            status:"broadcasted"
        })
        .populate("order")
        .populate("shop")

        const formatted=assignment.map(a=>({
            assignmentId:a._id,
            orderId:a.order._id,
            shopName:a.shop.name,
            deliveryAddress:a.order.deliveryAddress,
            items:a.order.shopOrders.find(so=>so._id.equals(a.shopOrderid)).shopOrderItems||[],
            subTotal:a.order.shopOrders.find(so=>so._id.equals(a.shopOrderid))?.subtotal
        }))
        return res.status(200).json(formtted)
    }

    catch(err){
        return res.status(500).json({message:"get Assignment Order error"})
    }
}