import express from 'express';
// const { createAndEditShop, getMyShop, getNearbyShops } = require('../controller/shopController');
import isAuth from '../middleware/isAuth.js';
import { placeOrder, getMyOrders, changeOrderStatus, getDeliveryBoyAssignment, 
    getCurrentOrderForDeliveryBoy, 
    acceptOrder,getOrderByIdForTracking, sendOtpFordeliery, verifyDeliveryOtp } from '../controller/PlaceOrderController.js';
// const { getMyOrders, updateShopOrderStatus } = require('../controller/PlaceOrderController')
const OrderRouter = express.Router();

OrderRouter.post("/place-order", isAuth, placeOrder);
OrderRouter.get("/my-orders", isAuth, getMyOrders);
OrderRouter.post("/update-status/:orderId/:shopId", isAuth, changeOrderStatus);
OrderRouter.get("/get-assignments", isAuth, getDeliveryBoyAssignment);
OrderRouter.get("/get-current-order", isAuth, getCurrentOrderForDeliveryBoy);
OrderRouter.post("/send-otp", isAuth, sendOtpFordeliery);
OrderRouter.post("/verify-otp", isAuth, verifyDeliveryOtp);

OrderRouter.post("/accept-order/:assignmentId", isAuth, acceptOrder);
OrderRouter.get("/get-order/:orderId", isAuth, getOrderByIdForTracking);

 
export default OrderRouter;
