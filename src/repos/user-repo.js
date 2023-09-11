const pool = require('../pool');
const { use } = require('../routes/users');

class UserRepo {
  static async find() {
    const { rows } = await pool.query('SELECT * FROM users;');

    return rows;
  }

  static async findById(id) {
    const { rows } = await pool.query(`SELECT * FROM users WHERE id = $1;`, [id]);

    return rows[0];
  }

  static async insert(username, bio) {
    const { rows } = await pool.query(`INSERT INTO users (username, bio) VALUES ($1, $2) RETURNING *`, [username, bio]);

    return rows[0];
  }

  static async update(id, username, bio) {
    const {
      rows,
    } = await pool.query(
      'UPDATE users SET username = $1, bio = $2 WHERE id = $3 RETURNING *;',
      [username, bio, id]
    );

    return rows[0];
  }

  static async delete(id) {
    const {
      rows,
    } = await pool.query('DELETE FROM users WHERE id = $1 RETURNING *;', [id]);

    return rows[0];
  }
}

module.exports = UserRepo;