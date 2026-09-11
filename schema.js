const Joi = require("joi");

const ListingSchema = Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    url: Joi.string().uri().allow("", null),
    price: Joi.number().min(0).required(),
    location: Joi.string().required(),
    country: Joi.string().required(),
});

const ReviewSchema = Joi.object({
    rating: Joi.number().min(1).max(5).required(),
    comment: Joi.string().required(),
});

module.exports = { ListingSchema, ReviewSchema };
