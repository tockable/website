"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Exo_2,
  Bebas_Neue,
  Anton,
  Lilita_One,
  Ubuntu_Mono,
} from "next/font/google";

const exo = Exo_2({ subsets: ["latin"], weight: ["900"] });
const dela = Bebas_Neue({ subsets: ["latin"], weight: ["400"] });
const anton = Anton({ subsets: ["latin"], weight: ["400"] });
const lilita = Lilita_One({ subsets: ["latin"], weight: ["400"] });
const ub = Ubuntu_Mono({ subsets: ["latin"], weight: ["400"] });

export default function TockBanner({ scrollToRef }) {
  const scrollTo = (e) => {
    e.preventDefault();
    const yOffset = -250;
    const y =
      scrollToRef.current.getBoundingClientRect().top +
      window.scrollY +
      yOffset;
    window.scrollTo({ top: y, behavior: "smooth" });
  };

  const firstWord = [
    <span className={`text-tock-green font-bold ${dela.className}`}>
      empower
    </span>,

    <div className={`text-tock-orange text-4xl ${ub.className}`}>
      &#123; _parameterize &#125;
    </div>,
    <span className="text-tock-green">tock</span>,
    <span className={`text-white font-bold ${dela.className}`}>choose</span>,
    <span className={`text-blue-400 font-bold ${anton.className}`}>
      <i>D e s i g n</i>
    </span>,
    <span className={`text-yellow-200 font-bold ${lilita.className}`}>
      personal
      <span className="text-blue-600">i</span>
      <span className="text-green-600">z</span>
      <span className="text-red-600">e</span>
    </span>,
    <span className={`text-yellow-200 font-bold bg-red-600 ${dela.className}`}>
      RULE
    </span>,
    <span
      className={`text-tock-blue font-bold line-through decoration-tock-red ${exo.className}`}
    >
      mint
    </span>,
  ];

  const secondWord = [
    <span className={`text-tock-red font-bold ${dela.className}`}>your</span>,
    <span className={`text-orange-400 font-bold ${lilita.className}`}>
      dynamic
    </span>,
    <span className="text-tock-blue">
      u<span className="text-tock-green">n</span>ique
    </span>,
  ];
  const thirdWord = [
    <span className="rounded-2xl bg-yellow-300 text-4xl p-3">nfts</span>,
    <span className="bg-sky-200 text-4xl p-3">collection</span>,

    <span
      className={`underline decoration-blue-900 text-white ${exo.className}`}
    >
      assets
    </span>,
    <span className="text-purple-400">tokens</span>,
  ];

  function Tock() {
    return <>{firstWord[tock]}</>;
  }
  function Your() {
    return <>{secondWord[your]}</>;
  }
  function Token() {
    return <>{thirdWord[token]}</>;
  }

  const [tock, setTock] = useState(0);
  const [your, setYour] = useState(0);
  const [token, setToken] = useState(0);

  function nextFirstWord() {
    if (tock + 1 < firstWord.length) setTock(tock + 1);
    else setTock(0);
  }

  function prevFirstWord() {
    if (tock - 1 >= 0) setTock(tock - 1);
    else setTock(firstWord.length - 1);
  }

  function nextSecondWord() {
    if (your + 1 < secondWord.length) setYour(your + 1);
    else setYour(0);
  }

  function prevSecondWord() {
    if (your - 1 >= 0) setYour(your - 1);
    else setYour(secondWord.length - 1);
  }

  function nextThirdWord() {
    if (token + 1 < thirdWord.length) setToken(token + 1);
    else setToken(0);
  }

  function prevThirdWord() {
    if (token - 1 >= 0) setToken(token - 1);
    else setToken(thirdWord.length - 1);
  }
  return (
    <div>
      <div className="pt-[10vh] flex flex-col xl:flex-row" /*md:gap-[10vw]*/>
        <div className="min-w-max md:w-full mb-10 flex flex-col">
          <p className="font-bold text-6xl text-center xl:text-start h-[4rem]">
            <Tock />
          </p>
          <p className="font-bold text-6xl text-center xl:text-start h-[4rem]">
            <Your />
          </p>
          <p className="font-bold text-6xl text-center xl:text-start h-[4rem]">
            <Token />
          </p>
          <p
            className={`${dela.className} font-bold text-3xl sm:text-5xl text-zinc-200 text-center mt-6 xl:text-start h-[4rem]`}
          >
            with tockable technology
          </p>
        </div>

        <div className="flex flex-col grow justify-center xl:mr-[20%]">
          <div className="flex justify-center select-none">
            <button
              className="mt-1 mb-1 border border-zinc-500 transition ease-in-out mx-4 hover:bg-zinc-600 duration-200 bg-tock-black text-zinc-400 font-bold py-2 px-4 rounded-2xl focus:outline-none focus:shadow-outline active:text-white"
              onClick={prevFirstWord}
            >
              &lt;
            </button>

            <button
              className="mt-1 mb-1 border border-zinc-500 transition ease-in-out mx-4 hover:bg-zinc-600 duration-200 bg-tock-black text-zinc-400 font-bold py-2 px-4 rounded-2xl focus:outline-none focus:shadow-outline active:text-white"
              onClick={nextFirstWord}
            >
              &gt;
            </button>
          </div>
          <div className="flex justify-center select-none">
            <button
              className="mt-1 mb-1 border border-zinc-500 transition ease-in-out mx-4 hover:bg-zinc-600 duration-200 bg-tock-black text-zinc-400 font-bold py-2 px-4 rounded-2xl focus:outline-none focus:shadow-outline active:text-white"
              onClick={prevSecondWord}
            >
              &lt;
            </button>

            <button
              className="mt-1 mb-1 border border-zinc-500 transition ease-in-out mx-4 hover:bg-zinc-600 duration-200 bg-tock-black text-zinc-400 font-bold py-2 px-4 rounded-2xl focus:outline-none focus:shadow-outline active:text-white"
              onClick={nextSecondWord}
            >
              &gt;
            </button>
          </div>
          <div className="flex justify-center select-none">
            <button
              className="mt-1 mb-1 border border-zinc-500 transition ease-in-out mx-4 hover:bg-zinc-600 duration-200 bg-tock-black text-zinc-400 font-bold py-2 px-4 rounded-2xl focus:outline-none focus:shadow-outline active:text-white"
              onClick={prevThirdWord}
            >
              &lt;
            </button>

            <button
              className="mt-1 mb-1 border border-zinc-500 transition ease-in-out mx-4 hover:bg-zinc-600 duration-200 bg-tock-black text-zinc-400 font-bold py-2 px-4 rounded-2xl focus:outline-none focus:shadow-outline active:text-white"
              onClick={nextThirdWord}
            >
              &gt;
            </button>
          </div>

          <div className="flex grow justify-center mt-2">
            <Link
              href="/explore/base"
              target="_blank"
              rel="noopener noreferrer"
            >
              <button className="mt-14 w-56 transition bg-blue-600 duration-200 text-tock-blue hover:bg-blue-300 font-bold py-2 px-4 rounded-xl focus:outline-none focus:shadow-outline active:text-white">
                Explore
              </button>
            </Link>
          </div>
          <div className="flex grow justify-center mt-4 text-sm text-zinc-400">
            OR
          </div>
          <div className="flex grow justify-center">
            <Link href="/creator/dashboard">
              <button className="mt-4 mx-4 w-56 transition hover:bg-tock-darkgreen duration-200 bg-tock-green text-tock-semiblack font-bold py-2 px-4 rounded-xl focus:outline-none focus:shadow-outline active:text-white">
                Launch yours!
              </button>
            </Link>
          </div>

          <div className="flex grow justify-center mt-2">
            <button
              onClick={scrollTo}
              className="w-56 transition duration-200 hover:text-orange-300 text-tock-orange text-sm rounded-xl focus:outline-none focus:shadow-outline active:text-white"
            >
              Learn more {">"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
