async function isAuthenticated(req, res, next) {
    if (req.user) {
        return next();
    }
    return res.status(401).json({ error: "Authentication error" }); 
}

function isAuthorized(allowedRoles) {
    return function(req, res, next) {
        console.log(req.user.role);
        console.log(allowedRoles[1]);
        if (allowedRoles.includes(req.user.role)) {
            next();
        } else {
            return res.status(401).json({ error: 'Unauthorized' });
        }
    }
}


module.exports = {
    isAuthenticated,
    isAuthorized
}