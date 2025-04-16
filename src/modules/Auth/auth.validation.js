import joi from "joi";

export const signupSchema = {
  body: joi
    .object({
      userName: joi.string().alphanum().min(2).max(25).required().messages({
        "string-empty": "Please fill in your username",
        "any.required": "Please fill in your username",
      }),
      email: joi
        .string()
        .email({
          minDomainSegments: 2,
          maxDomainSegments: 3,
          tlds: { allow: ["com", "net"] },
        })
        .required(),
      age: joi.number().integer().required(),
      gender: joi.string().alphanum().valid("male", "female").required(),
      password: joi
        .string()
        .pattern(
          new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/)
        )
        .required(),
      cPassword: joi.ref("password"),
    })
    .required(),
};
export const loginSchema = joi
  .object({
    email: joi.string().email().required(),
    password: joi
      .string()
      .pattern(
        new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/)
      )
      .required(),
  })
  .required();
