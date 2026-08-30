
const mongoose = require('mongoose');


const shopOrderItemsSchema = new mongoose.Schema({
    item:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Item" //Shop Model se refrence lena hai uska
    },
    price:Number,
    quantity:{
        type:Number,
        require:true
    }
},{timestamps:true})

const shopOrderSchema = new mongoose.Schema({
    shopName:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Shop" //Shop Model se refrence lena hai uska
    },
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    subTotal:Number,
    shopOrderItems:[shopOrderItemsSchema]

},{timestamps:true})


const orderSchema = new mongoose.Schema({
//  kis user ne kra hai order
    user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  paymentMethod: {
    type: String,
    enum: ['cod', 'online'],
    required: true
  },
  deliveryAddress: {
    text: String,
    required: true,
    latitude: Number,
    longitude: Number
},

    // kisi ne 2 shop se order kiya to dono ka alag alag order hoga
  
  totalAmount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'shipped', 'delivered'],
    default: 'pending'
  }
}, {
  timestamps: true
});



module.exports = mongoose.model('Order', orderSchema);