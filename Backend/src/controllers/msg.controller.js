const User = require('../models/user.model.js');
const Message = require('../models/message.model.js');
// const cloudinary = require('../utils/cloudinary.utils.js');
// const { getReceiverSocketId, io } = require('../lib/socket.js');
const { getReceiverSocketId, io } = require('../utils/socket.js'); // Adjust the path as needed
const   uploadImage = require('../utils/cloudinary.utils.js'); // Adjust the path as needed
const getUsersForSidebar = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    console.log("Logged in user ID: ", loggedInUserId);
    const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");
    // console.log("Filtered users: ", filteredUsers);
    res.status(200).json(filteredUsers);
  } 

  catch (error) 
  {
    console.error("Error in getUsersForSidebar: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }

};

const getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const myId = req.user._id;

    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: myId },
      ],
    });

    res.status(200).json(messages);
  } catch (error) {
    console.log("Error in getMessages controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    let imageUrl;
    // console.log("Image URL: ", imageUrl);

    if (image) {
      // Upload base64 image to cloudinary
      const uploadResponse = await uploadImage(image);
      console.log("Upload response: ", uploadResponse);
      
      imageUrl = uploadResponse;
    }
     console.log("Image URL after upload: ", imageUrl);
    // Check if both text and image are empty

    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image: imageUrl,
    });

    await newMessage.save();

    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    res.status(201).json(newMessage);
  } catch (error) {
    console.log("Error in sendMessage controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  getUsersForSidebar,
  getMessages,
  sendMessage,
};
