import Link from "next/link";
import TockableLogo from "@/svgs/logo";

export default function Navbar() {
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
        <div className="flex">
          <Link
            className="flex mx-1 text-sm items-center transition hover:bg-tock-black duration-200 text-zinc-300 font-bold py-2 px-4 rounded-xl focus:outline-none focus:shadow-outline active:text-white"
            href="/docs/drop-types"
            target="_blank"
            rel="noopener noreferrer"
          >
            Docs
          </Link>
          <Link
            className="flex mx-1 text-sm items-center transition hover:bg-tock-black duration-200 text-zinc-300 font-bold py-2 px-4 rounded-xl focus:outline-none focus:shadow-outline active:text-white"
            target="_blank"
            rel="noopener noreferrer"
            href={`/explore/${process.env.NEXT_PUBLIC_EXPLORE}`}
          >
            Explore
          </Link>
          <Link
            className="flex my-1 mx-1 text-center transition hover:bg-tock-darkgreen duration-200 bg-tock-green text-tock-semiblack font-bold py-2 px-4 rounded-xl focus:outline-none focus:shadow-outline active:text-white"
            href="/creator/dashboard"
          >
            <p className="flex items-center justify-center sm:hidden">
              Launch!
            </p>
            <p className="hidden sm:flex sm:items-center sm:justify-center">
              Launch project
            </p>
          </Link>
        </div>
      </div>
    </nav>
  );
}
