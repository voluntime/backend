const {Request, Response} = require("express");
const {pool} = require("../db");

/**
 * @param req {Request<P, ResBody, ReqBody, ReqQuery, Locals>}
 * @param res {Response<ResBody, Locals>}
 */
module.exports.getReputation = (req, res, next) => {
    const {
        username
    } = req.query;

    pool.query("select count(fufilled) from volunteered where volunteer = $1", [username], (err, result) => {
        let reputation = 0;

        if (err) return next(err);

        if (result.rows.length !== 0) {
            const numVerifiedEvents = result.rows[0][0];

            if (numVerifiedEvents === 1) {
                reputation = 1;
            } else if (numVerifiedEvents <= 5) {
                reputation = 2;
            } else if (numVerifiedEvents >= 10) {
                reputation = 3;
            }
        }

        return res.send({ reputation });
    });
};
