import dotenv from "dotenv";
dotenv.config();
import express from "express";
import initApp from "./src/app.router.js";
// import sendEmail from "./src/utils/sendEmail.js";
const app = express();
const port = 5000;

initApp(app, express);
// sendEmail({
//   to: "nodejs685@gmail.com",
//   subject: "test",
//   attachments: [{ filename: "test.text", content: "Hello world!" }],
// });
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
