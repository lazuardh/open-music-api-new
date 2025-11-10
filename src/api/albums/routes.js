const routes = (handler) => [
    {
        method: 'POST',
        path: '/albums',
        handler:  handler.postAlbumHandler,
    },
    {
        method: 'GET',
        path: '/albums/{id}',
        handler: handler.getAlbumHandlerById,
    },
    {
        method: 'PUT',
        path: '/albums/{id}',
        handler: handler.putAlbumHandlerById,
    },
    {
        method: 'DELETE',
        path: '/albums/{id}',
        handler: handler.deleteAlbumHandler,
    }
];

module.exports = routes;