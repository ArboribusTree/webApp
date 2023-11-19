
function setLoginStatus(req, res, next) {
    res.locals.isLoggedIn = req.session.user !== undefined;
    res.locals.loggedUser = req.session.user || null; // Include user details if logged in
    next();
}

module.exports = setLoginStatus;
