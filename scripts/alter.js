"use server";

const sqlite3 = require("sqlite3").verbose();
import path from "path";
// import fs from "fs";
import { open } from "sqlite";
import { db_path } from "@/tock.config";

const dbp = path.resolve(".", db_path, "published_projects_db.db");

// const dbp = "../sql/published_projects_db.db";
// const base = process.cwd();
// const dbp = `${base}/sql/published_projects_db.db`;
let db = null;
export async function alter() {
  if (!db) {
    db = await open({
      filename: dbp,
      driver: sqlite3.Database,
    });
  }

  const query = `ALTER TABLE published_projects ADD ipfs TEXT`;

  try {
    const a = await db.run(query);
    return "success";
  } catch (err) {
    return err.message;
  }
}

// export async function createSupportDb() {
//   const p = path.resolve(".", db_path);
//   if (!fs.existsSync(p)) {
//     fs.mkdirSync(p);
//   }

//   const db = new sqlite3.Database(
//     dbp,
//     sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,
//     (err) => {
//       if (err) {
//         return console.error(err);
//       }
//       console.log("Connected to the SQlite database.");
//     }
//   );

//   // Serialize method ensures that database queries are executed sequentially
//   db.serialize(() => {
//     // Create the items table if it doesn't exist
//     db.run(
//       `CREATE TABLE IF NOT EXISTS chats (
//         id INTEGER PRIMARY KEY,
//         opener TEXT,
//         sender TEXT,
//         date TEXT,
//         readbyadmin INTEGER,
//         readbyuser INTEGER,
//         content TEXT
//       )`,
//       (err) => {
//         if (err) {
//           return console.error(err.message);
//         }
//         console.log("Created chats table.");

//         // Clear the existing data in the products table
//         db.run(`DELETE FROM chats`, (err) => {
//           if (err) {
//             return console.error(err.message);
//           }

//           console.log("All rows deleted from chats");

//           /// end of creation of published_projects

//           db.close((err) => {
//             if (err) {
//               return console.error(err.message);
//             }
//             console.log("Closed the database connection.");
//           });
//         });
//       }
//     );
//   });
//   return 'ƒsuccess'
// }
