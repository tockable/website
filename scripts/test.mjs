import path from "path";
import sqlite3 from "sqlite3";
import { open } from "sqlite";

const db_path = "sql";
const dbp = path.resolve(".", db_path, "published_projects_db.db");
let db = null;

async function main() {
  if (!db) {
    db = await open({
      filename: dbp,
      driver: sqlite3.Database,
    });
  }

  const res = await db.all("SELECT * FROM published_projects");
  return res;
}

main().then((res) => console.log(res));
