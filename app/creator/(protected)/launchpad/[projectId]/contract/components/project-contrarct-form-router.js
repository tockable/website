"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { fetchProjectByUUID } from "@/actions/launchpad/projects";
import ProjectContractFormRegular from "./project-contract-form-regular";
import ProjectContractFormTockable from "./project-contract-form-tockable";
import ProjectContractFormMono from "./project-contract-form-mono";
import DeployedContractView from "./deployed-contract-view";
import Fade from "@/components/design/fade/fade";
import Loading from "@/components/loading/loading";

export default function ProjectContractRouter({ params }) {
  const [project, setProject] = useState(null);
  const [loadingFailed, setLoadingFailed] = useState(false);
  const session = useSession();

  useEffect(() => {
    if (session.status !== "authenticated") return;

    (async () => {
      const res = await fetchProjectByUUID(
        session.data.user.address,
        params.projectId
      );

      if (res.success === true) setProject(res.payload);
      if (res.success === false) setLoadingFailed(true);
    })();
  }, [session]);

  return (
    <>
      {!project ? (
        <>
          {!loadingFailed ? (
            <div className="flex h-64 justify-center items-center">
              <Loading isLoading={!project} size={30} />
            </div>
          ) : (
            <Fade show={loadingFailed}>
              <div className="basis-11/12 bg-tock-semiblack rounded-2xl p-4 mb-4">
                <p className="flex justify-center items-center h-24 text-sm text-tock-red">
                  Something wrong, please refresh the page. If the problem
                  persists, please try again in a few minutes...
                </p>
              </div>
            </Fade>
          )}
        </>
      ) : (
        <>
          {project.isDeployed ? (
            <Fade show={project.isDeployed}>
              <div className="basis-11/12 bg-tock-semiblack rounded-2xl p-4 mb-4">
                <DeployedContractView _project={project} />
              </div>
            </Fade>
          ) : (
            <>
              {(project.dropType === "tockable" ||
                project.dropType === "temp") && (
                <ProjectContractFormTockable _project={project} />
              )}
              {project.dropType === "regular" && (
                <ProjectContractFormRegular _project={project} />
              )}
              {project.dropType === "mono" && (
                <ProjectContractFormMono _project={project} />
              )}
            </>
          )}
        </>
      )}
    </>
  );
}
