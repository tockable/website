"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";
import { updateProject } from "@/actions/launchpad/projects";
import Loading from "@/components/loading/loading";
import Modal from "@/components/design/modal";
import Button from "@/components/design/button";

export default function DeploySessionsModal({
  onClose,
  project,
  abi,
  writeArgs,
  sessions,
}) {
  const [success, setSuccess] = useState(false);
  const [failed, setFailed] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [enableWrite, setEnableWrite] = useState(false);
  const [redirecting, setRedirecing] = useState(false);

  const router = useRouter();

  const proceed = () => {
    setRedirecing(true);
    router.push(`/creator/launchpad/${project.uuid}/publish`);
  };

  const { config } = usePrepareContractWrite({
    address: project.contractAddress,
    abi: abi,
    functionName: "setSessions",
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
        await updateProject(creator, { uuid, sessions });
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
            deploy sessions
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
                      <p>Sign to deploy sessions</p>
                    )}
                  </Button>
                </div>
              </div>
            )}
            {success && (
              <div>
                <p className="text-tock-green text-sm mt-2">
                  sessions successfully deployed.
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
