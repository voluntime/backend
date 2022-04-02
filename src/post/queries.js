const { Request, Response } = require("express");
const { pool } = require("../db");

/**
 * @param req {Request<P, ResBody, ReqBody, ReqQuery, Locals>}
 * @param res {Response<ResBody, Locals>}
 */
module.exports.getAllPosts = (req, res, next) => {
    const {
        date,
        eventType,
        duration
    } = req.query;

    let filters = [];
    let params = [req.session.user.username];

    if (date) {
        filters.push("p.begins::date = $");
        params.push(date);
    }

    if (eventType) {
        filters.push("p.event_type = $");
        params.push(eventType);
    }

    if (duration) {
        filters.push("p.ends - p.begins <= $");
        params.push(duration);
    }

    for (const i in filters) {
        const id = parseInt(i) + 2;
        filters[i] += id;
    }

    filters.push("p.begins > now()");

    const filterQuery = filters.join(" and ");

    const bigBoiQuery = "select p.*, v.volunteered, l.liked from ( select id, TRUE as liked from full_post fp where exists( select 1 from post_like where post = fp.id and post_like.volunteer = $1 ) union select id, FALSE as liked from full_post fp where not exists( select 1 from post_like where post = fp.id and post_like.volunteer = $1 ) ) l join ( select id, TRUE as volunteered from full_post fp where exists( select 1 from volunteered where post = fp.id and volunteered.volunteer = $1 ) union select id, FALSE as volunteered from full_post fp where not exists( select 1 from volunteered where post = fp.id and volunteered.volunteer = $1 ) ) v on l.id = v.id join full_post p on l.id = p.id";

    const query = bigBoiQuery + " where " +  filterQuery;

    pool.query(query, params, (err, result) => {
        if (err) return next(err);

        res.send(result.rows);
    });
};


/**
 * @param req {Request<P, ResBody, ReqBody, ReqQuery, Locals>}
 * @param res {Response<ResBody, Locals>}
 */
module.exports.getPostById = (req, res, next) => {
    res.send({ TODO: true });
};


/**
 * @param req {Request<P, ResBody, ReqBody, ReqQuery, Locals>}
 * @param res {Response<ResBody, Locals>}
 */
module.exports.createPost = (req, res, next) => {
    let {
        organization,
        title,
        body,
        eventLocation,
        eventType,
        volunteerGoal,
        beginsAt,
        endsAt
    } = req.body;

    let createdAt = new Date();

    organization = organization ? organization : null;

    let params = [
        createdAt,
        beginsAt,
        endsAt,
        req.session.user.username,
        organization,
        title,
        body,
        eventLocation,
        eventType,
        volunteerGoal
    ];

    pool.query("INSERT INTO POST(created, begins, ends, organizer, organization, title, body, event_location, event_type, goal) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *", params, (err, result) => {
        if (err) return next(err);

        if (result.rowCount !== 1) {
            return res.status(500).json({
                err: "Problem adding post"
            });
        }

        return res.status(201).json(result.rows[0]);
    });
};


/**
 * @param req {Request<P, ResBody, ReqBody, ReqQuery, Locals>}
 * @param res {Response<ResBody, Locals>}
 */
module.exports.deletePost = (req, res, next) => {
    const { id } = req.body;

    pool.query("DELETE FROM POST WHERE ID = $1", [id], (err, result) => {
       if (err) return next(err);

       res.send({
           success: true
       });
    });
}