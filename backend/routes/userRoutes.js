import express from 'express';
import { getCurrentUser,updateUserLocation } from '../controller/userController.js';
import isAuth from '../middleware/isAuth.js';

const userRouter = express.Router();

userRouter.get('/current', isAuth, getCurrentUser);
userRouter.post('/update-location', isAuth, updateUserLocation);
//update location route isliye hai because we need to update the user's location in the database when they move to a new location. This is important for features like finding nearby restaurants or delivery services based on the user's current location.

export default userRouter;
