"use client";

import { useState, useEffect, createContext } from "react";
import { getContractAbi } from "@/actions/contract/metadata";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Loading from "@/components/loading/loading";
import { fetchProjectByUUID } from "@/actions/launchpad/projects";

export const LaunchpadContext = createContext();

export default function ProjectContext({ params, children }) {
  const session = useSession();
  const router = useRouter();

  const [abi, setAbi] = useState(null);
  const [project, setProject] = useState(null);

  const callGetContractAbi = async () => {
    if (abi) return { success: true };
    const dropAbi = await getContractAbi(project.dropType);
    setAbi(dropAbi);

    return { success: true };
  };

  useEffect(() => {
    if (session.status !== "authenticated") return;

    (async () => {
      try {
        const res = await fetchProjectByUUID(
          session.data.user.address,
          params.projectId
        );

        if (res.success === true) {
          setProject(res.payload);
          console.log(res);
        }

        if (res.success === false) router.push("/creator/dashboard");
      } catch (_) {
        console.log(_);
        router.refresh();
      }
    })();
  }, [session]);

  return (
    <>
      {!project ? (
        <Loading isLoading={!project} size={20} variant="page" />
      ) : (
        <LaunchpadContext.Provider
          value={{ project, setProject, abi, setAbi, callGetContractAbi }}
        >
          {children}
        </LaunchpadContext.Provider>
      )}
    </>
  );
}
