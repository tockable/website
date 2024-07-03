import Link from "next/link";
import { SOCIAL, TOCKABLE_VERSION } from "@/tock.config";
import { FaGithub, FaDiscord } from "react-icons/fa";
import { FaSquareXTwitter } from "react-icons/fa6";

export default function Footer() {
  return (
    <footer className="text-center text-zinc-600 text-xs h-48 mt-32 mb-10">
      <div className="flex flex-row gap-5 md:gap-10 justify-center">
        <Link
          className="hover:opacity-50 transition duration-200 text-2xl text-zinc-700"
          href={SOCIAL.twitter}
          target="_blank"
          rel="noopener noreferrer"
        >
          <FaSquareXTwitter />
        </Link>
        <Link
          href={SOCIAL.discord}
          className="hover:opacity-50 transition duration-200 text-2xl text-zinc-700"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FaDiscord />
        </Link>
        <Link
          href="https://github.com/tockable"
          className="hover:opacity-50 transition duration-200 text-2xl text-zinc-700"
        >
          <FaGithub />
        </Link>
      </div>
      <p className="mt-24">&copy;2024 Tockable. All rights reserved.</p>
      <p>v{TOCKABLE_VERSION}</p>
    </footer>
  );
}
