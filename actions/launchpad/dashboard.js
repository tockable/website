"use server";

import fs from "fs";
import path from "path";
import * as Init from "@/actions/launchpad/drop-models.js";
import { DROP_TYPES } from "@/tock.config.js";
import { getProjectDirectory } from "../utils/path-utils.js";
import sqlite3 from "sqlite3";
import { open } from "sqlite";
import { db_path } from "@/tock.config";
import { getAddress } from "viem";

const dbp = path.resolve(".", db_path, "published_projects_db.db");
let db = null;

const DATABASE = process.env.DATABASE;

/**
 *
 * @param {string} creator
 * @param {string} name
 * @param {string} chain
 * @param {number | string} chainId
 * @param {"tockable" | "regular"} dropType
 * @returns
 */

function initProject(_creator, _name, _chain, _chainId, _dropType) {
  // Tockable drop
  const creator = getAddress(_creator);

  if (_dropType === DROP_TYPES[0].type)
    return Init.tockableDrop(creator, _name, _chain, _chainId, _dropType);

  // Regular drop
  if (_dropType === DROP_TYPES[1].type)
    return Init.regularDrop(creator, _name, _chain, _chainId, _dropType);

  // Mono Drop
  if (_dropType === DROP_TYPES[2].type)
    return Init.monoDrop(creator, _name, _chain, _chainId, _dropType);

  // Mono Drop
  if (_dropType === DROP_TYPES[3].type)
    return Init.tempDrop(creator, _name, _chain, _chainId, _dropType);
}

/**
 *
 * @param {string} _creator
 * @returns
 */
export async function getAllProjects(_creator) {
  try {
    if (!_creator.match(/^0x[a-fA-F0-9]{40}$/g))
      throw new Error("Not a wallet address.");

    const projectsPath = getProjectDirectory(_creator);

    const json = fs.readFileSync(projectsPath, { encoding: "utf8" });
    const projects = JSON.parse(json);

    const payload = projects.map((project) => {
      const { uuid, name, image, chainId, isDeployed, isPublished } = project;

      return {
        uuid,
        name,
        image,
        chainId,
        isDeployed,
        isPublished,
      };
    });

    return { success: true, payload };
  } catch (err) {
    return { success: false, message: err.message };
  }
}

/**
 *
 * @param {string} _creator
 * @param {object} _project
 * @returns
 */
export async function createNewProject(_creator, _project) {
  try {
    if (!_creator.match(/(\b0x[a-fA-F0-9]{40}\b)/g))
      throw new Error("Not a wallet address.");

    const projectsPath = getProjectDirectory(_creator);

    let projects = [];

    if (fs.existsSync(projectsPath)) {
      const json = fs.readFileSync(projectsPath, { encoding: "utf8" });
      projects = JSON.parse(json);
    } else {
      initCreatorDir(_creator);
    }

    const { name, chain, chainId, dropType } = _project;

    const project = initProject(_creator, name, chain, chainId, dropType);

    await fs.promises.writeFile(
      projectsPath,
      JSON.stringify([...projects, project], null, 2)
    );

    await addEntryToAllProjects({
      uuid: project.uuid,
      creator: _creator,
      name: project.name,
      chain,
      chainId,
      dropType: project.dropType,
    });

    return {
      success: true,
      uuid: project.uuid,
      chain,
      message: "The project successfully created",
    };
  } catch (err) {
    return { success: false, message: err.message };
  }
}

/**
 *
 * @param {*} _creator
 */
function initCreatorDir(_creator) {
  const creator = getAddress(_creator);
  const dirPath = path.resolve(".", DATABASE, "projects", creator.slice(2, 42));
  fs.mkdirSync(dirPath);
}

/**
 *
 * @param {*} param0
 */
async function addEntryToAllProjects({
  uuid,
  name,
  creator,
  chain,
  chainId,
  dropType,
}) {
  if (!db) {
    db = await open({
      filename: dbp,
      driver: sqlite3.Database,
    });
  }

  const query = `INSERT INTO published_projects (
    uuid,
    name,
    creator,
    chain,
    chainId,
    dropType,
    image,
    contractAddress,
    slug,
    isPublished,
    minted,
    ipfs
) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)`;

  const vals = [
    uuid,
    name,
    creator.toLowerCase(),
    chain,
    chainId,
    dropType,
    "",
    "",
    "",
    0,
    0,
    "pinata",
  ];

  await db.run(query, vals);
}
