import cron from "node-cron";
import db from "../config/datbase.js";
import { sendWhatsAppMessage } from "../services/whatsappService.js";

// Run every day at 9 AM
cron.schedule("0 9 * * *", async () => {
  console.log("Running daily cheque status check...");

  try {
    const today = new Date().toISOString().split("T")[0];

    const overdueCheques = await db.any(
      `SELECT * FROM cheques WHERE due_date < $1 AND status = 'Pending'`,
      [today]
    );

    for (const cheque of overdueCheques) {
      let newStatus = "Bounced";

      const diffDays = Math.floor(
        (new Date(today) - new Date(cheque.due_date)) / (1000 * 60 * 60 * 24)
      );
      if (diffDays > 90) newStatus = "Cancelled";

      // Update status in DB
      const updated = await db.one(
        `UPDATE cheques SET status = $1 WHERE id = $2 RETURNING *`,
        [newStatus, cheque.id]
      );

      await sendWhatsAppMessage(
        updated.payer_name,
        `Cheque #${updated.cheque_no} (₹${updated.amount}) has been automatically marked as *${newStatus}* because it is overdue.`
      );

      console.log(`Updated cheque ${cheque.cheque_no} → ${newStatus}`);
    }
  } catch (err) {
    console.error("Error in cheque reminder cron job:", err.message);
  }
});
