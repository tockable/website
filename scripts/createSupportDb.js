"use server";

const sqlite3 = require("sqlite3").verbose();
import path from "path";
import { db_path } from "@/tock.config";

const dbp = path.resolve(".", db_path, "published_projects_db.db");

export async function createSupportDb() {
  const p = path.resolve(".", db_path);

  if (!fs.existsSync(p)) {
    fs.mkdirSync(p);
  }

  const db = new sqlite3.Database(
    dbp,
    sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,
    (err) => {
      if (err) {
        return console.error(err);
      }

      console.log("Connected to the SQlite database.");
    }
  );

  // Serialize method ensures that database queries are executed sequentially
  db.serialize(() => {
    // Create the items table if it doesn't exist
    db.run(
      `CREATE TABLE IF NOT EXISTS chats (
        id INTEGER PRIMARY KEY,
        opener TEXT,
        sender TEXT,
        date TEXT,
        readbyadmin INTEGER,
        readbyuser INTEGER,
        content TEXT
      )`,
      (err) => {
        if (err) {
          return console.error(err.message);
        }

        console.log("Created chats table.");

        // Clear the existing data in the products table
        db.run(`DELETE FROM chats`, (err) => {
          if (err) {
            return console.error(err.message);
          }

          console.log("All rows deleted from chats");

          db.close((err) => {
            if (err) {
              return console.error(err.message);
            }
            console.log("Closed the database connection.");
          });
        });
      }
    );
  });
  return "success";
}
