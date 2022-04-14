const {Request, Response} = require("express");
const {pool} = require("../db");

/**
 * @param req {Request<P, ResBody, ReqBody, ReqQuery, Locals>}
 * @param res {Response<ResBody, Locals>}
 */
module.exports.verifyAttendance = (req, res, next) => {
    const {
        postId,
        username,
    } = req.body;

    pool.query("UPDATE VOLUNTEERED SET FULFILLED = true where post = $1 and volunteer = $2", [postId, username], (err, result) => {
       if (err) return next(err);

       return res.json({
           success: true
       });
    });
};