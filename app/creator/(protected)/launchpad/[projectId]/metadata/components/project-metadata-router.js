"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { fetchProjectByUUID } from "@/actions/launchpad/projects";
import ProjectMetadataFormRegular from "./project-metadata-form-regular";
import ProjectMetadataFormTockable from "./project-metadata-form-tockable";
import DeployedMetadataView from "./deployed-metadata-view";
import Fade from "@/components/design/fade/fade";
import Loading from "@/components/loading/loading";

export default function ProjectMetadataRouter({ params }) {
  const [project, setProject] = useState(null);
  const session = useSession();
  const [loadingFailed, setLoadingFailed] = useState(false);

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
          {!project.isDeployed && (
            <Fade show={!project.isDeployed}>
              <div className="basis-11/12 bg-tock-semiblack rounded-2xl p-4 mb-4">
                <div className="flex justify-center items-center h-24 text-sm text-tock-orange">
                  You need to deploy the contract first.
                </div>
              </div>
            </Fade>
          )}

          {project.isDeployed &&
            ((project.hasOwnProperty("cids") && project.cids.length === 0) ||
              (project.hasOwnProperty("cid") && project.cid.length === 0)) && (
              <>
                {(project.dropType === "tockable" ||
                  project.dropType === "temp") && (
                  <ProjectMetadataFormTockable _project={project} />
                )}
                {(project.dropType === "regular" ||
                  project.dropType === "mono") && (
                  <ProjectMetadataFormRegular _project={project} />
                )}
              </>
            )}
          {project.isDeployed &&
            ((project.cids && project.cids.length > 0) ||
              (project.cid && project.cid.length > 0)) && (
              <Fade
                show={
                  (project.cids && project.cids.length > 0) ||
                  (project.cid && project.cid.length > 0)
                }
              >
                <DeployedMetadataView project={project} />
              </Fade>
            )}
        </>
      )}
    </>
  );
}
