"use server";

const sqlite3 = require("sqlite3").verbose();
import path from "path";
import fs from "fs";
import { db_path } from "@/tock.config";

const dbp = path.resolve(".", db_path, "published_projects_db.db");

export async function createDb() {
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
      `CREATE TABLE IF NOT EXISTS published_projects (
        uuid TEXT PRIMARY KEY,
        name TEXT,
        creator TEXT,
        chain TEXT,
        chainId TEXT,
        dropType TEXT,
        image TEXT,
        contractAddress TEXT,
        slug TEXT,
        isPublished INTEGER,
        minted INTEGER,
        totalSupply INTEGER,
        price TEXT,
        paused INTEGER,
        ipfs TEXT
      )`,
      (err) => {
        if (err) {
          return console.error(err.message);
        }
        console.log("Created published_projects table.");

        // Clear the existing data in the products table
        db.run(`DELETE FROM published_projects`, (err) => {
          if (err) {
            return console.error(err.message);
          }

          db.run(
            `CREATE TABLE IF NOT EXISTS minted (
                id INTEGER PRIMARY KEY,
                address TEXT,
                chainId TEXT,
                contract TEXT,
                dropType TEXT,
                amount INTEGER,
                timestamp TEXT
              )`,
            (err) => {
              if (err) {
                return console.error(err.message);
              }

              console.log("Created minted table.");

              // Clear the existing data in the products table
              db.run(`DELETE FROM minted`, (err) => {
                if (err) {
                  return console.error(err.message);
                }

                console.log("All rows deleted from minted");

                db.run(
                  `CREATE TABLE IF NOT EXISTS referrals (
                address TEXT PRIMARY KEY,
                refPoint INTEGER
              )`,
                  (err) => {
                    if (err) {
                      return console.log(err.message);
                    }

                    console.log("referrals created.");

                    db.run(`DELETE FROM minted`, (err) => {
                      if (err) {
                        return console.log(err.message);
                      }

                      console.log("referral cleaned");

                      db.close((err) => {
                        if (err) {
                          return console.error(err.message);
                        }
                        console.log("Closed the database connection.");
                      });
                    });
                  }
                );
                //   Close the database connection after all insertions are done
              });
            }
          );
        });
      }
    );
  });
}
