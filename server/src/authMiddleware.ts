// src/authMiddleware.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Extend the Request interface to include the user property
interface CustomRequest extends Request {
    user?: { username: string }; // Customize according to your user object
}

export const authenticateJWT = (req: CustomRequest, res: Response, next: NextFunction) => {
    const token = req.headers['authorization']?.split(' ')[1]; // Bearer token
    if (!token) return res.sendStatus(403); // Forbidden if no token is provided

    jwt.verify(token, process.env.JWT_SECRET!, (err, user) => {
        if (err) return res.sendStatus(403); // Forbidden if token is invalid
        req.user = user as { username: string }; // Attach the user object to the request
        next();
    });
};
