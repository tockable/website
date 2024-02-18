"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useAccount } from "wagmi";
import { fetchProjectByUUID } from "@/actions/launchpad/projects";
import Loading from "@/components/loading/loading";
import { updateProject } from "@/actions/launchpad/projects";
import Fade from "@/components/design/fade/fade";
import Button from "@/components/design/button";

export default function ProjectPublish({ params }) {
  const session = useSession();
  const { address } = useAccount();

  const [isWriting, setWriting] = useState(false);
  const [loadingFailed, setLoadingFailed] = useState(false);
  const [successPublish, setSuccessPublish] = useState(false);
  const [successUnpublish, setSuccessUnpublish] = useState(false);
  const [error, setError] = useState(false);
  const [project, setProject] = useState(null);

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

  async function callPublishProject() {
    setWriting(true);
    try {
      setError(false);
      setSuccessUnpublish(false);
      setSuccessPublish(false);

      const { uuid } = project;

      const updatedProject = await updateProject(address, {
        uuid,
        isPublished: true,
      });

      setSuccessPublish(true);
      setProject(updatedProject);
    } catch (err) {
      setError(true);
    }
    setWriting(false);
  }

  async function callUnpublishProject() {
    setWriting(true);
    try {
      setError(false);
      setSuccessUnpublish(false);
      setSuccessPublish(false);

      const { uuid } = project;
      const updatedProject = await updateProject(address, {
        uuid,
        isPublished: false,
      });


      setSuccessUnpublish(true);
      setProject(updatedProject);
    } catch (err) {
      setError(true);
    }
    setWriting(false);
  }

  return (
    <>
      {!project ? (
        <>
          {!loadingFailed ? (
            <div className="flex h-64 justify-center items-center">
              <Loading isLoading={!project} size={30} />
            </div>
          ) : (
            <Fade show={project.isDeployed}>
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
        <Fade show={project}>
          <div className="basis-11/12 bg-tock-semiblack rounded-2xl p-4 mb-4">
            <h1 className="text-tock-green font-bold text-xl mt-4 mb-6 ">
              Publishment
            </h1>
            {project.slug == 0 && (
              <p className="text-tock-orange text-xs font-normal my-4">
                -For publishing the project, you should choose a slug in "
                <span className="text-tock-green">Details</span>" secion.
              </p>
            )}
            {project.sessions?.length == 0 && (
              <p className="text-tock-orange text-xs font-normal my-4">
                -For publishing the project, you should at least add a session
                for minting.
              </p>
            )}

            {project.roles?.length == 0 && (
              <p className="text-tock-orange text-xs font-normal my-4">
                -For publishing the project, you should at least add a role for
                minting.
              </p>
            )}
            {project.sessions?.length > 0 &&
              project.roles?.length > 0 &&
              project.slug.length > 0 && (
                <div>
                  {project.isPublished === false && (
                    <div>
                      <p className="text-tock-orange text-xs my-4">
                        Status: Unpublished
                      </p>
                      <p className="text-sm text-zinc-400 mb-10 mt-2">
                        Publishing porject makes the mintpad of the project
                        available to the public.
                      </p>
                    </div>
                  )}
                  {project.isPublished === true && (
                    <div>
                      <p className="text-tock-green text-xs my-4">
                        Status: Published
                      </p>
                      <p className="text-sm text-zinc-400 mb-10 mt-2">
                        Project mint page is live and publicly accessible via{" "}
                        <Link
                          className="font-bold text-sm text-blue-400 hover:text-blue-300 hover:cursor-pointer"
                          href={`/c/${project.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {`https://tockable.xyz/c/${project.slug}`}
                        </Link>
                      </p>
                      <p className="text-sm text-zinc-400 mb-10 mt-4">
                        <span className="text-tock-orange font-bold">
                          IMPORTANT:
                        </span>{" "}
                        don't forget to set the active session at the times you
                        specified from the{" "}
                        <span className="text-blue-400">
                          "actions" -&gt; "set active session"
                        </span>
                        , otherwise your mint will not be activated. Currently,
                        the platform does not do this automatically, but we are
                        working on it.
                      </p>
                    </div>
                  )}
                  {project.isPublished === false && (
                    <Button
                      disabled={project.isPublished === true || isWriting}
                      variant="primary"
                      onClick={() => {
                        callPublishProject();
                      }}
                    >
                      {isWriting ? (
                        <Loading size={10} isLoading={isWriting} />
                      ) : (
                        "Publish project"
                      )}
                    </Button>
                  )}
                  {project.isPublished === true && (
                    <Button
                      disabled={project.isPublished === false || isWriting}
                      variant="secondary"
                      onClick={() => {
                        callUnpublishProject();
                      }}
                    >
                      {isWriting ? (
                        <Loading size={10} isLoading={isWriting} />
                      ) : (
                        "Unpublish project"
                      )}
                    </Button>
                  )}
                  {successPublish && (
                    <p className="mt-2 text-tock-green text-xs">
                      Project published successfully"
                    </p>
                  )}
                  {successUnpublish && (
                    <p className="mt-2 text-tock-green text-xs">
                      Project unpublished successfully
                    </p>
                  )}
                  {error && (
                    <p className="mt-2 text-tock-red text-xs">
                      Something went wrong, please try again.
                    </p>
                  )}
                </div>
              )}
          </div>
        </Fade>
      )}
    </>
  );
}
