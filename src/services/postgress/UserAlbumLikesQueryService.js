const { Pool } = require('pg');
const { nanoid } = require('nanoid');

const InvariantError = require('../../exeption/invariantError');
const NotFoundError = require('../../exeption/notFoundError');

class UserAlbumLikesQueryService {
    constructor(cacheSevice) {
        this._pool = new Pool();
        this._cacheSevice = cacheSevice;
    }

    async _checkedAlreadyLikes(albumId, userId) {
        const query = {
            text: 'SELECT id FROM user_album_likes WHERE user_id = $1 AND album_id = $2',
            values: [userId, albumId],
        };

        const alreadyLikes = await this._pool.query(query);

        if (alreadyLikes.rows.length > 0) {
            throw new InvariantError('kamu sudah menyukai album ini.');
        }

    }

    async likeAlbum(albumId, userId) {
        await this._checkedAlreadyLikes(albumId, userId);

        const id = `likes-${nanoid(16)}`;

        const query = {
            text: 'INSERT INTO user_album_likes (id, user_id, album_id) VALUES ($1, $2, $3) RETURNING id',
            values: [id, userId, albumId],
        };

        const result = await this._pool.query(query);

        if (!result.rows.length) {
            throw new NotFoundError('gagal menambahkan album ke dalam favorite.');
        }

        await this._cacheSevice.delete(`album-likes:${albumId}`);

        return result.rows[0].id;
    }

    async unLikeAlbum(albumId, userId){
        const query = {
            text: 'DELETE FROM user_album_likes WHERE user_id = $1 AND album_id = $2 RETURNING id',
            values: [userId, albumId],
        };

        const result = await this._pool.query(query);

        if (!result.rows.length) {
            throw new NotFoundError('gagal batal menyukai album. id tidak ditemukan');
        }

        await this._cacheSevice.delete(`album-likes:${albumId}`);
    }

    async getAlbumLikes(albumId) {
    const cacheKey = `album-likes:${albumId}`;

    try {
        const result = await this._cacheSevice.get(cacheKey);

        const { likes } = JSON.parse(result);

        return { likes, source: 'cache' };
    } catch (error) {
        const query = {
            text: 'SELECT COUNT(*) AS likes FROM user_album_likes WHERE album_id = $1',
            values: [albumId],
        };

        const result = await this._pool.query(query);
        const likes = Number(result.rows[0].likes);

        await this._cacheSevice.set(cacheKey, JSON.stringify({ likes }));

        return { likes, source: 'db' };
    }
}

}

module.exports = UserAlbumLikesQueryService;