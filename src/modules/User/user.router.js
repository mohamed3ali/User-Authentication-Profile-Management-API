import { Router } from "express";
import * as userController from "./controller/user.js";
import auth from "../../middleware/auth.middleware.js";
import validation from "../../middleware/validation.js";
import * as validators from "./user.validation.js";
import { fileUpload, fileValidation } from "../../utils/cloudMulter.js";

const router = Router();
router.patch(
  "/pictureProfile",
  fileUpload(fileValidation.image).single("image"),
  auth,
  userController.profilePic
);
router.patch(
  "/pictureCoverProfile",
  fileUpload(fileValidation.image).array("image", 5),
  auth,
  userController.pictureCoverProfile
);
router.get("/profile", auth, userController.profile);

router.patch(
  "/password",

  auth,
  userController.updatePassword
);

router.get(
  "/:id/profile",
  validation(validators.shareProfile),
  userController.shareProfile
);

export default router;

//user or admin or super admin or support
//CRUD user
//upload doc
//upload image
//delete doc
// admin block
