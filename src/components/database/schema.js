// Schema file defining entities/ relations

import { uuid } from "drizzle-orm/gel-core";
import { datetime } from "drizzle-orm/mysql-core";
import { pgEnum } from "drizzle-orm/pg-core";
import {
  sqliteTable,
  text,
  integer,
  uniqueIndex,
} from "drizzle-orm/sqlite-core";

// User table
export const users = sqliteTable(
  "users",
  {
    email: text("email").primaryKey(),
    staffNumber: text("staff_number").notNull(),
    passwordHash: text("password_hash").notNull(),
  },
  // Unique index defined for if there should be more additions to the scheduler sign in
  (table) => ({
    usernameIdx: uniqueIndex("username_idx").on(table.staffNumber),
  })
);

// Booking table
export const bookings = sqliteTable("bookings", {
  roomId: uuid("room_id").primaryKey(),
  patientId: uuid("patient_id"),
  date: datetime("date").notNull(),
  blocked: integer("blocked", { mode: "boolean" }).default(false),
  note: text("note").notNull(),
  noShow: integer("no_show", { mode: "boolean" }).default(false),
  eventId: uuid("event_id").notNull(),
});

export const event = sqliteTable("event", {
  eventId: uuid("event_id").primaryKey(),
  eventType: pgEnum("event_type", ["booked", "window", "blocked"]).notNull(),
  visitNum: integer("visit_num").notNull(),
});
