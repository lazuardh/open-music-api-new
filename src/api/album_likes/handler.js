const autoBind = require('auto-bind');

class AlbumLikesHandler {
    constructor(userAlbumLikesQueryService, albumsService) {
        this._userAlbumLikesQueryService = userAlbumLikesQueryService;
        this._albumsService = albumsService;
        autoBind(this);
    }

    async postLikesAlbumHandler(request, h){
        const { id: albumId } = request.params;
        const { id: userId } = request.auth.credentials;

        await this._albumsService.verifyAlbumId(albumId);

        await this._userAlbumLikesQueryService.likeAlbum(albumId, userId);

        const response = h.response({
            status: 'success',
            message: 'album berhasil disukai',
        });

        response.code(201);
        return response;
    }

    async getLikesAlbumHandlerById(request, h) {
         const { id: albumId } = request.params;

        await this._albumsService.verifyAlbumId(albumId);
        const { likes, source} = await this._userAlbumLikesQueryService.getAlbumLikes(albumId);

        const response = h.response({
            status: 'success',
            data: { likes },
        });

        if (source === 'cache') {
            response.header('X-Data-Source', 'cache');
        }

        return response;
    }

    async deleteLikeAlbumHandler(request) {
        const { id: albumId } = request.params;
        const { id: userId } = request.auth.credentials;

         await this._albumsService.verifyAlbumId(albumId);
         await this._userAlbumLikesQueryService.unLikeAlbum(albumId, userId);

         return {
            status: 'success',
            message: 'Berhasil batal menyukai album',
        };
    }
}

module.exports = AlbumLikesHandler;