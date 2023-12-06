"use client";

import { useState, useEffect } from "react";
import isEqual from "react-fast-compare";
import { useAccount, useNetwork, useContractReads } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { MAX_MINT_PER_TX } from "@/tock.config";
import { getElligibility } from "@/actions/mintpad/mintpad";
import { MintContext } from "@/contexts/mint-context";
import MintpadMintSection from "./mintpad-mint-section";
import SwitchNetworkButton from "../design/button-switch-network/button-switch-network";
import AdminMint from "./admin-mint";
import MintpadDapp from "./mintpad-mint-app";
import MintBasket from "./mint-basket";
import Loading from "../loading/loading";
import CountDown from "../design/timer/timer";

export default function Mintpad({ project, prepareMint, abiAction }) {
  // Hooks and Contexts
  const { address, isConnected } = useAccount();
  const { chain } = useNetwork();

  // States
  const [paused, setPaused] = useState(false);
  const [mintEnded, setMintEnded] = useState(false);
  const [untilStart, setUntilStart] = useState(0);
  const [untilEnd, setUntilEnd] = useState(0);
  const [notStarted, setNotStarted] = useState(false);
  const [fetch, updateFetch] = useState(0);
  const [abi, setAbi] = useState([]);
  const [blobs, setBlobs] = useState([]);
  const [roles, setRoles] = useState();
  const [session, setSession] = useState();
  const [publicSession, setPublicSession] = useState();
  const [elligibility, setElligibility] = useState(null);
  const [duplicatedIndexes, setDuplicatedIndexes] = useState([]);
  const [successfullyMinted, setSuccessFullyMinted] = useState(false);
  const [errorGettingElligibility, setErrorGettingElligibility] =
    useState(false);

  const { data, refetch, isError, isLoading } = useContractReads({
    contracts: [
      {
        address: project.contractAddress,
        abi,
        functionName: "isMintLive",
      },
      {
        address: project.contractAddress,
        abi,
        functionName: "tokensLeft",
      },
      {
        address: project.contractAddress,
        abi,
        functionName: "tokensLeftInSession",
        args: [Number(project.activeSession)],
      },
    ],
    enabled: abi.length > 0 && project.contractAddress,
    structuralSharing: (prev, next) => (prev === next ? prev : next),
  });

  useEffect(() => {
    if (abi.length > 0 && project.contractAddress) refetch?.();
  }, [abi]);

  useEffect(() => {
    refetch?.();
    setTimeout(() => updateFetch(fetch + 1), 30000);
  }, [fetch]);

  // Effects
  useEffect(() => {
    if (!project || !isConnected) return;
    getElligibility(address, project.creator, project.slug).then((res) => {
      if (res.success === false) {
        setErrorGettingElligibility(true);
        return;
      }
      if (res.success === true) {
        if (res.notStarted) {
          setNotStarted(true);
          setUntilStart(res.untilStart);
          return;
        }

        if (res.paused) {
          setPaused(true);
          return;
        }

        if (res.mintEnded) {
          setMintEnded(true);
          return;
        }

        if (res.payload.untilEnd <= 0) {
          setMintEnded(true);
          return;
        }

        setElligibility(res.payload?.elligibility);
        setPublicSession(res.payload?.justPublicMint);
        setRoles(res.payload?.availableRoles);
        setSession(Number(res.payload?.activeSession));
        setUntilEnd(res.payload?.untilEnd);

        if (
          res.payload?.elligibility &&
          res.payload?.activeSession.toString().length > 0
        ) {
          abiAction(project.dropType).then((res) => {
            setAbi(res);
          });
        }
      }
    });
  }, [project, isConnected]);

  // Functions
  function addToBasket(blob) {
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
  }

  function removeFromBasket(blobId) {
    const dups = [];

    for (let i = 0; i < duplicatedIndexes.length; i++) {
      let isDuplicated = parseInt(duplicatedIndexes[i]);
      if (isDuplicated === 1) dups.push(i);
    }

    if (dups.length > 0) {
      if (dups.includes(blobId)) {
        let editedArray = [...duplicatedIndexes];
        editedArray.splice(blobId, 1);
        setDuplicatedIndexes(editedArray);
      }
    }
    if (dups.length == 0) {
      setDuplicatedIndexes([]);
    }

    const newBlobs = blobs.filter((blob) => blob.id !== blobId);
    newBlobs.forEach((blob, i) => (blob.id = i));
    setBlobs(newBlobs);
  }
  return (
    <main>
      {!project && <Loading isLoading={!project} variant="page" size={20} />}
      {project && (
        <MintContext.Provider
          value={{
            project,
            abi,
            setAbi,
            blobs,
            addToBasket,
            removeFromBasket,
            setDuplicatedIndexes,
            duplicatedIndexes,
            setSuccessFullyMinted,
          }}
        >
          {notStarted && (
            <div className="my-8">
              <h1 className="text-center text-tock-green p-2 mt-2">
                until mint starts
              </h1>
              <CountDown variant="start" exts={untilStart} />
            </div>
          )}
          {untilEnd > 0 && (
            <div className="my-8">
              <h1 className="text-center text-blue-400 p-2 mt-2">
                live until on:
              </h1>
              <CountDown variant="end" exts={untilEnd} />
            </div>
          )}
          {!isConnected && (
            <div className="my-4 flex flex-col justify-center items-center my-8">
              <p className="text-tock-orange text-xl font-bold my-2">
                please connect wallet
              </p>
            </div>
          )}

          {isConnected && chain.id !== Number(project.chainData.chainId) && (
            <div className="my-4 flex flex-col justify-center items-center my-8">
              <p className="text-tock-orange text-xl font-bold my-2">
                please switch network
              </p>

              <div className="mb-12">
                <p className="text-tock-orange text-xs text-center">
                  to see minting options, please switch network to the project
                  chain
                </p>
                <SwitchNetworkButton project={project.chainData} />
              </div>
            </div>
          )}

          {isConnected &&
            chain.id === Number(project.chainData.chainId) &&
            data &&
            !isNaN(parseInt(data[1].result)) && (
              <div className="my-4 flex flex-col justify-center items-center my-8">
                <p className="text-tock-blue text-xl font-bold my-2">
                  <span className="font-normal text-zinc-400">status:</span>{" "}
                  {data[0]?.result ? (
                    <span className="text-tock-green">live</span>
                  ) : (
                    <span className="text-tock-orange">pause</span>
                  )}
                </p>
                {!project.isUnlimited && project.slug !== "tock" && (
                  <p className="text-tock-blue text-xl font-bold my-2">
                    <span className="font-normal text-zinc-400">minted:</span>{" "}
                    {Number(project.totalSupply) - parseInt(data[1].result)} /{" "}
                    {project.totalSupply}
                  </p>
                )}
                {project.isUnlimited && (
                  <p className="text-tock-blue text-xl font-bold my-2">
                    minted:{" "}
                    {Number(project.totalSupply) - parseInt(data[1].result)}/
                    unlimited
                  </p>
                )}
              </div>
            )}

          <div className="flex grow justify-end">
            <ConnectButton />
          </div>

          <div className="rounded-2xl p-4 mt-8 bg-tock-semiblack">
            <MintpadDapp
              layers={project.layers}
              fileNames={project.fileNames}
              cids={project.cids}
            />
            <MintBasket />
            {!isConnected && (
              <div className="p-4">
                <p className="text-tock-orange p-2 border rounded-xl mt-8 border-tock-orange text-center text-xs">
                  please connect wallet.
                </p>
              </div>
            )}
            {isConnected && (
              <div>
                {chain.id != project.chainData.chainId && (
                  <div className="my-12">
                    <p className="text-tock-orange text-xs text-center">
                      to see minting options, please switch network to the
                      project chain
                    </p>
                    <SwitchNetworkButton project={project.chainData} />
                  </div>
                )}
                {chain.id === Number(project.chainData.chainId) && (
                  <div>
                    {!data && isLoading && (
                      <div className="p-4">
                        <div className="text-tock-orange text-center p-2 border rounded-xl mt-8 border-zinc-400 text-centerr">
                          <Loading isLoading={isLoading && !data} size={20} />
                        </div>
                      </div>
                    )}
                    {isError && (
                      <div className="p-4">
                        <p className="text-tock-red p-2 border rounded-xl mt-8 border-tock-red text-center text-xs">
                          cannot fetch data form blockchain at this moment. if
                          problem persists after refreshin the page, please try
                          again in a couple of minutes.
                        </p>
                      </div>
                    )}

                    {data && !isError && (
                      <div className="p-4">
                        {(paused || !data[0]?.result) && (
                          <p className="text-tock-orange mt-4 text-center p-2 border rounded-xl border-tock-orange">
                            minting is not available at this moment.
                          </p>
                        )}
                      </div>
                    )}
                    {data && !isError && (
                      <div>
                        {!notStarted &&
                          !mintEnded &&
                          (!paused || data[0]?.result) && (
                            <div>
                              {!isConnected && (
                                <p className="text-blue-400 text-xs text-center p-2 mt-8 mx-4 border rounded-xl border-blue-400">
                                  connect wallet to see mint options
                                </p>
                              )}
                              {errorGettingElligibility && isConnected && (
                                <p className="text-tock-orange text-xs p-2 border rounded-xl mt-8 mx-4 border-tock-orange text-center">
                                  Something went wrong, please refresh the page.
                                </p>
                              )}
                              {!errorGettingElligibility && isConnected && (
                                <div className="w-full">
                                  {!elligibility && (
                                    <div className="p-2 border rounded-xl border-zinc-400">
                                      <p className="text-tock-orange text-xs text-center">
                                        no mint plan available for this wallet
                                        at this moment
                                      </p>
                                    </div>
                                  )}
                                  {elligibility && (
                                    <div>
                                      {abi.length > 0 && (
                                        <div>
                                          {chain.id ===
                                            Number(
                                              project.chainData.chainId
                                            ) && (
                                            <div className="w-full mt-8">
                                              {successfullyMinted && (
                                                <p className="text-tock-green text-xs mt-2">
                                                  All NFTs in the basket minted
                                                  Successfully!
                                                </p>
                                              )}
                                              {parseInt(data[2].result) > 0 && (
                                                <div>
                                                  {!publicSession && (
                                                    <p className="text-tock-blue mt-12 mx-4">
                                                      available roles for you:
                                                    </p>
                                                  )}

                                                  <MintpadMintSection
                                                    roles={roles}
                                                    session={session}
                                                    prepareMint={prepareMint}
                                                  />
                                                </div>
                                              )}
                                              {parseInt(data[2].result) ==
                                                0 && (
                                                <p className="mt-8 text-tock-orange text-center p-2 border rounded-xl border-zinc-400">
                                                  current active session reaches
                                                  its total supply, please wait
                                                  until next session.
                                                </p>
                                              )}
                                            </div>
                                          )}
                                        </div>
                                      )}
                                      {abi.length == 0 && (
                                        <p className="mt-8 text-tock-orange text-center p-2 border rounded-xl border-zinc-400">
                                          Loading...
                                        </p>
                                      )}
                                    </div>
                                  )}
                                  {elligibility === false && (
                                    <p className="text-tock-orange">
                                      it seems this wallet is not whitelisted in
                                      this session
                                    </p>
                                  )}
                                </div>
                              )}
                            </div>
                          )}
                      </div>
                    )}
                    {address === project.creator && (
                      <AdminMint prepareMint={prepareMint} />
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </MintContext.Provider>
      )}
    </main>
  );
}
