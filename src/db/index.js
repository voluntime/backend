const { Pool } = require("pg");

const dbPool = new Pool({
    user: '',
    host: '',
    database: '',
    password: '',
    port: 5432,
});

module.exports = {
    pool: dbPool
};