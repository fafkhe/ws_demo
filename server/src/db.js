import pg from "pg";
import dotenv from "dotenv";

export var db;

dotenv.config();
export const connectDB = async () => {
  const { Client } = pg;
  db = new Client({
    host: process.env.host,
    port: +process.env.port,
    database: process.env.database,
    user: process.env.user,
    password: process.env.password,
  });

  await db.connect();

  await db.query(`
    CREATE TABLE IF NOT EXISTS Currency (
    id SERIAL PRIMARY KEY,
    Title text
    );
  `);

  await db.query(`
    CREATE TABLE IF NOT EXISTS Rate (
    id SERIAL PRIMARY KEY,
    origin INTEGER,
    destination INTEGER,
    amount DECIMAL,
    last_amount DECIMAL
    );`);
  console.log("successfully connected to db");
};
