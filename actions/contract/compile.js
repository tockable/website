"use server";

import fs from "fs";
import rimraf from "rimraf";
import path from "path";
const solc = require("solc");
import { camelize } from "@/utils/string-utils";
import { getBuildDirectory } from "../utils/path-utils";
import { fetchProjectByUUID } from "../launchpad/projects";
import createCostimizedContractFile from "./createCustomContract";

function getContractName(_project) {
  return camelize(_project.name, true);
}

async function createContract(_project, _buildDirectory, _contractName) {
  const editedBaseContract = await createCostimizedContractFile(
    _project,
    _buildDirectory,
    _contractName
  );

  if (fs.existsSync(_buildDirectory)) {
    rimraf.sync(_buildDirectory);
    fs.mkdirSync(_buildDirectory);
  } else {
    fs.mkdirSync(_buildDirectory);
  }

  fs.writeFileSync(
    `${_buildDirectory}/${_contractName}.sol`,
    editedBaseContract
  );
}

function compile(_contractName, _project, _buildDirectory) {
  const sources = {};
  compileImports(sources, _project, _contractName, _buildDirectory);

  var input = {
    language: "Solidity",
    sources: sources,
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
      evmVersion: "paris",
      outputSelection: {
        "*": {
          "*": ["*"],
        },
      },
    },
  };

  const output = solc.compile(JSON.stringify(input));

  const contract = JSON.parse(output);

  const metadata = {
    bytecode:
      contract.contracts[`${_contractName}.sol`][_contractName].evm.bytecode
        .object,
  };

  return metadata;
}

function compileImports(sources, _project, _contractName, _buildDirectory) {
  sources[`${_contractName}.sol`] = {
    content: fs.readFileSync(
      path.resolve(_buildDirectory, `${_contractName}.sol`),
      "utf8"
    ),
  };
}

function writeOutput(_metadata, _project, _buildDirectory, _contractName) {
  fs.writeFileSync(
    path.resolve(_buildDirectory, _contractName + ".json"),
    JSON.stringify(_metadata)
  );
}

export async function createAndCompile(_creator, _uuid) {
  try {
    let project;
    const res = await fetchProjectByUUID(_creator, _uuid);
    if (res.success) {
      project = res.payload;
    } else {
      throw new Error("No Project found");
    }

    const buildDirectory = getBuildDirectory(project);
    const contractName = getContractName(project);
    await createContract(project, buildDirectory, contractName);
    const metadata = compile(contractName, project, buildDirectory);
    writeOutput(metadata, project, buildDirectory, contractName);
    return { success: true };
  } catch (err) {
    return { success: false };
  }
}
