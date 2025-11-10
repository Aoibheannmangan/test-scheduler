import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./test/reportWebVitals";
import { BrowserRouter } from "react-router-dom";
import { DataProvider } from "./hooks/DataContext";

// Remove server-side imports (dotenv, express, drizzle, etc.) from the client bundle.
// The backend runs separately and exposes /api/* endpoints.

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <DataProvider>
        <App />
      </DataProvider>
    </BrowserRouter>
  </React.StrictMode>
);

reportWebVitals();
