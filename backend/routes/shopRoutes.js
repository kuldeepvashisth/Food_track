const express = require('express');
const { createAndEditShop, getMyShop, getNearbyShops } = require('../controller/shopController');
const isAuth = require('../middleware/isAuth');
const upload = require('../middleware/multer');

const shopRouter = express.Router();

shopRouter.post("/create-edit-shop", isAuth, upload.single("image"), createAndEditShop);
shopRouter.get("/get-my", isAuth, getMyShop);
shopRouter.get("/get-nearby-shop/:city", isAuth, getNearbyShops);

module.exports = shopRouter;
