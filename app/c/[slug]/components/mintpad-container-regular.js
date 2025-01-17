"use client";

import { useState, useEffect, useContext } from "react";
import { MintContextRegular } from "@/contexts/mint-context-regular";
import { useAccount, useNetwork, useContractReads } from "wagmi";
import { getElligibility } from "@/actions/mintpad/mintpad";
import MintpadMintSectionRegular from "./mintpad-mint-section-regular";
import SwitchNetworkButton from "@/components/design/button-switch-network";
import Loading from "@/components/loading/loading";
import CountDown from "@/components/design/timer";
import NavbarMintpad from "@/components/design/navbar/navbar-mintpad";
import { ls } from "@/utils/utils";

export default function MintpadContainerRegular({ prepareMint }) {
  // Hooks and Contexts
  const { address, isConnected } = useAccount();
  const { chain } = useNetwork();
  const { abi, project } = useContext(MintContextRegular);

  // States
  const [loading, setLoading] = useState(true);
  const [mintEnded, setMintEnded] = useState(false);
  const [untilStart, setUntilStart] = useState(0);
  const [untilEnd, setUntilEnd] = useState(0);
  const [notStarted, setNotStarted] = useState(false);
  const [notActive, setNotActive] = useState(false);
  const [roles, setRoles] = useState();
  const [session, setSession] = useState();
  const [publicSession, setPublicSession] = useState();
  const [elligibility, setElligibility] = useState(null);
  const [errorGettingElligibility, setErrorGettingElligibility] =
    useState(null);
  const [verifyFollow, setVerifyFollow] = useState(false);

  const setFollowState = () => {
    return ls()
      ? Boolean(localStorage.getItem("tockfollow"))
        ? Boolean(localStorage.getItem("tockfollow"))
        : false
      : true;
  };

  const handleFollowing = () => {
    setVerifyFollow(true);
    setTimeout(() => setFollow(true), 4000);
  };

  const [isFollow, setFollow] = useState(setFollowState());

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
      {
        address: project.contractAddress,
        abi,
        functionName: "totalSupply",
      },
    ],
  });

  const [fetch, updateFetch] = useState(0);

  useEffect(() => {
    refetch?.();
    const timer = setTimeout(() => updateFetch(fetch + 1), 10000);
    return timer && clearTimeout(timer);
  }, [fetch]);

  // Effects
  useEffect(() => {
    if (!isConnected) return;
    setLoading(true);
    (async () => {
      try {
        const res = await getElligibility(
          address,
          project.creator,
          project.slug
        );

        if (res.success === false) {
          setLoading(false);
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
            setErrorGettingElligibility(false);
            setLoading(false);
            return;
          }

          if (res.status === "notActive") {
            setNotStarted(true);
            setNotActive(true);
            setUntilStart(res.payload.timer);
            setErrorGettingElligibility(false);
            setLoading(false);
            return;
          }

          if (res.status === "ended") {
            setMintEnded(true);
            setLoading(false);
            setErrorGettingElligibility(false);
            return;
          }

          if (res.payload?.timer <= 0) {
            setMintEnded(true);
            setLoading(false);
            setErrorGettingElligibility(false);
            return;
          }

          setElligibility(res.payload?.elligibility);
          setPublicSession(res.status === "justPublic");
          setRoles(res.payload?.availableRoles);
          setSession(Number(res.payload?.activeSession));
          setUntilEnd(res.payload?.timer);
          setErrorGettingElligibility(false);
          setLoading(false);
        }
      } catch (err) {
        setLoading(false);
        setErrorGettingElligibility(true);
      }
    })();
  }, [isConnected]);

  return (
    <main>
      <NavbarMintpad />
      <div className="flex justify-center">
        <div className="basis-full">
          {!isConnected && (
            <div className="my-4 flex flex-col justify-center items-center my-8">
              <p className="text-tock-orange text-xl font-bold my-2">
                Please connect wallet to mint.
              </p>
            </div>
          )}
          {isConnected && chain.id !== Number(project.chainData.chainId) && (
            <div className="my-4 flex flex-col justify-center items-center my-8">
              <p className="text-tock-orange text-xl font-bold my-2">
                Please switch network
              </p>

              <div className="mb-12">
                <p className="text-tock-orange text-xs text-center mb-2">
                  To see minting options, please switch network to the project
                  chain
                </p>
                <SwitchNetworkButton
                  forDeploy={false}
                  project={project.chainData}
                />
              </div>
            </div>
          )}
          {isConnected && loading && (
            <div className="flex justify-center items-center h-64">
              <Loading isLoading={loading} size={20} />
            </div>
          )}
          {isConnected && !loading && data && !data[0]?.error && (
            <>
              {errorGettingElligibility === true && (
                <p className="text-tock-orange text-xs p-2 border rounded-xl mt-8 mx-4 border-tock-orange text-center">
                  Something went wrong, please refresh the page.
                </p>
              )}
              {errorGettingElligibility === false && (
                <div className="flex flex-col-reverse sm:flex-row gap-2">
                  {notStarted && (
                    <div className="my-2 flex flex-col sm:flex-row items-center flex-auto">
                      <h1 className="text-center sm:text-start text-tock-green p-2">
                        Until mint starts
                      </h1>
                      <CountDown variant="start" exts={untilStart} />
                    </div>
                  )}

                  {untilEnd > 0 && (
                    <div className="my-2 flex flex-col sm:flex-row items-center flex-auto">
                      <h1 className="text-center sm:text-start text-blue-400 p-2">
                        Live until
                      </h1>
                      <CountDown variant="end" exts={untilEnd} />
                    </div>
                  )}

                  {mintEnded && (
                    <div className="my-2 flex flex-col flex-row gap-2 justify-center items-center">
                      <p className="text-tock-blue font-bold">
                        {/* <span className="font-normal text-zinc-400">
                          Status:
                        </span>{" "} */}
                        <span className="text-tock-green">Finished</span>
                      </p>
                      {project.hasOwnProperty("isUnlimited") &&
                        project.isUnlimited === true && (
                          <p className="text-tock-blue font-bold">
                            <span className="font-normal text-zinc-400">
                              Minted:
                            </span>{" "}
                            {parseInt(data[3].result)} / Unlimited
                          </p>
                        )}
                      {project.hasOwnProperty("isUnlimited") &&
                        project.isUnlimited === false && (
                          <p className="text-tock-blue font-bold">
                            <span className="font-normal text-zinc-400">
                              Minted:
                            </span>
                            {parseInt(data[3].result)} / {project.totalSupply}
                          </p>
                        )}
                      {!project.hasOwnProperty("isUnlimited") && (
                        <p className="text-tock-blue font-bold">
                          <span className="font-normal text-zinc-400">
                            Minted:
                          </span>{" "}
                          {parseInt(data[3].result)} / {project.totalSupply}
                        </p>
                      )}
                    </div>
                  )}

                  {!mintEnded &&
                    !notStarted &&
                    chain.id === Number(project.chainData.chainId) &&
                    !isNaN(parseInt(data[1].result)) && (
                      <div className="my-2 flex flex-col sm:flex-row gap-2 justify-center items-center">
                        <p className="text-tock-blue font-bold">
                          {/* <span className="font-normal text-zinc-400">
                            Status:
                          </span>{" "} */}
                          {data[0]?.result === true ? (
                            <span className="text-tock-green">Live</span>
                          ) : (
                            <span className="text-tock-orange">Paused</span>
                          )}
                        </p>
                        {project.hasOwnProperty("isUnlimited") &&
                          project.isUnlimited === true && (
                            <p className="text-tock-blue font-bold">
                              <span className="font-normal text-zinc-400">
                                Minted:
                              </span>{" "}
                              {parseInt(data[3].result)} / Unlimited
                            </p>
                          )}
                        {project.hasOwnProperty("isUnlimited") &&
                          project.isUnlimited === false && (
                            <p className="text-tock-blue font-bold">
                              <span className="font-normal text-zinc-400">
                                Minted:
                              </span>{" "}
                              {parseInt(data[3].result)} / {project.totalSupply}
                            </p>
                          )}
                        {!project.hasOwnProperty("isUnlimited") && (
                          <p className="text-tock-blue font-bold">
                            <span className="font-normal text-zinc-400">
                              Minted:
                            </span>{" "}
                            {parseInt(data[3].result)} / {project.totalSupply}
                          </p>
                        )}
                      </div>
                    )}
                </div>
              )}
            </>
          )}

          {isConnected &&
            chain.id === Number(project.chainData.chainId) &&
            notActive && (
              <p className="text-tock-orange m-4 p-4">
                There is no Active mint session for this collection at this
                moment, Please contact the creator or come back later.
              </p>
            )}

          {!mintEnded &&
            !notStarted &&
            !loading &&
            isConnected &&
            chain.id === Number(project.chainData.chainId) && (
              <div className="rounded-2xl p-4 mt-8 bg-tock-semiblack">
                <h1 className="mx-8 mt-4 font-bold text-2xl text-tock-green">
                  Mint!
                </h1>
                {!isConnected && (
                  <div className="p-4">
                    <p className="text-tock-orange p-2 border rounded-xl mt-8 border-tock-orange text-center text-xs">
                      please connect wallet to mint.
                    </p>
                  </div>
                )}

                <div>
                  {isConnected && chain.id === project.chainData.chainId && (
                    <div>
                      {!data && isLoading && (
                        <div className="text-tock-orange text-center p-6 border rounded-xl mt-8 border-zinc-400 text-centerr">
                          <Loading isLoading={isLoading && !data} size={20} />
                        </div>
                      )}

                      {!isLoading && (isError || (data && data[0]?.error)) && (
                        <p className="mx-4 my-4 text-tock-red p-2 border rounded-xl mt-8 border-tock-red text-center text-xs">
                          Cannot fetch data form blockchain at this moment.
                          please refresh the page or try with another proxy/vpn
                          setting.
                          <br />
                          <br />
                          If the problem persists, please come back later.
                        </p>
                      )}

                      {!loading && data && !data[0]?.error && !isError && (
                        <>
                          {parseInt(data[1]?.result) === 0 ? (
                            <p className="text-blue-400 text-lg mx-4 mt-10 mb-6 text-center p-2 border rounded-xl border-tock-orange">
                              Sold out!
                            </p>
                          ) : (
                            <>
                              {data[0]?.result === false && (
                                <p className="text-tock-orange text-sm mx-4 mt-10 mb-6 text-center p-2 border rounded-xl border-tock-orange">
                                  minting is not available at this moment.
                                </p>
                              )}

                              {!loading &&
                                !notStarted &&
                                !mintEnded &&
                                data[0]?.result === true && (
                                  <div>
                                    {errorGettingElligibility === true && (
                                      <p className="text-tock-orange text-xs p-2 border rounded-xl mt-8 mx-4 border-tock-orange text-center">
                                        Something went wrong, please refresh the
                                        page.
                                      </p>
                                    )}
                                    {errorGettingElligibility === false && (
                                      <div className="w-full">
                                        {elligibility === false && (
                                          <div className="mx-4 p-2 mt-2 border rounded-xl border-tock-orange text-xs">
                                            <p className="text-tock-orange">
                                              It seems there is no mint option
                                              for this wallet at this moment...
                                            </p>
                                            <p className="text-tock-orange">
                                              Please come back later...
                                            </p>
                                          </div>
                                        )}
                                        {elligibility === true &&
                                          isFollow === false && (
                                            <FollowX
                                              setFollow={handleFollowing}
                                              verifyFollow={verifyFollow}
                                            />
                                          )}
                                        {elligibility === true &&
                                          isFollow === true && (
                                            <div className="w-full mt-8">
                                              {parseInt(data[2].result) > 0 && (
                                                <div>
                                                  {!publicSession && (
                                                    <p className="text-tock-blue mt-12 mx-4">
                                                      available roles for you:
                                                    </p>
                                                  )}
                                                  <MintpadMintSectionRegular
                                                    roles={roles}
                                                    session={session}
                                                    prepareMint={prepareMint}
                                                  />
                                                </div>
                                              )}
                                              {parseInt(data[2].result) ==
                                                0 && (
                                                <p className="mt-8 text-tock-orange text-center p-2 border rounded-xl border-zinc-400">
                                                  Current session reached its
                                                  total supply, please wait
                                                  until next session.
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
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
        </div>
      </div>
    </main>
  );
}

function FollowX({ setFollow, verifyFollow }) {
  return (
    <div className="flex flex-col justify-center h-44 items-center border rounded-xl border-zinc-700 my-4 bg-tock-black">
      <p className="text-xs mt-4 text-white">Please follow us on X to mint</p>
      {verifyFollow === false && (
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
            href="https://twitter.com/tockable_org?ref_src=twsrc%5Etfw"
            data-show-count="false"
            target="_blank"
            rel="noopener noreferrer"
            className="border px-4 py-2 rounded-2xl text-tock-green hover:bg-zinc-600 transition duration-200"
          >
            Follow @Tockable_org
          </a>
          <script
            async
            src="https://platform.twitter.com/widgets.js"
            charset="utf-8"
          ></script>
        </button>
      )}
      {verifyFollow === true && <p className="text-zinc-500">verifying...</p>}
    </div>
  );
}
