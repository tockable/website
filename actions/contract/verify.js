"use server";

import fs from "fs";
import path from "path";
import { camelize } from "@/utils/string-utils";
import getVerifyChainData from "./getVerifyChainData";
import { encodeAbiParameters, parseEther } from "viem";
import { TOCKABLE_ADDRESS, FACTORY_CONTRACTS } from "@/tock.config";
import { updateProject } from "../launchpad/projects";
const { URLSearchParams } = require("url");
import getChainData from "@/utils/chain-utils";

const COMPILER_VERSIONS = {
  v800: "v0.8.0+commit.c7dfd78e",
  v819: "v0.8.19+commit.7dd6d404",
  v820: "v0.8.20+commit.a1b79de6",
  v821: "v0.8.21+commit.d9974bed",
  v822: "v0.8.22+commit.4fc1097e",
  v823: "v0.8.23+commit.f704f362",
  v824: "v0.8.24+commit.e11b9ed9",
  v826: "v0.8.26+commit.8a97fa7a",
};

const DATABASE = process.env.DATABASE;

export async function getContractVerificationArgs(_project) {
  let cargs;
  let contractName;
  let source;

  // IF FACTORY
  if (FACTORY_CONTRACTS[_project.dropType].hasOwnProperty(_project.chainId)) {
    let constructorAbi;

    if (_project.dropType === "regular") {
      constructorAbi = {
        inputs: [
          {
            internalType: "address",
            name: "_tockableAddress",
            type: "address",
          },
          {
            internalType: "address",
            name: "_signerAddress",
            type: "address",
          },
          {
            internalType: "string",
            name: "_contractName",
            type: "string",
          },
          {
            internalType: "string",
            name: "_tokenName",
            type: "string",
          },
          {
            internalType: "string",
            name: "_tokenSymbol",
            type: "string",
          },
          {
            internalType: "uint256",
            name: "_baseFee",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "_totalSupply",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "_firstTokenId",
            type: "uint256",
          },
        ],
        stateMutability: "nonpayable",
        type: "constructor",
      };

      const chainData = getChainData(Number(_project.chainId));

      const base_fee = Number(chainData.regular_base_fee);

      cargs = encodeAbiParameters(constructorAbi.inputs, [
        TOCKABLE_ADDRESS,
        _project.signer,
        "TockableRegularDropFromFactoryV1",
        _project.tokenName,
        _project.tokenSymbol,
        parseEther(base_fee.toString(), "wei"),
        _project.totalSupply,
        _project.firstTokenId,
      ]);

      const sourcepath = path.resolve(
        ".",
        "contracts",
        "TockableRegularDropFromFactoryV1.sol"
      );

      source = fs.readFileSync(sourcepath, { encoding: "utf8" });
      contractName = "TockableRegularDropFromFactoryV1";
    }

    if (_project.dropType === "mono") {
      constructorAbi = {
        inputs: [
          {
            internalType: "address",
            name: "_tockableAddress",
            type: "address",
          },
          {
            internalType: "address",
            name: "_signerAddress",
            type: "address",
          },
          {
            internalType: "string",
            name: "_contractName",
            type: "string",
          },
          {
            internalType: "string",
            name: "_tokenName",
            type: "string",
          },
          {
            internalType: "string",
            name: "_tokenSymbol",
            type: "string",
          },
          {
            internalType: "uint256",
            name: "_baseFee",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "_totalSupply",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "_firstTokenId",
            type: "uint256",
          },
          {
            internalType: "bool",
            name: "_isUnlimited",
            type: "bool",
          },
        ],
        stateMutability: "nonpayable",
        type: "constructor",
      };

      const chainData = getChainData(Number(_project.chainId));

      const base_fee = Number(chainData.regular_base_fee);

      cargs = encodeAbiParameters(constructorAbi.inputs, [
        TOCKABLE_ADDRESS,
        _project.signer,
        "TockableMonoDropFromFactoryV1",
        _project.tokenName,
        _project.tokenSymbol,
        base_fee,
        _project.totalSupply,
        _project.firstTokenId,
        _project.isUnlimited,
      ]);
    }

    const sourcepath = path.resolve(
      ".",
      "contracts",
      "TockableMonoDropFromFactoryV1.sol"
    );

    source = fs.readFileSync(sourcepath, { encoding: "utf8" });
    contractName = "TockableMonoDropFromFactoryV1";
  }
  // IF NON FACTORY
  else {
    const constructorAbi = {
      inputs: [
        { internalType: "address", name: "_tockableAddress", type: "address" },
        { internalType: "address", name: "_signerAddress", type: "address" },
      ],
      stateMutability: "nonpayable",
      type: "constructor",
    };

    cargs = encodeAbiParameters(constructorAbi.inputs, [
      TOCKABLE_ADDRESS,
      _project.signer,
    ]);

    contractName = camelize(_project.name, true);

    const sourcepath = path.resolve(
      ".",
      DATABASE,
      "projects",
      _project.creator.slice(2),
      _project.uuid,
      `${contractName}.sol`
    );

    source = fs.readFileSync(sourcepath, { encoding: "utf8" });
  }

  const args = cargs.slice(2);

  return { contractName, source, args };
}

export default async function verify(_project) {
  try {
    const chainData = await getVerifyChainData(Number(_project.chainId));
    const { contractName, args, source } = await getContractVerificationArgs(
      _project
    );

    const compilerversion = FACTORY_CONTRACTS[_project.dropType].hasOwnProperty(
      _project.chainId
    )
      ? COMPILER_VERSIONS["v826"]
      : COMPILER_VERSIONS["v821"];

    const optimizationUsed =
      _project.dropType === "regular" && _project.chainData == 8453 ? 0 : 1;

    const evmVersion = FACTORY_CONTRACTS[_project.dropType].hasOwnProperty(
      _project.chainId
    )
      ? "cancun"
      : "paris";

    const request = {
      apikey: chainData.apikey,
      module: "contract",
      action: "verifysourcecode",
      sourceCode: source,
      contractaddress: _project.contractAddress,
      codeformat: "solidity-single-file",
      contractname: contractName,
      compilerversion,
      optimizationUsed,
      runs: 200,
      evmVersion: evmVersion,
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
