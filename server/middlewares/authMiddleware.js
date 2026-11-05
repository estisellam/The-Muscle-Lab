import jwt from "jsonwebtoken";

// verify jwt token
export function authMiddleware(req, res, next) {

    const authHeader = req.headers.authorization;

    const match = typeof authHeader === "string" && /^Bearer\s+(\S+)$/i.exec(authHeader);
    if (!match) {
        return res.status(401).json({ message: "access denied" });
    }
    const token = match[1];

    try {

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        req.user = decoded;

        next();

    } catch (error) {

        return res.status(401).json({
            message: "invalid token"
        });

    }

}