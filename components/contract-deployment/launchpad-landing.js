import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useAccount } from "wagmi";
import { fetchProjectByUUID } from "@/actions/launchpad/projects";
import { getContractAbi } from "@/actions/contract/metadata";
import { LaunchpadContext } from "@/contexts/project-context";
import Launchpad from "./launchpad";
import Loading from "../loading/loading";

export default function LaunchpadLanding({ params }) {
  const session = useSession();
  const router = useRouter();
  const { address, isConnected } = useAccount();

  const [project, setProject] = useState(null);
  const [abi, setAbi] = useState(null);
  const [loading, setLoading] = useState(null);

  useEffect(() => {
    if (!isConnected) {
      localStorage.setItem("tock", "/dashboard");
      router.push("/auth");
    }
  }, [isConnected]);

  useEffect(() => {
    if (session.status === "loading") return;
    if (session.status === "unauthenticated") {
      localStorage.setItem("tock", "/dashboard");
      router.push("/auth");
    }

    if (
      isConnected &&
      session.status === "authenticated" &&
      session.data?.user.address.toLowerCase() === address.toLowerCase()
    ) {
      fetchProjectByUUID(address, params.projectId)
        .then((res) => {
          if (res.success === true) setProject(res.payload);
          if (res.success === false) router.push("/dashboard");
        })
        .catch(router.refresh());
    }
  }, [session.status]);

  useEffect(() => {
    if (
      isConnected &&
      session.data &&
      session.data?.user.address.toLowerCase() !== address.toLowerCase()
    ) {
      setLoading(true);
      localStorage.setItem("tock", `/dashboard`);
      router.push("/auth");
    }
  }, [address]);

  async function callGetContractAbi() {
    if (!project) return { success: false };
    const { dropType } = project;
    const dropAbi = await getContractAbi(dropType);
    setAbi(dropAbi);
    return { success: true };
  }

  if (project) {
    return (
      <main>
        {loading && <Loading isLoading={loading} size={30} variant="page" />}
        {!loading && (
          <LaunchpadContext.Provider
            value={{ project, setProject, abi, setAbi, callGetContractAbi }}
          >
            <div className="mt-2">
              <Launchpad />
            </div>
          </LaunchpadContext.Provider>
        )}
      </main>
    );
  }
}
