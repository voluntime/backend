const { Pool } = require("pg");
const connectionString =
    process.env.DATABASE_URL ||
    "postgres://voluntime:voluntime@localhost:5432/voluntime"

const sslConfig = process.env.POSTGRES_SSL &&
                  process.env.POSTGRES_SSL === "true" ? { rejectUnauthorized: false } : false;

const dbPool = new Pool({
    connectionString,
    ssl: sslConfig,
});

module.exports.pool = dbPool;
