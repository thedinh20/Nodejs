import User from "../models/User.js";

export const authMe = async (req, res) => {
  try {
    const user = req.user; // lấy từ authMiddleware

    return res.status(200).json({
      user,
    });
  } catch (error) {
    console.error("Lỗi khi gọi authMe", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

export const searchUsers = async (req, res) => {
  try {
    const key = req.query.key || "";
    if (!key) {
      // If key is not provided, return empty array
      return res.status(200).json({ users: [] });
    }
    const currentUserId = req.user?._id;
    // Find users whose username starts with the key (case-insensitive), excluding the current user
    const users = await User.find({
      username: { $regex: `^${key}`, $options: "i" },
      _id: { $ne: currentUserId },
    }).select("_id username email displayName");
    return res.status(200).json({ users });
  } catch (error) {
    console.error("Lỗi khi tìm kiếm người dùng", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};
