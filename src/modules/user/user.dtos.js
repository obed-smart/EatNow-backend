import Joi from 'joi';

const updateUserDto = Joi.object({
  email: Joi.string().email().required(),
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
})
  .min(1)
  .unknown(false);

export { updateUserDto };
