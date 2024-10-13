// src/@types/express.d.ts
import * as express from 'express';

declare global {
    namespace Express {
        interface Request {
            user?: {
                username: string; // Add other properties as necessary
                // Add any other user properties you expect
            };
        }
    }
}
