const express = require("express");
const { pool } = require("./src/db");
const user = require("./src/user");
const fs = require("fs");

const initSql = fs.readFileSync("./db/schema.sql").toString();
const port = process.env.PORT || 8080;
const app = express();

app.get("/v1/users", user.getAllUsers);
app.get("/v1/user/:username", user.getUser);

// Ensure all tables are loaded
pool.query(initSql, (err, res) => {
    if (err) throw err;

    app.listen(port, () => {
        console.log("Listening on port " + port);
    });
})
