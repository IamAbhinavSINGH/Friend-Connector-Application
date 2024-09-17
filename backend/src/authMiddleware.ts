import { Request, Response, NextFunction } from "express";
import jwt from 'jsonwebtoken';

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(403).json({
            message: "Not logged in"
        });
    }
    
    const token = authHeader.split(' ')[1];

    try {
        const JWT_SECRET = process.env.JWT_SECRET || "";
        const decoded = jwt.verify(token, JWT_SECRET) as { userId?: string };

        if (decoded.userId) {
            req.body.userId = decoded.userId;
            next();
        } else {
            return res.status(403).json({
                message: "Not logged in"
            });
        }
        
    } catch (err) {
        console.log("error in authMiddleware: ", err);
        return res.status(403).json({
            message: "Not logged in"
        });
    }
};

export default authMiddleware;
