import React, { useEffect } from "react";
import { gapi } from "gapi-script";

const CLIENT_ID = "895126389835-6o3l6gqssq1nca75jpevpmumdn8a69pj.apps.googleusercontent.com";
const API_KEY = ""; 
const DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"];
const SCOPES = "https://www.googleapis.com/auth/calendar.events";

function GoogleCalendar() {
  useEffect(() => {
    const initClient = () => {
      gapi.client
        .init({
          apiKey: API_KEY,
          clientId: CLIENT_ID,
          discoveryDocs: DISCOVERY_DOCS,
          scope: SCOPES,
        })
        .then(() => {
          // Listen for sign-in state changes
          gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

          // Handle initial sign-in state
          updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
        });
    };

    gapi.load("client:auth2", initClient);
  }, []);

  const updateSigninStatus = (isSignedIn) => {
    if (isSignedIn) {
      console.log("Signed in");
      listUpcomingEvents();
    } else {
      console.log("Not signed in");
    }
  };

  const handleAuthClick = () => {
    gapi.auth2.getAuthInstance().signIn();
  };

  const handleSignoutClick = () => {
    gapi.auth2.getAuthInstance().signOut();
  };

  const listUpcomingEvents = () => {
    gapi.client.calendar.events
      .list({
        calendarId: "primary",
        timeMin: new Date().toISOString(),
        showDeleted: false,
        singleEvents: true,
        maxResults: 10,
        orderBy: "startTime",
      })
      .then((response) => {
        const events = response.result.items;
        console.log("Upcoming events:", events);
      });
  };

  return (
    <div>
      <button onClick={handleAuthClick}>Sign In</button>
      <button onClick={handleSignoutClick}>Sign Out</button>
    </div>
  );
}

export default GoogleCalendar;
