import Joi from 'joi';

const registerSchema = Joi.object({
       email: Joi.string().email().required(),
       password: Joi.string().min(6).required(),
       name: Joi.string().min(2).required(),
});

export { registerSchema };
