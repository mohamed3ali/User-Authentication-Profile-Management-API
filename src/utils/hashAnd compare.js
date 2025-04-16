import bcrypt from "bcryptjs";

export const hash = async ({ plaintext, salt = process.env.SALT_ROUND }) => {
  // استخدام await للحصول على النتيجة المتزامنة
  const hashResult = await bcrypt.hash(plaintext, parseInt(salt));
  return hashResult;
};

export const compare = async ({ plaintext, hashValue }) => {
  // استخدام المقارنة بشكل غير متزامن
  const match = await bcrypt.compare(plaintext, hashValue);
  return match;
};
