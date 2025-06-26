import nodemailer from 'nodemailer';
import sgTransport from 'nodemailer-sendgrid-transport';

const transporter = {
    auth: {
        api_key: process.env.SENDGRID_API_KEY
    }
}

const mailer = nodemailer.createTransport(sgTransport(transporter));

export default async (req, res) => {
    const {name, email, number, subject, text} = req.body;

    const data = {
        to: "contact@cdlhelp.com",
        from: 'noreply@cdlhelp.app',
        subject: subject,
        text: text,
        html: `
            <b>Email:</b>${email} <br />
            <b>Name:</b> ${name} <br /> 
            <b>Number:</b> ${number} <br /> 
            <b>Message:</b> ${text} 
        ` 
    };

    try {
        await mailer.sendMail(data);
        res.status(200).send("Email send successfully")
    } catch (error) {
        console.error(error);
        res.status(500).send("Error proccessing charge");
    }
}
