import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import nodemailer from 'nodemailer';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const { amount, email } = req.body;

        if (!amount || !email) {
            return res.status(400).json({ message: 'Amount and email are required' });
        }

        try {
            // Here you can handle the donation logic, e.g., save to the database
            await prisma.donation.create({
                data: {
                    amount,
                    email,
                },
            });

            // Send confirmation email
            const transporter = nodemailer.createTransport({
                service: 'Gmail',
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS,
                },
            });

            await transporter.sendMail({
                from: process.env.EMAIL_USER,
                to: email,
                subject: 'Donation Confirmation',
                text: `Thank you for your donation of $${amount}!`,
            });

            return res.status(200).json({ message: 'Donation successful' });
        } catch (error) {
            return res.status(500).json({ message: 'Internal server error' });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}