"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { SUPPORTED_CHAINS } from "@/tock.config";
import WagmiProvider from "@/contexts/wagmi-provider";
import NavbarMintpad from "@/components/design/navbar/navbar-mintpad";
import Footer from "@/components/design/footer";
// import Scroller from "@/components/scroller";
import Support from "@/app/support";
import CollectionSkletton from "./components/collection-skletton";

export default function ExploreLayout({ params, children }) {
  const router = useRouter();
  const [selectedChain, setSelectedChain] = useState(params.chain);
  const [changePage, setChangePage] = useState(false);
  const onChangeChain = (e) => setSelectedChain(e.target.value);
  const sklettonNumber = [0, 1, 2, 3, 4, 5];

  useEffect(() => {
    if (selectedChain === params.chain) return;
    setChangePage;
    router.push(`${selectedChain}`);
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
            onChange={onChangeChain}
            required
            value={selectedChain}
          >
            {SUPPORTED_CHAINS.map((c, i) => (
              <option key={"chain_" + i} value={c.cleanName}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* <div className="flex justify-center items-center">
            <Scroller />
          </div> */}

        <h1 className="mx-4 mt-8 text-2xl text-tock-green border-b border-tock-green">
          Explore on {selectedChain}
        </h1>
        {/* </div> */}
        <div className="p-4">
          {changePage === true ? (
            <div className="flex justify-center">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 mt-6">
                {sklettonNumber.map((s, i) => (
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
