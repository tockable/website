"use client";

import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { TXP } from "@/tock.config";
import { getTXPOf } from "@/actions/pointing/minted";
import Loading from "@/components/loading/loading";

export default function TXPTables() {
  const { address, isConnected } = useAccount();
  const [loading, setLoading] = useState(true);

  const [points, setPoints] = useState({
    regularMinted: 0,
    tockableMinted: 0,
    elligibleTockableContracts: [],
    elligibleRegularContracts: [],
  });

  useEffect(() => {
    if (!isConnected) return;
    (async () => {
      try {
        const res = await getTXPOf(address);
        setPoints(res);
        setLoading(false);
      } catch (err) {}
    })();
  }, [isConnected]);

  return (
    <div>
      {!isConnected && (
        <p className="text-tock-orange text-sm text-center">
          Please connect wallet
        </p>
      )}
      {isConnected && (
        <>
          {loading ? (
            <div className="h-64 flex justify-center items-center">
              <Loading isLoading={loading} size={30} />
            </div>
          ) : (
            <>
              <div>
                <h1 className="text-tock-green pb-2 border-b border-zinc-600">
                  Collector TXP
                </h1>
                <div className="my-4 text-sm">
                  <div className="flex flex-col items-center md:flex-row">
                    <p className="my-4 text-zinc-300 flex-auto flex gap-2">
                      Total minted NFTs from Tockable contracts:
                      <span className="text-tock-orange">
                        {points.tockableMinted} Minted
                      </span>
                    </p>
                    <p
                      className={`w-24 text-center text-tock-black p-2 ${
                        points.tockableMinted > 0
                          ? "bg-tock-green"
                          : "bg-zinc-400"
                      } rounded-xl`}
                    >
                      {points.tockableMinted * TXP.tockable} TXP
                    </p>
                  </div>
                  <div className="flex flex-col items-center md:flex-row">
                    <p className="my-4 text-zinc-300 flex-auto flex gap-2">
                      Totla minted NFTs from Regular/Edition contracts:
                      <span className="text-tock-orange">
                        {points.regularMinted} Minted
                      </span>
                    </p>
                    <p
                      className={`w-24 text-center text-tock-black p-2 ${
                        points.regularMinted > 0
                          ? "bg-tock-green"
                          : "bg-zinc-400"
                      } rounded-xl`}
                    >
                      {points.regularMinted * TXP.regular}TXP
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-8">
                <h1 className="text-tock-green pb-2 border-b border-zinc-600">
                  Creator TXP
                </h1>
                <div className="my-4 text-sm">
                  <div className="flex flex-col items-center md:flex-row">
                    <p className="my-4 text-zinc-300 flex-auto flex gap-2">
                      Deployed Tockable contracts with {">"} 5 mints
                      <span className="text-tock-orange">
                        {points.elligibleTockableContracts} Deployed
                      </span>
                    </p>
                    <p
                      className={`w-24 text-center text-tock-black p-2 ${
                        points.elligibleTockableContracts > 0
                          ? "bg-tock-green"
                          : "bg-zinc-400"
                      } rounded-xl`}
                    >
                      {points.elligibleTockableContracts * TXP.contractTockable}{" "}
                      TXP
                    </p>
                  </div>
                  <div className="flex flex-col items-center md:flex-row">
                    <p className="my-4 text-zinc-300 flex-auto flex gap-2">
                      Deployed Regular/Edition contracts with {">"} 5 mints
                      <span className="text-tock-orange">
                        {points.elligibleRegularContracts} Deployed
                      </span>
                    </p>
                    <p
                      className={`w-24 text-center text-tock-black p-2 ${
                        points.elligibleRegularContracts > 0
                          ? "bg-tock-green"
                          : "bg-zinc-400"
                      } rounded-xl`}
                    >
                      {points.elligibleRegularContracts * TXP.contractRegular}{" "}
                      TXP
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-8">
                <h1 className="text-tock-green pb-2 border-b border-zinc-600">
                  Total TXP
                </h1>
                <div className="my-4 text-sm">
                  <div className="flex flex-col items-center md:flex-row">
                    <p className="my-4 text-zinc-300 flex-auto">Total TXP</p>
                    <p className="w-24 text-center text-tock-black p-2 bg-tock-green rounded-xl">
                      {points.elligibleRegularContracts * TXP.contractRegular +
                        points.elligibleTockableContracts *
                          TXP.contractTockable +
                        points.tockableMinted * TXP.tockable +
                        points.regularMinted * TXP.regular}{" "}
                      TXP
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}
