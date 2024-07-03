"use client";

import { useRef } from "react";
import Register from "@/components/waitlist/waitlist-register";
import TockBanner from "@/components/design/tock";
import NavbarHome from "@/components/design/navbar/navbar-home";
import {
  ChainMarqueeRTL,
  ChainMarqueeLTR,
} from "@/components/marquee/chain-marquee";
import Footer from "@/components/design/footer";
import { Bebas_Neue } from "next/font/google";
import Link from "next/link";
// import Scroller from "./scroller";
const dela = Bebas_Neue({ subsets: ["latin"], weight: ["400"] });

export default function FirstPage() {
  const myref = useRef(null);

  return (
    <main className="flex justify-center">
      <NavbarHome />
      <div>
        <div id="banner" className="mt-20">
          <div className="flex justify-center items-center">
            <TockBanner scrollToRef={myref} />
            {/* <Scroller /> */}
          </div>
        </div>
        <div className="mb-32">
          <h1
            className={`${dela.className} p-2 text-tock-green font-bold text-6xl mt-24 md:mt-0 lg:text-6xl text-center`}
          >
            Launch
          </h1>
          <h1
            className={`${dela.className} p-2 text-zinc-300 font-bold text-4xl md:text-6xl lg:text-6xl text-center`}
          >
            on your beloved network
          </h1>
          <div className="flex justify-center my-8">
            <div className="w-[95vw]">
              <ChainMarqueeLTR />
              <ChainMarqueeRTL />
            </div>
          </div>
        </div>
        <h1
          className={`${dela.className} p-2 text-tock-green mt-16 md:mt-32 font-bold text-6xl lg:text-6xl text-center`}
        >
          MAKE
        </h1>
        <h1
          className={`${dela.className} p-2 text-zinc-300 mt-2 mb-4 font-bold text-4xl lg:text-6xl text-center`}
        >
          your collection stand out
        </h1>
        <div id="banner" className="flex justify-center">
          <div className="w-[98%] lg:w-[75%]">
            <div
              ref={myref}
              className="flex flex-col items-center gap-10 md:p-4 justify-center md:flex-row"
            >
              <Card>
                <h1 className="text-tock-red font-bold text-xl mb-2">
                  <span className="text-tock-green">Customizable</span> NFTs
                </h1>
                <p className="text-zinc-200 text-sm">
                  With Tockable, collectors can{" "}
                  <span className="text-tock-green">choose</span> their NFT
                  traits from among available traits provided by the creator to
                  design and mint their favourite asset.
                </p>
              </Card>
              <Card>
                <h1 className="text-tock-green font-bold text-xl mb-2">
                  <span className="text-tock-red">Create</span> your own app
                </h1>
                <p className="text-zinc-200 text-sm">
                  Create, manage and publish your own Dynamic-NFT minter app
                  with a few clicks, totally zero-code.{" "}
                  <Link
                    href="creator/dashboard"
                    className="text-blue-400 hover:text-blue-300"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {" "}
                    try &gt;
                  </Link>
                </p>
              </Card>
            </div>
            <div className="flex flex-col items-center gap-10 md:p-4 justify-center md:flex-row mt-10 mb-44">
              <Card>
                <h1 className="text-tock-green font-bold text-xl mb-2">
                  Flexible <span className="text-tock-red"> contracts</span>
                </h1>
                <p className="text-zinc-200 text-sm">
                  Customizable or random NFTs? Or maybe thinking about{" "}
                  <span className="text-tock-green">unlimited supply</span> (you
                  heard right!). Do you need uniqueness verification? or
                  Different roles, different prices? create the contract with
                  your rules.
                </p>
              </Card>
              <Card>
                <h1 className="text-tock-green font-bold text-xl mb-2">
                  Lowest <span className="text-tock-red">fee</span> in the
                  market
                </h1>
                <p className="text-zinc-200 text-sm">
                  Maximize your revenue with lowest platform fee in the market!
                  <Link
                    href="#"
                    className="text-blue-400 hover:text-blue-300"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {" "}
                    see fees &gt;
                  </Link>
                </p>
              </Card>
            </div>
          </div>
        </div>
        <h1
          className={`${dela.className} p-2 text-tock-green font-bold text-6xl lg:text-6xl text-center`}
        >
          Tockable.xyz
        </h1>
        <h1
          className={`${dela.className} p-2 text-zinc-300 mt-4 font-bold text-4xl lg:text-6xl text-center`}
        >
          a powerful launchpad for your new collection!
        </h1>

        <div id="banner" className="flex justify-center ">
          <Register />
        </div>
        <Footer />
      </div>
    </main>
  );
}

function Card({ children }) {
  return (
    <div className="border-2 border-zinc-400 rounded-xl p-4 w-11/12 md:w-1/2 h-48 transition duration-200 bg-tock-semiblack bg-opacity-70 hover:bg-opacity-100">
      {children}
    </div>
  );
}
