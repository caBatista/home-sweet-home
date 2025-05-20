import { MercadoPagoConfig, Preference } from 'mercadopago';
import type { NextApiRequest, NextApiResponse } from 'next';
import crypto from 'crypto';

const client = new MercadoPagoConfig({ 
    accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN!,
});

const preference = new Preference(client); 

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', ['POST']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    try {
        const baseUrl = process.env.NEXT_PUBLIC_URL!;
        const externalReference = crypto.randomUUID();

        const items = req.body;
        const result = await preference.create({
            body: {
                items: items,
                back_urls: {
                    success: `${baseUrl}/payment/success`,
                    pending: `${baseUrl}/payment/pending`,
                    failure: `${baseUrl}/payment/failure`,
                },
                notification_url: `${baseUrl}/api/webhook/mercadopago`,
                external_reference: externalReference,
                auto_return: 'all',
            },
        });
        res.status(200).json({ ...result, external_reference: externalReference });
    } catch (error: any) {
        res.status(500).json({ error: error.message || 'Internal Server Error' });
    }
}
