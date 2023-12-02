import Joi from 'joi';
import validator from 'express-joi-validation';

class ValidationHandler {
  constructor() {
    this.sharedValidator = validator.createValidator({});
    this.registerSchema = this.createRegisterSchema();
    this.loginSchema = this.createLoginSchema();
  }

  createRegisterSchema() {
    return Joi.object({
      username: Joi.string().min(3).max(12).required(),
      password: Joi.string().min(6).max(12).required(),
      mail: Joi.string().email().required(),
    });
  }

  createLoginSchema() {
    return Joi.object({
      password: Joi.string().min(6).max(12).required(),
      mail: Joi.string().email().required(),
    });
  }

  getRegisterValidator() {
    return this.sharedValidator.body(this.registerSchema);
  }

  getLoginValidator() {
    return this.sharedValidator.body(this.loginSchema);
  }
}

export default new ValidationHandler();
