import { db } from "./client.js";
import { bookings, event } from "./schema.js";
import { v4 as uuidv4 } from "uuid";
import { eq } from "drizzle-orm";

export async function bookAppointment({ patientId, start, end, notes = "" }) {
  const eventId = uuidv4();
  await db.transaction(async (tx) => {
    await tx
      .insert(event)
      .values({ eventId, eventType: "booked", visitNum: 1 });
    await tx.insert(bookings).values({
      eventId,
      patientId,
      date: start,
      blocked: 0,
      note: notes,
      noShow: 0,
    });
  });
  return eventId;
}

export async function deleteAppointment({ eventId }) {
  await db.transaction(async (tx) => {
    await tx.delete(bookings).where(eq(bookings.eventId, eventId));
    await tx
      .update(event)
      .set({ eventType: "window" })
      .where(eq(event.eventId, eventId));
  });
}
