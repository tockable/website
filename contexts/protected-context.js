"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useAccount } from "wagmi";
import Loading from "@/components/loading/loading";

export default function Protected({ children }) {
  const session = useSession();
  const router = useRouter();

  const { address, isConnected } = useAccount();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isConnected) {
      router.push("/creator/auth");
    }

    if (
      isConnected &&
      session.data &&
      session.data?.user.address.toLowerCase() !== address.toLowerCase()
    ) {
      sessionStorage.setItem("tock", `/dashboard`);
      router.push("/creator/auth");
    } else {
      setLoading(false);
    }
  }, [address]);

  return (
    <>
      {loading ? (
        <Loading isLoading={loading} size={30} />
      ) : (
        <div>{children}</div>
      )}
    </>
  );
}
