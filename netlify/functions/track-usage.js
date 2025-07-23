const { google } = require('googleapis');

exports.handler = async function(event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { userId, country, campaignCount, campaignNames } = JSON.parse(event.body);

    // Log received data for debugging in Netlify
    console.log('Received tracking data:', { userId, country, campaignCount, campaignNames });

    const credentials = JSON.parse(process.env.GOOGLE_API_CREDENTIALS);
    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });
    const spreadsheetId = '1CdM9jgDGJFyIQD3uMs5McUvWtIVg0me1MJW_JHOwBik';
    const sheetName = 'Usage';

    // Create a new Date object for GMT+7
    const now = new Date();
    const gmt7Time = new Date(now.getTime() + (7 * 60 * 60 * 1000));

    // Format date as YYYY-MM-DD HH:MM:SS using UTC methods on the new GMT+7 Date object
    const date = gmt7Time.getUTCFullYear() + '-' +
               String(gmt7Time.getUTCMonth() + 1).padStart(2, '0') + '-' +
               String(gmt7Time.getUTCDate()).padStart(2, '0') + ' ' +
               String(gmt7Time.getUTCHours()).padStart(2, '0') + ':' +
               String(gmt7Time.getUTCMinutes()).padStart(2, '0') + ':' +
               String(gmt7Time.getUTCSeconds()).padStart(2, '0');

    const values = [[
        date,
        userId || 'N/A',
        country || 'N/A',
        campaignCount || 0,
        campaignNames || 'N/A'
    ]];

    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: sheetName,
      valueInputOption: 'USER_ENTERED',
      resource: {
        values: values,
      },
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Successfully tracked usage.' }),
    };
  } catch (error) {
    console.error('Error tracking usage:', error);
    console.error('Event body that caused error:', event.body);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Error tracking usage.', error: error.message }),
    };
  }
};
