const dataMethods = ["body", "params", "query"];

const validation = (schema) => {
  return (req, res, next) => {
    const validationArr = [];
    dataMethods.forEach((key) => {
      if (schema[key]) {
        const validationResult = schema[key].validate(req[key], {
          abortEarly: false,
        });
        if (validationResult.error) {
          validationArr.push(validationResult.error.details);
        }
      }
    });

    if (validationArr.length > 0) {
      return res
        .status(400)
        .json({ message: "Validation error", validationArr });
    } else {
      return next();
    }
  };
};
export default validation;
