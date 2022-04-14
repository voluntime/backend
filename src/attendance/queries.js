const { Request, Response } = require("express");
const { pool } = require("../db");

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

/**
 * @param req {Request<P, ResBody, ReqBody, ReqQuery, Locals>}
 * @param res {Response<ResBody, Locals>}
 */
module.exports.volunteers = (req, res, next) => {
    const postId = req.params.postid || "";
    console.log(postId);
    pool.query("SELECT FP.ID, FP.TITLE, VD.*, V.NAME, V.EMAIL FROM FULL_POST FP JOIN VOLUNTEERED VD ON FP.ID = VD.POST JOIN VOLUNTEER V ON VD.VOLUNTEER = V.USERNAME WHERE FP.ID = $1 order by name;", [postId], (err, result) => {
        if (err) return next(err);

        return res.json(result.rows);
    });
};