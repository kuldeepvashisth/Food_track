const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
    Name: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: false,
    },
    shop: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Shop',
        required: true
    },
    category: {
        type: String,
        enum: [
            "snacks",
            "main course",
            "deserts",
            "Pizza",
            "Burgers",
            "South Indian",
            "North Indian",
            "chinese",
            "Fast food",
            "Others"
        ],
        required: true
    },
    price: {
        type: Number,
        min: 0,
        required: true
    },
    Foodtype: {
        type: String,
        enum: ["veg", "Non-veg"],
        required: true
    },
    rating:{
        average:{type:Number,default:0},
        count:{type:Number,default:0}
    }
}, { timestamps: true });

module.exports = mongoose.model('Item', itemSchema);