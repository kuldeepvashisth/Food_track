import uploadOnCloudinary from '../utils/cloudinary.js';
import Shop from '../models/shop_models.js';
import Item from '../models/items_model.js';

const getItemById = async (req, res) => {
    try {
        const shop = await Shop.findOne({ owner: req.userId });
        if (!shop) {
            return res.status(404).json({ message: "Shop not found." });
        }

        const item = await Item.findOne({
            _id: req.params.itemId,
            shop: shop._id,
        });

        if (!item) {
            return res.status(404).json({ message: "Food item not found." });
        }

        return res.status(200).json(item);
    } catch (err) {
        return res.status(500).json({
            message: "Unable to get food item.",
            error: err.message || err,
        });
    }
};

const addItem = async (req, res) => {
    try {
        const { name, category, foodType, price } = req.body || {};
        const cleanName = name?.trim();
        if (!cleanName || !category || !foodType || Number(price) <= 0) {
            return res.status(400).json({ message: "Please provide a food name, category, type, and valid price." });
        }
        let image = null;

        if (req.file) {
            image = await uploadOnCloudinary(req.file.path);
        }

        const shop = await Shop.findOne({ owner: req.userId })
        if (!shop) {
            return res.status(400).json({ message: "shop not found" });
        }

        const existingItem = await Item.findOne({
            shop: shop._id,
            Name: { $regex: `^${cleanName.replace(/[.*+?^${}()|[\\]\\]/g, "\\$&")}$`, $options: "i" },
        });
        if (existingItem) {
            return res.status(409).json({ message: "This food item is already on your menu. Use a unique food name." });
        }

        const item = await Item.create({
            Name: cleanName,
            category,
            Foodtype: foodType,
            price,
            image,
            shop: shop._id,
        });
        shop.items.push(item._id);
        await shop.save();
        await shop.populate({
            path: "items",
            options: {
                sort: { updatedAt: -1 },
            },
        });
        return res.status(201).json(shop);
    } catch (err) {
        return res.status(500).json({ message: "Add item error", error: err.message || err });
    }
};

const editItem = async (req, res) => {
    try {
        const itemId = req.params.itemId;
        const { name, category, foodType, price } = req.body || {};
        const shop = await Shop.findOne({ owner: req.userId });

        if (!shop) {
            return res.status(404).json({ message: "Shop not found." });
        }

        const item = await Item.findOne({
            _id: itemId,
            shop: shop._id,
        });

        if (!item) {
            return res.status(404).json({ message: "Food item not found." });
        }

        if (!name?.trim() || !category || !foodType || Number(price) <= 0) {
            return res.status(400).json({ message: "Please provide all valid food details." });
        }
        let image = null;

        if (req.file) {
            image = await uploadOnCloudinary(req.file.path);
        }

        const updateData = {
            Name: name.trim(),
            category,
            Foodtype: foodType,
            price,
        };

        if (image) {
            updateData.image = image;
        }

        await Item.findByIdAndUpdate(itemId, updateData, {
            new: true,
            runValidators: true,
        });

        await shop.populate({
            path: "items",
            options: {
                sort: { updatedAt: -1 },
            },
        });

        return res.status(200).json(shop);
    } catch (err) {
        return res.status(500).json({ message: "err while editing item", error: err.message || err });
    }
};

const deleteItem = async (req, res) => {
    try {
        const itemId = req.params.itemId;

        const shop = await Shop.findOne({ owner: req.userId });

        if (!shop) {
            return res.status(404).json({
                message: "Shop not found."
            });
        }

        const item = await Item.findOne({
            _id: itemId,
            shop: shop._id
        });

        if (!item) {
            return res.status(404).json({
                message: "Food item not found."
            });
        }

        await Item.findByIdAndDelete(itemId);

        shop.items.pull(itemId);
        await shop.save();

        await shop.populate({
            path: "items",
            options: {
                sort: { updatedAt: -1 }
            }
        });

        return res.status(200).json(shop);

    } catch (err) {
        return res.status(500).json({
            message: "Error while deleting item",
            error: err.message || err
        });
    }
};

 const getItemByCity = async (req, res) => {
      try {
            const { city } = req.params;
            if (!city) {
                return res.status(400).json({ message: 'City is required.' });
            }
    
            const shops = await Shop.find({ city: { $regex: `^${city}$`, $options: 'i' } })
                .populate('items')
                .sort({ name: 1 });
                if(!shops || shops.length === 0){
                    return res.status(200).json({ shops: [], items: [] });
                }
            const shopIds=shops.map((shop)=>shop._id)
                const items = await Item.find({ shop: { $in: shopIds } }).sort({ updatedAt: -1 });
                if(!items || items.length === 0){
                    return res.status(200).json({ shops, items: [] });
                }
            return res.status(200).json({ shops, items });
        } catch (err) {
            return res.status(500).json({ message: `error in nearby shops items fetching: ${err.message || err}` });
        }
}

export { addItem, editItem, getItemById, deleteItem, getItemByCity };
