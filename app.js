const express = require("express");

const port = process.env.PORT || 8080;

const app = express();

app.get("/", (req, res) => {
    res.send({
        "version": 1
    });
});

app.listen(port, () => {
    console.log("Listening on port " + port);
});