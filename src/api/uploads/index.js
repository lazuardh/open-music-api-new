const UploadsHandler = require("./handler");
const routes = require('./routes');

module.exports = {
    name: 'uploads',
    version: '1.0.0',
    register: async (server, { service, albumsQueryService, validator }) => {
        const uploadsHandler = new UploadsHandler(service, albumsQueryService, validator);
        server.route(routes(uploadsHandler));
    }
};