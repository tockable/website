"use client";

import Modal from "@/components/design/modal";
import { BsTwitterX } from "react-icons/bs";
import Link from "next/link";

const createTweat = (project, mintData) => {
  if (Math.random() >= 0.5) {
    return `https://twitter.com/intent/tweet?text=I've+Just+minted+${
      mintData.quantity
    }+${project.tokenName}&via=Tockable.+Mint+yours+here%3A&url=https%3A%2F%2F${
      process.env.NEXT_PUBLIC_TOCKABLE_TYPE === "testnet" && "testnet."
    }tockable.org%2Fc%2F${project.slug}%3Fref%3D${mintData.address}`;
  }
  return `https://twitter.com/intent/tweet?text=Just+minted+${
    mintData.quantity
  }+${project.tokenName}.+Go+get+yours+before+it's+over%3A&url=https%3A%2F%2F${
    process.env.NEXT_PUBLIC_TOCKABLE_TYPE === "testnet" && "testnet."
  }tockable.org%2Fc%2F${project.slug}%3Fref%3D${mintData.address}`;
};

export default function ShareModal({ onClose, project, mintData }) {
  const tweet = createTweat(project, mintData);

  return (
    <Modal isOpen={true} onClose={onClose}>
      <div className="flex basis-3/4 px-4">
        <div className="flex flex-col w-full">
          <h1 className="text-center text-tock-green font-bold text-xl mt-4 mb-6">
            It's yours!
          </h1>

          <div className="mb-10 rounded-2xl bg-zinc-800 p-4">
            <h2 className="text-center text-sm font-bold text-tock-blue mb-8">
              Share your experience with Tockable
            </h2>

            <div className="flex justify-center gap-2">
              <ShareButton className="text-white" href={tweet}>
                <BsTwitterX />
              </ShareButton>
              {/* <ShareButton className="text-sky-500">
                <FaTelegramPlane />
              </ShareButton>
              <ShareButton>
                <LensSvg />
              </ShareButton>
              <ShareButton>
                <FarcasterSvg />
              </ShareButton> */}
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}

//I Just minted 0 donkey  via @Tockable Mint here: url=https://tockable.org/mmmtest
const ShareButton = ({ className, children, ...props }) => {
  return (
    <Link
      target="_blank"
      rel="noopener noreferrer"
      className={`bg-tock-black text-2xl flex justify-center items-center w-16 h-16 p-2 rounded-xl hover:opacity-50 transition duration-200 ${className}`}
      {...props}
    >
      {children}
    </Link>
  );
};
//%23 = #
