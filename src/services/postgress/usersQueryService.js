const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const bcrypt = require('bcrypt');

const InvariantError = require('../../exeption/invariantError');
const NotFoundError = require('../../exeption/notFoundError');
const AuthenticationError = require('../../exeption/authenticationError');

class UsersQueryService {
  constructor() {
    this._pool = new Pool();
  }

  async addUser({username, password, fullname}) {
    // TODO: Verifikasi username, pastikan belum terdaftar.
    await this.verifyNewUsername(username);

    const id = `user-${nanoid(16)}`;
    const hashedPassword = await bcrypt.hash(password, 10);
    const query = {
        text: 'INSERT INTO users values($1, $2, $3, $4) RETURNING id',
        values: [id, username, hashedPassword, fullname],
    }

    // TODO: Bila verifikasi lolos, maka masukkan user baru ke database.
    const result = await this._pool.query(query);

    if (!result.rows.length) {
        throw new InvariantError('User gagal ditambahkan.');
    }

    return result.rows[0].id;
  }

  async verifyNewUsername(username) {
    const query = {
        text: 'SELECT username FROM users WHERE username = $1',
        values: [username],
    };

    const result = await this._pool.query(query);

    if (result.rows.length > 0) {
        throw new InvariantError('Gagal menambahkan user. username sudah digunakan');
    }
  }

  async getUserById(userId) {
    const query = {
      text: 'SELECT id, username, fullname FROM users WHERE id = $1',
      values: [userId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
        throw new NotFoundError('User tidak ditemukan.');
    }

    return result.rows[0];
  }

  async verifyCredential(username, password) {
    const query = {
      text: 'SELECT id, username, password FROM users WHERE username = $1',
      values: [username],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new AuthenticationError('Kredential yang anda berikan salah.');
    }

    const { id, password: hashedPassword } = result.rows[0];
    const matcheed = await bcrypt.compare(password, hashedPassword);

    if (!matcheed) {
      throw new AuthenticationError('Kredential yang anda berikan salah');
    }

    return id;
  }
}

module.exports = UsersQueryService;