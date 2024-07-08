import { v4 as uuidv4 } from "uuid";
import { getAddress } from "viem";
import { DROP_TYPES } from "@/tock.config";

export function tockableDrop(_creator, name, chain, chainId, dropType) {
  const creator = getAddress(_creator);
  const uuid = uuidv4();
  return {
    uuid,
    version: DROP_TYPES[0].currentVersion,
    ipfsProvider: "pinata",
    creator,
    chain,
    chainId,
    dropType,
    name,
    description: "",
    website: "",
    twitter: "",
    discord: "",
    slug: "",
    image: null,
    cover: null,
    tokenName: "",
    tokenSymbol: "",
    duplicateVerification: false,
    firstTokenId: 1,
    roles: [],
    sessions: [],
    signer: "",
    contractAddress: "",
    layers: [],
    fileNames: [],
    cids: [],
    paused: true,
    activeSession: "",
    isDeployed: false,
    isPublished: false,
    isUnlimited: false,
    isVerified: false,
  };
}

export function regularDrop(_creator, name, chain, chainId, dropType) {
  const creator = getAddress(_creator);
  const uuid = uuidv4();
  return {
    uuid,
    version: DROP_TYPES[1].currentVersion,
    ipfsProvider: "pinata",
    creator,
    chain,
    chainId,
    dropType,
    name,
    description: "",
    cid: "",
    hasExtension: true,
    website: "",
    twitter: "",
    discord: "",
    slug: "",
    image: null,
    cover: null,
    tokenName: "",
    tokenSymbol: "",
    firstTokenId: 1,
    roles: [],
    sessions: [],
    signer: "",
    contractAddress: "",
    paused: true,
    activeSession: "",
    isDeployed: false,
    isPublished: false,
    isVerified: false,
    isFrozen: false,
  };
}

export function monoDrop(_creator, name, chain, chainId, dropType) {
  const creator = getAddress(_creator);
  const uuid = uuidv4();
  return {
    uuid,
    version: DROP_TYPES[2].currentVersion,
    ipfsProvider: "pinata",
    creator,
    chain,
    chainId,
    dropType,
    name,
    description: "",
    cid: "",
    website: "",
    twitter: "",
    discord: "",
    slug: "",
    image: null,
    cover: null,
    tokenName: "",
    tokenSymbol: "",
    firstTokenId: 1,
    roles: [],
    sessions: [],
    signer: "",
    contractAddress: "",
    paused: true,
    activeSession: "",
    isDeployed: false,
    isPublished: false,
    isVerified: false,
    isFrozen: false,
  };
}

export function tempDrop(_creator, name, chain, chainId, dropType) {
  const creator = getAddress(_creator);
  const uuid = uuidv4();
  return {
    uuid,
    version: DROP_TYPES[3].currentVersion,
    ipfsProvider: "pinata",
    creator,
    chain,
    chainId,
    dropType,
    name,
    description: "",
    website: "",
    twitter: "",
    discord: "",
    slug: "",
    image: null,
    cover: null,
    tokenName: "",
    tokenSymbol: "",
    duplicateVerification: false,
    firstTokenId: 1,
    roles: [],
    sessions: [],
    signer: "",
    contractAddress: "",
    layers: [],
    fileNames: [],
    cid: "",
    cids: [],
    paused: true,
    activeSession: "",
    isDeployed: false,
    isPublished: false,
    isUnlimited: false,
    isVerified: false,
  };
}
