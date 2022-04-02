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
const user = require("./src/user");

const initSql = fs.readFileSync("./db/schema.sql").toString();
const port = process.env.PORT || 8080;
const app = express();

app.use(cors({
    origin: ["http://localhost:3000", "https://api.volunti.me"],
    credentials: true
}));

app.use(express.json());
app.use(session({
    secret: "voluntime",
    name: "sess_id",
    store: new PgSimple({
        pool,
        createTableIfMissing: true
    }),
    cookie: { maxAge: 86400000 }, // cookie expires in 24hr
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

// Auth routes
app.post("/v1/login", auth.login);
app.post("/v1/signup", auth.signup);
app.post("/v1/logout", authenticated, auth.signup);

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
    res.status(err.code || 500).send({
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
