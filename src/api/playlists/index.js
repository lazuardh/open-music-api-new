const PlaylistsHandler = require("./handler");
const routes = require("./router");

module.exports = {
    name: 'playlists',
    version: '1.0.0',
    register: async(server, {service, validator}) => {
        const playlistsHandler = new PlaylistsHandler(service, validator);
        server.route(routes(playlistsHandler));
    }
};