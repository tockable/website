"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";
import { updateProject } from "@/actions/launchpad/projects";
import Modal from "@/components/design/modal";
import Button from "@/components/design/button";
import Loading from "@/components/loading/loading";

export default function DeployRolesModal({
  onClose,
  project,
  abi,
  writeArgs,
  roles,
}) {
  const [success, setSuccess] = useState(false);
  const [failed, setFailed] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [enableWrite, setEnableWrite] = useState(false);
  const [redirecting, setRedirecing] = useState(false);

  const router = useRouter();

  const proceed = () => {
    setRedirecing(true);
    router.push(`/creator/launchpad/${project.uuid}/sessions`);
  };

  const { config } = usePrepareContractWrite({
    address: project.contractAddress,
    abi: abi,
    functionName: "setRoles",
    args: [writeArgs],
    enabled: enableWrite,
  });

  const { data, write, isError, error, isLoading } = useContractWrite(config);
  const uwt = useWaitForTransaction({ hash: data?.hash });

  useEffect(() => {
    if (!abi || !abi.length) return;
    setEnableWrite(true);
  }, [abi]);

  useEffect(() => {
    if (!uwt.isSuccess) {
      setSuccess(false);
      return;
    }

    (async () => {
      try {
        const { creator, uuid } = project;
        await updateProject(creator, { uuid, roles, roleDeployed: true });
        setSuccess(true);
      } catch (err) {
        setFailed(true);
      }
    })();

    setUpdating(false);
  }, [uwt.isSuccess]);

  return (
    <Modal isOpen={true} onClose={onClose}>
      <div className="flex basis-3/4 px-4">
        <div className="flex flex-col w-full">
          <h1 className="text-tock-green font-bold text-xl mt-4 mb-6 ">
            deploy roles
          </h1>
          <div className="mb-6">
            {!success && (
              <div>
                <p className="text-tock-orange text-xs font-normal">
                  please do not close this window until see the success
                  message...
                </p>
                <div className="flex justify-center my-4">
                  <Button
                    variant="primary"
                    type="button"
                    disabled={isLoading || uwt.isLoading || updating || !write}
                    onClick={() => {
                      setUpdating(true);
                      write?.();
                    }}
                  >
                    {(isLoading || uwt.isLoading || updating) && (
                      <Loading
                        isLoading={isLoading || uwt.isLoading || updating}
                        size={10}
                      />
                    )}
                    {!isLoading && !uwt.isLoading && !updating && !success && (
                      <p>sign to deploy roles</p>
                    )}
                  </Button>
                </div>
              </div>
            )}
            {success && (
              <div>
                <p className="text-tock-green text-sm mt-2">
                  roles successfully deployed.
                </p>
                <div className="flex justify-center my-6">
                  <Button
                    variant="primary"
                    onClick={proceed}
                    disabled={redirecting}
                  >
                    {redirecting ? (
                      <Loading isLoading={redirecting} size={10} />
                    ) : (
                      "Proceed"
                    )}
                  </Button>
                </div>
              </div>
            )}

            {isError && (
              <p className="text-tock-red text-sm mt-2">{error.name}</p>
            )}
            {failed && (
              <p className="text-tock-red text-sm mt-2">
                something went wrong, please try again.
              </p>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
}
