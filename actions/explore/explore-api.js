"use server";

import path from "path";
import { db_path } from "@/tock.config.js";
import sqlite3 from "sqlite3";
import { open } from "sqlite";

let db = null;
const dbp = path.resolve(".", db_path, "published_projects_db.db");

export async function getCollectionlistByChainId(_chainId) {
  if (!db) {
    db = await open({
      filename: dbp,
      driver: sqlite3.Database,
    });
  }

  const query = `SELECT * FROM published_projects WHERE chainId = ${_chainId.toString()} AND isPublished=1`;
  const projects = await db.all(query);
  return projects;
}
