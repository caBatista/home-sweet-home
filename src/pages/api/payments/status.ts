import { MercadoPagoConfig, Payment } from 'mercadopago';
import type { NextApiRequest, NextApiResponse } from 'next';

const client = new MercadoPagoConfig({ 
    accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN!,
});

const payment = new Payment(client);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET') {
        res.setHeader('Allow', ['GET']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    const { external_reference } = req.query;

    if (!external_reference) {
        return res.status(400).json({ error: 'External reference is required' });
    }

    try {
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
        
        return res.status(200).json({
            status: latestPayment.status,
            status_detail: latestPayment.status_detail,
            payment_method: latestPayment.payment_type_id,
        });
    } catch (error: any) {
        console.error('Error checking payment status:', error);
        return res.status(500).json({ error: error.message || 'Internal Server Error' });
    }
}
