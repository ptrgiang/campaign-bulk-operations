const { google } = require('googleapis');

exports.handler = async function(event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { userId, country, campaignCount, campaignNames } = JSON.parse(event.body);
    const credentials = JSON.parse(process.env.GOOGLE_API_CREDENTIALS);
    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });
    const spreadsheetId = '1CdM9jgDGJFyIQD3uMs5McUvWtIVg0me1MJW_JHOwBik';
    const sheetName = 'Usage';

    // Format date as YYYY-MM-DD HH:MM:SS in UTC
    const now = new Date();
    const date = now.getUTCFullYear() + '-' +
               String(now.getUTCMonth() + 1).padStart(2, '0') + '-' +
               String(now.getUTCDate()).padStart(2, '0') + ' ' +
               String(now.getUTCHours()).padStart(2, '0') + ':' +
               String(now.getUTCMinutes()).padStart(2, '0') + ':' +
               String(now.getUTCSeconds()).padStart(2, '0');

    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: sheetName,
      valueInputOption: 'USER_ENTERED',
      resource: {
        values: [[date, userId, country, campaignCount, campaignNames]],
      },
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Successfully tracked usage.' }),
    };
  } catch (error) {
    console.error('Error tracking usage:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Error tracking usage.', error: error.message }),
    };
  }
};
