import { axiosInstance } from "./axios";

export const getStreamToken = async (userId) => {
  try {
    const res = await axiosInstance.get(`/api/stream/token?userId=${userId}`);
    return res.data.token; // ✅ Axios puts parsed JSON in `data`
  } catch (error) {
    console.error("❌ Failed to fetch token:", error);
    throw new Error("Failed to fetch token");
  }
};
