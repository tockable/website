import Link from "next/link";
import DiscordSvg from "@/svgs/social-svgs/DiscordSvg";
import TwitterSvg from "@/svgs/social-svgs/TwitterSvg";
import { SOCIAL, TOCKBALE_VERSION } from "@/tock.config";

export default function Footer() {
  return (
    <footer className="text-center text-zinc-600 text-xs h-48 mt-32 mb-10">
      <div className="flex flex-row gap-10 md:gap-20 lg:gap-32 justify-center">
        <Link href={SOCIAL.twitter}>
          <TwitterSvg
            color="#3f3f46"
            className="w-6 hover:opacity-50 transition ease-in-out duration-200"
          />
        </Link>
        <Link href={SOCIAL.discord}>
          <DiscordSvg
            color="#3f3f46"
            className="w-6 hover:opacity-50 transition ease-in-out duration-200"
          />
        </Link>
      </div>
      <p className="mt-24">&copy;2024 Tockable. All rights reserved.</p>
      <p>v{TOCKBALE_VERSION}</p>
    </footer>
  );
}
