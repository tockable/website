"use server";

import { getAllChats } from "@/actions/support/support";
import ChatSection from "./chat-section";
import { Suspense } from "react";

export default async function AdminSupportSection() {
  const res = await getAllChats();
  return (
    <Suspense>
      <ChatSection {...res} />;
    </Suspense>
  );
}
