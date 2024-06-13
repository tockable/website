"use server";

import path from "path";
import sqlite3 from "sqlite3";
import { open } from "sqlite";
import { db_path } from "@/tock.config";

const dbp = path.resolve(".", db_path, "published_projects_db.db");
let db = null;

export async function storeMinted(mintParams, ref) {
  if (!db) {
    db = await open({
      filename: dbp,
      driver: sqlite3.Database,
    });
  }

  const insertMinted = `INSERT INTO minted (
    address,
    chainId,
    contract,
    dropType,
    amount,
    timeStamp
) VALUES(?, ?, ?, ?, ?, ?)`;

  const vals = [
    mintParams.address.toLowerCase(),
    mintParams.chainId.toString(),
    mintParams.contract,
    mintParams.dropType,
    mintParams.amount,
    mintParams.timeStamp,
  ];

  await db.run(insertMinted, vals);

  const insertProjectMinted = `UPDATE published_projects SET minted = minted + ${mintParams.amount} WHERE contractAddress = '${mintParams.contract}'`;

  await db.run(insertProjectMinted);

  if (ref) {
    const refl = ref.toLowerCase();
    const query = `INSERT INTO referrals (address, refPoint) VALUES ('${refl}',${mintParams.amount})`;
    await db.run(query);
  }
}

export async function getTXPOf(address) {
  if (!db) {
    db = await open({
      filename: dbp,
      driver: sqlite3.Database,
    });
  }

  const adl = address.toLowerCase();

  const tockableMinted = (
    await db.get(
      `SELECT SUM(amount) FROM minted WHERE address = '${adl}' AND dropType = 'tockable'`
    )
  )["SUM(amount)"];

  const regularMinted = (
    await db.get(
      `SELECT SUM(amount) FROM minted WHERE address = '${adl}' AND dropType = 'regular'`
    )
  )["SUM(amount)"];

  const elligibleTockableContracts = (
    await db.get(
      `SELECT COUNT(*) FROM published_projects WHERE creator = '${adl}' AND minted >= 5 AND dropType ='tockable'`
    )
  )["COUNT(*)"];

  const elligibleRegularContracts = (
    await db.all(
      `SELECT COUNT(*) FROM published_projects WHERE creator = '${adl}' AND minted >= 5 AND dropType ='regular'`
    )
  )["COUNT(*)"];

  return {
    tockableMinted,
    regularMinted,
    elligibleRegularContracts,
    elligibleTockableContracts,
  };
}
