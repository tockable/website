"use client";

import { useState, useEffect } from "react";
import {
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
  useAccount,
} from "wagmi";
import { useRouter } from "next/navigation";
import { updateProject } from "@/actions/launchpad/projects";
import Loading from "@/components/loading/loading";
import Modal from "@/components/design/modal";
import Button from "@/components/design/button";

export default function DeployMetadataRegularDropModal({
  onClose,
  project,
  abi,
  cid,
  hasExtension,
  notSpecify,
}) {
  const { address } = useAccount();
  const router = useRouter();

  const [success, setSuccess] = useState(false);
  const [failed, setFailed] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [redirecting, setRedirecing] = useState(false);

  const { config } = usePrepareContractWrite({
    address: project.contractAddress,
    abi: abi,
    functionName: project.dropType === "regular" ? "setBaseURI" : "setImageURI",
    args: project.dropType === "regular" ? [cid, hasExtension] : [cid],
    // gas: 2_000_000n,
  });

  const { data, write, isError, error, isLoading } = useContractWrite(config);
  const uwt = useWaitForTransaction({ hash: data?.hash });

  const proceed = () => {
    setRedirecing(true);
    router.push(`/creator/launchpad/${project.uuid}/roles`);
  };

  const closeOnSuccess = () => onClose();

  useEffect(() => {
    if (!uwt.isSuccess) {
      setSuccess(false);
      return;
    }

    (async () => {
      try {
        const { uuid } = project;
        await updateProject(address, { uuid, cid, hasExtension });
        setSuccess(true);
      } catch (err) {
        setFailed(true);
      }
    })();

    setUpdating(false);
  }, [uwt.isSuccess]);

  return (
    <Modal isOpen={true} onClose={closeOnSuccess}>
      <div className="flex basis-3/4 px-4">
        <div className="flex flex-col w-full">
          <h1 className="text-tock-green font-bold text-xl mt-4 mb-6 ">
            Deploy metadata
          </h1>
          <div className="mb-6">
            {project.dropType === "regular" && (
              <p className="text-xs text-zinc-400">
                You are deploying{" "}
                <span className="text-blue-400 break-all">"ipfs://{cid}/</span>{" "}
                for token base URI
              </p>
            )}
            {project.dropType === "mono" && (
              <p className="text-xs text-zinc-400">
                You are deploying{" "}
                <span className="text-blue-400 break-all">"ipfs://{cid}</span>{" "}
                for token image URI
              </p>
            )}
            {notSpecify && (
              <p className="text-xs text-zinc-400">
                {"("}in case of empty image on nfts, you may need to update
                metadata setting later{")"}, you can edit URI until you freeze
                it.
              </p>
            )}
          </div>
          <div className="mb-6">
            {!success && (
              <div>
                <p className="text-tock-orange text-xs font-normal">
                  please do not close this window until you see the success
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
                      <p>Sign to deploy metadata</p>
                    )}
                  </Button>
                </div>
              </div>
            )}

            {success && (
              <div>
                <p className="text-tock-green text-sm mt-2">
                  Metadata successfully deployed.
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
                Something went wrong, please try again.
              </p>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
}
