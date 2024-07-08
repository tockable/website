"use client";

import { useContext } from "react";
import { MintContextTockable } from "@/contexts/mint-context-tockable";
import { useAccount, useNetwork } from "wagmi";
import MintpadDappDetopia from "./mintpad-mint-app-detopia";
import MintBasket from "../[slug]/components/mint-basket";
import SwitchNetworkButton from "@/components/design/button-switch-network";
import NavbarMintpad from "@/components/design/navbar/navbar-mintpad";

const lands = ["L-1.png", "L-2.png", "L-3.png", "L-4.png"];

const block = [
  "empty.png",
  "B-1.png",
  "B-2.png",
  "B-3.png",
  "B-4.png",
  "B-5.png",
  "B-6.png",
  "B-7.png",
];
const front = [
  "empty.png",
  "F-1.png",
  "F-2.png",
  "F-3.png",
  "F-4.png",
  "F-5.png",
  "F-6.png",
  "F-7.png",
  "F-8.png",
  "F-9.png",
  "F-10.png",
  "F-11.png",
  "F-12.png",
  "F-13.png",
  "F-14.png",
  "F-15.png",
  "F-16.png",
  "F-17.png",
  "F-18.png",
  "F-19.png",
  "F-20-1.png",
  "F-20-2.png",
  "F-20-3.png",
  "F-20-4.png",
  "F-20-5.png",
  "F-20-6.png",
  "F-20-7.png",
];
const side = ["empty.png", "S-1.png", "S-2.png", "S-3.png", "S-4.png"];
const top = [
  "empty.png",
  "T-1.png",
  "T-2.png",
  "T-3.png",
  "T-4.png",
  "T-5.png",
  "T-6.png",
  "T-7.png",
  "T-8.png",
  "T-9.png",
  "T-10.png",
];

export default function MintpadContainerDetopia({ prepareMint }) {
  // Hooks and Contexts
  const { isConnected } = useAccount();
  const { chain } = useNetwork();
  const { project } = useContext(MintContextTockable);

  return (
    <main>
      <NavbarMintpad />
      <div className="flex justify-center p-4">
        <div className="basis-full">
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
                <SwitchNetworkButton
                  forDeploy={false}
                  project={project.chainData}
                />
              </div>
            </div>
          )}
          <div className="rounded-2xl p-4 mt-8 bg-tock-semiblack">
            <MintpadDappDetopia
              lands={lands}
              layers={["block", "front", "top", "side"]}
              fileNames={[block, front, top, side]}
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
                  <SwitchNetworkButton
                    forDeploy={false}
                    project={project.chainData}
                  />
                </div>
              )}

              {isConnected && chain.id === project.chainData.chainId && (
                <div>
                  <p className="text-tock-orange text-sm mx-4 mt-10 mb-6 text-center p-2 border rounded-xl border-tock-orange">
                    minting is not available at this moment.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
