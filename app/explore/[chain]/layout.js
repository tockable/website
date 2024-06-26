"use client";
import NavbarMintpad from "@/components/design/navbar/navbar-mintpad";
import { useRouter } from "next/navigation";
import { SUPPORTED_CHAINS } from "@/tock.config";

import { useState, useEffect } from "react";
import WagmiProvider from "@/contexts/wagmi-provider";
export default function ExploreLayout({ params, children }) {
  const router = useRouter();
  const [selectedChain, setSelectedChain] = useState(params.chain);

  const onChangeChain = (e) => setSelectedChain(e.target.value);

  useEffect(() => {
    if (selectedChain === params.chain) return;
    router.push(`${selectedChain}`);
  }, [selectedChain]);

  return (
    <WagmiProvider>
      <NavbarMintpad />
      <div className="mt-20 p-4">
        <div className="flex items-center justify-center sm:justify-end ">
            <p className="pr-4 shrink-0">Explore on{" "}</p>
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

        {children}
      </div>
    </WagmiProvider>
  );
}
