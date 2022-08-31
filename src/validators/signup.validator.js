const Joi = require('joi');
const { buildErrorObjectFromJoiValidator } = require("../helpers/responseHelper")

exports.SignupSchemaValidator = async (req, res, next) => {
  const SignupData = req.body;
  const { firstname, lastname, email, password } = SignupData;

  const SignupSchema = Joi.object({
    firstname: Joi.string().required().messages({
      "string.empty": `firstname cannot be an empty field.`,
      "any.required": `firstname is a required field.`,
    }),
    lastname: Joi.string().required().messages({
      "string.empty": `lastname cannot be an empty field.`,
      "any.required": `lastname is a required field.`,
    }),
    email: Joi.string().email().required().messages({
      "string.empty": `email cannot be an empty field.`,
      "any.required": `email is a required field.`,
    }),
    password: Joi.string().required().messages({
      "string.empty": `email cannot be an empty field.`,
      "any.required": `email is a required field.`,
    }),
  });

  const validationResult = SignupSchema.validate(SignupData, {
    abortEarly: false,
  });
  if (validationResult.error && validationResult.error?.details.length !== 0) {
    return res.status(400).json({
      success: false,
      errors: buildErrorObjectFromJoiValidator(validationResult.error.details),
    });
  }
  next();
};

