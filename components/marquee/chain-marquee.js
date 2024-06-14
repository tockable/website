import Image from "next/image";
import Marquee from "react-fast-marquee";
import TaikoWordmark from "@/svgs/chain-brandkits/Taiko_wordmark";
import BaseLogoAndWordmark from "@/svgs/chain-brandkits/Base_wordmark";
import BlastWordmark from "@/svgs/chain-brandkits/Blast_wordmark";
import LineaWordmark from "@/svgs/chain-brandkits/Linea_wordmark";
import PolygonWordmark from "@/svgs/chain-brandkits/Polygon_wordmark";
import Op_logo from "@/svgs/chain-brandkits/Op_logo";
import Op_wordmark from "@/svgs/chain-brandkits/Op_wordmark";
import Mode_logo from "@/svgs/chain-brandkits/Mode_logo";
import Mode_wordmark from "@/svgs/chain-brandkits/Mode_wordmark";
import Ethereum_logo from "@/svgs/chain-brandkits/Ethereum_logo";
import BOBWordMark from "@/svgs/chain-brandkits/BOB_wordmark";

export function ChainMarqueeLTR() {
  return (
    <Marquee speed={30} pauseOnHover={true} className="my-4">
      <BlastWordmark className="h-10" />
      <div className="flex mx-16">
        <Op_logo />
        <Op_wordmark className="w-44 ml-2" />
      </div>
      <div>
        <PolygonWordmark className="h-12" />
      </div>
      <div className="ml-16">
        <Image src="/BEVM_wordmark.webp" height={10} width={150} />
      </div>
      <BaseLogoAndWordmark className="mx-16 h-12" />
      <TaikoWordmark className="mx-18 h-12" />
      <div className="flex mr-8 ml-12 ">
        <Ethereum_logo className="h-12" />
        <div className="flex justify-center items-center font-bold text-4xl ml-2">
          Ethereum
        </div>
      </div>
      <BOBWordMark className="mx-16 h-16" />
      <div className="flex mx-16">
        <Mode_logo className="w-12" />
        <Mode_wordmark className="w-36 ml-2" />
      </div>
      <LineaWordmark className="mx-16" />
    </Marquee>
  );
}

export function ChainMarqueeRTL() {
  return (
    <Marquee pauseOnHover={true} speed={30} direction="right" className="my-4">
      <div>
        <PolygonWordmark className="ml-12 h-12" />
      </div>
      <BOBWordMark className="mx-16 h-16" />
      <BaseLogoAndWordmark className="mx-8 h-12" />
      <BlastWordmark className="h-10" />
      <div className="flex mr-8 ml-12 ">
        <Ethereum_logo className="h-12" />
        <div className="flex justify-center items-center font-bold text-4xl ml-2">
          Ethereum
        </div>
      </div>
      <LineaWordmark className="mx-16" />
      <div className="flex mx-16">
        <Op_logo />
        <Op_wordmark className="w-44 ml-2" />
      </div>
      <TaikoWordmark className="mx-18 h-12" />
      <div className="flex mx-16">
        <Mode_logo className="w-12" />
        <Mode_wordmark className="w-36 ml-2" />
      </div>
      <div className="mx-16">
        <Image src="/BEVM_wordmark.webp" height={10} width={150} />
      </div>
    </Marquee>
  );
}
