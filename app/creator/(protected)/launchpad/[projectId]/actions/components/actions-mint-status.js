import { useEffect, useState } from "react";
import {
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
  useContractRead,
} from "wagmi";
import { updateProject } from "@/actions/launchpad/projects";
import Loading from "@/components/loading/loading";
import Button from "@/components/design/button";

export default function ActionMintStatus({ abi, _project }) {
  const [project, setProject] = useState(_project);
  const [success, setSuccess] = useState(false);
  const [isWriting, setWriting] = useState(false);
  const [key, setKey] = useState(1);

  const res = useContractRead({
    abi,
    address: project.contractAddress,
    functionName: "isMintLive",
  });

  const options = {
    address: project.contractAddress,
    abi: abi,
    enabled: (() => {
      if (res) return true;
      else return false;
    })(),
    functionName: "setMintIsLive",
    args: (() => {
      if (!res) return [false];
      else return [!res?.data];
    })(),
  };

  const { config } = usePrepareContractWrite({
    ...options,
  });

  const { data, isLoading, isError, write, error } = useContractWrite(config);
  const uwt = useWaitForTransaction({ hash: data?.hash });

  useEffect(() => {
    if (!uwt.isSuccess) return;
    setWriting(true);

    (async () => {
      try {
        const { uuid, creator } = project;
        const updatedProject = await updateProject(creator, {
          uuid,
          paused: !project.paused,
        });

        setProject(updatedProject);
        setSuccess(true);
        setKey(key + 1);
        setWriting(false);
      } catch (err) {
        console.error(err.message);
      }
    })();

    setWriting(false);
  }, [uwt.isSuccess]);

  return (
    <section id="set-mint-status">
      <div>
        <h1 className="font-bold text-sm text-tock-blue mb-4 ">
          Start/Pause mint
        </h1>
      </div>
      <div key={key}>
        <Button
          className="mt-4"
          variant={"secondary"}
          disabled={!write || isLoading || isWriting || uwt.isLoading}
          onClick={() => write?.()}
        >
          {(isLoading || uwt.isLoading || isWriting || !res) && (
            <Loading
              isLoading={isLoading || uwt.isLoading || isWriting || !res}
              size={10}
            />
          )}

          {!isLoading && !uwt.isLoading && !isWriting && (
            <p>{res?.data === false ? "Start mint" : "Pause mint"}</p>
          )}
        </Button>
      </div>
      {(isLoading || uwt.isLoading || isWriting) && (
        <p className="text-tock-orange mt-2 text-xs">
          please DO NOT close this window, or change tabs...
        </p>
      )}
      {isError && <p className="text-tock-red mt-2 text-xs">{error.name}</p>}
      {uwt.isError && (
        <p className="text-tock-red mt-2 text-xs">transaction failed</p>
      )}
      {success && (
        <p className="text-tock-green mt-2 text-xs">Mint status changed!.</p>
      )}
    </section>
  );
}
