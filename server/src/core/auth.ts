import { Request, Response, NextFunction } from 'express';
import authConfig from '../config/auth';

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ message: 'Authorization header missing' });
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: authConfig.jwtSecret });
    }

    try {
        const decoded = verifyToken(token, authConfig.jwtSecret );
        req.user = decoded; 
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
};

const verifyToken = (token: string, secret: string) => {
    // Example: Use a library like jsonwebtoken to verify the token
    // const decoded = jwt.verify(token, secret);
    // return decoded;

    // For now, return a mock decoded object
    return { id: '123', role: 'user' };
};