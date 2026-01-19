import Joi from 'joi';

const registerDto = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string()
    .min(8)
    .pattern(/[a-z]/, 'lowercase')
    .pattern(/[A-Z]/, 'uppercase')
    .pattern(/[0-9]/, 'number')
    .pattern(/[^a-zA-Z0-9]/, 'symbol')
    .required()
    .messages({
      'string.min': 'Password must be at least 8 characters long',
      'string.pattern.name': 'Password must contain at least one {#name}',
      'any.required': 'Password is required',
    }),
  name: Joi.string().min(2).required(),
  photo: Joi.string().uri().optional(),
  phone: Joi.string().min(10).optional(),
  location: Joi.array()
    .items(
      Joi.object({
        type: Joi.string().valid('Point').required(),
        coordinates: Joi.array()
          .items(Joi.number().min(-180).max(180))
          .length(2)
          .optional(),
        address: Joi.string().min(3).required(),
        tag: Joi.string().min(2).required(),
      }),
    )
    .optional(),
}).unknown(false);

const loginDto = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
}).unknown(false);

const forgotPasswordDto = Joi.object({
  email: Joi.string().email().lowercase().trim().required(),
}).unknown(false);

const resetPasswordDto = Joi.object({
  password: Joi.string().min(8).max(100).required(),
}).unknown(false);


export {
  registerDto,
  loginDto,
  forgotPasswordDto,
  resetPasswordDto,
};
