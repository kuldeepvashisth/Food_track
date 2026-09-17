import express from 'express';
import * as authcontroller from '../controller/authcontroller.js';

const authrouter = express.Router();

//Here, require authcontroller() returns whatever the controller file exports.
/* whenever we want to export just one function we use mdule.exports and for multiple we use 
export.f(n) Name

so here we have multiple functions in authcontroller.js so we use export.f(n) Name
so in authoutes :
authcontroller is like an object whose key are function name and value is function defination
therefore we use like  :- authcontroller.logout
*/
authrouter.post('/signup',authcontroller.postsignup);
authrouter.post('/login',authcontroller.postlogin);
authrouter.get('/logout',authcontroller.logout);


authrouter.post('/send-otp',authcontroller.sendOtp);
authrouter.post('/verify-otp',authcontroller.verifyOtp);
authrouter.post('/reset-password',authcontroller.resetPassword);

authrouter.post('/google-auth',authcontroller.googleAuth);


export { authrouter };


