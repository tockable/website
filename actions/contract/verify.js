"use server";

import fs from "fs";
import path from "path";
import { camelize } from "@/utils/string-utils";
import getVerifyChainData from "./getVerifyChainData";
import { encodeAbiParameters } from "viem";
import { TOCKABLE_ADDRESS } from "@/tock.config";
import { updateProject } from "../launchpad/projects";
const { URLSearchParams } = require("url");

const COMPILER_VERSIONS = {
  v800: "v0.8.0+commit.c7dfd78e",
  v819: "v0.8.19+commit.7dd6d404",
  v820: "v0.8.20+commit.a1b79de6",
  v821: "v0.8.21+commit.d9974bed",
  v822: "v0.8.22+commit.4fc1097e",
  v823: "v0.8.23+commit.f704f362",
  v824: "v0.8.24+commit.e11b9ed9",
};

const DATABASE = process.env.DATABASE;

const constructorAbi = {
  inputs: [
    { internalType: "address", name: "_tockableAddress", type: "address" },
    { internalType: "address", name: "_signerAddress", type: "address" },
  ],
  stateMutability: "nonpayable",
  type: "constructor",
};

export async function getContractVerificationArgs(_project) {
  const cargs = encodeAbiParameters(constructorAbi.inputs, [
    TOCKABLE_ADDRESS,
    _project.signer,
  ]);

  const contractName = camelize(_project.name, true);

  const args = cargs.slice(2);

  const sourcepath = path.resolve(
    ".",
    DATABASE,
    "projects",
    _project.creator.slice(2),
    _project.uuid,
    `${contractName}.sol`
  );

  const source = fs.readFileSync(sourcepath, { encoding: "utf8" });

  return { contractName, source, args };
}

export default async function verify(_project) {
  try {
    const chainData = await getVerifyChainData(Number(_project.chainId));
    const { contractName, args, source } = await getContractVerificationArgs(
      _project
    );

    const request = {
      apikey: chainData.apikey,
      module: "contract",
      action: "verifysourcecode",
      sourceCode: source,
      contractaddress: _project.contractAddress,
      codeformat: "solidity-single-file",
      contractname: contractName,
      compilerversion: COMPILER_VERSIONS["v821"],
      optimizationUsed: 1,
      runs: 200,
      evmVersion: "paris",
      constructorArguements: args,
      licenseType: 3,
    };

    const request2 = {
      apikey: chainData.apikey,
      module: "contract",
      action: "verifysourcecode",
      sourceCode: source,
      contractaddress: _project.contractAddress,
      codeformat: "solidity-single-file",
      contractname: contractName,
      compilerversion: COMPILER_VERSIONS["v824"],
      optimizationUsed: 1,
      runs: 200,
      evmVersion: "paris",
      constructorArguements: args,
      licenseType: 3,
    };

    /// for json-input

    // const json = {
    //   language: "Solidity",
    //   sources: {},
    //   settings: {
    //     optimizer: {
    //       enabled: true,
    //       runs: 200,
    //     },
    //     evmVersion: "paris",
    //     outputSelection: {
    //       "*": {
    //         "*": ["*"],
    //       },
    //     },
    //   },
    // };

    // json.sources[`${contractName}.sol`] = {
    //   content: source,
    // };

    // const request = {
    //   apikey: chainData.apikey,
    //   module: "contract",
    //   action: "verifysourcecode",
    //   sourceCode: JSON.stringify(json),
    //   contractaddress: _project.contractAddress,
    //   codeformat: "solidity-standard-json-input",
    //   contractname: `${contractName}.sol:${contractName}`,
    //   compilerversion: "v0.8.21+commit.d9974bed",
    //   constructorArguements: editedcargs,
    //   licenseType: 3,
    // };

    // let formBody = [];

    // for (let property in request) {
    //   let encodedKey = encodeURIComponent(property);
    //   let encodedValue = encodeURIComponent(request[property]);
    //   formBody.push(encodedKey + "=" + encodedValue);
    // }

    // formBody = formBody.join("&");

    // let formBody2 = [];

    // for (let property in request2) {
    //   let encodedKey = encodeURIComponent(property);
    //   let encodedValue = encodeURIComponent(request[property]);
    //   formBody2.push(encodedKey + "=" + encodedValue);
    // }

    // formBody2 = formBody2.join("&");

    let formBody = new URLSearchParams(request);
    const res1 = await fetch(chainData.endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
      },
      body: formBody,
    });

    let formBody2 = new URLSearchParams(request2);
    await fetch(chainData.endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
      },
      body: formBody2,
    });

    const data1 = await res1.json();

    if (data1) {
      console.log(data1);
      if (data1.status == 1 || data1.status == "1") {
        const checkGuid = `${chainData.endpoint}?apikey=${chainData.apikey}&guid=${data1.result}&module=contract&action=checkverifystatus`;

        const res2 = await fetch(checkGuid);
        const data2 = await res2.json();
        // isVerified
        if (
          data2.status == 1 ||
          data2.status == "1" ||
          data2.result == "Pending in queue"
        ) {
          try {
            const updatedProject = await updateProject(_project.creator, {
              uuid: _project.uuid,
              isVerified: true,
            });

            return { success: true, payload: updatedProject };
          } catch (_) {
            throw new Error(
              "Contract verified successfully but dashboard may show something else, we are working on it."
            );
          }
        } else {
          throw new Error("Not verified:", data2);
        }
      } else {
        throw new Error("Not verified:", data1);
      }
    } else {
      throw new Error(
        "Explorer end-point not respond, please try again later."
      );
    }
  } catch (err) {
    return { success: false, payload: null, message: err.message };
  }
}
