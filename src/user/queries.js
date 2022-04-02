const {Request, Response} = require("express");
const {pool} = require("../db");

/**
 * @param req {Request<P, ResBody, ReqBody, ReqQuery, Locals>}
 * @param res {Response<ResBody, Locals>}
 */
module.exports.getAllUsers = (req, res, next) => {
    pool.query("SELECT * FROM VOLUNTEER", (err, result) => {
        if (err) return next(err);
        res.send(result.rows);
    });
};


/**
 * @param req {Request<P, ResBody, ReqBody, ReqQuery, Locals>}
 * @param res {Response<ResBody, Locals>}
 */
module.exports.getUser = (req, res, next) => {
    const username = req.params.username || "";

    pool.query("SELECT * FROM VOLUNTEER WHERE USERNAME = $1", [username], (err, result) => {
        if (err) return next(err);

        if (result.rows.length === 0) {
            return res.status(404).json({
                "error": "No user found"
            });
        }

        const user = result.rows[0];

        delete user.password;

        if (user.username !== req.session.user.username) {
            delete user.email;
        }

        return res.send(user);
    });
};