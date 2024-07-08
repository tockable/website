"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  useContractWrite,
  usePrepareContractWrite,
  useNetwork,
  useWaitForTransaction,
} from "wagmi";
import { createTaits } from "@/utils/crypto-utils";
import uploadDirectoryToIpfs from "@/actions/ipfs/uploadDirectory";
import { getContractAbi } from "@/actions/contract/metadata";
import { updateProject } from "@/actions/launchpad/projects";
import SwitchNetworkButton from "@/components/design/button-switch-network";
import Button from "@/components/design/button";
import Loading from "@/components/loading/loading";

export default function IpfsUploader({
  project,
  layers,
  layersFiles,
  layerFilesNames,
  handleGetBack,
}) {
  const [errorOnIpfs, setErrorOnIpfs] = useState(false);
  const [successOnIpfs, setSuccessOnIpfs] = useState(false);
  const [traits, setTraits] = useState([]);
  const [uploaded, setUploaded] = useState(0);
  const [last, setLast] = useState(-1);
  const [cids, setCids] = useState([]);
  const [abi, setAbi] = useState([]);
  const [gettingAbi, setGettingAbi] = useState(false);
  const [readyToDeploy, setReadyToDeploy] = useState(false);
  const [abiNotFetched, setAbiNotFetched] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [writing, setWriting] = useState(false);
  const [redirecting, setRedirecing] = useState(false);

  const { config } = usePrepareContractWrite({
    address: project.contractAddress,
    abi: abi,
    functionName: "addTraitTypes",
    args: [traits],
    enabled: readyToDeploy,
  });

  const router = useRouter();
  const { chain } = useNetwork();
  const { data, isLoading, isError, write, error } = useContractWrite(config);
  const uwt = useWaitForTransaction({ hash: data?.hash });

  const proceed = () => {
    setRedirecing(true);
    router.push(`/creator/launchpad/${project.uuid}/roles`);
  };

  useEffect(() => {
    if (!uwt.isSuccess) return;

    setWriting(true);

    const sortedCids = [];

    for (let i = 0; i < layers.length; i++) {
      const cid = cids.find((cid) => cid.name === layers[i]);
      sortedCids.push(cid.cid);
    }

    (async () => {
      try {
        const { creator, uuid } = project;

        await updateProject(creator, {
          uuid,
          layers,
          fileNames: layerFilesNames,
          cids: sortedCids,
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
    if (traits.length == 0) return;

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

  async function deploy() {
    setSuccessOnIpfs(false);
    write?.();
  }

  async function callUploadDirectoryToIpfs() {
    setUploading(true);
    setErrorOnIpfs(false);

    let uploadNeaded = true;
    let uploadSuccess = true;

    let _cids = cids;
    if (last == layersFiles.length - 1) uploadNeaded = false;

    if (uploadNeaded) {
      for (let i = last + 1; i < layersFiles.length; i++) {
        const files = new FormData();

        for (let j = 0; j < layersFiles[i].length; j++) {
          files.append(`${j}`, layersFiles[i][j]);
        }

        const res = await uploadDirectoryToIpfs(files);

        if (res.success === true) {
          _cids.push({ name: layers[i], cid: res.cid });
          setUploaded(i + 1);
        } else {
          uploadSuccess = false;

          setLast(i - 1);
          setUploading(false);
          setErrorOnIpfs(true);
          setCids(_cids);

          return;
        }
      }

      setCids(_cids);
    }

    if (!uploadSuccess) return;

    const _traits = createTaits(layers);

    setTraits(_traits);
    setUploading(false);
  }

  async function getAbiAgain() {
    setGettingAbi(true);
    try {
      const _abi = await getContractAbi(project);
      setAbi(_abi);
      setReadyToDeploy(true);
      setAbiNotFetched(false);
    } catch (err) {
      console.error("error fetching abi");
    }
    setGettingAbi(false);
  }

  return (
    <div className="p-4">
      {!readyToDeploy && !uploading && (
        <div>
          <h1 className="text-tock-green font-bold text-xl mt-4 mb-6">
            Upload to IPFS
          </h1>
          <p className="text-zinc-400 text-sm mt-2 mb-4">
            By clicking on button below, uploading process will be started.
          </p>
          <button
            className="my-4 transition ease-in-out mr-4 hover:bg-zinc-700 duration-300 text-zinc-500 font-bold py-2 px-4 rounded-2xl focus:outline-none focus:shadow-outline hover:text-blue-400 active:text-white"
            onClick={handleGetBack}
          >
            back
          </button>
          <Button
            variant="secondary"
            className="xs:mt-2 mb-4"
            onClick={() => callUploadDirectoryToIpfs()}
            disabled={layersFiles.length == 0 || uploading}
          >
            {uploading ? (
              <Loading isLoading={uploading} size={10} />
            ) : (
              "Upload & deploy"
            )}
          </Button>
        </div>
      )}

      {uploading && (
        <div className="border rounded-2xl bg-tock-black border-zinc-400 p-4 my-4">
          <h1 className="text-tock-green font-normal text-lg mb-2">
            Uploading to ipfs...
          </h1>
          <p className="text-tock-orange text-xs font-normal mb-6">
            Depending on files size, it may take 5 to 30 minutes, please DO NOT
            close this window ...
          </p>
          <p className="text-center text-tock-green mb-2 text-xs font-normal">
            {Math.ceil((uploaded * 100) / layers.length)}%
          </p>
          <div className="flex justify-center items-center">
            <div className="flex justify-center h-12 mb-8 items-center">
              <Loading isLoading={uploading} size={20} />
            </div>
          </div>
        </div>
      )}

      {errorOnIpfs && (
        <IpfsStatus
          layers={layers}
          cids={cids}
          last={last}
          retry={callUploadDirectoryToIpfs}
        />
      )}

      {abiNotFetched && (
        <Button
          onClick={() => {
            getAbiAgain();
          }}
          disabled={isLoading}
          variant="warning"
        >
          {!abi && <p>retry</p>}
          {abiNotFetched && <Loading isLoading={gettingAbi} size={10} />}
        </Button>
      )}

      {successOnIpfs && (
        <div className="border rounded-2xl bg-tock-black border-zinc-400 p-4 my-4">
          <h1 className="text-tock-green font-normal text-lg mb-6">
            Metadata deployed successfully!
          </h1>
          <div className="flex justify-center">
            <Button variant="primary" onClick={proceed} disabled={redirecting}>
              {redirecting ? (
                <Loading isLoading={redirecting} size={10} />
              ) : (
                "Proceed"
              )}
            </Button>
          </div>
        </div>
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

      {readyToDeploy && !uwt.isSuccess && !successOnIpfs && !uwt.isLoading && (
        <div className="border rounded-2xl bg-tock-black border-zinc-400 p-4 my-4">
          <h1 className="text-tock-green font-normal text-lg mb-12">
            sign to deploy
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
                {!isLoading && !uwt.isLoading && !writing && <p>deploy</p>}
                {(isLoading || uwt.isLoading || writing) && (
                  <Loading
                    isLoading={isLoading || uwt.isLoading || writing}
                    size={10}
                  />
                )}
              </Button>
              {isError && (
                <p className="text-tock-red mt-2 text-xs">{error.name}</p>
              )}
              {uwt.isError && (
                <p className="text-tock-red mt-2 text-xs">tx failed</p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function IpfsStatus({ cids, layers, retry, last }) {
  return (
    <div className="border rounded-2xl bg-tock-black border-zinc-400 p-4 my-4">
      <h1 className="text-tock-red font-normal text-lg mt-2 mb-4">
        oops {":("} we had errors on some directories
      </h1>
      {cids?.length > 0 && (
        <div className=" my-1 text-tock-green text-xs">
          <p className=" my-2">Successful directory uploads:</p>
          {cids.map((cid, i) => {
            return (
              <p key={"cid_" + i} className="my-1 indent-2">
                {cid.name}: {cid.cid}
              </p>
            );
          })}
        </div>
      )}
      <div className=" my-4 text-tock-red text-xs">
        <p className="my-2">failed directory uploads:</p>
        {layers?.map((layer, i) => {
          if (i > last) {
            return (
              <p key={"failed_" + i} className="my-1 indent-2">
                {layer} failed
              </p>
            );
          }
        })}
      </div>
      <div>
        <Button variant="warning" className="mt-4" onClick={() => retry()}>
          retry
        </Button>
      </div>
    </div>
  );
}
