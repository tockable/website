"use server";

import fs from "fs";
import { getProjectMetadataPath } from "../utils/path-utils";
import { FlattenTockableDropAbi } from "@/contracts/FlattenTockableDropAbi";
import { FlattenBlastRegularDropV2Abi } from "@/contracts/FlattenBlastRegularDropV1Abi";
import { FlattenBlastTockableDropV2Abi } from "@/contracts/FlattenBlastTockableDropV2Abi";
import { FlattenRegularDropV1Abi } from "@/contracts/FlattenRegularDropV1Abi";
import { FlattenTockableDropV2Abi } from "@/contracts/FlattenTockableDropV2Abi";
// import cbor from "cbor";
// import { base58btc } from "multiformats/bases/base58";
// import { regex } from "@/constants/regex";

export async function getContractMetadata(_creator, _uuid, _projectName) {
  const metadataPath = getProjectMetadataPath(_creator, _uuid, _projectName);
  const json = fs.readFileSync(metadataPath);
  const metadata = JSON.parse(json);
  return metadata;
}

export async function getContractAbi(_project) {

  if (_project.dropType === "tockable") {
    if (Number(_project.chainId) === 168587773) {

      return FlattenBlastTockableDropV2Abi;
    } else {
      if (_project.version == 1) return FlattenTockableDropAbi;
      if (_project.version == 2) return FlattenTockableDropV2Abi;
    }
  }
  if (_project.dropType === "regular") {
    if (Number(_project.chainId) === 168587773) {
      return FlattenBlastRegularDropV2Abi;
    } else {
      return FlattenRegularDropV1Abi;
    }
  }
}

export async function getContractBytecode(_creator, _uuid, _projectName) {
  const metadata = await getContractMetadata(_creator, _uuid, _projectName);
  return metadata.bytecode;
}

// async function getComputedCidFromBytecode(_bytecode) {
//   const extracedBytecode = _bytecode
//     .match(regex.bytecode)[0]
//     .match(regex.cleanBytecode)[0];
//   const decodedBytecode = cbor.decodeFirstSync(extracedBytecode);
//   const cid = base58btc.encode(decodedBytecode.ipfs).slice(1);
//   return { cid };
// }

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
