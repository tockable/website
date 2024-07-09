"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";
import TockConnectButton from "@/components/tockConnectButton";
import { useAccount, useDisconnect } from "wagmi";
import TockableLogo from "@/svgs/logo";
import { IoIosLogOut } from "react-icons/io";

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
          {/* <Link
            className="flex mx-1 items-center transition hover:bg-tock-black duration-200 text-zinc-300 font-bold py-2 px-4 rounded-xl focus:outline-none focus:shadow-outline active:text-white"
            href="/dashboard/points"
            target="_blank"
            rel="noopener noreferrer"
          >
            My TXPs
          </Link> */}
          <Link
            className="flex mx-1 text-sm items-center transition hover:bg-tock-black duration-200 text-zinc-300 font-bold py-2 px-2 rounded-xl focus:outline-none focus:shadow-outline active:text-white"
            href={`/explore/${process.env.NEXT_PUBLIC_EXPLORE}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            Explore
          </Link>
          <div>
            <TockConnectButton />
          </div>
          {isConnected && (
            <div className="flex items-center">
              <button
                onClick={() => handleSignout()}
                className="p-8 mx-1 text-center transition text-sm duration-200 text-gray-500 hover:text-tock-red py-2 px-4 focus:outline-none focus:shadow-outline active:text-tock-red"
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
