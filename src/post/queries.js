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
        duration,
        profile,
    } = req.query;

    const my_username = req.session.user.username;

    let andFilters = [];
    let params = [my_username];

    if (date) {
        andFilters.push("p.begins::date = $");
        params.push(date);
    }

    if (eventType) {
        andFilters.push("p.event_type = $");
        params.push(eventType);
    }

    if (duration) {
        andFilters.push("p.ends - p.begins <= $");
        params.push(duration);
    }

    for (const i in andFilters) {
        const id = parseInt(i) + 2;
        andFilters[i] += id;
    }

    andFilters.push("p.begins > now()");

    // If the user is on the homepage, show the list of upcoming events they
    // are going to or organized
    // - p.organizer = me or volunteered = 't'

    // (If organizer is not me)
    // If we're looking at another user's profile, only show the list of their
    // upcoming events
    // -

    if (profile) {
        if (my_username === profile) {
            // TODO FIX, SQL INJECTION sad
            andFilters.push(`(p.organizer = '${profile}' or volunteered = 't' or liked = 't')`);
        } else {
            andFilters.push(`(p.organizer = '${profile}')`);
        }
    }

    let filterQuery = andFilters.join(" and ");

    const bigBoiQuery = "select p.*, v.volunteered, l.liked from ( select id, TRUE as liked from full_post fp where exists( select 1 from post_like where post = fp.id and post_like.volunteer = $1 ) union select id, FALSE as liked from full_post fp where not exists( select 1 from post_like where post = fp.id and post_like.volunteer = $1 ) ) l join ( select id, TRUE as volunteered from full_post fp where exists( select 1 from volunteered where post = fp.id and volunteered.volunteer = $1 ) union select id, FALSE as volunteered from full_post fp where not exists( select 1 from volunteered where post = fp.id and volunteered.volunteer = $1 ) ) v on l.id = v.id join full_post p on l.id = p.id";

    const query = andFilters.length > 0 ? bigBoiQuery + " where " + filterQuery : bigBoiQuery;

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