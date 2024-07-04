"use server";

import path from "path";
import sqlite3 from "sqlite3";
import { open } from "sqlite";
import { db_path } from "@/tock.config";

const dbp = path.resolve(".", db_path, "support.db");
let db = null;

export async function getAllChats() {
  if (!db) {
    db = await open({
      filename: dbp,
      driver: sqlite3.Database,
    });
  }

  const query = `SELECT * FROM chats GROUP BY opener`;
  const res = await db.all(query);

  return res;
}

export async function getChats(_wallet) {
  if (!db) {
    db = await open({
      filename: dbp,
      driver: sqlite3.Database,
    });
  }

  const query = `SELECT * FROM chats WHERE opener = '${_wallet}'`;
  const res = await db.all(query);

  return res;
}

export async function sendMessage(_wallet, _sender, _content) {
  if (!db) {
    db = await open({
      filename: dbp,
      driver: sqlite3.Database,
    });
  }

  const insert = `INSERT INTO chats (
    opener,
    sender,
    date,
    readbyadmin,
    readbyuser,
    content
) VALUES(?, ?, ?, ?, ?, ?)`;

  const date = new Date();
  const readbyuser = _sender === "user" ? 1 : 0;
  const readbyadmin = _sender === "admin" ? 1 : 0;

  await db.run(insert, [
    _wallet,
    _sender,
    date,
    readbyadmin,
    readbyuser,
    _content,
  ]);

  const query = `SELECT * FROM chats WHERE opener = '${_wallet}'`;
  const res = await db.all(query);

  return res;
}
