import mongoose, { model, Schema, Types } from "mongoose";

const messageSchema = new Schema(
  {
    message: {
      type: String,
      required: true,
    },
    receiverId: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const messageModel = mongoose.models.message || model("Message", messageSchema);
export default messageModel;
