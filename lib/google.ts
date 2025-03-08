import { google } from "googleapis";

export const oauth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  `${process.env.NEXT_PUBLIC_API_URL}api/auth/google-callback`
);

const scopes = [
  "https://www.googleapis.com/auth/userinfo.email",
  "https://www.googleapis.com/auth/userinfo.profile",
];

const url = oauth2Client.generateAuthUrl({
  access_type: "offline",
  scope: scopes,
});

export default url;
