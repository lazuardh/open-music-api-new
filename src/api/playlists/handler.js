const autoBind = require('auto-bind');

class PlaylistsHandler {
    constructor(service, validator) {
        this._service = service;
        this._validator = validator;
        autoBind(this);
    }

    async postPlaylistsHandler(request, h) {
        this._validator.validatePostPlaylistsPayload(request.payload);
        const { name } = request.payload;
        const { id:credentialId } = request.auth.credentials;

        const playlistId = await this._service.addPlaylists({ name, owner: credentialId });

        const response = h.response({
            status: 'success',
            message: 'playlist berhasil ditambahkan.',
            data: {
                playlistId,
            }
        });

        response.code(201);
        return response;
    }

    async getAllPlaylistsHandler(request) {
        const { id: credentialId } = request.auth.credentials;

        const playlists = await this._service.getAllPlaylists(credentialId);
        const playlistsMapped = playlists.map((playlist) => ({
            id: playlist.id,
            name: playlist.name,
            owner: playlist.owner,
        }));

        return {
            status: "success",
            data: {
                playlists: playlistsMapped,
            },
        };
    }

    async deletePlaylistHandler(request) {
        const { id } = request.params;
        const { id:credentialId } = request.auth.credentials;

        await this._service.verifyPlaylistOwner(id, credentialId);
        await this._service.deletePlaylist(id);

        return {
            status: 'success',
            message: 'playlist berhasil dihapus.',
        };
    }

    async postSongToPlaylistHandler(request, h) {
        this._validator.validatePostSongToPlaylistPayload(request.payload);
        const { id: userId } = request.auth.credentials;
        const { id: playlistId } = request.params;
        const { songId } = request.payload;

        await this._service.verifyPlaylistAccess(playlistId, userId);
        await this._service.addSongToPlaylists(playlistId, songId);

        const response = h.response({
            status: 'success',
            message: 'Lagu berhasil ditambahkan ke playlist.',
        });

        response.code(201);
        return response;
    }

    async getSongsFromPlaylistHandler(request) {
        const { id: userId } = request.auth.credentials;
        const { id: playlistId } = request.params;

        await this._service.verifyPlaylistAccess(playlistId, userId);
        const playlist = await this._service.getSongsFromPlaylists(playlistId);

        return {
        status: 'success',
        data: { playlist },
        };
    }

    async deleteSongFromPlaylistHandler(request) {
        this._validator.validateDeleteSongFromPlaylistPayload(request.payload);
        const { id: userId } = request.auth.credentials;
        const { id: playlistId } = request.params;
        const { songId } = request.payload;

        await this._service.verifyPlaylistAccess(playlistId, userId);
        await this._service.deleteSongFromPlaylist(playlistId, songId);

        return {
            status: 'success',
            message: 'Lagu berhasil dihapus dari playlist',
        };
    }
}

module.exports = PlaylistsHandler;