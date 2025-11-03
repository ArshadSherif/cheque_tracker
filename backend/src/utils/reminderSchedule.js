import schedule from "node-schedule";
import db from "../db/index.js";

export const scheduleReminders = () => {
  schedule.scheduleJob("0 9 * * *", async () => {
    const rows = await db.any(`
      SELECT * FROM cheques
      WHERE status='pending' AND date <= NOW() + INTERVAL '2 days'
    `);
    rows.forEach((c) =>
      console.log(`Reminder: Cheque ID ${c.id} is due soon (${c.date})`)
    );
  });
};
