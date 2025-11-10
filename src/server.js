require('dotenv').config();
const Hapi = require('@hapi/hapi');

const albums = require('./api/albums');
const AlbumsService = require('./services/inMemory/albumsService');
const albumsValidator = require('./validator/albums');

const songs = require('./api/songs');
const SongsService = require('./services/inMemory/songsService');
const songsValidator = require('./validator/songs');

const ClientError = require("./exeption/clientError");


const init = async () => {
    const albumsService = new AlbumsService();
    const songsService = new SongsService();

    const host = process.env.HOST || '127.0.0.1';
    const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

    const server = Hapi.server({
        port: port,
        host: host,
        routes: {
            cors: {
                origin: ['*'],
            }
        }
    });

    //adding all pluggin
    await server.register([
      {
        plugin: albums,
        options: {
            service: albumsService,
            validator: albumsValidator,
        }
      },
      {
        plugin: songs,
        options: {
          service: songsService,
          validator: songsValidator,
        },
      },
    ]);

    //menambahkan onPreResponse untuk handle custom error
    server.ext("onPreResponse", (request, h) => {
    // mendapatkan konteks response dari request
    const { response } = request;

    // penanganan client error secara internal.
    if (response instanceof ClientError) {
      const newResponse = h.response({
        status: "fail",
        message: response.message,
      });
      newResponse.code(response.statusCode);
      return newResponse;
    }

      return h.continue;
    });

    await server.start();
     console.log(`Server berjalan pada ${server.info.uri}`);
};

init();