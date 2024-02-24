"use client";

import { useState, useEffect } from "react";

import { useRouter } from "next/navigation";
import { useAccount } from "wagmi";
import { getAllProjects } from "@/actions/launchpad/dashboard";
import Loading from "@/components/loading/loading";
import NewProjectModal from "./modal-new-project";
import ProjectPreview from "./project-preview";
import Button from "@/components/design/button";

export default function CreatorDashboard() {
  const { address, isConnected } = useAccount();

  const router = useRouter();
  const [projects, setProjects] = useState([]);
  const [newPojectModalShow, setNewProjectModelShow] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isConnected) {
      getAllProjects(address)
        .then((res) => {
          if (res.success === true) setProjects(res.payload);
          if (res.success === false) setProjects([]);
          setLoading(false);
        })
        .catch(router.refresh());
    }
  }, []);

  const handleShowNewProjectModal = () => setNewProjectModelShow(true);
  const handleCloseNewProjectModal = () => {
    setNewProjectModelShow(false);
  };

  return (
    <>
      {loading ? (
        <Loading isLoading={loading} size={30} variant="page" />
      ) : (
        <div className="relative top-24">
          <div className="flex justify-center items-center">
            <div className="basis-11/12 md:basis-3/4 lg:basis-5/6">
              <div>
                <div className="bg-tock-semiblack rounded-2xl px-8 pt-6 pb-8 mb-4">
                  <h1 className="mb-2 text-xl font-bold text-tock-green">
                    New project
                  </h1>
                  <p className="text-zinc-200 text-sm">
                    {projects.length === 0
                      ? "Launch your first project!"
                      : "Time to launch another project?"}
                  </p>
                  <div className="flex justify-center mt-12">
                    <Button
                      variant="primary"
                      type="button"
                      onClick={handleShowNewProjectModal}
                    >
                      + Launch new project
                    </Button>

                    <div>
                      {newPojectModalShow && (
                        <NewProjectModal
                          isOpen={true}
                          onClose={handleCloseNewProjectModal}
                        />
                      )}
                    </div>
                  </div>
                </div>
                <div className="mb-4">
                  <h1 className="border-b border-tock-green pb-2 mb-2 mt-6 text-xl font-bold text-tock-green">
                    Projects
                  </h1>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 mt-6">
                    {projects.map((project, i) => (
                      <div key={"project_" + i}>
                        <ProjectPreview project={project} />
                      </div>
                    ))}
                  </div>
                  {!projects.length && (
                    <div className="text-center text-zinc-500 text-xs">
                      You don't have any projects yet
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
