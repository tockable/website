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
                  TXP from collecting
                </h1>
                <div className="my-4 text-sm">
                  <div className="flex flex-col items-center md:flex-row">
                    <p className="my-4 text-zinc-300 flex-auto">
                      NFTs minted form Tockable contracts:
                    </p>
                    <p
                      className={`w-24 text-center text-tock-black p-2 ${
                        points.tockableMinted > 0
                          ? "bg-tock-green"
                          : "bg-zinc-400"
                      } rounded-xl`}
                    >
                      {points.tockableMinted * TXP.tockable}TXP
                    </p>
                  </div>
                  <div className="flex flex-col items-center md:flex-row">
                    <p className="my-4 text-zinc-300 flex-auto">
                      NFTs minted form Regular contracts:
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
                  TXP from creating
                </h1>
                <div className="my-4 text-sm">
                  <div className="flex flex-col items-center md:flex-row">
                    <p className="my-4 text-zinc-300 flex-auto">
                      Deploying Tockable contracts with at least 5 mints
                    </p>
                    <p
                      className={`w-24 text-center text-tock-black p-2 ${
                        points.elligibleTockableContracts.length > 0
                          ? "bg-tock-green"
                          : "bg-zinc-400"
                      } rounded-xl`}
                    >
                      {points.elligibleTockableContracts.length *
                        TXP.contractTockable}
                      TXP
                    </p>
                  </div>
                  <div className="flex flex-col items-center md:flex-row">
                    <p className="my-4 text-zinc-300 flex-auto">
                      Deploying Regular contracts with at least 5 mints
                    </p>
                    <p
                      className={`w-24 text-center text-tock-black p-2 ${
                        points.elligibleRegularContracts.length > 0
                          ? "bg-tock-green"
                          : "bg-zinc-400"
                      } rounded-xl`}
                    >
                      {points.elligibleRegularContracts.length *
                        TXP.contractRegular}
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
                      {points.elligibleRegularContracts.length *
                        TXP.contractRegular +
                        points.elligibleTockableContracts.length *
                          TXP.contractTockable +
                        points.tockableMinted * TXP.tockable +
                        points.regularMinted * TXP.regular}
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
