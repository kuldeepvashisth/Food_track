import express from 'express';
// const { createAndEditShop, getMyShop, getNearbyShops } = require('../controller/shopController');
import isAuth from '../middleware/isAuth.js';
import { placeOrder, getMyOrders, changeOrderStatus, getDeliveryBoyAssignment } from '../controller/PlaceOrderController.js';
// const { getMyOrders, updateShopOrderStatus } = require('../controller/PlaceOrderController')
const OrderRouter = express.Router();

OrderRouter.post("/place-order", isAuth, placeOrder);
OrderRouter.get("/my-orders", isAuth, getMyOrders);
OrderRouter.post("/update-status/:orderId/:shopId", isAuth, changeOrderStatus);
OrderRouter.get("/get-assignments", isAuth, getDeliveryBoyAssignment);
OrderRouter.post("/update-status/:orderId/:shopId", isAuth, changeOrderStatus);
 
export default OrderRouter;
