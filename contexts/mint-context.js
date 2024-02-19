"use client";

import { useState, createContext } from "react";
import { MAX_MINT_PER_TX } from "@/tock.config";
import isEqual from "react-fast-compare";

export const MintContext = createContext();

export default function MintProvider({ project, abi, children }) {
  const [blobs, setBlobs] = useState([]);
  const [duplicatedIndexes, setDuplicatedIndexes] = useState([]);
  const [successfullyMinted, setSuccessFullyMinted] = useState(false);
  // Functions
  const addToBasket = (blob) => {
    if (blobs.length === MAX_MINT_PER_TX) return { duplicated: false };

    let duplicate = false;

    if (project.duplicateVerification) {
      for (let i = 0; i < blobs.length; i++) {
        duplicate = isEqual(blobs[i].traits, blob.traits);
        if (duplicate) break;
      }

      if (duplicate) return { duplicated: true };
    }

    if (!duplicate) {
      blob.id = blobs.length;
      setBlobs([...blobs, blob]);
      return { duplicated: false };
    }
  };

  const removeFromBasket = (blobId) => {
    const dups = [];

    for (let i = 0; i < duplicatedIndexes.length; i++) {
      const isDuplicated = parseInt(duplicatedIndexes[i]);
      if (isDuplicated === 1) dups.push(i);
    }

    if (dups.includes(blobId)) {
      const arr = [...duplicatedIndexes];
      arr.splice(blobId, 1);
      setDuplicatedIndexes(arr);
    }

    if (!dups.length) setDuplicatedIndexes([]);

    const newBlobs = blobs.filter((blob) => blob.id !== blobId);
    newBlobs.forEach((blob, i) => (blob.id = i));

    setBlobs(newBlobs);
  };

  return (
    <MintContext.Provider
      value={{
        project,
        abi,
        blobs,
        addToBasket,
        removeFromBasket,
        setDuplicatedIndexes,
        duplicatedIndexes,
        setSuccessFullyMinted,
      }}
    >
      {children}
    </MintContext.Provider>
  );
}
