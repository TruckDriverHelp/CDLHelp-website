import redis from '../../redis';
import sheets_insert from '../../utils/send_to_sheets';

export default async function handler(req, res) {
    const { code } = req.query;

    if (!code) {
        return res.status(400).json({ error: 'Code is required' });
    }

    const email = await redis.get(code);

    if (email) {
        await redis.del(code);
        try {
            await sheets_insert(email);
            return res.status(200).json({ message: 'Email verified', email });
        } catch (error) {
            console.error('Error sending email to sheets:', error);
            return res.status(500).json({ error: 'Failed to send email to sheets' });
        }
    } else {
        return res.status(404).json({ error: 'Invalid code' });
    }
}
