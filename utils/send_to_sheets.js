import { google } from 'googleapis';


async function sheets_insert(email) {
    try {
        const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_CREDENTIALS)
        const client = new google.auth.JWT(
            credentials.client_email,
            null,
            credentials.private_key,
            ['https://www.googleapis.com/auth/spreadsheets']
        );

        const sheets = google.sheets({ version: 'v4', auth: client });

        const spreadsheetId = process.env.SHEET_ID;
        const range = `Sheet1!A1`;

        await sheets.spreadsheets.values.append({
            spreadsheetId,
            range,
            valueInputOption: 'RAW',
            resource: {
                values: [[email]],
            },
        });

        return true;
    } catch (error) {
        console.error(error);
        return false;
    }
}

export default sheets_insert;
