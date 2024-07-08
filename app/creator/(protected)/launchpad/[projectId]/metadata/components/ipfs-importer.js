"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  useContractWrite,
  usePrepareContractWrite,
  useNetwork,
  useWaitForTransaction,
} from "wagmi";
import { getContractAbi } from "@/actions/contract/metadata";
import SwitchNetworkButton from "@/components/design/button-switch-network";
import { createTaits } from "@/utils/crypto-utils";
import { updateProject } from "@/actions/launchpad/projects";
import Loading from "@/components/loading/loading";
import LabeledInput from "@/components/design/labeled-input";
import Button from "@/components/design/button";

export default function IpfsImporter({
  project,
  layers,
  handleGetBack,
  layerFilesNames,
}) {
  const [layerIpfsCids, setLayerIpfsCids] = useState([]);
  const [traits, setTraits] = useState([]);
  const [abi, setAbi] = useState([]);
  const [gettingAbi, setGettingAbi] = useState(false);
  const [readyToDeploy, setReadyToDeploy] = useState(false);
  const [abiNotFetched, setAbiNotFetched] = useState(false);
  const [hideRest, setHideRest] = useState(false);
  const [writing, setWriting] = useState(false);
  const [successOnIpfs, setSuccessOnIpfs] = useState(false);
  const [cannotEmpty, setCannotEmpty] = useState(false);
  const [redirecting, setRedirecing] = useState(false);

  const router = useRouter();

  const { chain } = useNetwork();
  const { config } = usePrepareContractWrite({
    address: project.contractAddress,
    abi: abi,
    functionName: "addTraitTypes",
    args: [traits],
    enabled: readyToDeploy,
  });

  const { data, isLoading, isError, write, error } = useContractWrite(config);
  const uwt = useWaitForTransaction({ hash: data?.hash });

  const proceed = () => {
    setRedirecing(true);
    router.push(`/creator/launchpad/${project.uuid}/roles`);
  };

  useEffect(() => {
    if (!uwt.isSuccess) return;

    setWriting(true);

    (async () => {
      try {
        const { creator, uuid } = project;

        await updateProject(creator, {
          uuid,
          layers,
          fileNames: layerFilesNames,
          cids: layerIpfsCids,
        });

        setSuccessOnIpfs(true);
      } catch (err) {
        setTraits([]);
        setErrorOnIpfs(true);
      }
    })();

    setWriting(false);
  }, [uwt.isSuccess]);

  useEffect(() => {
    if (!project) return;
    if (!traits.length) return;

    if (abi.length) setReadyToDeploy(true);
    else {
      (async () => {
        try {
          const _abi = await getContractAbi(project);
          setAbi(_abi);
          setReadyToDeploy(true);
        } catch (err) {
          setAbiNotFetched(true);
        }
      })();
    }
  }, [traits]);

  async function getAbiAgain() {
    setGettingAbi(true);
    try {
      const _abi = await getContractAbi(project);
      setAbi(_abi);
      setReadyToDeploy(true);
      setAbiNotFetched(false);
    } catch (err) {
      console.log(err);
      console.error("error fetching abi");
    }
    setGettingAbi(false);
  }

  function handleIpfsAdd(_index, _cid) {
    const _layerIpfsCids = layerIpfsCids;
    _layerIpfsCids[_index] = _cid.trim();
    setLayerIpfsCids(_layerIpfsCids);
  }

  function importIpfs() {
    let isEmpty = false;

    for (let i = 0; i < layerIpfsCids.length; i++) {
      if (!layerIpfsCids[i]) {
        setCannotEmpty(true);
        isEmpty = true;
        break;
      }
    }

    if (isEmpty) return;

    const _traits = createTaits(layers);
    setTraits(_traits);
    setHideRest(true);
  }

  async function deploy() {
    setSuccessOnIpfs(false);
    write?.();
  }

  return (
    <div className="p-4">
      {!hideRest && (
        <div>
          <h1 className="text-tock-green font-bold text-xl mt-4 mb-6">
            Import IPFS cids
          </h1>
          <p className="text-zinc-400 text-sm mt-2 mb-4">
            copy/paste your layer cids into correlated fields.
          </p>
          <p className="text-zinc-400 text-sm mt-2 mb-4">
            Please make sure that you input correct cid for each directory,
            since this action is IRREVERSIBLE after deploying.{" "}
            {/* <a
              href="#"
              target="_blank"
              rel="noopener noreferer"
              className="text-blue-400 hover:text-blue-200"
            >
              learn how do this correctly
            </a> */}
          </p>
          <section className="mt-2 mb-4">
            {layers?.map((layer, i) => (
              <div key={"layer_ipfs_" + i}>
                <LabeledInput
                  onChange={(e) => handleIpfsAdd(i, e.target.value)}
                >
                  ipfs cid for <span className="text-tock-orange">{layer}</span>
                </LabeledInput>
              </div>
            ))}
          </section>
          <Button variant="primary" onClick={importIpfs}>
            import
          </Button>
          <button
            className="my-4 transition ease-in-out mr-4 hover:bg-zinc-700 duration-300 text-zinc-500 font-bold py-2 px-4 rounded-2xl focus:outline-none focus:shadow-outline hover:text-blue-400 active:text-white"
            onClick={handleGetBack}
          >
            back
          </button>
          {cannotEmpty && (
            <p className="text-tock-red text-xs mt-2">
              ipfs field cannot be empty
            </p>
          )}
        </div>
      )}
      {hideRest && (
        <div>
          {abiNotFetched && (
            <Button
              onClick={() => getAbiAgain()}
              disabled={isLoading}
              variant="warning"
            >
              {!abi && <p>retry</p>}
              {abiNotFetched && <Loading isLoading={gettingAbi} size={10} />}
            </Button>
          )}
          {uwt.isLoading && (
            <div className="border rounded-2xl bg-tock-black border-zinc-400 p-4 my-4">
              <h1 className="text-tock-green font-normal text-lg mb-2">
                wait for transaction...
              </h1>
              <p className="text-tock-orange text-xs font-normal mb-6">
                please do not close this window...
              </p>
              <div className="flex justify-center items-center">
                <div className="flex justify-center h-12 mb-8 items-center">
                  <Loading isLoading={uwt.isLoading} size={20} />
                </div>
              </div>
            </div>
          )}
          {successOnIpfs && (
            <div className="border rounded-2xl bg-tock-black border-zinc-400 p-4 my-4">
              <h1 className="text-tock-green font-normal text-lg mb-6">
                Metadata deployed successully!
              </h1>
              <div className="flex justify-center">
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
          {readyToDeploy &&
            !uwt.isSuccess &&
            !successOnIpfs &&
            !uwt.isLoading && (
              <div className="border rounded-2xl bg-tock-black border-zinc-400 p-4 my-4">
                <h1 className="text-tock-green font-normal text-lg mb-12">
                  Sign to deploy
                </h1>

                {chain.id != project.chainId && (
                  <SwitchNetworkButton project={project} />
                )}

                {chain.id === Number(project.chainId) && (
                  <div className="flex flex-col justify-center items-center">
                    <Button
                      onClick={() => deploy()}
                      disabled={isLoading || uwt.isLoading || writing}
                      variant="primary"
                    >
                      {!isLoading && !uwt.isLoading && !writing && (
                        <p>deploy</p>
                      )}

                      {(isLoading || uwt.isLoading || writing) && (
                        <Loading
                          isLoading={isLoading || uwt.isLoading || writing}
                          size={10}
                        />
                      )}
                    </Button>
                    {isError && (
                      <p className="text-tock-red text-xs mt-2">{error.name}</p>
                    )}
                    {uwt.isError && (
                      <p className="text-tock-red text-xs mt-2">tx failed</p>
                    )}
                  </div>
                )}
              </div>
            )}
        </div>
      )}
    </div>
  );
}
