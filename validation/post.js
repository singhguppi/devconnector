const Validator = require("validator");
const isEmpty = require("./is-empty");
module.exports = function validatePostInput(data) {
  let errors = {};

  data.text = !isEmpty(data.text) ? data.text : "";

  if (Validator.isEmpty(data.text)) {
    errors.text = "Text field is required";
  }

  if (!Validator.isLength(data.text, { min: 10, max: 300 })) {
    errors.text = "post must be between 10 and 300 characters";
  }
  return {
    errors: errors,
    isValid: isEmpty(errors)
  };
};
