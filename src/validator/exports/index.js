const ExportPlaylistsPayloadSchema = require('./schema');
const InvariantError = require('../../exeption/invariantError');

const ExportsValidator = {
    validateExportPlaylistsPayload: (payload) => {
        const validatorResult = ExportPlaylistsPayloadSchema.validate(payload);

        if (validatorResult.error) {
            throw new InvariantError(validatorResult.error.message);
        }
    },
};

module.exports = ExportsValidator;