// utils/otp.js
const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();


const sendOtpEmail = async (email, otp) => {
  const transporter = require('../config/email');

  await transporter.sendMail({
    from: `"Howdy-Verify your Account" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Your OTP Code',
    text: `Your OTP code is ${otp}. It is valid for 5 minutes.`,
  });

};
module.exports = { generateOtp, sendOtpEmail };
