const { Joi, celebrate } = require("celebrate");
const validator = require("validator");
const mongoose = require("mongoose");

const validateURL = (value, helpers) => {
  if (validator.isURL(value)) {
    return value;
  }
  return helpers.error("string.uri");
};

module.exports.validateId = celebrate({
  params: Joi.object().keys({
    itemId: Joi.string()
      .required()
      .custom((value, helpers) => {
        if (mongoose.Types.ObjectId.isValid(value)) {
          return value;
        }
        return helpers.message("Invalid Id");
      }),
  }),
});

module.exports.validateCardBody = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30).messages({
      "string.min": 'The minimum length of the "name" field is 2',
      "string.max": 'The maximum length of the "name "field is 30',
      "string.empty": 'The "name" field most be filled in',
    }),
    imageUrl: Joi.string().required().custom(validateURL).messages({
      "string.empty": 'The "imageURl" field must be field in',
      "string.uri": 'The "imageURl" field must be a valid url',
    }),
    weather: Joi.string().required().valid("hot", "cold", "warm"),
  }),
});

module.exports.validateUserSignUp = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30).messages({
      "string.min": "The 'name' field must be at least 2 characters.",
      "string.max": "The 'name' field must not exceed 30 characters.",
      "any.required": "The 'name' field is required.",
    }),
    email: Joi.string().required().email().messages({
      "string.email": "The 'email' field must be a valid email address.",
      "any.required": "The 'email' field is required.",
    }),
    password: Joi.string().required().min(7).messages({
      "string.min": "The 'password' must be at least 7 characters long.",
      "any.required": "The 'password' field is required.",
    }),
    avatar: Joi.string().required().custom(validateURL).messages({
      "string.uri": "The 'avatar' field must be a valid URL.",
      "any.required": "The 'avatar' field is required.",
    }),
  }),
});

module.exports.validateUserSignIn = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email().messages({
      "string.email": "The 'email' field must be a valid email address.",
      "any.required": "The 'email' field is required.",
    }),
    password: Joi.string().required().min(7).messages({
      "string.min": "The 'password' must be at least 7 characters long.",
      "any.required": "The 'password' field is required.",
    }),
  }),
});

module.exports.validateUpdateProfile = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30).messages({
      "string.min": "The 'name' field must be at least 2 characters.",
      "string.max": "The 'name' field must not exceed 30 characters.",
      "any.required": "The 'name' field is required.",
    }),
    avatar: Joi.string().required().custom(validateURL).messages({
      "string.uri": "The 'avatar' field must be a valid URL.",
      "any.required": "The 'avatar' field is required.",
    }),
  }),
});
