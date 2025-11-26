const autoBind = require("auto-bind");

const ClientError = require('../../exeption/clientError');

class UploadsHandler {
    constructor(service, albumsQueryService,  validator) {
        this._service = service;
        this._albumsQueryService = albumsQueryService,
        this._validator = validator;  
        
        autoBind(this);
    }

    async postUploadImageHandler(request, h) {
        const { cover } = request.payload;
        const { id } = request.params;

        await this._albumsQueryService.verifyAlbumId(id);

         this._validator.validateImageHeaders(cover.hapi.headers);

        const filename = await this._service.writeFile(cover, cover.hapi);
          const coverUrl = `http://${process.env.HOST}:${process.env.PORT}/upload/images/${filename}`

        await this._albumsQueryService.updateCoverAlbums(id, coverUrl);
        
        const response = h.response({
            status: 'success',
            message: 'Sampul berhasil diunggah',
        });

        response.code(201);
        return response;
    }
}

module.exports = UploadsHandler;