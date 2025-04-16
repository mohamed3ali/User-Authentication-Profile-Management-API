import userRouter from "./modules/User/user.router.js";
import messageRouter from "./modules/Message/message.router.js";
import authRouter from "./modules/Auth/auth.router.js";
import connectDB from "../DB/connection.js";
import { globalErrorHandling } from "./utils/errorHandling.js";
import path from "path";
import { fileURLToPath } from "url";
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const initApp = (app, express) => {
  // Middleware to parse JSON bodies
  app.use(express.json());
  app.use("/uploads", express.static(path.join(__dirname, "./uploads")));
  connectDB();
  app.get("/", (req, res) => {
    res.send("Server is running");
  });
  app.use("/api/user", userRouter);
  app.use("/api/message", messageRouter);

  app.use("/api/auth", authRouter);

  app.all(/.*/, (req, res) => {
    return res.status(404).json({ message: "Route not found" });
  });
  // Global error handling middleware
  app.use(globalErrorHandling);
};
export default initApp;
