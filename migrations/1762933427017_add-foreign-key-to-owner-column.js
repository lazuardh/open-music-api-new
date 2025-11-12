/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const up = (pgm) => {
    // membuat user baru.
    pgm.sql("INSERT INTO users(id, username, password, fullname) VALUES('developer','developer','developer','developer')");

    // mengubah nilai owner pada note yang owner-nya bernilai NULL
    pgm.sql("UPDATE playlists SET owner = 'developer' WHERE owner IS NULL");

    // memberikan constraint foreign key pada owner terhadap kolom id dari tabel users
    pgm.addConstraint('playlists', 'fk_playlists.owner_users.id', 'FOREIGN KEY(owner) REFERENCES users(id) ON DELETE CASCADE');
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
    // menghapus constraint fk_notes.owner_users.id pada tabel notes
    pgm.dropConstraint('playlists','fk_playlists.owner_users.id');

    // mengubah nilai owner old_notes pada note menjadi NULL
    pgm.sql("UPDATE playlists SET owner = NULL WHERE owner = 'developer'");
 
    // menghapus user baru.
    pgm.sql("DELETE FROM users WHERE id = 'developer'");
};
