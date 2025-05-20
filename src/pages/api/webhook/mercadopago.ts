import type { NextApiRequest, NextApiResponse } from 'next';
import { MercadoPagoConfig, Payment } from 'mercadopago';
import prisma from '../../../lib/prisma';

const client = new MercadoPagoConfig({ 
    accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN!,
});
const paymentClient = new Payment(client);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        return res.status(200).json({ message: 'Webhook working (GET)' });
    }

    if (req.method !== 'POST') {
        res.setHeader('Allow', ['POST', 'GET']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    try {
        const { data } = req.body;
        const paymentId = data?.id;

        if (!paymentId) {
            return res.status(400).json({ error: 'Payment ID not provided' });
        }

        const paymentDetails = await paymentClient.get({ id: paymentId });

        if (paymentDetails.status !== 'approved') {
            return res.status(200).json({ message: 'Payment not approved, no action taken' });
        }

        const externalReference = paymentDetails.external_reference;

        if (!externalReference) {
            return res.status(400).json({ error: 'External reference not provided' });
        }

        const existingProcessedPayment = await prisma.processedPayment.findUnique({
            where: { externalReference }
        });
        if (existingProcessedPayment) {
            return res.status(200).json({ message: 'Payment already processed' });
        }

        const items = paymentDetails.additional_info?.items;
        if (!items || items.length === 0) {
            return res.status(400).json({ error: 'No items found in payment' });
        }

        await prisma.$transaction(async (prisma) => {
            for (const item of items) {
                const id = parseInt(item.id);
                const currentProduct = await prisma.product.findUnique({ where: { id } });
                if (!currentProduct) continue;
                const newQuantity = currentProduct.quantity - (item.quantity ? item.quantity : 1);
                await prisma.product.update({
                    where: { id },
                    data: {
                        quantity: newQuantity,
                        active: newQuantity > 0
                    }
                });
            }
            await prisma.processedPayment.create({
                data: { externalReference }
            });
        });

        res.status(200).json({ message: 'Stock updated and payment saved' });
    } catch (error: any) {
        console.error('Error processing webhook:', error);
        res.status(500).json({ error: error.message || 'Internal Server Error' });
    }
}