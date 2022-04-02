const { Request, Response } = require("express");
const { pool } = require("../db");
const bcrypt = require("bcrypt");
const saltRounds = 10;

/**
 * @param req {Request<P, ResBody, ReqBody, ReqQuery, Locals>}
 * @param res {Response<ResBody, Locals>}
 */
module.exports.login = (req, res, next) => {
    const { username, password } = req.body;

    pool.query("SELECT PASSWORD FROM VOLUNTEER WHERE USERNAME = $1", [username], async (err, result) => {
        if (err) next(err);

        if (result.rows.length !== 1) {
            return res.status(401).json({
                err: "Username or password incorrect"
            });
        }

        const hash = result.rows[0].password;

        const passwordMatches = await bcrypt.compare(password, hash);

        if (!passwordMatches) {
            res.status(401).json({
                err: "Incorrect username or password"
            });
        } else {
            req.session.user = {
                username
            };
            const userData = result.rows[0];
            delete userData.password;

            res.json(userData)
        }
    });
};


/**
 * @param req {Request<P, ResBody, ReqBody, ReqQuery, Locals>}
 * @param res {Response<ResBody, Locals>}
 */
module.exports.logout = (req, res, next) => {
    delete req.session.user;
    res.send({
        success: true
    });
};


/**
 * @param req {Request<P, ResBody, ReqBody, ReqQuery, Locals>}
 * @param res {Response<ResBody, Locals>}
 */
module.exports.signup = async (req, res, next) => {
    const {
        username,
        name,
        email,
        password,
        zipcode,
        organization,
        bio
    } = req.body;

    req.body.organization = req.body.organization || null;
    req.body.password = await bcrypt.hash(password, saltRounds);

    const cb = (err, result) => {
        if (err) next(err);
        delete req.body.password;
        res.status(201).json(req.body);
    };

    pool.query(`insert into volunteer(username, name, email, password, zipcode, organization, bio) values($1, $2, $3, $4, $5, $6, $7)`,
        Object.values(req.body),
        cb
    )
};