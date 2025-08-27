const { google } = require("googleapis");
const serviceAccount = require("./service-account.json");

exports.handler = async (event, context) => {
  try {
    const { username, score } = JSON.parse(event.body);

    const auth = new google.auth.GoogleAuth({
      credentials: serviceAccount,
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    const client = await auth.getClient();
    const sheets = google.sheets({ version: "v4", auth: client });

    const spreadsheetId = "1p5cW_F3TC4PAKCOrjqckAGGRHwui9paE0Dv7a-aP_TQ";
    const range = "Blad1!A:C";

    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range,
      valueInputOption: "USER_ENTERED",
      requestBody: { values: [[username, score]] },
    });

    return { statusCode: 200, body: JSON.stringify({ success: true }) };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};
