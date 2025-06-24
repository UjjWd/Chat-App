
const User = require('../models/user.model.js'); // Adjust the path as needed
const uploadImage = require('../utils/cloudinary.utils.js'); // Adjust the path as needed



// POST /send-otp
const { generateOtp, sendOtpEmail } = require('../utils/otp.js');
const { saveOtp } = require('../config/otpStore.js');
// POST /verify-otp
const { verifyOtp } = require('../config/otpStore.js');

const checkotp=async (req, res) => {
  const { email, otp } = req.body;
  const isValid = verifyOtp(email, otp);
  if (!isValid) return res.status(400).json({ message: 'Invalid or expired OTP' });
  res.json({ message: 'OTP verified' });
};


const sendotp= async (req, res) => {
  const { email } = req.body;
  const otp = generateOtp();
  saveOtp(email, otp);
  await sendOtpEmail(email, otp);
  res.json({ message: 'OTP sent' });
};

const signup = async (req, res) => {
    const { name, email, password } = req.body;

    if (password.length < 6) {
        return res.status(400).json({ message: "Password should be at least 6 characters" });
    }

    if (!name || !email || !password) {
        return res.status(400).json({ message: "Please provide name, email, and password" });
    }

    const user = await User.findOne({ email });
    if (user) {
        return res.status(400).json({ message: "User already exists" });
    } else {
        const newUser = await User.create({ name, email, password });
        const token = await newUser.generateAccesstoken();
        console.log("Token generated:", token);

        // Update: Send the token in a cookie instead of directly in the response
        res.cookie("token", token, { httpOnly: true, secure: true, sameSite: "None" });

        console.log("User created successfully:", newUser);
        return res.status(201).json({ message: 'Signup successful', user: newUser });
    }
};

const login =async (req, res) => {
    const { email, password } = req.body;
    // Perform signin logic here
     if(!email || !password){

        return res.status(400).json({message:"Please provide email and password"})}
    const user= await User.findOne({ email })
    if(!user){
        return res.status(400).json({message:"User not found"})
    }
    const isPasswordCorrect = await user.isPasswordCorrect(password);
    if(!isPasswordCorrect){
        return res.status(400).json({message:"Incorrect password"})
    }

    const token= await user.generateAccesstoken();
   
    res.cookie("token", token, { httpOnly: true, secure: true, sameSite: "None" });
    console.log("Login successful:", user);
    res.status(200).json({ message: 'Login successful', user });
}

const logout =async (req, res) => {
    // Perform logout logic here
    // For example, clear the session or token
     res.clearCookie("token", { httpOnly: true, secure: true, sameSite: "None" });
    console.log("Logout successful");
    // If successful, send a response with a success message
    res.status(200).json({ message: 'Logout successful' });
}
const uploadProfilePicture = async (req, res) => {
    const userId = req.user._id; // Assuming you have user ID from the auth middleware
    // const filePath = req.file.path; // Assuming you're using multer to handle file uploads
    const {profilePic}=req.body

    try {
        const imageUrl = await uploadImage(profilePic); // Upload the image to Cloudinary
        const user = await User.findByIdAndUpdate(userId, { profilePic: imageUrl }, { new: true }); // Update the user's profile picture in the database
        console.log("Profile picture uploaded successfully:", user);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        } 
        res.status(200).json({ message: 'Profile picture uploaded successfully', user });
    } catch (error) {
        console.error('Error uploading profile picture:', error);
        res.status(500).json({ message: 'Error uploading profile picture' });
    }
}
const checkAuth = async (req, res) => {
    // Check if the user is authenticated
    if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    // If authenticated, send user information
    res.status(200).json({ user: req.user });
}

module.exports = {
    signup,
    login,
    logout,
    uploadProfilePicture,
    checkAuth,
    sendotp,
    checkotp
}