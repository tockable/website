export function regularDrop(project, chainData) {
  return {
    uuid: project.uuid,
    name: project.name,
    version: project.version,
    ipfsProvider: project.hasOwnProperty("ipfsProvider")
      ? project.ipfsProvider
      : "",
    tokenName: project.tokenName,
    description: project.description,
    twitter: project.twitter,
    discord: project.discord,
    website: project.website,
    creator: project.creator,
    image: project.image,
    cover: project.cover,
    totalSupply: project.totalSupply,
    contractAddress: project.contractAddress,
    dropType: project.dropType,
    isFrozen: project.isFrozen,
    signer: project.signer,
    chainData,
    chainId: chainData.chainId,
    activeSession: project.activeSession,
    slug: project.slug,
    isPublished: project.isPublished,
  };
}

export function tockableDrop(project, chainData) {
  return {
    uuid: project.uuid,
    name: project.name,
    version: project.version,
    ipfsProvider: project.hasOwnProperty("ipfsProvider")
      ? project.ipfsProvider
      : "",
    tokenName: project.tokenName,
    description: project.description,
    twitter: project.twitter,
    discord: project.discord,
    website: project.website,
    creator: project.creator,
    image: project.image,
    cover: project.cover,
    totalSupply: project.totalSupply,
    isUnlimited: project.isUnlimited,
    duplicateVerification: project.duplicateVerification,
    contractAddress: project.contractAddress,
    dropType: project.dropType,
    layers: project.layers,
    fileNames: project.fileNames,
    cids: project.cids,
    signer: project.signer,
    chainData,
    chainId: chainData.chainId,
    activeSession: project.activeSession,
    slug: project.slug,
    isPublished: project.isPublished,
  };
}

export function monoDrop(project, chainData) {
  return {
    uuid: project.uuid,
    name: project.name,
    version: project.version,
    ipfsProvider: project.hasOwnProperty("ipfsProvider")
      ? project.ipfsProvider
      : "",
    tokenName: project.tokenName,
    description: project.description,
    twitter: project.twitter,
    discord: project.discord,
    website: project.website,
    creator: project.creator,
    image: project.image,
    cover: project.cover,
    totalSupply: project.totalSupply,
    isUnlimited: project.isUnlimited,
    contractAddress: project.contractAddress,
    dropType: project.dropType,
    isFrozen: project.isFrozen,
    signer: project.signer,
    chainData,
    chainId: chainData.chainId,
    activeSession: project.activeSession,
    slug: project.slug,
    isPublished: project.isPublished,
  };
}
export function tempDrop(project, chainData) {
  return {
    uuid: project.uuid,
    name: project.name,
    version: project.version,
    ipfsProvider: project.hasOwnProperty("ipfsProvider")
      ? project.ipfsProvider
      : "",
    tokenName: project.tokenName,
    description: project.description,
    twitter: project.twitter,
    discord: project.discord,
    website: project.website,
    creator: project.creator,
    image: project.image,
    cover: project.cover,
    totalSupply: project.totalSupply,
    isUnlimited: project.isUnlimited,
    duplicateVerification: project.duplicateVerification,
    contractAddress: project.contractAddress,
    dropType: project.dropType,
    layers: project.layers,
    fileNames: project.fileNames,
    cids: project.cids,
    cid: project.cid,
    signer: project.signer,
    chainData,
    chainId: chainData.chainId,
    activeSession: project.activeSession,
    slug: project.slug,
    isPublished: project.isPublished,
  };
}
