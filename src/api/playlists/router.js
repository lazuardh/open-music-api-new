const routes = (handler) => [
    {
        method: 'POST',
        path: '/playlists',
        handler: handler.postPlaylistsHandler,
        options: {
            auth: 'openmusic__jwt',
        }
    },
    {
        method: 'POST',
        path: '/playlists/{id}/songs',
        handler: handler.postSongToPlaylistHandler,
        options: {
            auth: 'openmusic__jwt',
        }
    },
    {
        method: 'GET',
        path: '/playlists',
        handler: handler.getAllPlaylistsHandler,
        options: {
            auth: 'openmusic__jwt',
        }
    },
    {
        method: 'GET',
        path: '/playlists/{id}/songs',
        handler: handler.getSongsFromPlaylistHandler,
        options: {
        auth: 'openmusic__jwt',
        },
    },
    {
        method: 'DELETE',
        path: '/playlists/{id}',
        handler: handler.deletePlaylistHandler,
        options: {
            auth: 'openmusic__jwt',
        }
    },
    {
        method: 'DELETE',
        path: '/playlists/{id}/songs',
        handler: handler.deleteSongFromPlaylistHandler,
        options: {
        auth: 'openmusic__jwt',
        },
    },
];

module.exports = routes;