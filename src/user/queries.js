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

    pool.query("SELECT V.*, COUNT(VD.FUFILLED) AS REPUTATION FROM VOLUNTEER V LEFT OUTER JOIN VOLUNTEERED VD ON V.USERNAME = VD.VOLUNTEER WHERE USERNAME = $1 GROUP BY V.USERNAME", [username], (err, result) => {

        if (err) return next(err);

        if (result.rows.length === 0) {
            return res.status(404).json({
                "error": "No user found"
            });
        }

        const user = result.rows[0];

        delete user.password;
        user.reputation = parseInt(user.reputation);

        // set reputation to be in range of 0-3
        if (user.reputation > 1 && user.reputation < 5) {
            user.reputation = 1;
        } else if (user.reputation > 5 && user.reputation < 10) {
            user.reputation = 2;
        } else if (user.reputation >= 10) {
            user.reputation = 3;
        }

        if (user.username !== req.session.user.username) {
            delete user.email;
        }

        return res.send(user);
    });
};