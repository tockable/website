"use client";

import { useState, useEffect } from "react";
import { useNetwork } from "wagmi";
import { getContractAbi } from "@/actions/contract/metadata";
import DeployMetadataRegularDropModal from "./modal-deploy-metadata-regular";
import SwitchNetworkButton from "@/components/design/button-switch-network";
import Button from "@/components/design/button";
import Loading from "@/components/loading/loading";
import Fade from "@/components/design/fade/fade";
import { checkExtension } from "@/actions/ipfs/checkExtension";

export default function ProjectMetadataFormRegular({ _project }) {
  const { chain } = useNetwork();

  const [project] = useState(_project);
  const [deploying, setDeploying] = useState(false);
  const [cid, setCid] = useState(_project.cid);
  const [abi, setAbi] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [emptyMetadata, setEmptyMetadata] = useState(false);
  const [inorrectMetada, setIncorrectMetadata] = useState(false);
  const [hasExtension, setHasExtension] = useState(null);
  const [error, setError] = useState(false);
  const [readyToDeploy, setReadyToDeploy] = useState(false);

  const onChangeCid = (e) => setCid(e.target.value);
  const showMetadataModal = () => setShowModal(true);
  const hideMetadataModal = () => {
    setReadyToDeploy(false);
    setDeploying(false);
    setShowModal(false);
  };

  const onExtensionChange = (e) => {
    if (e.target.value === "null") setHasExtension(null);
    if (e.target.value === "true") setHasExtension(true);
    if (e.target.value === "false") setHasExtension(false);
  };

  useEffect(() => {
    if (!project) return;
    if (abi.length) return;

    (async () => {
      try {
        const _abi = await getContractAbi(project);
        setAbi(_abi);
      } catch (err) {
        console.error("error fetching abi");
      }
    })();
  }, [project]);

  useEffect(() => {
    if (!readyToDeploy) return;
    showMetadataModal(true);
  }, [readyToDeploy]);

  const deploy = async () => {
    setEmptyMetadata(false);
    setIncorrectMetadata(false);

    if (cid.length === 0) {
      setEmptyMetadata(true);
      return;
    }

    if (cid.match(/\//g)) {
      setIncorrectMetadata(true);
      return;
    }

    setDeploying(true);

    // if (cid.match(/^Qm/)) {
    //   try {
    //     const res = await fetch(`https://ipfs.io/ipfs/${cid}/1`);
    //     const json = await res.json();
    //     if (json) setHasExtension(false);
    //   } catch (_) {
    //     try {
    //       const res = await fetch(`https://ipfs.io/ipfs/${cid}/1.json`);
    //       const json = await res.json();

    //       if (json) setHasExtension(true);
    //     } catch (_) {
    //       const v0 = CID.parse(cid);

    //       v0.toString();

    //       const cidV1 = v0.toV1().toString();

    //       try {
    //         const res = await fetch(`https://${cidV1}.ipfs.nftstorage.link/1`);
    //         const json = await res.json();

    //         if (json) setHasExtension(false);
    //       } catch (_) {
    //         try {
    //           const res = await fetch(
    //             `https://${cidV1}.ipfs.nftstorage.link/1.json`
    //           );

    //           const json = await res.json();

    //           if (json) setHasExtension(true);
    //         } catch (_) {
    //           setHasExtension(true);
    //           setError(true);
    //         }
    //       }
    //     }
    //   }
    // } else {
    //   try {
    //     const res = await fetch(`https://${cid}.ipfs.nftstorage.link/1`);
    //     const json = await res.json();
    //     if (json) setHasExtension(false);
    //   } catch (_) {
    //     try {
    //       const res = await fetch(`https://${cid}.ipfs.nftstorage.link/1.json`);
    //       const json = await res.json();
    //       if (json) setHasExtension(true);
    //     } catch (_) {
    //       setHasExtension(true);
    //       setError(true);
    //     }
    //   }
    // }
    if (hasExtension !== true && hasExtension !== false) {
      try {
        const _hasExtension = await checkExtension(cid);
        setHasExtension(_hasExtension);
      } catch (_) {
        setHasExtension(true);
      }
    }

    setReadyToDeploy(true);
  };

  return (
    <Fade show={project}>
      <div className="flex w-full justify-center items-center">
        <div className="basis-11/12 bg-tock-semiblack rounded-2xl p-4 mb-4">
          <div id="modals">
            {showModal && (
              <DeployMetadataRegularDropModal
                abi={abi}
                project={project}
                onClose={hideMetadataModal}
                cid={cid}
                hasExtension={hasExtension}
                notSpecify={error}
              />
            )}
          </div>
          <div>
            <h1 className="text-tock-green font-bold text-xl mt-4 mb-6">
              Token metadata
            </h1>

            <p className="text-sm text-zinc-400 mb-12">
              please copy-paste your CID{" "}
              {/* <a className="text-xs text-blue-400 hover:text-blue-300 hover:cursor-pointer">
                learn more about CID &gt;
              </a> */}
            </p>
            <div>
              <div className="mb-10">
                <label className="block text-zinc-100 text-sm font-bold mb-2">
                  base URI{" "}
                  <span className="text-xs text-zinc-400 font-normal">
                    (IPFS CID)
                  </span>
                </label>
                <div className="flex">
                  <input
                    className="select-none flex-none text-sm appearance-none rounded-l-xl pointer-events-none bg-tock-semiblack border border-zinc-700 text-gray-400 py-3 px-3 w-36 leading-tight"
                    value="ipfs://"
                    readOnly
                    tabIndex="-1"
                  />
                  <input
                    className="flex-1 text-sm appearance-none bg-zinc-700 rounded-r-xl py-3 px-3 text-gray-200 border border-zinc-700 leading-tight focus:outline-none w- focus:ring focus:ring-2 focus:ring-zinc-500"
                    value={cid}
                    id="cid"
                    type="text"
                    placeholder="Qm... or bafk..."
                    onChange={onChangeCid}
                  />
                </div>
                <div className="flex flex-col">
                  <label className="text-sm font-bold mt-6 mb-4 text-zinc-400">
                    Do you want to add .json extension to Metadata?
                  </label>
                  <div className="flex items-center mb-2">
                    <input
                      id="auto-extension"
                      type="radio"
                      value="null"
                      name="json"
                      className="w-4 h-4 accent-tock-green text-blue-100"
                      onChange={onExtensionChange}
                      checked={hasExtension !== true && hasExtension !== false}
                    />
                    <label className="ml-2 text-sm text-gray-200 dark:text-gray-300">
                      Who is Jason?? <span className="text-xs text-zinc-400" >(Let Tockable do it for you)</span>
                    </label>
                  </div>
                  <div className="flex items-center mb-2">
                    <input
                      id="add-json"
                      type="radio"
                      value="true"
                      name="json"
                      className="w-4 h-4 accent-tock-green text-blue-100"
                      onChange={onExtensionChange}
                      checked={hasExtension === true}
                    />
                    <label className="ml-2 text-sm text-gray-200 dark:text-gray-300">
                      Yes, like "69.json"
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="dont-add-json"
                      type="radio"
                      value="false"
                      name="json"
                      className="w-4 h-4 accent-tock-green text-blue-100"
                      onChange={onExtensionChange}
                      checked={hasExtension === false}
                    />
                    <label className="ml-2 text-sm text-gray-200 dark:text-gray-300">
                      No, Don't add .json
                    </label>
                  </div>
                </div>
              </div>
            </div>
            <div className="mb-4">
              {chain.id != project.chainId && (
                <SwitchNetworkButton project={project} />
              )}

              {chain.id === Number(project.chainId) && (
                <>
                  <Button
                    className="xs:mt-2"
                    variant="secondary"
                    type="button"
                    onClick={() => deploy()}
                    disabled={deploying}
                  >
                    <div>
                      {deploying ? (
                        <Loading isLoading={deploying} size={10} />
                      ) : (
                        "save & deploy"
                      )}
                    </div>
                  </Button>
                  {deploying && (
                    <p className="text-xs text-tock-orange my-2">
                      It may take a while due to the Metadata extension
                      validation. please be patient...
                    </p>
                  )}
                </>
              )}
            </div>
            {emptyMetadata && (
              <p className="text-tock-red text-xs mt-2">
                cannot deploy empty CID
              </p>
            )}
            {inorrectMetada && (
              <p className="text-tock-red text-xs mt-2">
                please provide a valid ipfs CID {"("}without https:// or ipfs://
                {")"}
              </p>
            )}
          </div>
        </div>
      </div>
    </Fade>
  );
}
