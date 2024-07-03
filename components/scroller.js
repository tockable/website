"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import BOBWordMark from "@/svgs/chain-brandkits/BOB_wordmark";

export default function Scroller() {
  const [margin, setMargin] = useState(0);
  const cns = [0, -86, -172];

  const nextSlide = () => {
    if (margin == cns.length - 1) {
      setMargin(0);
    } else {
      setMargin(margin + 1);
    }
  };

  const prevSlide = () => {
    if (margin == 0) {
      setMargin(cns.length - 1);
    } else {
      setMargin(margin - 1);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => nextSlide(), 2500);
    return () => clearTimeout(timer);
  }, [margin]);

  return (
    <div>
      <div className={`w-[95vw] overflow-x-hidden`}>
        <div
          style={{
            transition: `margin-left 0.2s`,
            marginLeft: `${cns[margin]}vw`,
          }}
        >
          <div className={`flex gap-[1vw]`}>
            <div
              className={`p-4 rounded-xl w-[85vw] shrink-0 bg-zinc-800/40 backdrop-blur-sm h-[80vh] sm:h-[400px]`}
            >
              <div className="flex flex-col sm:flex-row h-full items-center">
                <BOBWordMark className="w-64 h-64 basis-3/4 sm:basis-1/2" />

                <div className="flex flex-col basis-1/4 sm:basis-1/2 justify-center sm:justify-end">
                  <h1>Tockable now supports BOB🔥</h1>
                  <Link
                    className="text-center transition hover:bg-tock-darkgreen duration-200 bg-tock-green text-tock-semiblack font-bold p-4 rounded-xl focus:outline-none focus:shadow-outline active:text-white"
                    href="/c/bobxtockable"
                  >
                    Free mint on BOB🔥
                  </Link>
                </div>
              </div>
            </div>
            <div
              className={`p-4 rounded-xl w-[85vw] shrink-0 bg-zinc-800/40 backdrop-blur-sm `}
            >
              heys
            </div>
            <div
              className={`p-4 rounded-xl w-[85vw] shrink-0 bg-zinc-800/40 backdrop-blur-sm `}
            >
              heyyou
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-center items-center gap-2">
        <button
          className="text-zinc-500 hover:text-zinc-300"
          onClick={prevSlide}
        >
          {"<"}
        </button>
        <div className="flex gap-2">
          {cns.map((c, i) => (
            <span
              onClick={() => setMargin(i)}
              className={`w-2 h-2 rounded-full hover:border hover:cursor-pointer ${
                margin === i ? "bg-zinc-300" : "bg-zinc-500"
              }`}
            ></span>
          ))}
        </div>
        <button
          className="text-zinc-500 hover:text-zinc-300"
          onClick={nextSlide}
        >
          {">"}
        </button>
      </div>
    </div>
  );
}
