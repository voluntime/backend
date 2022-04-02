const { Request, Response } = require("express");
const { pool } = require("../db");
const bcrypt = require("bcrypt");
const saltRounds = 10;

/**
 * @param req {Request<P, ResBody, ReqBody, ReqQuery, Locals>}
 * @param res {Response<ResBody, Locals>}
 */
module.exports.login = async (req, res) => {
    const { username, password } = req.body;
    const hash = await bcrypt.hash(password, saltRounds);
    console.log(hash);
    res.send({ TODO: true });
};


/**
 * @param req {Request<P, ResBody, ReqBody, ReqQuery, Locals>}
 * @param res {Response<ResBody, Locals>}
 */
module.exports.signup = (req, res) => {
    res.send({ TODO: true });
};