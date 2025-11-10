const { AlbumPayloadSchema } = require('./schema');
const InvariantError = require('../../exeption/invariantError');

/* this file will focus on create a funtion as a validator that uses schema  */
const AlbumValidator = {
    validateAlbumPayload: (payload) => {
        const validateResult = AlbumPayloadSchema.validate(payload);
        if (validateResult.error) {
            throw new InvariantError(validateResult.error.message);
        }

    },
};

module.exports = AlbumValidator;