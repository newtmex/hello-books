import Joi from 'joi';

const bookSchema = {
  title: Joi.string().required(),
  author: Joi.string().required(),
  description: Joi.string().required(),
  quantity: Joi.number().integer().positive().required(),
  imageURL: Joi.string().uri({ scheme: ['http', 'https'] }).required(),
  subject: Joi.string().required(),
};

const validateBookSchema = (req, res, next) => {
  const result = Joi.validate(
    req.body, bookSchema,
    { allowUnknown: false, abortEarly: false },
  );
  if (result.error) {
    return res.status(400).json({
      msg: 'Book could not be added',
      error: result.error.toString(),
    });
  }
  next();
};

export default validateBookSchema;
