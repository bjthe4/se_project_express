const { Joi, celebrate } = require("celebrate");
const validator = require("validator");

const validateURL = (value, helpers) => {
  if (validator.isURl(value)) {
    return value;
  }
  return helpers.error("string.uri");
};

module.exports.validateId = celebrate({
  params: Joi.object().keys({
    // ...
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
  }),
});
