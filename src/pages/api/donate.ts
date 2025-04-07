import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const { amount, email } = req.body;

        if (!amount || !email) {
            return res.status(400).json({ message: 'Amount and email are required' });
        }

        try {
            await prisma.donation.create({
                data: {
                    amount,
                },
            });

            return res.status(200).json({ message: 'Donation successful' });
        } catch (error) {
            return res.status(500).json({ message: `Internal server error: ${error}` });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}