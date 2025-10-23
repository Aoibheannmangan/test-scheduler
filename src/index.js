import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./test/reportWebVitals";
import { BrowserRouter } from "react-router-dom";
import { DataProvider } from "./hooks/DataContext";
import "dotenv/config";
import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";

const dbUrl =
  process.env.DB_FILE_NAME || process.env.REACT_APP_DB_FILE_NAME || "";
const client = createClient({ url: dbUrl });
const db = drizzle({ client });

const express = require("express");
const app = express();
const port = process.env.PORT || 4000;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

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
