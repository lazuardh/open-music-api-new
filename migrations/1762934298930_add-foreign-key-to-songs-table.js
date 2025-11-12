/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const up = (pgm) => {
    pgm.sql(`INSERT INTO albums (id, name, year) VALUES ('default-album', 'Unknown Album', 0)`);

    pgm.sql(`UPDATE songs SET "albumId" = 'default-album' WHERE "albumId" IS NULL`);

    pgm.addConstraint('songs', 'fk_songs.albumId_albums.id', 'FOREIGN KEY("albumId") REFERENCES albums(id) ON DELETE CASCADE');
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
    pgm.dropConstraint('songs', 'fk_songs.albumId_albums.id');
    pgm.sql(`DELETE FROM albums WHERE id = 'default-album'`);
};
