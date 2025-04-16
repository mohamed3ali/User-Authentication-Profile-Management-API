import userModel from "../../DB/models/User.model.js";
import { verifyToken } from "../utils/generateandverifyToken.js";

const auth = async (req, res, next) => {
  try {
    const { authorization } = req.headers;
    console.log({ authorization });
    if (!authorization?.startsWith(process.env.BEAREAR_KEY)) {
      return res.status(401).json({ message: "In-valid bearer key" });
    }
    const token = authorization.split(process.env.BEAREAR_KEY)[1];

    if (!token) {
      return res.status(401).json({ message: "In-valid token" });
    }
    const decoded = verifyToken({ token });

    if (!decoded?.id) {
      return res.status(401).json({ message: "In-valid token payload" });
    }
    console.log({ decoded });
    const auth = await userModel
      .findById(decoded.id)
      .select(" userName email status role  ");
    if (!auth) {
      return res.status(401).json({ message: "not register account" });
    }
    req.user = auth;
    return next();
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error });
  }
};
export default auth;
