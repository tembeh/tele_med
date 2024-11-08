// middleware/auth.js

function isAuthenticated(req, res, next) {
    // Your authentication logic here
    if (req.isAuthenticated()) {
        return next(); // user is authenticated
    }
    res.redirect('/login'); // redirect to login if not authenticated
}

module.exports = { isAuthenticated };