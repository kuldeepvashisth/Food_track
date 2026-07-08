const nodemailer=require('nodemailer')
const dotenv=require('dotenv');
dotenv.config() 

const transporter = nodemailer.createTransport({
 service: "gmail",
  port: 465,
  secure: true, // Must be true for port 465
  auth: {
    user: process.env.Email,
    pass: process.env.Pass,
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

module.exports = { sendOtpMail };

// mxky ykjn ushx jkhx