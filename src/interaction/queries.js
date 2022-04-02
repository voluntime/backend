const { Request, Response } = require("express");
const { pool } = require("../db");

const interaction = (req, res, interactionTable) => {
    const { id } = req.body;

    // Check if they liked it
    pool.query(`SELECT * FROM ${interactionTable} WHERE VOLUNTEER = $1 AND POST = $2`, [req.session.user.username, id], (err, result) => {

        if (err) throw err;

        if (result.rows.length === 0) {
            // They need to like it
            pool.query(`INSERT INTO ${interactionTable} VALUES ($1, $2)`, [req.session.user.username, id], (err, result) => {
                if (err) throw err;

                // Good to go
                res.status(202).json({
                    interaction: true
                });
            });
        } else {
            // They don't wanna like it anymore
            pool.query(`DELETE FROM ${interactionTable} WHERE VOLUNTEER = $1 AND POST = $2`, [req.session.user.username, id], (err, result) => {
                if (err) throw err;

                // Good to go
                res.status(202).json({
                    interaction: false
                });
            });
        }

    });
};

/**
 * @param req {Request<P, ResBody, ReqBody, ReqQuery, Locals>}
 * @param res {Response<ResBody, Locals>}
 */
module.exports.likePost = (req, res) => {
    interaction(req, res, "POST_LIKE");
};


/**
 * @param req {Request<P, ResBody, ReqBody, ReqQuery, Locals>}
 * @param res {Response<ResBody, Locals>}
 */
module.exports.volunteer = (req, res) => {
    interaction(req, res, "VOLUNTEERED");
};