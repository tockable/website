"use client";

import { useState, useEffect, useContext } from "react";
import { MintContext } from "@/contexts/mint-context";
import { useAccount, useNetwork, useContractReads } from "wagmi";
import { getElligibility } from "@/actions/mintpad/mintpad";
import MintpadMintSection from "./mintpad-mint-section";
import AdminMint from "./admin-mint";
import MintpadDapp from "./mintpad-mint-app";
import MintBasket from "./mint-basket";
import SwitchNetworkButton from "@/components/design/button-switch-network";
import Loading from "@/components/loading/loading";
import CountDown from "@/components/design/timer";
import NavbarMintpad from "@/components/design/navbar/navbar-mintpad";

export default function Mintpad({ prepareMint }) {
  // Hooks and Contexts
  const { address, isConnected } = useAccount();
  const { chain } = useNetwork();
  const { abi, project } = useContext(MintContext);

  // States
  const [mintEnded, setMintEnded] = useState(false);
  const [untilStart, setUntilStart] = useState(0);
  const [untilEnd, setUntilEnd] = useState(0);
  const [notStarted, setNotStarted] = useState(false);
  const [roles, setRoles] = useState();
  const [session, setSession] = useState();
  const [publicSession, setPublicSession] = useState();
  const [elligibility, setElligibility] = useState(null);
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
  });

  const [fetch, updateFetch] = useState(0);

  useEffect(() => {
    refetch?.();
    setTimeout(() => updateFetch(fetch + 1), 10000);
  }, [fetch]);

  // Effects
  useEffect(() => {
    if (!isConnected) return;

    getElligibility(address, project.creator, project.slug)
      .then((res) => {
        console.log(res);
        if (res.success === false) {
          setErrorGettingElligibility(true);
          return;
        }

        if (res.success === true) {
          if (
            res.status === "notStarted" ||
            res.status === "notStartedSession"
          ) {
            setNotStarted(true);
            setUntilStart(res.payload.timer);
            return;
          }

          if (res.status === "ended") {
            setMintEnded(true);
            return;
          }

          if (res.payload?.timer <= 0) {
            setMintEnded(true);
            return;
          }

          setElligibility(res.payload?.elligibility);
          setPublicSession(res.status === "justPublic");
          setRoles(res.payload?.availableRoles);
          setSession(Number(res.payload?.activeSession));
          setUntilEnd(res.payload?.timer);
        }
      })
      .catch((_) => setErrorGettingElligibility(true));
  }, [isConnected]);

  return (
    <main>
      <NavbarMintpad />
      <div className="flex justify-center">
        <div className="basis-full">
          {notStarted && (
            <div className="my-8">
              <h1 className="text-center text-tock-green p-2 mt-2">
                Until mint starts
              </h1>
              <CountDown variant="start" exts={untilStart} />
            </div>
          )}

          {untilEnd > 0 && (
            <div className="my-8">
              <h1 className="text-center text-blue-400 p-2 mt-2">
                Live until on:
              </h1>
              <CountDown variant="end" exts={untilEnd} />
            </div>
          )}

          {!isConnected && (
            <div className="my-4 flex flex-col justify-center items-center my-8">
              <p className="text-tock-orange text-xl font-bold my-2">
                please connect wallet to mint.
              </p>
            </div>
          )}

          {isConnected && chain.id !== Number(project.chainData.chainId) && (
            <div className="my-4 flex flex-col justify-center items-center my-8">
              <p className="text-tock-orange text-xl font-bold my-2">
                please switch network
              </p>

              <div className="mb-12">
                <p className="text-tock-orange text-xs text-center mb-2">
                  to see minting options, please switch network to the project
                  chain
                </p>
                <SwitchNetworkButton project={project.chainData} />
              </div>
            </div>
          )}

          {mintEnded && (
            <div className="my-4 flex flex-col justify-center items-center my-8">
              <p className="text-tock-blue text-xl font-bold my-2">
                <span className="font-normal text-zinc-400">Status:</span>{" "}
                <span className="text-tock-green">Finished</span>
              </p>
              {!project.isUnlimited && project.slug !== "tock" && (
                <p className="text-tock-blue text-xl font-bold my-2">
                  <span className="font-normal text-zinc-400">Minted:</span>{" "}
                  {Number(project.totalSupply) - parseInt(data[1].result)} /{" "}
                  {project.totalSupply}
                </p>
              )}
              {project.isUnlimited && (
                <p className="text-tock-blue text-xl font-bold my-2">
                  Supply:{" "}
                  {Number(project.totalSupply) - parseInt(data[1].result)}/
                  Unlimited
                </p>
              )}
            </div>
          )}
          {isConnected &&
            !mintEnded &&
            !notStarted &&
            chain.id === Number(project.chainData.chainId) &&
            data &&
            !data[0]?.error &&
            !isNaN(parseInt(data[1].result)) && (
              <div className="my-4 flex flex-col justify-center items-center my-8">
                <p className="text-tock-blue text-xl font-bold my-2">
                  <span className="font-normal text-zinc-400">Status:</span>{" "}
                  {data[0]?.result === true ? (
                    <span className="text-tock-green">live</span>
                  ) : (
                    <span className="text-tock-orange">paused</span>
                  )}
                </p>
                {!project.isUnlimited && project.slug !== "tock" && (
                  <p className="text-tock-blue text-xl font-bold my-2">
                    <span className="font-normal text-zinc-400">Minted:</span>{" "}
                    {Number(project.totalSupply) - parseInt(data[1].result)} /{" "}
                    {project.totalSupply}
                  </p>
                )}
                {project.isUnlimited && (
                  <p className="text-tock-blue text-xl font-bold my-2">
                    Supply:{" "}
                    {Number(project.totalSupply) - parseInt(data[1].result)}/
                    Unlimited
                  </p>
                )}
              </div>
            )}

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
                  please connect wallet to mint.
                </p>
              </div>
            )}

            <div>
              {isConnected && chain.id != project.chainData.chainId && (
                <div className="my-12">
                  <p className="text-tock-orange text-xs text-center mb-2">
                    to see minting options, please switch network to the project
                    chain
                  </p>
                  <SwitchNetworkButton project={project.chainData} />
                </div>
              )}

              {isConnected && chain.id === project.chainData.chainId && (
                <div>
                  {!data && isLoading && (
                    <div className="text-tock-orange text-center p-6 border rounded-xl mt-8 border-zinc-400 text-centerr">
                      <Loading isLoading={isLoading && !data} size={20} />
                    </div>
                  )}

                  {!isLoading && (isError || (data && data[0]?.error)) && (
                    <p className="mx-4 my-4 text-tock-red p-2 border rounded-xl mt-8 border-tock-red text-center text-xs">
                      cannot fetch data form blockchain at this moment. please
                      refresh the page or try with another proxy/vpn setting.
                      <br />
                      <br />
                      If the problem persists, please come back later.
                    </p>
                  )}

                  {data && !data[0]?.error && !isError && (
                    <>
                      {data[0]?.result === false && (
                        <p className="text-tock-orange text-sm mx-4 mt-10 mb-6 text-center p-2 border rounded-xl border-tock-orange">
                          minting is not available at this moment.
                        </p>
                      )}

                      {!notStarted &&
                        !mintEnded &&
                        data[0]?.result === true && (
                          <div>
                            {errorGettingElligibility && (
                              <p className="text-tock-orange text-xs p-2 border rounded-xl mt-8 mx-4 border-tock-orange text-center">
                                Something went wrong, please refresh the page.
                              </p>
                            )}
                            {!errorGettingElligibility && (
                              <div className="w-full">
                                {!elligibility ? (
                                  <div className="mx-4 p-2 border rounded-xl border-tock-orange">
                                    <p className="text-tock-orange">
                                      It seems there is no mint option for this
                                      wallet at this moment...
                                    </p>
                                    <p className="text-tock-orange">
                                      Please come back later...
                                    </p>
                                  </div>
                                ) : (
                                  <div className="w-full mt-8">
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
                                    {parseInt(data[2].result) == 0 && (
                                      <p className="mt-8 text-tock-orange text-center p-2 border rounded-xl border-zinc-400">
                                        Current session reaches its total
                                        supply, please wait until next session.
                                      </p>
                                    )}
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        )}
                    </>
                  )}
                  {address === project.creator && (
                    <AdminMint prepareMint={prepareMint} />
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
