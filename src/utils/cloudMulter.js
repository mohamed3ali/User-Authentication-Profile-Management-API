import multer from "multer";

export const fileValidation = {
  image: ["image/png", "image/jpg", "image/jpeg"],
  file: ["application/pdf", "application/msword"],
};

export function fileUpload(customValidation = []) {
  const storage = multer.diskStorage({});

  const fileFilter = (req, file, cb) => {
    if (customValidation.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Please upload a valid file"), false);
    }
  };

  const upload = multer({ storage, fileFilter });
  return upload;
}
