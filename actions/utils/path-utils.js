import path from "path";
import { camelize } from "@/utils/string-utils";
import { getAddress } from "viem";

const DATABASE = process.env.DATABASE;
const QUERY = process.env.QUERY;
const publishedProjectPath = path.resolve(".", `${QUERY}/allProjects.json`);

/**
 *
 * @param {*} _creator
 * @returns
 */
export function getProjectDirectory(_creator) {
  const creator = getAddress(_creator);
  const dir = creator.slice(2, 42);
  return path.resolve(".", DATABASE, "projects", dir, "projects.json");
}

/**
 *
 * @returns
 */
export function getPublishedProjectPath() {
  return publishedProjectPath;
}

/**
 *
 * @param {*} _creator
 * @param {*} _uuid
 * @returns
 */
export function getProjectFilesDirectory(_creator, _uuid) {
  const creator = getAddress(_creator);
  const dir = creator.slice(2, 42);
  return path.resolve(".", DATABASE, "projects", dir, _uuid);
}

/**
 *
 * @param {*} _creator
 * @param {*} _uuid
 * @param {*} _contractName
 * @returns
 */
export function getProjectMetadataPath(_creator, _uuid, _projectName) {
  const creator = getAddress(_creator);
  const contractName = camelize(_projectName, true);
  const dir = creator.slice(2, 42);

  return path.resolve(
    ".",
    DATABASE,
    "projects",
    dir,
    _uuid,
    `${contractName}.json`
  );
}

/**
 *
 * @param {*} _creator
 * @returns
 */
export function getProjectDataDirectory(_creator) {
  const creator = getAddress(_creator);
  const dir = creator.slice(2, 42);
  return path.resolve(".", DATABASE, "projects", dir, "projectsData.json");
}

/**
 *
 * @param {*} _project
 * @returns
 */
export function getBuildDirectory(_project) {
  const creator = getAddress(_project.creator);
  const dir = creator.slice(2, 42);
  return path.resolve(".", DATABASE, "projects", dir, _project.uuid);
}
