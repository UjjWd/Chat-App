const { StreamChat } = require("stream-chat");
const STREAM_API_KEY = process.env.STREAM_API_KEY;
const STREAM_API_SECRET = process.env.STREAM_API_SECRET;

const serverClient = StreamChat.getInstance(STREAM_API_KEY, STREAM_API_SECRET);

const generateStreamToken = async (req, res) => {
  try {
    const userId = (req.user?.id || req.query.userId)?.trim(); // ✅ Important fix

    if (!userId) {
      return res.status(400).json({ error: "Missing userId" });
    }

    const token = serverClient.createToken(userId);
    return res.status(200).json({ token });
  } catch (error) {
    console.error("Token generation failed:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { generateStreamToken };
