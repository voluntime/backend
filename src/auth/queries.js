const {Request, Response} = require("express");
const {pool} = require("../db");
const bcrypt = require("bcrypt");
const saltRounds = 10;

/**
 * @param req {Request<P, ResBody, ReqBody, ReqQuery, Locals>}
 * @param res {Response<ResBody, Locals>}
 */
module.exports.login = (req, res, next) => {
    const {username, password} = req.body;

    pool.query("SELECT * FROM VOLUNTEER WHERE USERNAME = $1", [username], async (err, result) => {
        if (err) return next(err);

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
            const userData = result.rows[0];
            delete userData.password;
            req.session.user = userData;
            res.json(userData);
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
        email,
        password,
    } = req.body;

    pool.query("SELECT * FROM VOLUNTEER WHERE USERNAME = $1 OR EMAIL = $2", [username, email], async (err, result) => {
        if (err) return next(err);

        if (result.rows.length > 0) return res.status(400).json({ err: "Username or email already exists" });

        req.body.organization = req.body.organization || null;
        req.body.password = await bcrypt.hash(password, saltRounds);

        const cb = (err, result) => {
            if (err) return next(err);
            delete req.body.password;
            res.status(201).json(req.body);
        };

        pool.query(`insert into volunteer(username, name, email, password, zipcode, organization, bio)
                    values ($1, $2, $3, $4, $5, $6, $7)`,
            Object.values(req.body),
            cb
        )
    })
};