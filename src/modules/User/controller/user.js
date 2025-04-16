import userModel from "../../../../DB/models/User.model.js";
import { asyncHandler } from "../../../utils/errorHandling.js";
import { compare, hash } from "../../../utils/hashAnd compare.js";
import { updatePasswordSchema } from "../user.validation.js";
import cloudinary from "../../../utils/cloudinary.js";
const profilePic = asyncHandler(async (req, res) => {
  if (!req.file) {
    return next(new Error("Please upload a file", { cause: 400 }));
  }
  const { secure_url, public_id } = await cloudinary.uploader.upload(
    req.file.path,
    {
      folder: `user/${req.user._id}/profile`,
    }
  );
  const user = await userModel.findByIdAndUpdate(
    req.user._id,
    { profilePic: secure_url, profilePicId: public_id },
    { new: false }
  );
  await cloudinary.uploader.destroy(user.profilePicId);
  return res.json({ message: "Done", user });
});
const pictureCoverProfile = asyncHandler(async (req, res, next) => {
  if (!req.files?.length) {
    return next(new Error("Please upload files", { cause: 400 }));
  }

  const coverPic = [];

  for (const file of req.files) {
    const { secure_url, public_id } = await cloudinary.uploader.upload(
      file.path,
      {
        folder: `user/${req.user._id}/profile/cover`,
      }
    );
    coverPic.push({ secure_url, public_id });
  }

  const user = await userModel.findByIdAndUpdate(
    req.user._id,
    { coverPic },
    { new: true }
  );

  return res.json({ message: "Cover pictures uploaded successfully", user });
});

const profile = async (req, res) => {
  const user = await userModel.findById(req.user._id);
  res.json({ message: "profile is working", user });
};

// دالة لتحديث كلمة المرور
const updatePassword = asyncHandler(async (req, res, next) => {
  // التحقق من البيانات باستخدام Joi
  const { error } = updatePasswordSchema.validate(req.body);
  if (error) {
    return next(new Error(error.details[0].message, { cause: 400 }));
  }

  const { oldPassword, newPassword } = req.body;
  const user = await userModel.findById(req.user._id);

  if (!user) {
    return next(new Error("User not found", { cause: 404 }));
  }

  const isMatch = await compare({
    plaintext: oldPassword,
    hashValue: user.password,
  });

  if (!isMatch) {
    return next(new Error("Old password is incorrect", { cause: 400 }));
  }

  const hashedPassword = await hash({ plaintext: newPassword });
  user.password = hashedPassword;
  await user.save();

  res.json({ message: "Password updated successfully" });
});

const shareProfile = asyncHandler(async (req, res, next) => {
  const userId = req.params.id;

  const user = await userModel
    .findById(userId)
    .select("userName email profilePic firstName lastName");

  if (!user) {
    return next(new Error("User not found", { cause: 404 }));
  }

  return res.json({ message: "Profile shared successfully", user });
});

export {
  profile,
  updatePassword,
  pictureCoverProfile,
  shareProfile,
  profilePic,
};
