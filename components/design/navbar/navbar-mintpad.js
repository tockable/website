"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount, useDisconnect } from "wagmi";
import TockableLogo from "@/svgs/logo";

export default function NavbarMintpad() {
  const { disconnectAsync } = useDisconnect();
  const { isConnected } = useAccount();
  async function handleSignout() {
    disconnectAsync();
    signOut({ callbackUrl: "/" });
  }

  return (
    <nav className="fixed left-0 top-0 p-2 z-10 h-18 w-full">
      <div className="flex rounded-2xl h-full w-full">
        <div className="flex-auto">
          <Link
            className="border border-zinc-800 bg-zinc-800/70 backdrop-blur-sm p-1 w-14 sm:w-40 flex items-center rounded-2xl md:hover:bg-tock-black transition duration-200"
            href="/"
          >
            <TockableLogo className="rounded-xl h-12" />
            <span className="hidden sm:flex font-bold text-zinc-400 text-lg mx-2">
              Tockable
            </span>
          </Link>
        </div>
        <div className="border border-zinc-800 flex bg-zinc-800/70 backdrop-blur-sm items-center rounded-2xl px-1">
          <div>
            <ConnectButton chainStatus={"icon"} showBalance={false} />
          </div>
          {isConnected && (
            <div className="flex items-center">
              <button
                onClick={() => handleSignout()}
                className="p-8 mx-1 text-center transition text-sm duration-200 text-gray-500 hover:text-tock-red py-2 px-4 focus:outline-none focus:shadow-outline active:text-tock-red"
              >
                sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
