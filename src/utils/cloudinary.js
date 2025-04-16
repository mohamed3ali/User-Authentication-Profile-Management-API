import * as dotenv from "dotenv";
dotenv.config();
import cloudinary from "cloudinary";

// Configuration
cloudinary.v2.config({
  cloud_name: process.env.cloud_name,
  api_key: process.env.api_key, // Click 'View API Keys' above to copy your API key
  api_secret: process.env.api_secret, // Click 'View API Keys' above to copy your API secret
  secure: true,
});
export default cloudinary.v2;
