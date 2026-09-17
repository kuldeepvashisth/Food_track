import Shop from '../models/shop_models.js';
import uploadOnCloudinary from '../utils/cloudinary.js';

const createAndEditShop = async (req, res) => {
    try {
        const { name, city, state, address } = req.body || {};
        const shopName = name || req.body?.Name || "";
        let image = null;

        if (req.file) {
            console.log(req.file)
            image = await uploadOnCloudinary(req.file.path);
        }

        let shop = await Shop.findOne({ owner: req.userId });

        const updateData = {
            name: shopName,
            city,
            state,
            address,
            owner: req.userId,
        };

        if (image) {
            updateData.image = image;
        }

        if (!shop) {
            shop = await Shop.create(updateData);
        } else {
            shop = await Shop.findByIdAndUpdate(shop._id, updateData, { new: true });
        }

        await shop.populate("owner items");
        return res.status(201).json(shop);
    } 

    catch (err) {
    console.error("CREATE SHOP ERROR:", err);
    return res.status(500).json({
        message: `error while create shop: ${err.message || err}`
    });
}
};

const getMyShop = async (req, res) => {
    try {
        const shop = await Shop.findOne({ owner: req.userId }).populate({
            path: "items",
            options: {
                sort: { updatedAt: -1 },
            },
        });
        if (!shop) {
            return res.status(200).json(null);
        }

        return res.status(200).json(shop);
    } catch (err) {
        return res.status(500).json({ message: `error in get my shop : ${err.message || err}` });
    }
};

const getNearbyShops = async (req, res) => {
    try {
        const { city } = req.params;
        if (!city) {
            return res.status(400).json({ message: 'City is required.' });
        }

        const shops = await Shop.find({ city: { $regex: `^${city}$`, $options: 'i' } })
            .populate('items')
            .sort({ name: 1 });
            
        return res.status(200).json(shops);
    } catch (err) {
        return res.status(500).json({ message: `error in nearby shops: ${err.message || err}` });
    }
};

export { createAndEditShop, getMyShop, getNearbyShops };

