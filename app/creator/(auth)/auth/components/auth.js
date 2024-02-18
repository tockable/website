"use client";

import { useState, useEffect } from "react";
import SignInWithEthereum from "./signin-with-ethereum";
import Loading from "@/components/loading/loading";

export default function Auth() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <div>
      {!mounted && <Loading isLoading={!mounted} variant={"page"} size={20} />}
      {mounted && <SignInWithEthereum />}
    </div>
  );
}
