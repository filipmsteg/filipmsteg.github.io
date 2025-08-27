const { google } = require("googleapis");
const serviceAccount = require("./service-account.json");

exports.handler = async (event, context) => {
  try {
    const auth = new google.auth.GoogleAuth({
      credentials: serviceAccount,
      scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
    });

    const client = await auth.getClient();
    const sheets = google.sheets({ version: "v4", auth: client });

    const spreadsheetId = "1p5cW_F3TC4PAKCOrjqckAGGRHwui9paE0Dv7a-aP_TQ";
    const range = "Blad1!A:B"; // Assuming column A = username, B = score

    const res = await sheets.spreadsheets.values.get({ spreadsheetId, range });
    let rows = res.data.values || [];

    // Convert scores to numbers
    rows = rows.map(([username, score]) => ({ username, score: parseInt(score) || 0 }));

    // Sort descending by score
    rows.sort((a, b) => b.score - a.score);

    // Only keep top 10
    const top10 = rows.slice(0, 10);

    return { statusCode: 200, body: JSON.stringify(top10) };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};
