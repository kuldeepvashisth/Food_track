import express from 'express';
import { createAndEditShop, getMyShop, getNearbyShops } from '../controller/shopController.js';
import isAuth from '../middleware/isAuth.js';
import upload from '../middleware/multer.js';

const shopRouter = express.Router();

shopRouter.post("/create-edit-shop", isAuth, upload.single("image"), createAndEditShop);
shopRouter.get("/get-my", isAuth, getMyShop);
shopRouter.get("/get-nearby-shop/:city", isAuth, getNearbyShops);

export default shopRouter;
