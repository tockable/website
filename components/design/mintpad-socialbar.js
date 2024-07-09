import Link from "next/link";
import { FaDiscord } from "react-icons/fa";
import { FaSquareXTwitter } from "react-icons/fa6";
import { TbWorld } from "react-icons/tb";
export default async function MintpadSocialbar({ project }) {
  return (
    <div className="mb-4 flex flex-row items-center border border-zinc-600 rounded-xl px-4 py-2">
      <p className="text-xs text-start text-zinc-400 flex-auto">See on:</p>
      <div className="flex gap-3 text-2xl">
        <Link
          className={`${
            project?.twitter.length > 0
              ? "hover:opacity-50 text-zinc-400 transition duration-200 "
              : "text-zinc-700 pointer-events-none"
          } `}
          href={`https://twitter.com/${project.twitter}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <FaSquareXTwitter />
        </Link>

        <Link
          href={`https://discord.gg/${project.discord}`}
          className={`${
            project?.discord.length > 0
              ? "hover:opacity-50 text-zinc-400 transition duration-200 "
              : "text-zinc-700 pointer-events-none"
          } `}
          target="_blank"
          rel="noopener noreferrer"
        >
          <FaDiscord />
        </Link>

        <Link
          disabled={true}
          href={`https://${project.website}`}
          className={`${
            project?.website.length > 0
              ? "hover:opacity-50 text-zinc-400 transition duration-200"
              : "text-zinc-700 pointer-events-none"
          } `}
          target="_blank"
          rel="noopener noreferrer"
        >
          <TbWorld />
        </Link>
      </div>
    </div>
  );
}
