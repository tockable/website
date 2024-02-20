"use client";

import { usePathname } from "next/navigation";
import { extractSlug } from "@/utils/string-utils";
import Link from "next/link";

export default function ProjectNavigation() {
  return (
    <div className="flex justify-center mb-10">
      <nav className="flex flex-col gap-2 text-sm text-tock-green w-48 mx-4">
        <NavItem name="Details" route="details" />
        <NavItem name="Contract" route="contract" />
        <NavItem name="Metadata" route="metadata" />
        <NavItem name="Roles" route="roles" />
        <NavItem name="Sessions" route="sessions" />
        <NavItem name="Publish" route="publish" />
        <NavItem name="Actions" route="actions" />
      </nav>
    </div>
  );
}

function NavItem({ name, route }) {
  const pathname = usePathname();
  const currentRoute = extractSlug(pathname);

  const colorClass =
    currentRoute === route
      ? "bg-zinc-700"
      : "bg-tock-black hover:bg-tock-semiblack hover:bg-zinc-500";
  return (
    <Link
      className={`transition duration-200 rounded-xl h-10 border border-zinc-700 text-xs flex justify-center items-center ${colorClass}`}
      href={route}
    >
      {name}
    </Link>
  );
}
