import type { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import mercadopago from '../../lib/mercadopago';
import prisma from '../../lib/prisma';

export default async function checkout(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const session = await getSession({ req });

        if (!session) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const { productId, quantity } = req.body;

        if (!productId || !quantity) {
            return res.status(400).json({ message: 'Product ID and quantity are required' });
        }

        const product = await prisma.product.findUnique({
            where: { id: productId },
        });

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        const paymentData = {
            transaction_amount: product.price * quantity,
            description: product.name,
            payment_method_id: 'credit_card',
            payer: {
                email: session.user.email,
            },
        };

        try {
            const payment = await mercadopago.payment.create(paymentData);
            return res.status(200).json(payment);
        } catch (error) {
            return res.status(500).json({ message: 'Payment processing error', error });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}