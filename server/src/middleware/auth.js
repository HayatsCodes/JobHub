async function isAuthenticated(req, res, next) {
    if (req.user) {
        return next();
    }
    return res.status(401).json({ error: "Unauthorized" }); 
}

function isAuthorized(allowedRoles) {
    return function(req, res, next) {
        if (allowedRoles.includes(req.user.role)) {
            next();
        }
        res.status(401).json({ error: 'Unauthorized' });
    }
}