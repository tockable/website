"use server";

import fs from "fs";
import path from "path";
import { getProjectDirectory } from "../utils/path-utils.js";
import { db_path } from "@/tock.config.js";
import sqlite3 from "sqlite3";
import { open } from "sqlite";

let db = null;
const dbp = path.resolve(".", db_path, "published_projects_db.db");

const DATABASE = process.env.DATABASE;

/**
 *
 * @param {string} _creator
 * @param {string} _uuid
 * @returns
 */
export async function fetchProjectByUUID(_creator, _uuid) {
  if (!_creator.match(/(\b0x[a-fA-F0-9]{40}\b)/g))
    return { success: false, message: "Invalid wallet address" };

  const projectsPath = getProjectDirectory(_creator);

  if (!fs.existsSync(projectsPath)) return { success: false };

  const json = fs.readFileSync(projectsPath, { encoding: "utf8" });
  const projects = JSON.parse(json);

  const project = projects.find((p) => p.uuid === _uuid);

  if (!project) return { success: false, message: "Project not found" };

  return { success: true, payload: project };
}

/**
 *
 * @param {string} _slug
 * @returns
 */
export async function checkUniqueSlug(_slug) {
  try {
    const slugsPath = path.resolve(".", DATABASE, "slugs.json");

    const json = fs.readFileSync(slugsPath, { encoding: "utf8" });
    const slugs = JSON.parse(json);

    const duplicate = slugs.find(
      (slug) => slug.toLowerCase() === _slug.toLowerCase()
    );

    if (duplicate) return { success: true, duplicate: true };

    return { success: true, duplicate: false };
  } catch (err) {
    return { success: false, message: err.message };
  }
}

/**
 *
 * @param {*} _creator
 * @param {*} params
 * @returns
 */
export async function updateProject(_creator, params) {
  const projectsPath = getProjectDirectory(_creator);

  const json = fs.readFileSync(projectsPath, { encoding: "utf8" });
  const projects = JSON.parse(json);

  const project = projects.find((p) => p.uuid === params.uuid);

  if (_creator.toLowerCase() !== project.creator.toLowerCase())
    throw new Error("forbidden");

  Object.assign(project, params);

  fs.writeFileSync(projectsPath, JSON.stringify(projects, null, 2));

  if (params.hasOwnProperty("isDeployed")) {
    await updateAllProjects({
      uuid: params.uuid,
      contractAddress: params.contractAddress,
      totalSupply: params.totalSupply,
    });
  }

  if (params.hasOwnProperty("paused")) {
    await updateAllProjects({
      uuid: params.uuid,
      paused: params.paused,
    });
  }

  if (params.hasOwnProperty("activeSession")) {
    const session = project.sessions.find(
      (s) => Number(s.id) === Number(params.activeSession)
    );

    const roleId = session.roles[0];
    const role = project.roles.find((role) => role.id === roleId);
    const price = role.price.toString();
    
    await updateAllProjects({
      uuid: params.uuid,
      price,
    });
  }

  if (params.hasOwnProperty("isPublished")) {
    await updateAllProjects({
      uuid: params.uuid,
      isPublished: params.isPublished,
    });
  }

  return project;
}

export async function updateAllProjects(params) {
  if (!db) {
    db = await open({
      filename: dbp,
      driver: sqlite3.Database,
    });
  }

  let query;

  if (
    params.hasOwnProperty("name") ||
    params.hasOwnProperty("image") ||
    params.hasOwnProperty("slug")
  ) {
    query = `UPDATE published_projects
             SET name = '${params.name}', image = '${params.image}', slug = '${params.slug}'
             WHERE uuid = '${params.uuid}'`;
  }

  if (params.hasOwnProperty("contractAddress")) {
    query = `UPDATE published_projects 
             SET contractAddress = '${params.contractAddress}' ,totalSupply = ${params.totalSupply}
             WHERE uuid = '${params.uuid}'`;
  }

  if (params.hasOwnProperty("isPublished")) {
    query = `UPDATE published_projects
             SET isPublished = ${params.isPublished === true ? 1 : 0}
             WHERE uuid = '${params.uuid}'`;
  }
  if (params.hasOwnProperty("price")) {
    query = `UPDATE published_projects
             SET price = '${params.price}' ,paused = 0
             WHERE uuid = '${params.uuid}'`;
  }

  if (params.hasOwnProperty("amount")) {
    query = `UPDATE published_projects
             SET minted = minted + ${params.amount}
             WHERE uuid = '${params.uuid}'`;
  }

  if (params.hasOwnProperty("paused")) {
    query = `UPDATE published_projects
             SET paused = ${params.paused === true ? 1 : 0}
             WHERE uuid = '${params.uuid}'`;
  }

  await db.run(query);
}

/**
 *
 * @param {string} _creator
 * @param {object} _project
 */

export async function updateProjectDetails(_creator, _projectDetails) {
  const { slug } = _projectDetails;

  try {
    const params = _projectDetails;

    const updatedProject = await updateProject(_creator, params);

    const slugPath = path.resolve(".", `${DATABASE}/slugs.json`);
    const slugsJSon = fs.readFileSync(slugPath, { encoding: "utf8" });
    const slugs = JSON.parse(slugsJSon);

    const writedBefore = slugs.find(
      (s) => s.toLowerCase() === slug.toLowerCase()
    );

    if (!writedBefore) {
      await fs.promises.writeFile(
        slugPath,
        JSON.stringify([...slugs, slug], null, 2)
      );
    }

    await updateAllProjects({
      uuid: params.uuid,
      name: params.name,
      image: params.image,
      slug: params.slug,
    });

    return {
      success: true,
      payload: updatedProject,
      message: "Project details updated successfully",
    };
  } catch (err) {
    return { success: false, message: err.message };
  }
}
