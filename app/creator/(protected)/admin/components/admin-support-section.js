"use server";

import { getAllChats } from "@/actions/support/support";

export default async function AdminSupportSection() {
  const allChats = await getAllChats();

  console.log(allChats);
  return <div></div>;
}
