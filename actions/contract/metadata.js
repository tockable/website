"use server";

import cbor from "cbor";
import fs from "fs";
import { base58btc } from "multiformats/bases/base58";
import { regex } from "@/constants/regex";
import { getProjectMetadataPath } from "../utils/path-utils";
import { FlattenTockableDropAbi } from "@/contracts/FlattenTockableDropAbi";

async function getComputedCidFromBytecode(_bytecode) {
  const extracedBytecode = _bytecode
    .match(regex.bytecode)[0]
    .match(regex.cleanBytecode)[0];
  const decodedBytecode = cbor.decodeFirstSync(extracedBytecode);
  const cid = base58btc.encode(decodedBytecode.ipfs).slice(1);
  return { cid };
}

export async function getContractMetadata(_creator, _uuid, _projectName) {
  const metaDataPath = getProjectMetadataPath(_creator, _uuid, _projectName);
  const json = fs.readFileSync(metaDataPath);
  const metadata = JSON.parse(json);
  return metadata;
}

export async function getContractAbi(_dropType) {
  if (_dropType === "tockable") {
    return FlattenTockableDropAbi;
  }
}

// getting abi annd bytecode form creator
// export async function getContractAbiAndBytecode(_creator, _uuid, _projectName) {
//   try {
//     const metadata = await getContractMetadata(_creator, _uuid, _projectName);
//     return {
//       success: true,
//       contract: { abi: metadata.abi, bytecode: `0x${metadata.bytecode}` },
//     };
//   } catch (err) {
//     return { success: false, contract: {} };
//   }
// }

export async function getContractBytecode(_creator, _uuid, _projectName) {
  try {
    const metadata = await getContractMetadata(_creator, _uuid, _projectName);
    return { success: true, bytecode: metadata.bytecode };
  } catch (err) {
    return { success: false };
  }
}

// export async function verifyContractMetadata(
//   _creator,
//   _uuid,
//   _projectName,
//   _uploadedCid
// ) {
//   const bytecode = await getContractBytecode(_creator, _uuid, _projectName);
//   const cid = getComputedCidFromBytecode(bytecode);
//   if (cid === _uploadedCid) return true;
//   else return false;
// }
