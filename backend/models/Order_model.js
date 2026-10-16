
import mongoose from 'mongoose';


const shopOrderItemsSchema = new mongoose.Schema({
    item:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Item" //Shop Model se refrence lena hai uska
    },
    name:String,
    price:Number,
    quantity:{
        type:Number,
      required:true
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
    shopOrderItems:[shopOrderItemsSchema],
    status:{
      type:String,
      enum:['pending', 'processing', 'out for delivery', 'delivered'],
      default:'pending'
    },
    assignment:{
      type:mongoose.Schema.Types.ObjectId,
      ref:"DeliveryAssignment",
      default:null
    },
    assignedDeliveryBoy:{
       type:mongoose.Schema.Types.ObjectId,
      ref:"User",
      default:null
    },
      deliveryOtp: {
        type: String,
        default: null,
    },
    
    otpExpires: {
        type: Date,
        default: null,
    },
    deliveryAt:{
        type:Date,
        default:null
    }

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
    type: {
      text: {
        type: String,
        required: true
      },
      latitude: Number,
      longitude: Number
    },
    required: true
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
  },
  assignment:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"DeliveryAssignment",
    default:null
  },
  shopOrders:[shopOrderSchema]
}, {
  timestamps: true
});



export default mongoose.model('Order', orderSchema);