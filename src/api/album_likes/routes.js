const routes = (handler) => [
    {
        method: 'POST',
        path: '/albums/{id}/likes',
        handler:  handler.postLikesAlbumHandler,
        options: {
            auth: 'openmusic__jwt',
        },
    },
    {
        method: 'GET',
        path: '/albums/{id}/likes',
        handler: handler.getLikesAlbumHandlerById,
    },
    {
        method: 'DELETE',
        path: '/albums/{id}/likes',
        handler: handler.deleteLikeAlbumHandler,
        options: {
            auth: 'openmusic__jwt',
        },
    }
];

module.exports = routes;