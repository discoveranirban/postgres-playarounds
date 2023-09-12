const pool = require('../pool');
const { randomBytes } = require('crypto');
const { default: migrate } = require('node-pg-migrate');

class Context {
    static async build() {
        const roleName = 'a' + randomBytes(4).toString('hex');

        await pool.connect({
            host: 'localhost',
            port: 5432,
            database: 'socialnetwork-testdb',
            user: 'yashadhara',
            password: '',
        });

        await pool.query(`CREATE ROLE ${roleName} WITH LOGIN PASSWORD '${roleName}';`);

        await pool.query(`CREATE SCHEMA ${roleName} AUTHORIZATION ${roleName};`);

        await pool.close();

        await migrate({
            schema: roleName,
            direction: 'up',
            log: () => {},
            noLock: true,
            dir: 'migrations',
            databaseUrl: {
                host: 'localhost',
                port: 5432,
                database: 'socialnetwork-testdb',
                user: roleName,
                password: roleName
            }
        });

        await pool.connect({
            host: 'localhost',
            port: 5432,
            database: 'socialnetwork-testdb',
            user: roleName,
            password: roleName,
        });

        return new Context(roleName);
    }

    async reset() {
        return pool.query(`
            DELETE FROM users;
        `);
    }

    async close() {
        await pool.close();

        await pool.connect({
            host: 'localhost',
            port: 5432,
            database: 'socialnetwork-testdb',
            user: 'yashadhara',
            password: '',
        });

        await pool.query(`DROP SCHEMA ${this.roleName} CASCADE`);

        await pool.query(`DROP ROLE ${this.roleName}`);

        await pool.close();
    }

    constructor(roleName) {
        this.roleName = roleName;
    }
}

module.exports = Context;