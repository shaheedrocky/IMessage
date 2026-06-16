import { hasImageKitConfig, uploadChatMedia } from "../lib/imagekit.js";
import { getRecieverSocketId, io } from "../lib/socket.js";
import { Message } from "../models/message.model.js";
import { User } from "../models/user.model.js";

export async function getUsersForSideBar(req, res) {
  console.log('---- hitted ---');
  
  try {
    const loggedUserId = req.user._id;
    const filteredUsers = await User.find({
      _id: { $ne: loggedUserId },
    }).select("-clerkId");
    console.log('---- ',  filteredUsers);
    
    res.status(200).json(filteredUsers);
  } catch (error) {
    console.log("Error from getUsersForSideBar controller: ", error.message);
    res.status(200).json({
      message: error.message || "Internal server error",
    });
  }
}

export async function getConversationForSideBar(req, res) {
  try {
    const loggedUserId = req.user._id;

    const filteredConversations = await Message.aggregate([
      {
        $match: {
          $or: [{ senderId: loggedUserId }, { receiverId: loggedUserId }],
        },
      },
      { $sort: { createdAt: -1 } },
      {
        $group: {
          _id: {
            $cond: [
              { $eq: ["$senderId", loggedUserId] },
              "$receiverId",
              "$senderId",
            ],
          },
          lastMessage: { $first: "$$ROOT" },
          lastMessageAt: { $first: "$createdAt" },
        },
      },
      { $sort: { lastMessageAt: -1 } },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },
      {
        $project: {
          _id: "$user._id",
          fullName: "$user.fullName",
          email: "$user.email",
          profilePic: "$user.profilePic",
          lastMessage: {
            text: "$lastMessage.text",
            image: "$lastMessage.image",
            video: "$lastMessage.video",
            pdf: "$lastMessage.pdf",
            senderId: "$lastMessage.senderId",
            createdAt: "$lastMessage.createdAt",
          },
        },
      },
    ]);

    res.status(200).json(filteredConversations);
  } catch (error) {
    console.error(
      "Error in getConversationForSideBar controller:",
      error.message,
    );
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function getMessages(req, res) {
  try {
    const { id: userToChatId } = req.params;
    const loggedUserId = req.user._id;

    const messages = await Message.find({
      $or: [
        {
          senderId: loggedUserId,
          receiverId: userToChatId,
        },
        {
          senderId: userToChatId,
          receiverId: loggedUserId,
        },
      ],
    }).sort({ createdAt: 1 });

    res.status(200).json(messages);
  } catch (error) {
    console.error("Error in getMessages controller :", error.message);
    res.status(500).json({ message: error.message || "Internal server error" });
  }
}

export async function sendMessage(req, res) {
  try {
    const senderId = req.user._id;
    const { text } = req.body;
    const { id:receiverId } = req.params;

    let imageUrl;
    let videoUrl;
    let pdfUrl;

    if (req.file) {
      if (!hasImageKitConfig()) {
        res.status(500).json({ message: "Media upload is not configured" });
        return;
      }

      const uploadedFileUrl = await uploadChatMedia(req.file);

      if (req.file.mimetype.startsWith("image/")) {
        imageUrl = uploadedFileUrl;
      } else if (req.file.mimetype.startsWith("video/")) {
        videoUrl = uploadedFileUrl;
      } else {
        pdfUrl = uploadedFileUrl;
      }
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image: imageUrl,
      pdf: pdfUrl,
      video: videoUrl,
    });

    await newMessage.save();

    const receiverSocketId = getRecieverSocketId(receiverId);

    if(receiverSocketId){
        io.to(receiverSocketId).emit("newMessage", newMessage)
    }

    res.status(201).json(newMessage); 
  } catch (error) {
    console.error("Error in sendMessage controller:", error.message);
    res.status(500).json({ message: error.message || "Internal server error" });
  }
}
