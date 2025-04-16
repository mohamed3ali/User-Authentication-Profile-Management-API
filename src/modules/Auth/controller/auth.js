import userModel from "../../../../DB/models/User.model.js";
import { asyncHandler } from "../../../utils/errorHandling.js";
import {
  generateToken,
  verifyToken,
} from "../../../utils/generateandverifyToken.js";
import { compare, hash } from "../../../utils/hashAnd compare.js";
import sendEmail from "../../../utils/sendEmail.js";

const signup = asyncHandler(async (req, res, next) => {
  const { userName, email, password } = req.body;
  const user = await userModel.findOne({ email });
  if (user) {
    return next(new Error("Email already exists", { cause: 409 }));
    // return res.status(409).json({ message: "Email already exists" });
  }
  const token = generateToken({
    payload: { email },
    signature: process.env.EMAIL_TOKEN,
    expiresIn: 60 * 5,
  });
  const link = `${req.protocol}://${req.headers.host}/api/auth/confirmEmail/${token}`;

  const refreshToken = generateToken({
    payload: { email },
    signature: process.env.EMAIL_TOKEN,
    expiresIn: 60 * 60 * 24 * 30,
  });
  const refreshLink = `${req.protocol}://${req.headers.host}/api/auth/newConfirmEmail/${refreshToken}`;

  const html = ` <!DOCTYPE html>
<html lang="en" dir="ltr">
  <head>
    <meta charset="UTF-8" />
    <title>Confirm Your Email</title>
    <style>
      body {
        background-color: #f4f4f4;
        font-family: Arial, sans-serif;
        margin: 0;
        padding: 0;
      }
      .email-container {
        background-color: #ffffff;
        width: 100%;
        max-width: 600px;
        margin: 30px auto;
        border-radius: 8px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        overflow: hidden;
      }
      .email-header {
        background-color: #4caf50;
        padding: 20px;
        color: white;
        text-align: center;
      }
      .email-body {
        padding: 30px;
        color: #333333;
        line-height: 1.6;
      }
      .email-body h1 {
        margin-top: 0;
      }
      .confirm-btn {
        display: inline-block;
        background-color: #4caf50;
        color: white;
        padding: 12px 20px;
        text-decoration: none;
        border-radius: 5px;
        margin-top: 20px;
        font-weight: bold;
      }
      .footer {
        font-size: 12px;
        text-align: center;
        padding: 20px;
        color: #888;
      }
    </style>
  </head>
  <body>
    <div class="email-container">
      <div class="email-header">
        <h2>Confirm Your Email</h2>
      </div>
      <div class="email-body">
        <h1>Welcome to Saraha App 👋</h1>
        <p>Thank you for signing up! Please confirm your email address by clicking the button below:</p>
        <a class="confirm-btn" href="${link}" target="_blank">Confirm Email</a><br><br>
           <a class="confirm-btn" href="${refreshLink}" target="_blank">Request new email</a>
        <p>If you didn’t request this, you can ignore this email.</p>
      </div>
      <div class="footer">
        &copy; 2025 Saraha App. All rights reserved.
      </div>
    </div>
  </body>
</html>
`;
  const info = await sendEmail({ to: email, subject: "Confirm Email", html });
  if (!info) {
    return next(new Error("Failed to send email", { cause: 500 }));
  }

  const hashPassword = await hash({ plaintext: password });
  const createUser = await userModel.create({
    userName,
    email,
    password: hashPassword,
  });
  return res
    .status(201)
    .json({ message: "User created", user: createUser._id });
});

const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  const user = await userModel.findOne({ email });
  if (!user) {
    return next(new Error("User not found", { cause: 404 }));
    // return res.status(404).json({ message: "User not found" });
  }
  if (!user.confirmEmail) {
    return next(new Error("Email not confirmed", { cause: 401 }));
  }
  const match = await compare({
    plaintext: password,
    hashValue: user.password,
  });

  if (!match) {
    return next(new Error("Invalid credentials"));
    // return res.status(401).json({ message: "Invalid credentials" });
  }

  const access_token = generateToken({
    payload: { id: user._id, isLoggedIn: true, role: user.role },
  });
  user.status = "online";
  await user.save();
  return res.status(200).json({ message: "Login successful", access_token });
});

const confirmEmail = asyncHandler(async (req, res, next) => {
  const { token } = req.params;
  const decoded = verifyToken({
    token,
    signature: process.env.EMAIL_TOKEN,
  });
  if (!decoded) {
    return next(new Error("Invalid token", { cause: 400 }));
  }
  const user = await userModel.updateOne(
    { email: decoded.email },
    { confirmEmail: true }
  );
  return user.modifiedCount
    ? res.status(200).redirect("https://sarahah.top/sarahah.top/Login?Lang=en")
    : next(new Error("Email already confirmed", { cause: 409 }));
});

const newConfirmEmail = asyncHandler(async (req, res, next) => {
  const { token } = req.params;
  const decoded = verifyToken({
    token,
    signature: process.env.EMAIL_TOKEN,
  });

  if (!decoded || !decoded.email) {
    return next(new Error("Invalid or expired token", { cause: 400 }));
  }

  const email = decoded.email;

  const newToken = generateToken({
    payload: { email },
    signature: process.env.EMAIL_TOKEN,
    expiresIn: 60 * 2,
  });

  const link = `${req.protocol}://${req.headers.host}/api/v1/auth/confirmEmail/${newToken}`;

  const refreshLink = `${req.protocol}://${req.headers.host}/api/v1/auth/newConfirmEmail/${token}`;

  const html = ` <!DOCTYPE html>
<html lang="en" dir="ltr">
  <head>
    <meta charset="UTF-8" />
    <title>Confirm Your Email</title>
    <style>
      body {
        background-color: #f4f4f4;
        font-family: Arial, sans-serif;
        margin: 0;
        padding: 0;
      }
      .email-container {
        background-color: #ffffff;
        width: 100%;
        max-width: 600px;
        margin: 30px auto;
        border-radius: 8px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        overflow: hidden;
      }
      .email-header {
        background-color: #4caf50;
        padding: 20px;
        color: white;
        text-align: center;
      }
      .email-body {
        padding: 30px;
        color: #333333;
        line-height: 1.6;
      }
      .email-body h1 {
        margin-top: 0;
      }
      .confirm-btn {
        display: inline-block;
        background-color: #4caf50;
        color: white;
        padding: 12px 20px;
        text-decoration: none;
        border-radius: 5px;
        margin-top: 20px;
        font-weight: bold;
      }
      .footer {
        font-size: 12px;
        text-align: center;
        padding: 20px;
        color: #888;
      }
    </style>
  </head>
  <body>
    <div class="email-container">
      <div class="email-header">
        <h2>Confirm Your Email</h2>
      </div>
      <div class="email-body">
        <h1>Welcome to Saraha App 👋</h1>
        <p>Thank you for signing up! Please confirm your email address by clicking the button below:</p>
        <a class="confirm-btn" href="${link}" target="_blank">Confirm Email</a><br><br>
           <a class="confirm-btn" href="${refreshLink}" target="_blank">Request new email</a>
        <p>If you didn’t request this, you can ignore this email.</p>
      </div>
      <div class="footer">
        &copy; 2025 Saraha App. All rights reserved.
      </div>
    </div>
  </body>
</html>
`;
  const info = await sendEmail({
    to: email,
    subject: "Confirm Your Email",
    html,
  });

  if (!info) {
    return next(new Error("Failed to send email", { cause: 500 }));
  }

  return res.status(200).send("<p>New confirmation email sent</p>");
});

export { signup, login, confirmEmail, newConfirmEmail };
