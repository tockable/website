const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const fs = require("fs");

// const db_path = "sql";
// const dbp = path.resolve(".", db_path, "published_projects_db.db");
// console.log(dbp);

// const dbp = "../sql/published_projects_db.db";
const base = process.cwd();
const dbp = `${base}/sql/published_projects_db.db`;
const db = new sqlite3.Database(
  dbp,
  sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,
  (err) => {
    if (err) {
      return console.error(err.message);
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
        minted INTEGER
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

        console.log("All rows deleted from published_projects");

        const res = JSON.parse(
          fs.readFileSync(path.resolve(".", "query/allProjects.json"), "utf8")
        );

        const insertSql = `INSERT INTO published_projects (
            uuid,
            name,
            creator,
            chain,
            chainId,
            dropType,
            image,
            contractAddress,
            slug,
            isPublished,
            minted
        ) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

        for (let i = 0; i < res.length; i++) {
          const vals = [
            res[i].uuid,
            res[i].name,
            res[i].creator.toLowerCase(),
            res[i].chain,
            res[i].chainId.toString(),
            res[i].dropType,
            res[i].image,
            res[i].contractAddress,
            res[i].slug,
            (() => (res[i].isPublished === true ? 1 : 0))(),
            (() => (res[i].hasOwnPropery("minted") ? res[i].minted : null))(),
          ];

          db.run(insertSql, vals, function (err) {
            if (err) {
              return console.error(err.message);
            }

            const id = this.lastID; // get the id of the last inserted row
            console.log(`Rows inserted, ID ${id}`);
          });
        }

        /// end of creation of published_projects

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

              const minted = [];

              for (let i = 0; i < 4; i++) {
                const _minted = JSON.parse(
                  fs.readFileSync(
                    path.resolve(".", `query/mint-db/minted-${i}.json`),
                    "utf8"
                  )
                );
                _minted.forEach((m) => minted.push(m));
              }

              const insertMinted = `INSERT INTO minted (
                                        address,
                                        chainId,
                                        contract,
                                        dropType,
                                        amount,
                                        timeStamp
                                    ) VALUES(?, ?, ?, ?, ?, ?)`;
              for (let j = 0; j < minted.length; j++) {
                const adl = minted[j].address.toLowerCase();
                const vals = [
                  adl,
                  minted[j].chainId.toString(),
                  minted[j].contract,
                  minted[j].dropType,
                  minted[j].amount,
                  minted[j].timeStamp,
                ];

                db.run(insertMinted, vals, function (err) {
                  if (err) {
                    return console.error(err.message);
                  }

                  const id = this.lastID; // get the id of the last inserted row
                  console.log(`Rows inserted, ID ${id}`);
                });
              }

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

                    const referrals = JSON.parse(
                      fs.readFileSync(
                        path.resolve(".", `referals/referals.json`),
                        "utf8"
                      )
                    );

                    const insertRef = `INSERT INTO referrals(address, refPoint) VALUES(?, ?)`;
                    for (let r = 0; r < referrals.length; r++) {
                      const adrl = referrals[r].address.toLowerCase();
                      const vals = [adrl, referrals[r].refPoint];

                      db.run(insertRef, vals, function (err) {
                        if (err) {
                          return console.log(err.message);
                        }

                        const id = this.lastID;
                        console.log(`Rows inserted, ID ${id}`);
                      });
                    }
                    ///

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
