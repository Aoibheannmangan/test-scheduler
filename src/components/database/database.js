// File for db using Drizzle ORM

import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import * as schema from "./schema";

const db = new Database("./dev.db"); // adjust path as needed
export const client = drizzle(db);
