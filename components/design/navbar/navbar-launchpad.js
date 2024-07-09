"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";
import TockConnectButton from "@/components/tockConnectButton";
import { useAccount, useDisconnect } from "wagmi";
import TockableLogo from "@/svgs/logo";
import { IoIosLogOut } from "react-icons/io";

export default function NavbarLaunchpad() {
  const { disconnectAsync } = useDisconnect();
  const { isConnected } = useAccount();
  async function handleSignout() {
    disconnectAsync();
    signOut({ callbackUrl: "/" });
  }

  return (
    <nav className="fixed top-0 p-2 z-10 h-18 w-full">
      <div className="flex rounded-2xl h-full bg-zinc-800/70 backdrop-blur-sm border border-tock-black w-full p-1">
        <div className="flex-auto">
          <Link
            className="md:w-40 flex items-center rounded-xl md:hover:bg-tock-black transition duration-200"
            href="/"
          >
            <TockableLogo className="rounded-xl h-12" />
            <span className="hidden sm:flex font-bold text-zinc-400 text-lg mx-2">
              Tockable
            </span>
          </Link>
        </div>
        <div className="flex text-sm">
          <Link
            className="flex mx-1 items-center transition hover:bg-tock-black duration-200 text-zinc-300 font-bold py-2 px-2 rounded-xl focus:outline-none focus:shadow-outline active:text-white"
            href="/docs/drop-types"
            target="_blank"
            rel="noopener noreferrer"
          >
            docs
          </Link>
          <Link
            className="flex mx-1 items-center transition hover:bg-tock-black duration-200 text-zinc-300 font-bold py-2 px-2 rounded-xl focus:outline-none focus:shadow-outline active:text-white"
            href="/creator/dashboard"
          >
            dashboard
          </Link>
          <div className="hidden md:flex">
            <TockConnectButton />
          </div>
          {isConnected && (
            <div className="flex items-center">
              <button
                onClick={() => handleSignout()}
                className="p-8 mx-1 text-center transition text-sm duration-200 text-gray-500 hover:text-tock-red py-2 px-2 focus:outline-none focus:shadow-outline active:text-tock-red"
              >
                <IoIosLogOut />
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
