const Joi = require('joi');

/* create object schema data albums */
const AlbumPayloadSchema = Joi.object({
    name: Joi.string().required(),
    year: Joi.number().required(),
});

module.exports = { AlbumPayloadSchema };