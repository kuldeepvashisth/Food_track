import express from 'express';
import isAuth from '../middleware/isAuth.js';
import { addItem, editItem, getItemById, deleteItem, getItemByCity } from '../controller/itemController.js';
import upload from '../middleware/multer.js';

const itemRouter = express.Router();

itemRouter.post("/add-item", isAuth, upload.single("image"), addItem);
itemRouter.get("/get-item/:itemId", isAuth, getItemById);
itemRouter.post("/edit-item/:itemId", isAuth, upload.single("image"), editItem);
itemRouter.get("/delete/:itemId", isAuth, deleteItem);
itemRouter.get("/get-items-by-city/:city", isAuth, getItemByCity);
export default itemRouter;
