import db from "../config/datbase.js";
import { sendWhatsAppMessage } from "../services/whatsappService.js";

export const addCheque = async (req, res) => {
  try {
    const {
      payer_name,

      amount,
      due_date,
      cheque_no,
      bank_name,
      status,
    } = req.body;

    const image_url = req.file ? req.file.path : null;

    const result = await db.one(
      `INSERT INTO cheques (
        payer_name,
        amount,
        due_date,
        cheque_no,
        bank_name,
        status,
        image_url
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *`,
      [
        payer_name,
        amount,
        due_date,
        cheque_no,
        bank_name || null,
        status || "Pending",
        image_url,
      ]
    );

    res.status(201).json(result);
  } catch (err) {
    console.error("Error adding cheque:", err);
    res.status(500).json({ error: err.message });
  }
};

export const getCheques = async (_, res) => {
  try {
    const rows = await db.any(`SELECT * FROM cheques ORDER BY created_at DESC`);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateChequeStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const updated = await db.one(
      `UPDATE cheques SET status = $1 WHERE id = $2 RETURNING *`,
      [status, id]
    );
    if (["bounced"].includes(status.toLowerCase())) {
      await sendWhatsAppMessage(
        updated.payer_name,
        ` Cheque #${updated.cheque_no} (₹${
          updated.amount
        }) has been manually marked as *${status.toUpperCase()}*.`
      );
    }

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
