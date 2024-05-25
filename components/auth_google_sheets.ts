// import { env } from "@/env.mjs";
// import { google } from "googleapis";
// import type { Response, lotteryTypes, GoogleAuthInterface } from "./types";
// import { GoogleAuth } from "google-auth-library"

// export function authGoogleSheets() {
//   const GOOGLE_APP_CREDS = JSON.parse(process.env.GOOGLE_APP_CREDS!) as GoogleAuthInterface;

//   const auth =
//     new GoogleAuth({
//       credentials:{
//         client_id: GOOGLE_APP_CREDS.client_id,
//         client_email: GOOGLE_APP_CREDS.client_email,
//         project_id: GOOGLE_APP_CREDS.project_id,
//         private_key: GOOGLE_APP_CREDS.private_key
//       },
//       scopes: [
//         'https://www.googleapis.com/auth/spreadsheets',
//       ]
//     });

//   const sheets = google.sheets({ version: "v4", auth });
// }
//
