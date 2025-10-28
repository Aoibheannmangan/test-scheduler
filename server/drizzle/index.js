import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import { bookAppointment, deleteAppointment } from "./db/ops.js"; // implement ops.js (below)

dotenv.config();
const app = express();
app.use(cors());
app.use(bodyParser.json());

app.get("http://127.0.0.1:5000/api/data", (req, res) =>
  res.json({ status: "ok" })
);

app.post("/api/book", async (req, res) => {
  try {
    const eventId = await bookAppointment(req.body);
    res.status(201).json({ ok: true, eventId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, error: err.message });
  }
});

app.delete("/api/appointment/:id", async (req, res) => {
  try {
    await deleteAppointment({ eventId: req.params.id });
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, error: err.message });
  }
});

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Drizzle service listening on ${port}`));
