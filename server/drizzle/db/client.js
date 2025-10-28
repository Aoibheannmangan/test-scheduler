import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import dotenv from "dotenv";
dotenv.config();

const DB_FILE = process.env.DB_FILE || "./data/scheduler.db";
const raw = new Database(DB_FILE);
export const db = drizzle(raw);
