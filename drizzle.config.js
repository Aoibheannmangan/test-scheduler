// Config file for Drizzle ORM

import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "sqlite",
  schema: "./src/db/schema.js",
  out: "./drizzle/migrations",
  driver: "better-sqlite",
  dbCredentials: {
    url: "./scheduler.db",
  },
  verbose: true,
  strict: true,
});
