import multer from "multer";
import { nanoid } from "nanoid";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const fileValidation = {
  image: ["image/png", "image/jpg", "image/jpeg"],
  file: ["application/pdf", "application/msword"],
};

export function fileUpload(customPath = "general", customValidation = []) {
  console.log({ DIR: __dirname });
  const fullPath = path.join(__dirname, `../uploads/${customPath}`); // ✅ استخدام المسار الكامل للمجلد
  console.log({ fullPath });

  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true }); // ✅ إنشاء المجلد إذا لم يكن موجودًا
  }
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, fullPath); // مجلد الحفظ
    },
    filename: (req, file, cb) => {
      const uniqueName = `${nanoid()}-${file.originalname}`;
      file.dest = `/uploads/${customPath}/${uniqueName}`; // ✅ حفظ المسار الكامل في الملف

      // ✅ دمج الاسم العشوائي مع اسم الملف الأصلي
      cb(null, uniqueName);
    },
  });

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
