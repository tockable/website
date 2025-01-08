"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { SUPPORTED_CHAINS } from "@/contexts/wagmi-provider";
import WagmiProvider from "@/contexts/wagmi-provider";
import NavbarMintpad from "@/components/design/navbar/navbar-mintpad";
import Footer from "@/components/design/footer";
import Support from "@/app/support";
import CollectionSkletton from "./components/collection-skletton";

// import Scroller from "@/components/scroller";
const FILTERED_CHAIN =
  process.env.NEXT_PUBLIC_TOCKABLE_TYPE === "testnet"
    ? SUPPORTED_CHAINS.filter((chain) => chain.value !== "1")
    : SUPPORTED_CHAINS;

export default function ExploreLayout({ params, children }) {
  const router = useRouter();

  const [selectedChain, setSelectedChain] = useState(params.chain);
  const [changePage, setChangePage] = useState(false);

  useEffect(() => {
    if (selectedChain.toLowerCase() === params.chain.toLowerCase()) return;

    setChangePage(true);

    router.push(`${selectedChain.toLowerCase()}`);
  }, [selectedChain]);

  return (
    <WagmiProvider>
      <NavbarMintpad />
      <div className="mt-20">
        {/* <div id="banner-sm"> */}
        <div className="flex items-center justify-center sm:justify-end px-4">
          <p className="pr-4 shrink-0">Explore on</p>
          <select
            className="text-sm bg-zinc-700 w-full sm:w-44 rounded-xl py-3 px-3 text-gray-200 leading-tight focus:outline-none focus:ring focus:ring-2 focus:ring-zinc-500"
            id="chain"
            name="chain"
            onChange={(e) => setSelectedChain(e.target.value)}
            required
            value={selectedChain}
          >
            {FILTERED_CHAIN.map((c) => (
              <option key={"chain_" + c.value} value={c.network}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* <div className="flex justify-center items-center">
            <Scroller />
          </div> */}

        <h1 className="mx-4 mt-8 text-2xl text-tock-green border-b border-tock-green">
          Explore on{" "}
          {
            FILTERED_CHAIN.find(
              (chain) =>
                chain.network.toLowerCase() === selectedChain.toLowerCase()
            )?.name
          }
        </h1>
        {/* </div> */}
        <div className="p-4">
          {changePage === true ? (
            <div className="flex justify-center">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 mt-6">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div className="shrink-0" key={"skletton_" + i}>
                    <CollectionSkletton />
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <>{children}</>
          )}
        </div>
        <Footer />
      </div>
      <Support />
    </WagmiProvider>
  );
}
