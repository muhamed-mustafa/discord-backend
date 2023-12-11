import { validationResult } from 'express-validator';

export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);

  console.log('errors', req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  next();
};
