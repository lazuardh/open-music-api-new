const routes = require("./routes");
const AlbumLikesHandler = require("./handler");

module.exports = {
    name: 'albums-Likes',
    version: '1.0.0',
     register: async(server, { userAlbumLikesQueryService, albumsService }) => {
        const albumLikesHandler= new AlbumLikesHandler(userAlbumLikesQueryService, albumsService);
        server.route(routes(albumLikesHandler));
    }
}