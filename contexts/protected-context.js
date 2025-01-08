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
    if (!isConnected) router.push("/creator/auth");

    if (isConnected && session.data) {
      if (session.data?.user.address.toLowerCase() !== address.toLowerCase()) {
        sessionStorage.setItem("tock", `/dashboard`);
        router.push("/creator/auth");
      } else {
        setLoading(false);
      }
    }
  }, [address, session]);

  return (
    <>
      {loading ? (
        <div className="flex justify-center items-center h-24">
          <Loading isLoading={loading} size={30} />
        </div>
      ) : (
        <div>
          {isConnected ? (
            <div>{children}</div>
          ) : (
            <Loading isLoading={true} size={30} variant="page" />
          )}
        </div>
      )}
    </>
  );
}
