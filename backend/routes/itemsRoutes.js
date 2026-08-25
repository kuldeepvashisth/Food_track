const express = require('express');
const isAuth = require('../middleware/isAuth');
const { addItem, editItem, getItemById,deleteItem,getItemByCity } = require('../controller/itemController');
const upload = require('../middleware/multer');

const itemRouter = express.Router();

itemRouter.post("/add-item", isAuth, upload.single("image"), addItem);
itemRouter.get("/get-item/:itemId", isAuth, getItemById);
itemRouter.post("/edit-item/:itemId", isAuth, upload.single("image"), editItem);
itemRouter.get("/delete/:itemId", isAuth, deleteItem);
itemRouter.get("/get-items-by-city/:city", isAuth, getItemByCity);
module.exports = itemRouter;
