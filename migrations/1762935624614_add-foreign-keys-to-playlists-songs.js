/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const up = (pgm) => {
    // Tambahkan foreign key ke playlists
    pgm.addConstraint('playlists_songs', 'fk_playlists_songs_playlist_id', 'FOREIGN KEY(playlist_id) REFERENCES playlists(id) ON DELETE CASCADE');

    // Tambahkan foreign key ke songs
    pgm.addConstraint('playlists_songs', 'fk_playlists_songs_song_id', 'FOREIGN KEY(song_id) REFERENCES songs(id) ON DELETE CASCADE');

    // Buat index unik untuk kombinasi playlist_id dan song_id
    pgm.sql(`CREATE UNIQUE INDEX idx_playlists_songs_unique ON playlists_songs(playlist_id, song_id)`);
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
    // Hapus index unik
    pgm.sql(`DROP INDEX idx_playlists_songs_unique`);

    // Hapus foreign key constraints
    pgm.addConstraint('playlists_songs', 'fk_playlists_songs_playlist_id', 'DROP CONSTRAINT');
    pgm.addConstraint('playlists_songs', 'fk_playlists_songs_song_id', 'DROP CONSTRAINT');
};
