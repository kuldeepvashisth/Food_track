const mongoose = require('mongoose');

const shopSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    city: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: false,
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    state: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    items:[ {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Item',
    }]
}, { timestamps: true });

module.exports = mongoose.model('Shop', shopSchema);

/*
1.Frontend se img lenge
2.multer middleware ke zariye use public folder mai dallenge
3.then use cloudinary pr daalenge which will return a string 
4.we store that string and dlt our orig imag form public folder
*/