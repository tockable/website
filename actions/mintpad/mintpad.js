"use server";

import fs from "fs";
import { getProjectDirectory } from "../utils/path-utils";
import getChainData from "@/utils/chain-utils";
import * as mintpadData from "./payload-models";
import { db_path } from "@/tock.config.js";
import sqlite3 from "sqlite3";
import { open } from "sqlite";
import path from "path";
import { getAddress } from "viem";

const dbp = path.resolve(".", db_path, "published_projects_db.db");

let db;

function getPayload(project) {
  const chainData = getChainData(project.chainId);
  if (project.dropType === "tockable") {
    return mintpadData.tockableDrop(project, chainData);
  }
  if (project.dropType === "regular") {
    payload = mintpadData.regularDrop(project, chainData);
  }
  if (project.dropType === "tockable") {
    return mintpadData.monoDrop(project, chainData);
  }
  if (project.dropType === "temp") {
    return mintpadData.tempDrop(project, chainData);
  }
}

export async function fetchProjectMintData(slug) {
  // const allProjectsPath = getPublishedProjectPath();
  if (!db) {
    db = await open({
      filename: dbp,
      driver: sqlite3.Database,
    });
  }

  try {
    const query = `SELECT * FROM published_projects WHERE slug='${slug}'`;

    const projectBySlug = await db.get(query);
    if (!projectBySlug) return { success: false, notFound: true };

    const creatorAddress = getAddress(projectBySlug.creator);
    const creatorProjectsDir = getProjectDirectory(creatorAddress);
    const creatorProjectsJson = fs.readFileSync(creatorProjectsDir, {
      encoding: "utf8",
    });

    const creatorProjects = JSON.parse(creatorProjectsJson);

    const project = creatorProjects.find((p) => slug === p.slug);

    const payload = getPayload(project);

    return { success: true, payload };
  } catch (err) {
    return { success: false, message: err.message };
  }
}

export async function getElligibility(_address, _creator, _slug) {
  try {
    const creatorProjectsDir = getProjectDirectory(_creator);
    const creatorProjectsJson = fs.readFileSync(creatorProjectsDir, {
      encoding: "utf8",
    });

    const creatorProjects = JSON.parse(creatorProjectsJson);
    const project = creatorProjects.find((project) => _slug === project.slug);
    const activeSessionData = project.activeSession;

    const _current = new Date();

    const current = Date.UTC(
      _current.getUTCFullYear(),
      _current.getUTCMonth(),
      _current.getUTCDate(),
      _current.getUTCHours(),
      _current.getUTCMinutes()
    );

    const starts = [];

    for (let i = 0; i < project.sessions.length; i++) {
      const _append = project.sessions[i].start + ":00Z";
      const _date = new Date(_append);
      starts.push(_date.getTime());
    }

    const firstSession = Math.min(...starts);

    // if not started
    if (current < firstSession) {
      const timer = firstSession - current;
      return { success: true, status: "notStarted", payload: { timer } };
    }

    // if ended
    const ends = [];
    for (let i = 0; i < project.sessions.length; i++) {
      const _append = project.sessions[i].end + ":00Z";
      const _date = new Date(_append);
      ends.push(_date.getTime());
    }

    const endOfMint = Math.max(...ends);

    if (current > endOfMint) {
      return { success: true, status: "ended", payload: {} };
    }

    // until current session
    const currentSession = project.sessions[Number(project.activeSession)];

    const _appendStart = currentSession.start + ":00Z";
    const _start = new Date(_appendStart);
    const _appendEnd = currentSession.end + ":00Z";
    const _end = new Date(_appendEnd);

    const start = _start.getTime();
    const end = _end.getTime();

    if (current < start) {
      const timer = start - current;
      return { success: true, status: "notStartedSession", payload: { timer } };
    }

    if (current > end) {
      for (let i = 0; i < starts.length; i++) {
        if (current < start) {
          nextStart = starts[i];
          break;
        } else {
          return { success: true, status: "ended", payload: {} };
        }
      }
      return { success: true, status: "notStartedSession", payload: { timer } };
    }

    const timer = end - current;
    // if not active
    if (!project.activeSession.toString().length) {
      return { success: true, status: "notActive", payload: {} };
    }

    // if paused
    // if (project.paused) {
    //   return { success: true, status: "paused", payload: {} };
    // }

    if (project.activeSession == 0) {
      return {
        success: true,
        status: "justPublic",
        payload: {
          timer,
          elligibility: true,
          activeSession: project.activeSession,
          availableRoles: [
            {
              id: project.roles[0].id,
              name: project.roles[0].name,
              price: project.roles[0].price,
              quota: project.roles[0].quota,
            },
          ],
        },
      };
    }

    const availableRoles = [];

    for (let roleId of project.sessions[activeSessionData].roles) {
      if (roleId == 0) {
        const newRole = {
          id: project.roles[0].id,
          name: project.roles[0].name,
          price: project.roles[0].price,
          quota: project.roles[0].quota,
        };
        availableRoles.push(newRole);
      } else {
        const index = project.roles[roleId].allowedAddresses.findIndex(
          (allowedAddress) =>
            allowedAddress.toLowerCase() === _address.toLowerCase()
        );
        if (index !== -1) {
          const newRole = {
            id: project.roles[roleId].id,
            name: project.roles[roleId].name,
            price: project.roles[roleId].price,
            quota: project.roles[roleId].quota,
          };
          availableRoles.push(newRole);
        }
      }
    }
    if (availableRoles.length == 1) {
      if (availableRoles[0].id == 0) {
        return {
          success: true,
          status: "justPublic",
          payload: {
            timer,
            elligibility: true,
            activeSession: project.activeSession,
            availableRoles,
          },
        };
      } else {
        return {
          success: true,
          status: "notPublic",
          payload: {
            timer,
            activeSession: project.activeSession,
            elligibility: true,
            justPublicMint: false,
            availableRoles,
          },
        };
      }
    } else if (availableRoles.length > 1) {
      return {
        success: true,
        status: "notPublic",
        payload: {
          timer,
          elligibility: true,
          activeSession: project.activeSession,
          availableRoles,
        },
      };
    } else {
      return {
        success: true,
        status: "notPublic",
        payload: {
          timer,
          elligibility: false,
          activeSession: project.activeSession,
          availableRoles,
        },
      };
    }
  } catch (err) {
    return { success: false };
  }
}
