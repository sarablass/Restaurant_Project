const verifyPermissions = (requiredRoles) => {
    return (req, res, next) => {
        console.log("verifyPermissions middleware triggered 2");


        if (!req.id) {
            console.log("User is not authenticated");
            return res.status(401).json({ message: "User is not authenticated" });
        }

        if (!requiredRoles.includes(req.idUserType)) {
            console.log(`User with role ID ${req.idUserType} does not have access`);
            return res.status(403).json({ message: "User does not have the required permissions" });
        }

        console.log(`User with role ID ${req.idUserType} has access`);
        return next();
    };
}

module.exports = verifyPermissions;