import { MercadoPagoConfig, Payment } from 'mercadopago';
import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';

const client = new MercadoPagoConfig({ 
    accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN!,
});

const payment = new Payment(client);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', ['POST']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    const { external_reference } = req.query;

    if (!external_reference) {
        return res.status(400).json({ error: 'External reference is required' });
    }

    try {
        const existingProcessedPayment = await prisma.processedPayment.findUnique({
            where: {
                externalReference: external_reference as string
            }
        });

        if (existingProcessedPayment) {
            return res.status(200).json({ message: 'Payment already processed' });
        }

        const searchResult = await payment.search({
            options: {
                criteria: "desc",
                external_reference: external_reference as string
            }
        });

        if (!searchResult.results || searchResult.results.length === 0) {
            return res.status(404).json({ error: 'Payment not found' });
        }

        const latestPayment = searchResult.results[0];
        const items = latestPayment.additional_info.items;

        if (!items || items.length === 0) {
            return res.status(400).json({ error: 'No items found in payment' });
        }

        await prisma.$transaction(async (prisma) => {
            for (const item of items) {
                const id = parseInt(item.id);
                const currentProduct = await prisma.product.findUnique({
                    where: { id }
                });

                if (!currentProduct) continue;

                const newQuantity = currentProduct.quantity - (item.quantity ? parseInt(item.quantity) : 1);
                await prisma.product.update({
                    where: { id },
                    data: {
                        quantity: newQuantity,
                        active: newQuantity > 0
                    }
                });
            }

            await prisma.processedPayment.create({
                data: {
                    externalReference: external_reference as string
                }
            });
        });

        return res.status(200).json({ message: 'Items updated successfully' });
    } catch (error: any) {
        console.error('Error updating stock:', error);
        return res.status(500).json({ error: error.message || 'Internal Server Error' });
    }
}
