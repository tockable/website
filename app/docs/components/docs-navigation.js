"use client";

import { usePathname } from "next/navigation";
import { extractSlug } from "@/utils/string-utils";
import Link from "next/link";

const contents = [
  // { name: "About Tockable", route: "about-tockable" },
  { name: "Drop types", route: "drop-types" },
  {
    name: "Launch Regular NFT collection",
    route: "launch-regular-nft-collection",
  },
  {
    name: "Launch Tockable NFT collection",
    route: "launch-tockable-nft-collection",
  },
  { name: "Tockable metadata", route: "tockable-metadata" },
  { name: "Contract actions", route: "contract-actions" },
  { name: "Tockable Points (TXP)", route: "tockable-xp" },
  { name: "Tockable Fees", route: "tockable-fees" },
];
export default function DocsNavigation() {
  return (
    <div className="flex mb-10">
      <nav className="flex flex-col gap-1 text-xs text-tock-green w-64 border-r border-zinc-500 h-[80vh] mx-4">
        {contents.map((c, i) => (
          <div key={"doc_" + i}>
            <DocNavItem name={c.name} route={c.route} />
          </div>
        ))}
      </nav>
    </div>
  );
}

function DocNavItem({ name, route }) {
  const pathname = usePathname();
  const currentRoute = extractSlug(pathname);

  const colorClass =
    currentRoute === route
      ? "text-tock-blue bg-tock-semiblack"
      : "bg-tock-black hover:bg-tock-semiblack hover:bg-zinc-700";
  return (
    <Link
      className={`w-60 block transition duration-100 rounded-lg p-2 text-xs ${colorClass}`}
      href={route}
    >
      {name}
    </Link>
  );
}
