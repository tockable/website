"use client";

import { useEffect, useState } from "react";
import { useNetwork, useAccount } from "wagmi";
import ActionAdminMintRegular from "./actions-admin-mint-regular";
import ActionConfigureMetadataRegular from "./actions-configure-metadata-regular";
import ActionSetActiveSession from "./acitons-set-active-session";
import ActionWithdraw from "./actions-withdraw";
import ActionMintStatus from "./actions-mint-status";
import SwitchNetworkButton from "@/components/design/button-switch-network";
import { getContractAbi } from "@/actions/contract/metadata";
import Fade from "@/components/design/fade/fade";

const actions = [
  "Set Mint Session",
  "Owner Mint",
  "Metadata",
  "Withdraw",
  "Pause/Unpause",
];

export default function ProjectContractActionsTockable({ _project }) {
  const [activeAction, setActiveAction] = useState(actions[0]);
  const [abiError, setAbiError] = useState(false);
  const [project] = useState(_project);
  const [abi, setAbi] = useState([]);
  const { chain } = useNetwork();
  const { isConnected } = useAccount();

  useEffect(() => {
    if (!project) return;
    if (abi.length) return;

    (async () => {
      try {
        const _abi = await getContractAbi(project);
        setAbi(_abi);
      } catch (err) {
        setAbiError(true);
      }
    })();
  }, [project]);

  return (
    <>
      <Fade show={project}>
        <div className="basis-11/12 bg-tock-semiblack rounded-2xl p-4 mb-4">
          <h1 className="text-tock-green font-bold text-xl mt-4 mb-6 ">
            Contract actions
          </h1>
          <p className="text-zinc-400 text-sm mb-4">
            you can write the contract with available functions{" "}
          </p>
          <a
            className="text-xs text-blue-400 hover:text-blue-300"
            href="/docs/contract-actions"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn how to start mint & interact with contracts &gt;
          </a>
          {abiError && (
            <p className="text-tock-red text-sm">
              Something wrong, please refresh the page.
            </p>
          )}

          {!abiError && (
            <section>
              {isConnected && chain.id != project.chainId && (
                <SwitchNetworkButton project={project} />
              )}

              {isConnected && chain.id === Number(project.chainId) && (
                <div>
                  <nav className="flex flex-row gap-2 text-sm text-tock-green  mb-2">
                    {actions.map((action) => (
                      <button
                        className={`bg-${
                          activeAction === action ? "zinc-700" : "tock-black"
                        } 
             ${
               activeAction === action ? "" : "hover:bg-tock-semiblack"
             } px-2 transition ease-in-out duration-300 rounded-2xl h-14 text-xs px-2 lg:h-10 border border-zinc-700`}
                        key={action}
                        onClick={() => setActiveAction(action)}
                      >
                        {action}
                      </button>
                    ))}
                  </nav>
                  <div className="p-4 border border-zinc-600 rounded-2xl mb-4 bg-zinc-800">
                    {activeAction == "Set Mint Session" && (
                      <ActionSetActiveSession abi={abi} _project={project} />
                    )}
                    {activeAction == "Metadata" && (
                      <ActionConfigureMetadataRegular
                        abi={abi}
                        _project={project}
                      />
                    )}
                    {activeAction == "Owner Mint" && (
                      <ActionAdminMintRegular abi={abi} _project={project} />
                    )}
                    {activeAction == "Withdraw" && (
                      <ActionWithdraw abi={abi} _project={project} />
                    )}
                    {activeAction == "Pause/Unpause" && (
                      <ActionMintStatus abi={abi} _project={project} />
                    )}
                  </div>
                </div>
              )}
            </section>
          )}
        </div>
      </Fade>
    </>
  );
}
