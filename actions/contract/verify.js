"use server";
import fs from "fs";
import path from "path";
import { camelize } from "@/utils/string-utils";
import getVerifyChainData from "./getVerifyChainData";
import { encodeAbiParameters } from "viem";
import { TOCKABLE_ADDRESS } from "@/tock.config";
import { updateIsVerified } from "../launchpad/projects";

// const COMPILER_VERSIONS = {
//   v800: "v0.8.0+commit.c7dfd78e",
//   v819: "v0.8.19+commit.7dd6d404",
//   v820: "v0.8.20+commit.a1b79de6",
//   v821: "v0.8.21+commit.d9974bed",
//   v822: "v0.8.22+commit.4fc1097e",
//   v823: "v0.8.23+commit.f704f362",
// };

const DATABASE = process.env.DATABASE;

const constructorAbi = {
  inputs: [
    { internalType: "address", name: "_tockableAddress", type: "address" },
    { internalType: "address", name: "_signerAddress", type: "address" },
  ],
  stateMutability: "nonpayable",
  type: "constructor",
};
export default async function verify(_project) {
  try {
    const chainData = await getVerifyChainData(Number(_project.chainId));
    console.log(chainData);
    const contractName = camelize(_project.name, true);

    const cargs = encodeAbiParameters(constructorAbi.inputs, [
      TOCKABLE_ADDRESS,
      _project.signer,
    ]);

    const editedcargs = cargs.slice(2);

    const sourcepath = path.resolve(
      ".",
      DATABASE,
      "projects",
      _project.creator.slice(2),
      _project.uuid,
      `${contractName}.sol`
    );

    const source = fs.readFileSync(sourcepath, { encoding: "utf8" });

    const request = {
      apikey: chainData.apikey,
      module: "contract",
      action: "verifysourcecode",
      sourceCode: source,
      contractaddress: _project.contractAddress,
      codeformat: "solidity-single-file",
      contractname: contractName,
      compilerversion: "v0.8.21+commit.d9974bed",
      optimizationUsed: 1,
      runs: 200,
      evmVersion: "paris",
      constructorArguements: editedcargs,
      licenseType: 3,
    };

    // for json-input
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

    let formBody = [];
    for (let property in request) {
      let encodedKey = encodeURIComponent(property);
      let encodedValue = encodeURIComponent(request[property]);
      formBody.push(encodedKey + "=" + encodedValue);
    }
    formBody = formBody.join("&");

    // const res1 = await fetch(chainData.endpoint, {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/x-www-form-urlencoded",
    //   },
    //   body: formBody,
    // });

    // const data1 = await res1.json();
    // console.log(data1);
    const data1 = {
      status: "1",
      result: "mdtgarmzyipaxvajyxxdlqpqjsn5vxxraycijelvsxi8q2m7rq",
    };
    if (data1) {
      if (data1.status == 1 || data1.status == "1") {
        const checkGuid = `${chainData.endpoint}?apikey=${chainData.apikey}&guid=${data1.result}&module=contract&action=checkverifystatus`;

        const res2 = await fetch(checkGuid);
        const data2 = await res2.json();
        console.log("data2", data2);
        if (
          data2.status == 1 ||
          data2.status == "1" ||
          data2.result == "Pending in queue"
        ) {
          console.log(data2);
          const res3 = await updateIsVerified(_project.creator, _project.uuid);
          if (res3.success) {
            return { success: true, payload: res3.payload };
          } else {
            throw new Error(
              "contract verified but you may see unverified on your dashboard which is not a big problem"
            );
          }
        } else {
          throw new Error("not verified:", data2);
        }
      } else {
        throw new Error("not verified:", data1);
      }
    } else {
      throw new Error(
        "chain explorer end-point not respond, please try again later."
      );
    }
  } catch (err) {
    console.log(err);
    return { success: false, payload: null, message: err.message };
  }
}
