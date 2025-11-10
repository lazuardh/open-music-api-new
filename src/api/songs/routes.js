const routes = (handler) => [
    {
        method: 'POST',
        path: '/songs',
        handler: handler.postSongHandler,
    },
    {
        method: 'GET',
        path: '/songs',
        handler: handler.getSongsHandler,
    },
    {
        method: 'GET',
        path: '/songs/{id}',
        handler: handler.getSongHandlerById,
    },
    {
        method: 'PUT',
        path: '/songs/{id}',
        handler: handler.putSongHandlerById,
    },
    {
        method: 'DELETE',
        path: '/songs/{id}',
        handler: handler.deleteSongHandler,
    }
];


module.exports = routes;
