"use server";

import fs from "fs";
import path from "path";
import { getPublishedProjectPath } from "../utils/path-utils";

const QUERY = process.env.QUERY;

/**
 *
 */
export async function storeMinted(mintParams) {
  const dbParam = findDb(mintParams.address);

  const db_file = "minted-" + dbParam + ".json";
  const mintedPath = path.resolve(".", QUERY, "mint-db", db_file);
  const json = fs.readFileSync(mintedPath, "utf-8");

  const db = JSON.parse(json);

  await fs.promises.writeFile(
    mintedPath,
    JSON.stringify([...db, mintParams], null, 2)
  );
}

/**
 *
 */
export async function getTXPOf(address) {
  const dbParam = findDb(address);

  const db_file = "minted-" + dbParam + ".json";
  const mintedPath = path.resolve(".", QUERY, "mint-db", db_file);
  const json = fs.readFileSync(mintedPath, "utf-8");

  const db = JSON.parse(json);

  const allMinted = db.filter(
    (item) => item.address.toLowerCase() === address.toLowerCase()
  );

  let regularMinted = 0;
  let tockableMinted = 0;
  let elligibleTockableContracts = [];
  let elligibleRegularContracts = [];

  allMinted.forEach((minted) => {
    if (minted.dropType === "regular") regularMinted += minted.amount;
  });

  allMinted.forEach((minted) => {
    if (minted.dropType === "tockable") tockableMinted += minted.amount;
  });

  const allProjectsPath = getPublishedProjectPath();

  const allDeployedContractsJson = fs.readFileSync(allProjectsPath, "utf8");
  const allDeployedContracts = JSON.parse(allDeployedContractsJson);

  const deployedContractsByWallet = allDeployedContracts.filter(
    (d) => d.creator.toLowerCase() === address.toLowerCase()
  );

  const contracts = deployedContractsByWallet.map(
    (item) => item.contractAddress
  );

  console.log(contracts)
  if (contracts.length > 0) {
    const deployedContracts = {};

    for (let i = 0; i < 4; i++) {
      const db_file = "minted-" + i + ".json";
      const mintedPath = path.resolve(".", QUERY, "mint-db", db_file);
      const json = fs.readFileSync(mintedPath, "utf-8");

      const db = JSON.parse(json);

      deployedContractsByWallet.forEach((c) => {
        deployedContracts[c.contractAddress] = {
          amount: 0,
          dropType: c.dropType || "regular",
        };
      });

      db.forEach((item) => {
        if (contracts.includes(item.contractAddress)) {
          deployedContracts[item.contractAddress].amount +=
            deployedContracts[item.contractAddress].amount;
        }
      });
    }

    const deployedContractsArray = Object.values(deployedContracts);

    elligibleTockableContracts = deployedContractsArray.filter(
      (d) => d.amount >= 5 && d.dropType === "tockable"
    );

    elligibleRegularContracts = deployedContractsArray.filter(
      (d) => d.amount >= 5 && d.dropType === "regular"
    );
  }

  return {
    tockableMinted,
    regularMinted,
    elligibleRegularContracts,
    elligibleTockableContracts,
  };
}

/**
 *
 */
function findDb(address) {
  const char_0 = address.charAt(2).charCodeAt(0);

  if (char_0 >= 97 && char_0 <= 102) return 0;
  if (char_0 >= 65 && char_0 <= 70) return 1;
  if (char_0 >= 48 && char_0 <= 52) return 2;
  if (char_0 >= 53 && char_0 <= 57) return 3;
}
