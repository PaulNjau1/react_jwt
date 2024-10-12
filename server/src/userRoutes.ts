// src/userRoutes.ts
import { Router, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import nodemailer from 'nodemailer';

const router = Router();

export default function userRoutes(prisma: any) {
    // Send email
    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    // Register route
    router.post('/register', async (req: Request, res: Response) => {
        const { username, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const verificationToken = crypto.randomBytes(20).toString('hex');

        const newUser = await prisma.user.create({
            data: {
                username,
                email,
                password: hashedPassword,
                verificationToken,
            },
        });

        const verificationUrl = `http://localhost:5000/api/verify-email/${verificationToken}`;
        await transporter.sendMail({
            to: email,
            subject: 'Email Verification',
            text: `Click on this link to verify your email: ${verificationUrl}`,
        });

        res.status(201).json({ message: 'User registered successfully. Verification email sent.' });
    });

    // Verify Email

    router.get('/verify-email/:token', async (req: Request, res: Response):Promise<any> => {
        const { token } = req.params;
        const user = await prisma.user.findUnique({ where: { verificationToken: token } });

        if (!user) return res.status(400).json({ message: 'Invalid token' });

        await prisma.user.update({
            where: { id: user.id },
            data: { isVerified: true, verificationToken: null },
        });

        res.json({ message: 'Email verified successfully' });
    });

    // Request Password Reset
 
    router.post('/request-reset', async (req: Request, res: Response):Promise<any> => {
        const { email } = req.body;
        const user = await prisma.user.findUnique({ where: { email:email } });
        if (!user) return res.status(404).json({ message: 'User not found' });

        const token = crypto.randomBytes(20).toString('hex');
        await prisma.user.update({
            where: { id: user.id },
            data: { resetPasswordToken: token, resetPasswordExpires: new Date(Date.now() + 3600000) },
        });

        const resetUrl = `http://localhost:5000/api/reset-password/${token}`;
        await transporter.sendMail({
            to: user.email,
            subject: 'Password Reset',
            text: `Click on this link to reset your password: ${resetUrl}`,
        });

        res.json({ message: 'Password reset email sent' });
    });

    // Reset Password
    router.post('/reset-password/:token', async (req: Request, res: Response):Promise<any> => {
        const { token } = req.params;
        const { newPassword } = req.body;

        const user = await prisma.user.findUnique({
            where: { resetPasswordToken: token },
        });

        if (!user || (user.resetPasswordExpires && user.resetPasswordExpires < new Date())) {
            return res.status(400).json({ message: 'Token is invalid or has expired' });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await prisma.user.update({
            where: { id: user.id },
            data: {
                password: hashedPassword,
                resetPasswordToken: null,
                resetPasswordExpires: null,
            },
        });

        res.json({ message: 'Password has been reset' });
    });

    // Login route
   
    router.post('/login', async (req: Request, res: Response):Promise<any> => {
        const { username, password } = req.body;
        const user = await prisma.user.findUnique({ where: { username } });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const accessToken = jwt.sign({ username }, process.env.JWT_SECRET!, { expiresIn: '15m' });
        const refreshToken = jwt.sign({ username }, process.env.JWT_SECRET!, { expiresIn: '7d' });

        await prisma.user.update({
            where: { id: user.id },
            data: { resetPasswordToken: refreshToken },
        });

        res.json({ accessToken, refreshToken });
    });

    // Refresh Token Route
    router.post('/token', async (req: Request, res: Response):Promise<any> => {
        const { token } = req.body;
        if (!token) return res.sendStatus(401); // Unauthorized if no token is provided

        const user = await prisma.user.findFirst({ where: { resetPasswordToken: token } });
        if (!user) return res.sendStatus(403); // Forbidden if user not found

        jwt.verify(token, process.env.JWT_SECRET!, (err: Error | null) => {
            if (err) return res.sendStatus(403); // Forbidden if token verification fails

            const accessToken = jwt.sign({ username: user.username }, process.env.JWT_SECRET!, { expiresIn: '15m' });
            res.json({ accessToken });
        });
    });

    return router;
}
