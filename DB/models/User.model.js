import mongoose, { model, Schema } from "mongoose";

const userSchema = new Schema(
  {
    firstName: String,
    lastName: String,

    userName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    age: Number,
    profilePicId: String,
    gender: {
      type: String,
      default: "male",
      enum: ["male", "female"],
    },
    phone: String,
    profilePic: String,
    coverPic: [],
    address: String,

    confirmEmail: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      default: "offline",
      enum: ["online", "offline", "blocked"],
    },
    role: {
      type: String,
      default: "User",
      enum: ["Admin", "User"],
    },
  },
  {
    timestamps: true,
  }
);

const userModel = mongoose.models.User || model("User", userSchema);
export default userModel;
