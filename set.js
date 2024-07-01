const fs = require('fs-extra');
const { Sequelize } = require('sequelize');
if (fs.existsSync('set.env'))
    require('dotenv').config({ path: __dirname + '/set.env' });
const path = require("path");
const databasePath = path.join(__dirname, './database.db');
const DATABASE_URL = process.env.DATABASE_URL === undefined
    ? databasePath
    : process.env.DATABASE_URL;
module.exports = { session: process.env.SESSION_ID || 'eyJub2lzZUtleSI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoib0hBY1d2R0wrTUIvVjZjejZZV0JXMFR6MEZnU0FSMXZ5MzFDbWxIQkIzZz0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiVmFhbzcrQ0F3THRXOG1TWitYVDJzUWNzS2dXQ09pQm9leWUySVpLTC9sQT0ifX0sInBhaXJpbmdFcGhlbWVyYWxLZXlQYWlyIjp7InByaXZhdGUiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJXR3BJemwzL2NCVE5HamZxTmNwL21kSlY5dnlnSUtxRCt0U2JGSlVTNFhjPSJ9LCJwdWJsaWMiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJ4cGpJTkR3SThTYjIvVGlFU2YzM1BidVloQjd2NkZ5WUNTdWlNWmZnOEg4PSJ9fSwic2lnbmVkSWRlbnRpdHlLZXkiOnsicHJpdmF0ZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6ImFOZFczZDcxWFR5di81RHhKVWhjSndWNVJDOW5WNmhwWUpKQ2FxMURDMDA9In0sInB1YmxpYyI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IjJrR3Y5QmFoS1RMOGtCWHc4RFVxd2M1UHNFcW4rTlgzME9WdHp0ZFFWUUU9In19LCJzaWduZWRQcmVLZXkiOnsia2V5UGFpciI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiYUdnNWFjYU5mY0ZpR3ord0hZdHFyT3RMR1NUSlpQTTlTaysxMUY0TjBtZz0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiNHZEeFdyNVAzVTZqeCtyZXB4eTUvWlNtVHk1VXZBb29jN2JLdVlxVC8zMD0ifX0sInNpZ25hdHVyZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6ImdnNUJIU0xPcW04NUJPWHF3NVJxcEJLdHZ5Z2JHUVRWMmVlclhYUndETHZDTTVqWTc2N1JVVU9zZTIwNmwrL0tnU3pzcGpjMGl0VjBkTElzaCtuampnPT0ifSwia2V5SWQiOjF9LCJyZWdpc3RyYXRpb25JZCI6MTUxLCJhZHZTZWNyZXRLZXkiOiJWWkVJWFpCeWkyU205NEM0R2p2T3hiMkxYdm9KdXgrOHRIZkhodjZ4RmNJPSIsInByb2Nlc3NlZEhpc3RvcnlNZXNzYWdlcyI6W10sIm5leHRQcmVLZXlJZCI6MzEsImZpcnN0VW51cGxvYWRlZFByZUtleUlkIjozMSwiYWNjb3VudFN5bmNDb3VudGVyIjowLCJhY2NvdW50U2V0dGluZ3MiOnsidW5hcmNoaXZlQ2hhdHMiOmZhbHNlfSwiZGV2aWNlSWQiOiJxYXBQeTV0SVFiS0RPbUNtcnZ5Z0VnIiwicGhvbmVJZCI6IjA4MDE4NjA4LWU0MjItNGVhNy05ZjQxLTVmYThiY2MwZDk0YSIsImlkZW50aXR5SWQiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJOZ0FPTU84cTlldW9UQnVMK3RsVUVRanEyOHc9In0sInJlZ2lzdGVyZWQiOnRydWUsImJhY2t1cFRva2VuIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiZUwzblRlZjRPOGNnOTVLa21xRHhJQUtvRnFBPSJ9LCJyZWdpc3RyYXRpb24iOnt9LCJwYWlyaW5nQ29kZSI6IlIxTlJUNEZDIiwibWUiOnsiaWQiOiI5NDcyNjU4MDg0MzoyMkBzLndoYXRzYXBwLm5ldCJ9LCJhY2NvdW50Ijp7ImRldGFpbHMiOiJDTHZ5aDg0R0VJajVpN1FHR0FVZ0FDZ0EiLCJhY2NvdW50U2lnbmF0dXJlS2V5IjoicTAyenY0WWMveFhsSzZldHh4REYxVWV1cFl2WmprUnQreGRGai9QOVNTOD0iLCJhY2NvdW50U2lnbmF0dXJlIjoiaVJZd05kL3NqQkZBVDdJY0pvUVJueGNwK283WHpPK1dPR053c2F2MVlkcU5yQ1h1YzhFSkh0MHJlM2R4Q1NYZDlyTTRBRlN5bk8xSHlIcXFCWG92RHc9PSIsImRldmljZVNpZ25hdHVyZSI6ImdrOEpobEU0V211ZFFPdHJ2amZCT1ptQ0JUbVR5WjdORUcvM1hCenFDYWRhMVVYZHZsRjRrSUtTbzBKWnR0eFhiS2pLb09veUtZREptbzhRUjQyTmlRPT0ifSwic2lnbmFsSWRlbnRpdGllcyI6W3siaWRlbnRpZmllciI6eyJuYW1lIjoiOTQ3MjY1ODA4NDM6MjJAcy53aGF0c2FwcC5uZXQiLCJkZXZpY2VJZCI6MH0sImlkZW50aWZpZXJLZXkiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJCYXROczcrR0hQOFY1U3VucmNjUXhkVkhycVdMMlk1RWJmc1hSWS96L1VrdiJ9fV0sInBsYXRmb3JtIjoiYW5kcm9pZCIsImxhc3RBY2NvdW50U3luY1RpbWVzdGFtcCI6MTcxOTg2MDM3NCwibXlBcHBTdGF0ZUtleUlkIjoiQUFBQUFFRnAifQ==',
    PREFIXE: process.env.PREFIX || ".",
    OWNER_NAME: process.env.OWNER_NAME || "Beltah Tech",
    NUMERO_OWNER : process.env.NUMERO_OWNER || "Beltah KE",              
    AUTO_READ_STATUS: process.env.AUTO_READ_STATUS || "yes h ",
    AUTO_DOWNLOAD_STATUS: process.env.AUTO_DOWNLOAD_STATUS || 'non',
    BOT : process.env.BOT_NAME || 'BELTAH_MD',
    URL : process.env.BOT_MENU_LINKS || 'https://telegra.ph/file/dcce2ddee6cc7597c859a.jpg',
    MODE: process.env.PUBLIC_MODE || "yes",
    PM_PERMIT: process.env.PM_PERMIT || 'yes',
    HEROKU_APP_NAME : process.env.HEROKU_APP_hNAME,
    HEROKU_APY_KEY : process.env.HEROKU_APY_KEY ,
    WARN_COUNT : process.env.WARN_COUNT || '3' ,
    ETAT : process.env.PRESENCE || 'typing',
    //GPT : process.env.OPENAI_API_KEY || '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',
    DP : process.env.STARTING_BOT_MESSAGE || "yes",
    ADM : process.env.ANTI_DELETE_MESSAGE || 'no',
    DATABASE_URL,
    DATABASE: DATABASE_URL === databasePath
        ? "postgres://db_7xp9_user:6hwmTN7rGPNsjlBEHyX49CXwrG7cDeYi@dpg-cj7ldu5jeehc73b2p7g0-a.oregon-postgres.render.com/db_7xp9" : "postgres://db_7xp9_user:6hwmTN7rGPNsjlBEHyX49CXwrG7cDeYi@dpg-cj7ldu5jeehc73b2p7g0-a.oregon-postgres.render.com/db_7xp9",
    /* new Sequelize({
     dialect: 'sqlite',
     storage: DATABASE_URL,
     logging: false,
})
: new Sequelize(DATABASE_URL, {
     dialect: 'postgres',
     ssl: true,
     protocol: 'postgres',
     dialectOptions: {
         native: true,
         ssl: { require: true, rejectUnauthorized: false },
     },
     logging: false,
}),*/
};
let fichier = require.resolve(__filename);
fs.watchFile(fichier, () => {
    fs.unwatchFile(fichier);
    console.log(`mise à jour ${__filename}`);
    delete require.cache[fichier];
    require(fichier);
});
