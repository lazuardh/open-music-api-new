const { Pool } = require('pg');
const { nanoid } = require('nanoid');

const InvariantError = require('../../exeption/invariantError');
const AuthorizationError = require('../../exeption/authorizationError');
const NotFoundError = require('../../exeption/notFoundError');
const { mapPlaylistsDBToModel } = require('../../utils');

class PlaylistsQueryService {
    constructor() {
        this._pool = new Pool();
    }

    async addPlaylists({ name, owner }) {
        const id = `playlist-${nanoid(16)}`;
        const query = {
            text: 'Insert INTO playlists values($1, $2, $3) RETURNING id',
            values: [id, name, owner],
        };

        const result = await this._pool.query(query);

        if (!result.rows.length) {
            throw new InvariantError('gagal menambahkan playlist.');
        }

        return result.rows[0].id;
    }

    async verifyNewPlaylist(name) {
        const query = {
            text: 'SELECT name FROM playlists WHERE name = $1',
            values: [name],
        };

        const result = await this._pool.query(query);

        if (result.rows.length > 0) {
            throw new InvariantError('Gagal menambahkan playlist, nama playlist sudah digunakan.');
        }
    }

    async getAllPlaylists(owner) {
        const baseQuery = {
            text: 'SELECT p.id, p.name, u.username FROM playlists p JOIN users u ON u.id = p.owner WHERE p.owner = $1',
            values: [owner],
        };

        const result = await this._pool.query(baseQuery);
        return result.rows.map(mapPlaylistsDBToModel);
    }

    async verifyPlaylistOwner(id, owner) {
        const query = {
            text: 'SElECT * FROM playlists WHERE id = $1',
            values: [id],
        };

        const result = await this._pool.query(query);

        if (!result.rows.length) {
            throw new NotFoundError('playlist tidak ditemukan.');
        }

        const playlist = result.rows[0];

        if (playlist.owner !== owner) {
            throw new AuthorizationError('Anda tidak berhak mengakses resource ini.');
        }
    }

    async deletePlaylist(id) {
        const query = {
            text: 'DELETE FROM playlists WHERE id = $1 RETURNING id',
            values: [id],
        };

        const result = await this._pool.query(query);

        if (!result.rows.length) {
            throw new NotFoundError('Gagal menghapus playlists. id tidak ditemukan');
        }
    }

    async addSongToPlaylists(playlistId, songId) {
        const id = `playlist-${nanoid(16)}`;
        const query = {
            text: 'INSERT INTO playlists_songs(id, playlist_id, song_id) VALUES($1, $2, $3) RETURNING id',
            values: [id,playlistId, songId],
        };

        const result = await this._pool.query(query);

        if (!result.rows.length) {
            throw new InvariantError('Gagal menambahkan lagu ke playlist.');
        }

        return result.rows[0].id;
    }

    async getSongsFromPlaylists(playlistId) {
        const queryPlaylist = {
            text: `SELECT p.id, p.name, u.username FROM playlists p
                   JOIN users u ON p.owner = u.id WHERE p.id = $1`,
            values: [playlistId]
        };

        const playlistResult = await this._pool.query(queryPlaylist);

        if (!playlistResult.rows.length) {
            throw new NotFoundError('Playlist tidak ditemukan.');
        }

        const querySong = {
             text: `SELECT s.id, s.title, s.performer FROM playlists_songs ps
                   JOIN songs s ON s.id = ps.song_id WHERE ps.playlist_id = $1`,
            values: [playlistId]
        }


        const songResult = await this._pool.query(querySong);

        return {
            ...playlistResult.rows[0],
            songs: songResult.rows,
        };
    }

    async deleteSongFromPlaylist(playlistId, songId) {
        const query = {
            text: 'DELETE FROM playlists_songs WHERE playlist_id = $1 AND song_id = $2 RETURNING id',
            values: [playlistId, songId],
        };

        const result = await this._pool.query(query);

        if (!result.rows.length) {
            throw new NotFoundError('Lagu tidak ditemukan di dalam playlist.');
        }
    }

    async verifyPlaylistAccess(playlistId, userId) {
        const playlistQuery = {
        text: 'SELECT owner FROM playlists WHERE id = $1',
        values: [playlistId],
        };

        const result = await this._pool.query(playlistQuery);


        if (!result.rows.length) throw new NotFoundError('Playlist tidak ditemukan');

        const playlist = result.rows[0];

        if (playlist.owner !== userId) {
            throw new AuthorizationError('Anda tidak berhak mengakses resource ini');
        }
    }


    async verifyQuerySongs(songId) {
        const querySongs = {
            text: 'SELECT id FROM songs WHERE id = $1',
            values: [songId],
        };

        const resultSong = await this._pool.query(querySongs);

        if (!resultSong.rows.length) {
             throw new NotFoundError('lagu tidak ditemukan.');
        }
    }
}

module.exports = PlaylistsQueryService;