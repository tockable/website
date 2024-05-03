"use server";

import fs from "fs";
import path from "path";
// import storeFileToIpfs from "../ipfs/uploadFileToIpfs.js";
import { getProjectDirectory } from "../utils/path-utils.js";

const DATABASE = process.env.DATABASE;
const QUERY = process.env.QUERY;

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

  if (params.isDeployed) {
    await updateAllProjects({
      uuid: params.uuid,
      contractAddress: params.contractAddress,
    });
  }

  if (params.isPublished) {
    await updateAllProjects({
      uuid: params.uuid,
      isPublished: params.isPublished,
    });
  }

  return project;
}

async function updateAllProjects(params) {
  const allProjectsPath = path.resolve(".", QUERY, "allProjects.json");

  const json = fs.readFileSync(allProjectsPath, { encoding: "utf8" });
  const allProjects = JSON.parse(json);

  const project = allProjects.find((p) => p.uuid === params.uuid);

  Object.assign(project, params);

  fs.writeFileSync(allProjectsPath, JSON.stringify(allProjects, null, 2));
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

// export async function updateProjectDetails(_creator, _projectDetails, _files) {
//   let image, cover;

//   const { uuid, name, description, website, twitter, discord, slug } =
//     _projectDetails;

//   if (_files !== null) {
//     image = _files.get("image");
//     cover = _files.get("cover");
//   } else {
//     image = null;
//     cover = null;
//   }

//   try {
//     const params = { uuid, name, description, website, twitter, discord, slug };

//     if (image !== null && image !== "null") {
//       const bytes = await image.arrayBuffer();
//       const buffer = Buffer.from(bytes);
//       const res = await storeFileToIpfs(buffer, image.type, image.name);
//       if (
//         res.success === true &&
//         res.cid &&
//         res.cid !== "" &&
//         res.cid !== undefined
//       ) {
//         params.image = res.cid;
//       } else {
//         return { success: false, message: "Something wrong with ipfs" };
//       }
//     }

//     if (cover !== null && cover !== "null") {
//       const bytes = await cover.arrayBuffer();
//       const buffer = Buffer.from(bytes);
//       const res = await storeFileToIpfs(buffer, cover.type, cover.name);
//       if (
//         res.success === true &&
//         res.cid &&
//         res.cid !== "" &&
//         res.cid !== undefined
//       ) {
//         params.cover = res.cid;
//       } else {
//         return { success: false, message: "Something wrong with ipfs" };
//       }
//     }

//     const updatedProject = await updateProject(_creator, params);

//     const slugPath = path.resolve(".", `${DATABASE}/slugs.json`);
//     const slugsJSon = fs.readFileSync(slugPath, { encoding: "utf8" });
//     const slugs = JSON.parse(slugsJSon);

//     const writedBefore = slugs.find(
//       (s) => s.toLowerCase() === slug.toLowerCase()
//     );

//     if (!writedBefore) {
//       await fs.promises.writeFile(
//         slugPath,
//         JSON.stringify([...slugs, slug], null, 2)
//       );
//     }

//     await updateAllProjects({
//       uuid: params.uuid,
//       name: params.name,
//       image: params.image,
//       slug: params.slug,
//     });

//     return {
//       success: true,
//       payload: updatedProject,
//       message: "Project details updated successfully",
//     };
//   } catch (err) {
//     return { success: false, message: err.message };
//   }
// }
