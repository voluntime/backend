const { Pool } = require("pg");
const connectionString =
    process.env.DATABASE_URL ||
    "postgres://voluntime:voluntime@localhost:5432/voluntime"

const dbPool = new Pool({
    connectionString,
    ssl: !!process.env.DATABASE_URL
});

module.exports.pool = dbPool;