// authorize users by role
export function authorizeRoles(...allowedRoles) {

    return function (req, res, next) {

        if (!req.user) {
            return res.status(401).json({
                message: "authentication required"
            });
        }

        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                message: "access denied"
            });
        }

        next();
    };
}