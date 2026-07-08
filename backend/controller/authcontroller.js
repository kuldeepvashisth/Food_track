const bcrypt = require('bcryptjs');
const generateToken = require('../utils/token');
const User = require('../models/usermodel');
const { sendOtpMail } = require('../utils/sendmail');

exports.postsignup = async (req, res) => {
    try {
        // accept multiple field name variants from frontend
        const { Fullname, Email, password, mobile, role } = req.body;

        console.log('in request body', req.body);
        const userName = Fullname;
        const userEmail = Email;
        if (!userEmail) return res.status(400).json({ message: 'Email is required' });
        console.log("Email:", userEmail);
        console.log("Password:", password);
        console.log("Mobile:", mobile);

        let exist = await User.findOne({ Email: userEmail });
        if (exist) {
            //res.redirect('/signup');
            return res.status(400).json({ message: "user Already exist" })
        }
        if (!password || password.length < 6) {
            return res.status(400).json({ message: 'pass length should be min 6' });
        }

        if (!mobile || String(mobile).length < 10) {
            return res.status(400).json({ message: 'mobile length should be min 10' });
        }

        const hashedpass = await bcrypt.hash(password, 12);
        const user = new User({ Name: userName || userEmail.split('@')[0], Email: userEmail, password: hashedpass, mobile, role: role || 'user' });
        console.log('hlo user is ', user);
        await user.save();
        console.log('user created successfully', user);
        const token = await generateToken(user._id);
        res.cookie("token", token, {
            secure: false,
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000,
            sameSite: "strict"
        })
        return res.status(201).json({
            message: "User created successfully",
            token,
            user
        });
        // don't send password back
        // const userSafe = user.toObject();
        // delete userSafe.password;
        // return res.status(201).json(userSafe)
    }
    catch (err) {
        console.log('err in signup is ', err)
        console.log('err in signup is ', err)
        return res.status(500).json({ message: 'Internal server error' })
    }
}


exports.postlogin = async (req, res) => {
    try {
        const { Email, password } = req.body;
        const userEmail = Email;
        const user = await User.findOne({ Email: userEmail });
        if (!user) {
            res.redirect('/signup');
            return res.status(400).json({ message: "user not exist" })
        }
        if (!user.password) {
            return res.status(400).json({ message: 'This account was created with Google sign-in. Please login with Google.' });
        }
        if (!password || password.length < 6) {
            return res.status(400).json({ message: 'pass length should be min 6' });
        }

        const ismatch = await bcrypt.compare(password, user.password)
        if (!ismatch) {
            return res.status(401).json({ message: "wrong Password" });
        }

        const token = generateToken(user._id);

        res.cookie("token", token, {
            secure: false,
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000,
            sameSite: "strict"
        })
        return res.status(200).json({ message: 'Login successful', token });
        // const userSafe = user.toObject();
        // delete userSafe.password;
        // return res.status(200).json(userSafe)

    }
    catch (err) {
        console.log('err in login is ', err)
        return res.status(500).json({ message: 'Internal server error' })
    }

}

exports.logout = async (req, res) => {
    try {
        res.clearCookie('token');
        return res.status(201).json('logout successfully')
    }
    catch (err) {
        console.log('error in log out is ', err);
        return res.status(404).json({ message: 'error in logout' });
    }
}


exports.sendOtp = async (req, res) => {
    try {
        const Email = (req.body.Email || '').trim().toLowerCase();
        const user = await User.findOne({ Email });
        if (!user) {
            return res.status(400).json({ message: "user not exist" })
        }
        const otp = Math.floor(1000 + Math.random() * 900000).toString();
        user.resetotp = otp;
        user.resetotpExpiry = Date.now() + 5 * 60 * 1000; // OTP valid for 5 minutes
        user.isverified = false; // Mark user as unverified until OTP is verified
        await user.save();

        await sendOtpMail(user.Email, otp);
        return res.status(200).json({ message: 'OTP sent successfully' });
    } catch (error) {
        console.error('Error sending OTP:', error);
        return res.status(500).json({ message: `send otp error ${error.message}` });
    }
}

exports.verifyOtp = async (req, res) => {
    try {
        const Email = (req.body.Email || '').trim().toLowerCase();
        const { otp } = req.body;
        const user = await User.findOne({ Email });
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }
        if (!user.resetotp || user.resetotp !== otp || user.resetotpExpiry < Date.now()) {
            return res.status(400).json({ message: "Invalid or expired OTP" });
        }
        user.isverified = true; // Mark user as verified after successful OTP verification
        user.resetotp = null; // Clear the OTP after verification
        user.resetotpExpiry = null; // Clear the OTP expiry after verification
        await user.save();
        return res.status(200).json({ message: "OTP verified successfully" });
    }
    catch (err) {
        console.log('error in verify otp is ', err);
        return res.status(500).json({ message: `verify otp error ${err.message}` });
    }
}


exports.resetPassword= async (req, res) => {
    try{
        const Email = (req.body.Email || '').trim().toLowerCase();
        const { newPassword } = req.body;
        const user = await User.findOne({ Email });
        if (!user || !user.isverified) {
            return res.status(400).json({ message: "OTP NOT VERIFIED" });
        }
        const hashedPass=await bcrypt.hash(newPassword, 12);
           user.password=hashedPass;
           user.isverified=false;
           await user.save();
           return res.status(200).json({ message: "Password reset successfully" });

    }catch(error){
        console.error('Error resetting password:', error);
        return res.status(500).json({ message: `Reset password error ${error.message}` });
    }
}

exports.googleAuth = async (req, res) => {
    try {
        const { Fullname, Email, mobile, role } = req.body;
        if (!Email) {
            return res.status(400).json({ message: 'Email is required' });
        }

        let user = await User.findOne({ Email });
        if (!user) {
            user = await User.create({
                Name: Fullname || Email.split('@')[0],
                Email,
                mobile,
                role: role || 'user',
                password: null,
                authProvider: 'google'
            });
        }

        const token = await generateToken(user._id);
        res.cookie('token', token, {
            secure: false,
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000,
            sameSite: 'strict'
        });

        return res.status(201).json({
            message: 'User authenticated successfully',
            token,
            user
        });
    } catch (err) {
        console.error('googleAuth error:', err);
        return res.status(500).json({ message: 'Google auth error', error: err.message });
    }
};