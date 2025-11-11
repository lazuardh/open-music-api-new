require('dotenv').config();

const Hapi = require('@hapi/hapi');
const Vision = require('@hapi/vision');
const Handlebars = require('handlebars');
const path = require("path");

const albums = require('./api/albums');
const AlbumsService = require('./services/postgress/albumsQueryService');
const albumsValidator = require('./validator/albums');

const songs = require('./api/songs');
const SongsService = require('./services/postgress/songsQueryService');
const songsValidator = require('./validator/songs');

const users = require('./api/users');
const UsersService = require('./services/postgress/usersQueryService');
const UsersValidator = require('./validator/users');

const authentications = require('./api/authentications');
const AuthenticationsQueryService = require('./services/postgress/authenticationsQueryService');
const TokenManager = require('./tokenize/tokenManager');
const AuthenticationsValidator = require('./validator/authentications');

const ClientError = require("./exeption/clientError");


const init = async () => {
    const albumsService = new AlbumsService(new SongsService());
    const songsService = new SongsService();
    const usersService = new UsersService();
    const usersQueryService = new UsersService();
    const authenticationsQueryService = new AuthenticationsQueryService();

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
      {
        plugin: users,
        options: {
          service: usersService,
          validator: UsersValidator,
        },
      },
      {
        plugin: authentications,
        options: {
          authenticationsQueryService,
          usersQueryService,
          tokenManager: TokenManager,
          validator: AuthenticationsValidator,
        },
      },
    ]);

    await server.register(Vision);
    server.views({
      engines: {
        hbs: Handlebars,
      },
      path: path.join(__dirname, "..", "/views"),
    });

    server.route({
    method: "GET",
    path: "/",
    handler: (request, h) => {
      return h.view("index", {
        title: "Open-musik Api v1 with Hapi.js",
        message:
          "Ini adalah template rendering engine menggunakan handlebars dan plugin vision",
      });
    },
  });

    //menambahkan onPreResponse untuk handle custom error
    server.ext('onPreResponse', (request, h) => {
      // mendapatkan konteks response dari request
      const { response } = request;

      if (response instanceof Error) {
  
        // penanganan client error secara internal.
        if (response instanceof ClientError) {
          const newResponse = h.response({
            status: 'fail',
            message: response.message,
          });
          newResponse.code(response.statusCode);
          return newResponse;
        }

        // mempertahankan penanganan client error oleh hapi secara native, seperti 404, etc.
        if (!response.isServer) {
          return h.continue;
        }

        // penanganan server error sesuai kebutuhan
        const newResponse = h.response({
          status: 'error',
          message: 'terjadi kegagalan pada server kami',
        });
        newResponse.code(500);
        return newResponse;
      }

      // jika bukan error, lanjutkan dengan response sebelumnya (tanpa terintervensi)
      return h.continue;
    });

    await server.start();
     console.log(`Server berjalan pada ${server.info.uri}`);
};

init();