import pgPromise from "pg-promise";
import dotenv from "dotenv";
dotenv.config();

const pgp = pgPromise();
const db = pgp(process.env.DATABASE_URL);

export async function connectToDb() {
  try {
    await db.connect(); 
    console.log(" Database connected successfully");
  } catch (error) {
    console.error(" Database connection failed:", error.message);
  }
}

export default db;
