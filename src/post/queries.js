const { Request, Response } = require("express");
const { pool } = require("../db");

/**
 * @param req {Request<P, ResBody, ReqBody, ReqQuery, Locals>}
 * @param res {Response<ResBody, Locals>}
 */
module.exports.getAllPostsWithFilters = (req, res) => {
    const {
        date,
        eventType,
        duration
    } = req.query;

    let filters = [];
    let params = [req.session.user.username];

    if (date) {
        filters.push("p.begins::date = date $");
        params.push(date);
    }

    if (eventType) {
        filters.push("p.event_type = $");
        params.push(eventType);
    }

    if (duration) {
        filters.push("p.ends - p.begins <= INTERVAL $");
        params.push(duration);
    }

    for (const i in filters) {
        const id = (parseInt(i) + params.length - 1)
        filters[i] += id;
    }

    const filterQuery = filters.join(" and ");

    const dateFilterQuery = "select *, exists(select 1 from full_post join post_like l on id = l.post where id = $1 and l.volunteer = $2) as like, exists(select 1 from full_post join volunteered v on id = v.post where id = $1 and v.volunteer = $2) as volunteered from full_post p where p.begins::date = date $3;";

    res.send({ TODO: true });
};


/**
 * @param req {Request<P, ResBody, ReqBody, ReqQuery, Locals>}
 * @param res {Response<ResBody, Locals>}
 */
module.exports.getPostById = (req, res) => {
    res.send({ TODO: true });
};