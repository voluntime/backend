// Voluntime app
const fs = require("fs");
const express = require("express");
const cors = require("cors");
const session = require("express-session");
const MemoryStore = require("memorystore")(session);
const PgSimple = require("connect-pg-simple")(session);

const { pool } = require("./src/db");
const { authenticated } = require("./src/middleware");
const auth = require("./src/auth");
const interaction = require("./src/interaction");
const post = require("./src/post");
const reputation = require("./src/reputation");
const user = require("./src/user");

const initSql = fs.readFileSync("./db/schema.sql").toString();
const port = process.env.PORT || 8080;
const app = express();

if (process.env.NODE_ENV === 'production') {
    app.use((req, res, next) => {
        if (req.header('x-forwarded-proto') !== 'https')
            res.redirect(`https://${req.header('host')}${req.url}`)
        else
            next()
    })
}

app.use(cors({
    origin: ["http://localhost", "http://localhost:8080", "http://localhost:3000", "https://api.volunti.me", "https://volunti.me"],
    credentials: true
}));

// Dev cookie config
let cookieConfig = {
    maxAge: 86400000,
    domain: !!process.env.DATABASE_URL ? ".volunti.me" : "localhost",
};

if (!!process.env.DATABASE_URL) {
    app.set("trust proxy", 1);
}

app.use(express.json());
app.use(session({
    secret: "voluntime",
    name: "sess_id",
    store: new PgSimple({
        pool,
        createTableIfMissing: true
    }),
    cookie: cookieConfig, // cookie expires in 24hr
    saveUninitialized: false,
    resave: false
}));

// User routes
app.get("/v1/users", authenticated, user.getAllUsers);
app.get("/v1/user/:username", authenticated, user.getUser);

// Post routes
app.get("/v1/posts", authenticated, post.getAllPosts);
app.post("/v1/post", authenticated, post.createPost);
app.delete("/v1/post", authenticated, post.deletePost);

// Interaction routes
app.post("/v1/interaction/like", authenticated, interaction.likePost);
app.post("/v1/interaction/volunteer", authenticated, interaction.volunteer);

// Reputation route
app.get("/v1/reputation/:username", authenticated, reputation.getReputation);

// Auth routes
app.post("/v1/login", auth.login);
app.post("/v1/signup", auth.signup);
app.post("/v1/logout", authenticated, auth.logout);

// TEST - session route
app.get("/session", (req, res, next) => {
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
    res.status(500).json({
        err: err.reason || err.toString()
    })
});

// Ensure all tables are loaded
pool.query(initSql, (err, res) => {
    if (err) return next(err);

    app.listen(port, () => {
        console.log("Listening on port " + port);
    });
})
