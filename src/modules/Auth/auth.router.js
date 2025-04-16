import { Router } from "express";
import * as authController from "./controller/auth.js";
import validation from "../../middleware/validation.js";
import * as validators from "./auth.validation.js";
const router = Router();

router.post(
  "/signup",
  validation(validators.signupSchema),
  authController.signup
);
router.get("/confirmEmail/:token", authController.confirmEmail);
router.get("/newConfirmEmail/:token", authController.newConfirmEmail);

router.post("/login", validation(validators.loginSchema), authController.login);
export default router;

// send otp
// verify otp
//api resend otp
// api forget pass
// api reset pass
// api google login
// api facebook login
// api block user
// api unblock user
//api two factor auth
// api logout
