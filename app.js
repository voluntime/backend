// Voluntime app
const fs = require("fs");
const express = require("express");
const session = require("express-session");
const MemoryStore = require("memorystore")(session);

const { pool } = require("./src/db");
const { authenticated } = require("./src/middleware");
const user = require("./src/user");
const auth = require("./src/auth");


const initSql = fs.readFileSync("./db/schema.sql").toString();
const port = process.env.PORT || 8080;
const app = express();

app.use(express.json());
app.use(session({
    secret: "voluntime",
    name: "sess_id",
    store: new MemoryStore({ checkPeriod: 86400000 }), // prune after 24hr
    cookie: { maxAge: 86400000 }, // cookie expires in 24hr
    saveUninitialized: false,
    resave: false
}));

// User routes
app.get("/v1/users", user.getAllUsers);
app.get("/v1/user/:username", user.getUser);

// Auth routes
app.post("/v1/login", auth.login);

// TEST - session route
app.get("/session", (req, res) => {
    if (req.session.views) {
       req.session.views++;
       res.send(req.session);
    } else {
        req.session.views = 1;
        res.send(req.session);
    }
});

// Global err catchall
app.use((err, req, res, next) => {
    res.status(err.code || 500).send({
        err: err.reason || "No reason given"
    })
});

// Ensure all tables are loaded
pool.query(initSql, (err, res) => {
    if (err) throw err;

    app.listen(port, () => {
        console.log("Listening on port " + port);
    });
})
