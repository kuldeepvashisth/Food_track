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
                // The delivery dashboard is a list of offers. Once a partner
                // accepts one, it changes to "assigned" and must disappear
                // from this list.
                broadcastedTo: req.userId,
                status: 'broadcasted'
            }).select('order');//assignment mai se sirf order wali field lo
           // --v
            //Sirf wahi orders lao jinki IDs current delivery boy ke assignments mein mili hain.
           //Isliye delivery boy ko database ke saare orders nahi milt
            query = { _id: { $in: assignments.map(assignment => assignment.order) } };
            //ye query jb orders mai pass hogi to only assigned orders hi milegnge
        } else {
            query = { user: req.userId };
        }
        // ye orders user role ke accoriding honge bcoz we pass query based on role
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
            // Agar customer ne Shop A aur Shop B dono se order kiya hai,
            //  to Shop A ke owner ko Shop B ka shop order nahi dikhega.
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
            'shopOrders._id': shopId, //order model ke andr shopOrders:[shopOrderSchema] array hai usme 
            // shopOrders ke andr each array ki ek id hai bcoz each array itself a schema ,to us id se match kro current shop ko
            // and shopOrders ke each array mai hi owner attribute bhi hai
            'shopOrders.owner': req.userId
        });
        if (!order) return res.status(404).json({ message: 'Order not found' });
        const shopOrder = order.shopOrders.id(shopId);
        //vo element meand vo order mil gya jiska status change hua hai ab us order mai 
        //se shopOrder nikalo  jis order ki id change hui hai shopId ke base pr
        let availableBoys = [];
        let deliveryboyPayload = [];

        if (status === 'out for delivery' && !shopOrder.assignment) {
            const { latitude, longitude } = order.deliveryAddress;
            /*
            Is query ka meaning:
  
  Sirf deliveryBoy role wale users search karo.
  Customer ke delivery location ke around search karo.
  Maximum distance 5000 meters, yani 5 km.
  Sirf name, mobile aur location data lao.
            */

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
                status: 'assigned'    //Yahan check hota hai ki nearby delivery boys mein se kaun already kisi order par assigned hai.
            }).select('assignedTo');  //measn of select here ??
            const busyIdsSet = new Set(busyIds.map(id => String(id.assignedTo)));
            availableBoys = nearbyDeliveryBoys.filter(person => !busyIdsSet.has(String(person._id)));
            /*
            CandidateId:Ye sirf available boys ki IDs hain:
            #In IDs ko assignment mein save kiya jaata hai:
            #broadcastedTo: candidateIds
            availableBoys:nearby+free
            
            *availableBoys = abhi available boys ki temporary details
            candidateIds = un boys ki IDs
            assignment = order aur boys ke relation ka permanent record
            
            Assignment ek permanent database record hai jo yaad rakhta hai:
                Ye order kin delivery boys ko dikhana hai? 
            Order kis shop ka hai?
            Kaunsa shopOrder hai?
            Assignment ka status kya hai?
            Kaunsa boy finally assigned hua?

            
            */
            const candidateIds = availableBoys.map(person => person._id);
            if (candidateIds.length > 0) {
                const deliveryAssignment = await DeliveryAssignment.create({
                    order: order._id,
                    shop: shopOrder.shopName,
                    shopOrderId: shopOrder._id,
                    broadcastedTo: candidateIds, //Ye delivery request in delivery boys ko show karni hai.
                    status: 'broadcasted',

                });

                /*
                Assignment create hone ke baad uski ID shop order ke andar save hoti hai.
                Ab shop order kuch aisa ho jaata hai:

                {
                shopName: shopId,
                status: "out for delivery",
                assignment: assignmentId
             }


                */
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


//whny do we need getDeliveryBoyAssignment
// Agar aap frontend mein directly assignments se cards render karna chahte ho, tab ye endpoint use kar sakte ho
export const getDeliveryBoyAssignment = async (req, res) => {
    try {
        const deliveryBoyId = req.userId
        const assignment = await DeliveryAssignment.find({
            broadcastedTo: deliveryBoyId,
            status: "broadcasted"
        })
            /*
                Assignment ke saath order aur shop lana
                Assignment mein normally sirf IDs saved hoti hain:
                order: orderId
                shop: shopId
    
                *populate() in IDs ko actual documents mein convert karta hai.
                Iske baad:
                {
                a.order
                mein complete order data hota hai.
                simlarly a.shop mai complete shop ka dtaa
                means after populate we can access shop name as a.shop.name
                }
                
            */

            .populate("order")
            .populate("shop")

        const formatted = assignment.flatMap(a => {
            // An old assignment can outlive a deleted order/shop document.
            // Skip it instead of failing the whole delivery dashboard request.
            if (!a.order) return [];
            const shopOrder = a.order.shopOrders.find(so => so._id.equals(a.shopOrderId));
            return [{
                assignmentId: a._id,
                orderId: a.order._id,
                shopName: a.shop?.name || 'Shop unavailable',
                deliveryAddress: a.order.deliveryAddress,
                items: shopOrder?.shopOrderItems || [],
                subTotal: shopOrder?.subTotal || 0
            }];
        });
        return res.status(200).json(formatted);
    }

    catch (err) {
        return res.status(500).json({ message: "get Assignment Order error" })
    }
}

export const acceptOrder = async (req, res) => {
    try {
        const { assignmentId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(assignmentId)) {
            return res.status(400).json({ message: 'Invalid assignment id' });
        }

        const alreadyAssigned = await DeliveryAssignment.findOne({
            assignedTo: req.userId,
            status: 'assigned'
        });

        if (alreadyAssigned) {
            return res.status(400).json({
                message: "You are already assigned to another order"
            });
        }

        // The conditional update prevents two delivery partners accepting the
        // same broadcast at the same time.
        const assignment = await DeliveryAssignment.findOneAndUpdate(
            { _id: assignmentId, broadcastedTo: req.userId, status: 'broadcasted' },
            { assignedTo: req.userId, status: 'assigned', acceptedAt: new Date() },
            { new: true }
        );

        if (!assignment) {
            return res.status(409).json({ message: 'This delivery request is no longer available' });
        }

        const order = await Order_model.findById(assignment.order);

        if (!order) {
            return res.status(400).json({
                message: "order not found"
            });
        }

        const shopOrder = order.shopOrders.id(assignment.shopOrderId);

        if (!shopOrder) {
            return res.status(404).json({ message: 'Shop order not found' });
        }

        shopOrder.assignedDeliveryBoy = req.userId;

        await order.save();

        return res.status(200).json({
            message: "order accepted"
        });

    } catch (error) {
        return res.status(500).json({
            message: `accept order error ${error}`
        });
    }
};
