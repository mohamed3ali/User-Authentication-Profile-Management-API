import joi from "joi";

export const updatePasswordSchema = joi.object({
  oldPassword: joi.string().min(6).required(),
  newPassword: joi
    .string()
    .min(6)
    .required()
    .not(joi.ref("oldPassword")) // التحقق من أن كلمة المرور الجديدة ليست نفسها القديمة
    .messages({
      "any.invalid": "New password cannot be the same as the old password",
    }),
  cPassword: joi
    .string()
    .valid(joi.ref("newPassword")) // التأكد من أن كلمة مرور التأكيد تطابق كلمة المرور الجديدة
    .required()
    .messages({
      "any.only": "Confirm password must match new password",
    }),
});

export const shareProfile = {
  params: joi
    .object({
      id: joi.string().min(24).max(24).required(),
    })
    .required(),
};
