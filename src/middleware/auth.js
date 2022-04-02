module.exports = (req, res, next) => {
    // If user object exists, allow forward
    if (!!req.session.user) {
        next();
    } else {
        next({
            code: 401,
            reason: "Not authorized"
        });
    }
}