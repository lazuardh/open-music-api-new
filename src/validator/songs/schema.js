const Joi = require('joi');

const SongPayloadSchema = Joi.object({
    title: Joi.string().required(),
    year: Joi.number().required(),
    genre: Joi.string().required(),
    performer: Joi.string().required(),
    duration: Joi.number(),
    albumId: Joi.string(),
});

const SongsQuerySchema = Joi.object({
  title: Joi.string().pattern(/[a-zA-Z]/).strict().optional().messages({
      'string.pattern.base': '"title" harus berupa teks, tidak boleh hanya angka.',
    }),
  performer: Joi.string().optional(),
}).or('title', 'performer').options({convert: false});

module.exports =  { SongPayloadSchema, SongsQuerySchema };