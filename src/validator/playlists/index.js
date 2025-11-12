const InvariantError = require('../../exeption/invariantError');
const { PostPlaylistPayloadSchema, PostSongToPlaylistPayloadSchema, DeleteSongFromPlaylistPayloadSchema } = require('./schema');

const PlaylistsValidator = {
    validatePostPlaylistsPayload: (payload) => {
        const validationResult = PostPlaylistPayloadSchema.validate(payload);

        if (validationResult.error) {
            throw new InvariantError(validationResult.error.message);
        }
    },

    validatePostSongToPlaylistPayload: (payload) => {
        const validationResult = PostSongToPlaylistPayloadSchema.validate(payload);

        if (validationResult.error) {
            throw new InvariantError(validationResult.error.message);
        }
    },

    validateDeleteSongFromPlaylistPayload: (payload) => {
        const validationResult = DeleteSongFromPlaylistPayloadSchema.validate(payload);

        if (validationResult.error) {
            throw new InvariantError(validationResult.error.message);
        }
    }
}

module.exports = PlaylistsValidator;