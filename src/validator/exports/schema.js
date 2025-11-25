const Joi = require('joi');


const ExportPlaylistsPayloadSchema = Joi.object({
    playlistId: Joi.string().required(),
    targetEmail: Joi.string().email({ tlds: true}).required(),
});

module.exports = ExportPlaylistsPayloadSchema;