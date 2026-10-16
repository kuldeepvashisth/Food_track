import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config() 

const transporter = nodemailer.createTransport({
 service: "gmail",
  port: 465,
  secure: true, // Must be true for port 465
  auth: {
    user: process.env.Email?.trim(),
    // Google displays app passwords in groups of four. Ignore formatting
    // spaces if the value was pasted exactly as shown.
    pass: process.env.Pass?.replace(/\s/g, ''),
  },
});

const sendOtpMail = async (to, otp) => {
  try {
    const mailOptions = {
      from: process.env.Email,
      to: to,
      subject: "Your OTP To Reset YOUR Password",
      text: `Your OTP is ${otp}. It is valid for 5 minutes.`,
    };

    await transporter.sendMail(mailOptions);
    console.log(`OTP sent to ${to}`);
  } catch (error) {
    console.error(`Error sending OTP to ${to}:`, error);
    throw error;
  }
}


const sendDeliveryOtpMail = async (to, otp) => {
  try {
    const mailOptions = {
      from: process.env.Email,
      to: to,
      subject: "Your OTP For Delivery",
      text: `Your OTP is ${otp}. It is valid for 5 minutes.`,
    };

    await transporter.sendMail(mailOptions);
    console.log(`OTP sent to ${to}`);
  } catch (error) {
    console.error(`Error sending OTP to ${to}:`, error);
    throw error;
  }
}


export { sendOtpMail, sendDeliveryOtpMail };

// mxky ykjn ushx jkhx
