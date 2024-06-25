// api/proxy.ts
// for now unused. Look to reverse proxy.
import { VercelRequest, VercelResponse } from '@vercel/node';
import fetch from 'node-fetch';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    console.log("here")
    try {
        const url = `http://18.216.31.43:8000${req.url}`; // Adjust your backend URL here
        const backendResponse = await fetch(url);
        if (!backendResponse.ok) {
            throw new Error('Failed to fetch data from backend');
        }

        const data = await backendResponse.json();
        res.status(200).json(data);
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}
