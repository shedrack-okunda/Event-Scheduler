const express = require("express");
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;
const { v4: uuid } = require("uuid");
const dotenv = require("dotenv");

const app = express();
dotenv.config();
const port = process.env.PORT || 8080;

app.get("/", (req, res) => {
  res.send("Hello world");
});

const googleCalender = async () => {
  const calenderApi = await fetch(
    `https://www.googleapis.com/calendar/v3/calendars`,
  );
};

const scopes = ["https://www.googleapis.com/auth/calendar"];

const oauth2Client = new OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URL,
);

app.get("/auth", (req, res) => {
  const url = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: scopes,
  });
  res.redirect(url);
});

app.get("/auth/redirect", async (req, res) => {
  const { tokens } = await oauth2Client.getToken(req.query.code);
  oauth2Client.setCredentials(tokens);
  res.end("Authentication successful! Please return to the console.");
});

app.listen(8080, () => {
  console.log(`Server running on port ${8080}`);
});

const calendar = google.calendar({ version: "v3", auth: oauth2Client });

const event = {
  summary: "Tech talk with Shedrack",
  location: "Google Meet",

  description: "Demo event for Shedrack portfolio. ",
  start: {
    dateTime: "2024-12-14T19:30:00+05:30",
    timeZone: "EST",
  },
  end: {
    dateTime: "2024-12-14T20:30:00+05:30",
    timeZone: "EST",
  },
  colorId: 1,
  conferenceData: {
    createRequest: {
      requestId: uuid(),
    },
  },
  attendees: [{ email: "keshedrack@gmail.com" }],
};

app.get("/create-event", async (req, res) => {
  try {
    const result = await calendar.events.insert({
      calendarId: "primary",
      auth: oauth2Client,
      conferenceDataVersion: 1,
      sendUpdates: "all",
      resource: event,
    });
    res.send({
      status: 200,
      message: "Event created",
      link: result.data.hangoutLink,
    });
  } catch (err) {
    console.log(err);
    res.send(err);
  }
});
