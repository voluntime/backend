const { Request, Response } = require("express");
const { pool } = require("../db");


/**
 * @param req {Request<P, ResBody, ReqBody, ReqQuery, Locals>}
 * @param res {Response<ResBody, Locals>}
 */
module.exports.login = (req, res) => {
    res.send({ TODO: true });
};


/**
 * @param req {Request<P, ResBody, ReqBody, ReqQuery, Locals>}
 * @param res {Response<ResBody, Locals>}
 */
module.exports.signup = (req, res) => {
    res.send({ TODO: true });
};