import { check } from 'express-validator';
import { User } from '@root/modules/user/UserModel.js';
import { handleValidationErrors } from '@root/middlewares/validator.js';
import { ErrorResponse } from '@root/utils/errorResponse.js';
import i18n from 'i18n';

class AuthValidator {
  static getValidationChain(fn) {
    return [fn, handleValidationErrors];
  }

  static signupValidation() {
    return [
      check('username')
        .notEmpty()
        .withMessage(i18n.__('nameIsRequired'))
        .isLength({ min: 3 })
        .withMessage(i18n.__('nameLengthError')),

      check('email')
        .notEmpty()
        .withMessage(i18n.__('emailIsRequired'))
        .isEmail()
        .withMessage(i18n.__('invalidEmail'))
        .bail()
        .custom(async (val) => {
          await this.validateEmailDoesNotExist(val);
        }),

      check('password')
        .notEmpty()
        .withMessage(i18n.__('passwordIsRequired'))
        .custom((value) => this.validatePasswordLength(value))
        .withMessage(i18n.__('passwordLengthError')),
    ];
  }

  static loginValidation() {
    return [
      check('email')
        .notEmpty()
        .withMessage(i18n.__('emailIsRequired'))
        .isEmail()
        .withMessage(i18n.__('invalidEmail'))
        .bail()
        .custom(async (val, { req }) => {
          await this.validateEmailExists(val, { req });
        }),

      check('password')
        .notEmpty()
        .withMessage(i18n.__('passwordIsRequired'))
        .isLength({ min: 6 })
        .withMessage(i18n.__('passwordLengthError'))
        .bail()
        .custom(async (val, { req }) => {
          await this.validatePassword(val, { req });
        }),
    ];
  }

  static validateEmailDoesNotExist = async (email) => {
    const user = await User.findOne({ email });
    if (user) throw new ErrorResponse(i18n.__('emailAlreadyExists'), 400);
  };

  static validatePasswordLength = (password) => password.length >= 6;

  static validatePasswordMatch = (passwordConfirm, password) =>
    passwordConfirm === password;

  static validateEmailExists = async (val, { req }) => {
    req.user = await User.findOne({ email: val });
    if (!req.user) throw new ErrorResponse(i18n.__('UserNotFound'), 400);
  };

  static validatePassword = async (val, { req }) => {
    if (req.user && !(await req.user.comparePassword(val))) {
      throw new ErrorResponse(i18n.__('invalidPassword'), 400);
    }

    return true;
  };
}

export { AuthValidator };
