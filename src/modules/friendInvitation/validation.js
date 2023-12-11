import { check } from 'express-validator';
import { handleValidationErrors } from '@root/middlewares/validator.js';
import { ErrorResponse } from '@root/utils/errorResponse.js';
import i18n from 'i18n';

class FriendValidator {
  static getValidationChain(fn) {
    return [fn, handleValidationErrors];
  }

  static addFriendValidation() {
    return [
      check('targetEmailAddress')
        .notEmpty()
        .isEmail()
        .withMessage('invalidEmail')
        .custom(async (val) => {
          if (!val) {
            throw new ErrorResponse(i18n.__('targetEmailAddressRequired'), 400);
          }
          return true;
        }),
    ];
  }
}

export { FriendValidator };
