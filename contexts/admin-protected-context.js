"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useAccount } from "wagmi";
import { checkRole } from "@/actions/admin/admin";
import Loading from "@/components/loading/loading";
import NotFound from "@/components/not-found/not-found";

export default function AdminProtected({ children }) {
  const session = useSession();
  const router = useRouter();

  const { address, isConnected } = useAccount();
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!isConnected) {
      router.push("/creator/auth");
    }

    let adminRole = false;

    checkRole(address).then((res) => {
      if (isConnected && session.data) {
        if (res === false) {
          setNotFound(true);
        }
        setLoading(false);
      }
    });
  }, [address, session]);

  if (loading === true) {
    return (
      <div className="flex justify-center items-center h-24">
        <Loading isLoading={loading} size={30} />
      </div>
    );
  }
  if (notFound === true && loading === false) {
    return (
      <div className="mt-20">
        <NotFound />
      </div>
    );
  }

  return (
    <div>
      {isConnected ? (
        <div>{children}</div>
      ) : (
        <Loading isLoading={true} size={30} variant="page" />
      )}
    </div>
  );
}
