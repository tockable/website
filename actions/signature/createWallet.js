"use server";

import fs from "fs";
import { ethers } from "ethers";
import { getProjectDataDirectory } from "../utils/path-utils";

export async function createNewSigner(_creator, _uuid) {
  const projectsDataPath = getProjectDataDirectory(_creator);

  let projectsData = [];

  if (fs.existsSync(projectsDataPath)) {
    const json = fs.readFileSync(projectsDataPath, {
      encoding: "utf8",
    });

    projectsData = JSON.parse(json);
  }

  const wallet = ethers.Wallet.createRandom();

  const walletData = {
    address: wallet.address,
    mnemonic: wallet.mnemonic.phrase,
    privateKey: wallet.privateKey,
    uuid: _uuid,
  };

  fs.writeFileSync(
    projectsDataPath,
    JSON.stringify([...projectsData, walletData], null, 2)
  );

  return wallet.address;
}
