import mongoose from "mongoose";
import messageModel from "../../../../DB/models/Message.model.js";
import userModel from "../../../../DB/models/User.model.js";
import { asyncHandler } from "../../../utils/errorHandling.js";

const getMessageModule = asyncHandler(async (req, res, next) => {
  const messageList = await messageModel.find({ receiverId: req.user._id });
  return res.status(200).json({ message: "Done", messageList });
});

const sendMessage = asyncHandler(async (req, res, next) => {
  const { receiverId } = req.params;
  const { message } = req.body;

  // Validate receiverId format
  if (!mongoose.Types.ObjectId.isValid(receiverId)) {
    return next(new Error("Invalid receiver ID format", { cause: 400 }));
  }

  // Check if receiver exists
  const user = await userModel.findById(receiverId);
  if (!user) {
    return next(new Error("Receiver not found", { cause: 404 }));
  }

  // Create the message
  const createMessage = await messageModel.create({
    receiverId: user._id,
    message,
  });

  return res.status(201).json({
    message: "Message sent successfully",
    data: createMessage,
  });
});

const deleteMessage = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  // Validate ObjectId before querying
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(new Error("Invalid message ID format", { cause: 400 }));
  }

  const message = await messageModel.deleteOne({
    _id: id,
    receiverId: req.user._id,
  });

  if (!message.deletedCount) {
    return next(
      new Error("Message not found or not authorized", { cause: 404 })
    );
  }

  return res.status(200).json({ message: "Deleted successfully" });
});
export { sendMessage, getMessageModule, deleteMessage };
