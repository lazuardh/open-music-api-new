const InvariantError = require('../../exeption/invariantError');
const { SongPayloadSchema, SongsQuerySchema } = require('./schema');

const SongValidator = {
    validateSongPayload: (payload) => {
        const validateResult = SongPayloadSchema.validate(payload);
        if (validateResult.error) {
            throw new InvariantError(validateResult.error.message);
        }
    },

    validateSongQuery: (query) => {
    const validationResult = SongsQuerySchema.validate(query);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = SongValidator;