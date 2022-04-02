const express = require("express");

const port = process.env.PORT || 8080;

const app = express();

app.get("/v1", (req, res) => {
    res.send({
        "version": 1
    });
});

app.get("/v1/user", (req, res) => {
    res.send({
        "username": "adam_hearn",
        "full_name": "Adam Hearn",
    })
});

app.listen(port, () => {
    console.log("Listening on port " + port);
});