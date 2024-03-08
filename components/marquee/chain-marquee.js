import Marquee from "react-fast-marquee";
import BaseLogoAndWordmark from "@/svgs/chain-brandkits/Base_wordmark";
import BlastWordmark from "@/svgs/chain-brandkits/Blast_wordmark";
import LineaWordmark from "@/svgs/chain-brandkits/Linea_wordmark";
import PolygonWordmark from "@/svgs/chain-brandkits/Polygon_wordmark";
import Op_logo from "@/svgs/chain-brandkits/Op_logo";
import Op_wordmark from "@/svgs/chain-brandkits/Op_wordmark";
import Mode_logo from "@/svgs/chain-brandkits/Mode_logo";
import Mode_wordmark from "@/svgs/chain-brandkits/Mode_wordmark";
import Ethereum_logo from "@/svgs/chain-brandkits/Ethereum_logo";

export function ChainMarqueeLTR() {
  return (
    <Marquee speed={30} pauseOnHover={true} className="my-4">
      <BlastWordmark className="mx-16 h-14" />
      <div className="flex mx-16">
        <Op_logo />
        <Op_wordmark className="w-44 ml-2" />
      </div>
      <div>
        <PolygonWordmark className="h-12" />
      </div>

      <BaseLogoAndWordmark className="mx-16 h-12" />
      <div className="flex mx-16">
        <Ethereum_logo />
        <div className="flex justify-center items-center font-bold text-4xl ml-2">
          Ethereum
        </div>
      </div>

      <div className="flex mx-16">
        <Mode_logo />
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
        <PolygonWordmark className="h-12" />
      </div>
      <div className="flex mx-16">
        <Ethereum_logo />
        <div className="flex justify-center items-center font-bold text-4xl ml-2">
          Ethereum
        </div>
      </div>
      <BaseLogoAndWordmark className="mx-8 h-12" />
      <BlastWordmark className="mx-16 h-14" />
      <LineaWordmark className="mx-16" />
      <div className="flex mx-16">
        <Op_logo />
        <Op_wordmark className="w-44 ml-2" />
      </div>
      <div className="flex mx-16">
        <Mode_logo />
        <Mode_wordmark className="w-36 ml-2" />
      </div>
    </Marquee>
  );
}
