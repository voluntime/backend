const { Pool } = require("pg");
const connectionString =
    process.env.DATABASE_URL ||
    "postgres://voluntime:voluntime@localhost:5432/voluntime"

const dbPool = new Pool({
    connectionString,
});

module.exports.pool = dbPool;