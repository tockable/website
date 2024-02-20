"use client";

import { useState, createContext, useEffect } from "react";
import isEqual from "react-fast-compare";
import { toast, ToastContainer, Bounce } from "react-toastify";
import { ls } from "@/utils/utils";
import { MAX_MINT_PER_TX } from "@/tock.config";
import "react-toastify/dist/ReactToastify.css";

export const MintContextTockable = createContext();

export default function MintProviderTockable({ project, abi, children }) {
  const [blobs, setBlobs] = useState([]);
  const [duplicatedIndexes, setDuplicatedIndexes] = useState([]);
  const [successfullyMinted, setSuccessfullyMinted] = useState(false);
  const [isFollow, setFollow] = useState(setFollowState());

  const setFollowState = () => {
    return ls()
      ? Boolean(localStorage.getItem("tockfollow"))
        ? Boolean(localStorage.getItem("tockfollow"))
        : false
      : true;
  };

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

  useEffect(() => {
    if (!successfullyMinted) return;

    toast.success(<Success isFollow={isFollow} setFollow={setFollow} />, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
      transition: Bounce,
      onClose: () => setSuccessfullyMinted(false),
    });
  }, [successfullyMinted]);

  return (
    <MintContextTockable.Provider
      value={{
        project,
        abi,
        blobs,
        addToBasket,
        removeFromBasket,
        setDuplicatedIndexes,
        duplicatedIndexes,
        setSuccessfullyMinted,
      }}
    >
      <ToastContainer closeOnClick={false} />
      {children}
    </MintContextTockable.Provider>
  );
}

function Success({ isFollow, setFollow }) {
  return (
    <div>
      <p className="text-sm font-bold text-white">
        Basket Successfully minted!
      </p>
      {!isFollow && (
        <div>
          <p className="text-xs mt-4 text-white">
            If you enjoy, pease follow us on X
          </p>
          <button
            className="my-4"
            onClick={() => {
              localStorage.getItem("tockfollow");
              if (ls()) {
                setFollow(true);
                localStorage.setItem("tockfollow", "true");
              }
            }}
          >
            <a
              href="https://twitter.com/Tockablexyz?ref_src=twsrc%5Etfw"
              data-show-count="false"
              target="_blank"
              rel="noopener noreferrer"
              className="border px-2 py-2 rounded-2xl hover:bg-tock-semiblack transition duration-200"
            >
              Follow @Tockablexyz
            </a>
          </button>
          <script
            async
            src="https://platform.twitter.com/widgets.js"
            charset="utf-8"
          ></script>
        </div>
      )}
    </div>
  );
}
