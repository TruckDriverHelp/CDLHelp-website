import validate_email from "../../utils/validate_email.js";
import sendgrid from '@sendgrid/mail';
import { generateVerificationLink } from "@/utils/generateOTP.js";

sendgrid.setApiKey(process.env.SENDGRID_API_KEY);

const EMAIL_SUBJECT = "CDL Help | Подтверждение почты";
const EMAIL_LETTER_HEADER = "Подтвердите адрес электронной почты";
const EMAIL_LETTER_TEXT = "Здравствуйте. Вы только что подписались на уведомления с сайта CDL Help. Чтобы завершить подписку, подтвердите ссылку, нажав кнопку ниже";
const EMAIL_CONFIRM_BUTTON = "Подтвердить";

export async function send_email(to, link) {

    const html = `
    <div style="max-width: 600px; margin: 0 auto; padding: 20px; background-color: #fff; border-radius: 5px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
      <img src="https://test.cdlhelp.com/images/logo_v1.png" alt="Logo" width="143" height="57" style="margin: 0 auto;">
      <h1 style="color: #333; margin-bottom: 20px;">${EMAIL_LETTER_HEADER}</h1>
      <p style="color: #555; line-height: 1.5;">${EMAIL_LETTER_TEXT}</p>
      
      <a href="${link}" style="display: block; width: 100%; padding: 15px 0; background-color: #007bff; color: #fff; text-align: center; text-decoration: none; border-radius: 5px; margin-bottom: 20px;">${EMAIL_CONFIRM_BUTTON}</a>
      
      <div style="text-align: center; color: #777; font-size: 12px;">
        &copy; 2024 TruckDriverHelp. All rights reserved.
        <br>
      </div>
    </div>
  `;

    const result = await sendgrid.send({
        to: to,
        from: 'noreply@truckdriver.help',
        subject: EMAIL_SUBJECT,
        text: link,
        html: html
    });

    console.debug("\n\n" + result);
}

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ error: 'Email is required' });
        }

        if (!validate_email(email)) {
            return res.status(400).json({ error: 'Email invalid' });
        }

        try {
            const link = await generateVerificationLink(email);
            console.debug(link)
            // await send_email(email, link);
            return res.status(200).json({ message: 'Verification email sent' });
        } catch (error) {
            console.error('Error sending verification email:', error);
            return res.status(500).json({ error: 'Failed to send verification email' });
        }

    } else {
        res.setHeader('Allow', ['POST']);
        return res.status(405).end(`Method ${req.method} not allowed`);
    }
}