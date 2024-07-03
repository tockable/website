"use client";

import { useEffect, useState } from "react";
import {
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";
import { updateProject } from "@/actions/launchpad/projects";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import Button from "@/components/design/button";
import Loading from "@/components/loading/loading";
import { checkExtension } from "@/actions/ipfs/checkExtension";

export default function ActionConfigureMetadataRegular({ abi, _project }) {
  const [states, setStates] = useState({
    setBaseURI: true,
    setExtension: false,
    freezeMetadata: false,
  });

  const showSetBaseURI = () =>
    setStates({ setBaseURI: true, setExtension: false, freezeMetadata: false });
  const showSetExtension = () =>
    setStates({ setBaseURI: false, setExtension: true, freezeMetadata: false });
  const showFreezeMetadata = () =>
    setStates({ setBaseURI: false, setExtension: false, freezeMetadata: true });

  return (
    <section id="withdraw">
      <div>
        <h1 className="font-bold text-sm text-tock-blue mb-4 ">
          Configure Metadata
        </h1>
      </div>
      <div
        onClick={showSetBaseURI}
        className={`bg-tock-black rounded-2xl p-4 my-4 mx-4 ${
          !states.setBaseURI &&
          "hover:bg-tock-semiblack hover:ring hover:ring-zinc-600 transition ease-in-out duration-200 cursor-pointer"
        }`}
      >
        <div className="flex text-zinc-400 text-sm font-bold">
          <div className="flex-auto">
            <p>
              Set New {_project.dropType === "regular" ? "Base" : "Image"} URI
            </p>
          </div>
          <div>{states.setBaseURI ? <IoIosArrowUp /> : <IoIosArrowDown />}</div>
        </div>

        {states.setBaseURI && (
          <DeployNewBaseURI _project={_project} abi={abi} />
        )}
      </div>
      <div
        onClick={showFreezeMetadata}
        className={`bg-tock-black rounded-2xl p-4 my-4 mx-4 ${
          !states.freezeMetadata &&
          "hover:bg-tock-semiblack hover:ring hover:ring-zinc-600 transition ease-in-out duration-200 cursor-pointer"
        }`}
      >
        <div className="flex text-zinc-400 text-sm font-bold">
          <div className="flex-auto">
            <p>Freeze Metadata</p>
          </div>
          <div>
            {states.freezeMetadata ? <IoIosArrowUp /> : <IoIosArrowDown />}
          </div>
        </div>
        {states.freezeMetadata && (
          <FreezeMetadata _project={_project} abi={abi} />
        )}
      </div>
      {_project.dropType === "regular" && (
        <div
          onClick={showSetExtension}
          className={`bg-tock-black rounded-2xl p-4 my-4 mx-4 ${
            !states.setExtension &&
            "hover:bg-tock-semiblack hover:ring hover:ring-zinc-600 transition ease-in-out duration-200 cursor-pointer"
          }`}
        >
          <div className="text-zinc-400 text-sm font-bold">
            <div className="flex text-zinc-400 text-sm font-bold">
              <div className="flex-auto">
                <p>Change Metadata extension</p>
              </div>
              <div>
                {states.setExtension ? <IoIosArrowUp /> : <IoIosArrowDown />}
              </div>
            </div>
          </div>
          {states.setExtension && (
            <ChangeExtension _project={_project} abi={abi} />
          )}
        </div>
      )}
    </section>
  );
}

/**
 *
 * @param {*} param0
 * @returns
 */
function DeployNewBaseURI({ _project, abi }) {
  const [project, setProject] = useState(_project);
  const [enableState, setEnabled] = useState(false);
  const [readyToDeploy, setReadyToDeploy] = useState(false);
  const [cid, setCid] = useState(project.cid);
  const [hasExtension, setHasExtension] = useState(true);
  const [incorrectMetadata, setIncorrectMetadata] = useState(false);
  const [isChecking, setCheking] = useState(false);
  const [isWriting, setWriting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [printedError, setPrintedError] = useState("");
  const [emptyMetadata, setEmptyMetadata] = useState(false);

  const onChangeCid = (e) => setCid(e.target.value);

  const { config } = usePrepareContractWrite({
    address: project.contractAddress,
    abi: abi,
    functionName:
      _project.dropType === "regular" ? "setBaseURI" : "setImageURI",
    args: _project.dropType === "regular" ? [cid, hasExtension] : [cid],
    enabled: enableState,
    onSuccess(_) {
      setReadyToDeploy(true);
    },
    onError(err) {
      if (err instanceof BaseError) {
        const revertError = err.walk(
          (err) => err instanceof ContractFunctionRevertedError
        );

        if (revertError instanceof ContractFunctionRevertedError) {
          const errorName = revertError.data?.errorName ?? "";

          if (errorName === "MetadataIsFrozen") {
            setPrintedError("Metadata has been frozen.");
          }
        }
      }
    },
    // gas: 3_000_000n,
  });

  const { data, isLoading, isError, write, error } = useContractWrite(config);
  const uwt = useWaitForTransaction({ hash: data?.hash });

  useEffect(() => {
    if (!setReadyToDeploy) return;
    (async () => write?.())();
  }, [readyToDeploy]);

  useEffect(() => {
    if (!isError && !uwt.isError) return;
    setCheking(false);
  }, [isError, uwt.isError]);

  useEffect(() => {
    if (!uwt.isSuccess) return;
    setWriting(true);

    (async () => {
      try {
        const { creator, uuid } = project;
        const updatedProject = await updateProject(creator, {
          uuid,
          cid,
        });
        setSuccess(true);
        setProject(updatedProject);
      } catch (err) {}
    })();

    setWriting(false);
    setCheking(false);
  }, [uwt.isSuccess]);

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

    setCheking(true);

    if (project.dropType === "regular") {
      try {
        const _hasExtension = await checkExtension(cid);
        setHasExtension(_hasExtension);
      } catch (_) {
        setHasExtension(true);
      }
    }

    if (project.dropType === "mono") {
      setHasExtension === false;
    }

    setEnabled(true);
  };

  return (
    <>
      <p className="text-sm text-zinc-400 mt-4 mb-12">
        You can set new metadata CID using following field
      </p>
      <div>
        <div className="mb-10">
          <label className="block text-zinc-100 text-sm font-bold mb-2">
            Base URI{" "}
            <span className="text-xs text-zinc-400 font-normal">
              (IPFS CID)
            </span>
          </label>
          <div className="flex">
            <input
              className="select-none text-xs flex-none text-xs appearance-none rounded-l-xl pointer-events-none bg-tock-semiblack border border-zinc-700 text-gray-400 py-3 px-3 w-36 leading-tight"
              value="ipfs://"
              readOnly
              tabIndex="-1"
            />
            <input
              className="flex-1 text-xs appearance-none bg-zinc-700 rounded-r-xl py-3 px-3 text-gray-200 border border-zinc-700 leading-tight focus:outline-none w- focus:ring focus:ring-2 focus:ring-zinc-500"
              value={cid}
              id="cid"
              type="text"
              placeholder="Qm... or bafk..."
              onChange={onChangeCid}
            />
          </div>
        </div>
      </div>
      <Button
        className="mt-6 mb-2"
        variant={"secondary"}
        disabled={isLoading || uwt.isLoading || isChecking || incorrectMetadata}
        onClick={() => deploy()}
      >
        {(isLoading || uwt.isLoading || isChecking || isWriting) && (
          <Loading
            isLoading={isLoading || uwt.isLoading || isChecking || isWriting}
            size={10}
          />
        )}
        {!isLoading &&
          !uwt.isLoading &&
          !isChecking &&
          !isWriting &&
          !isChecking && <p>Set Metadata</p>}
      </Button>
      {(isLoading || uwt.isLoading || isWriting || isChecking) && (
        <p className="text-tock-orange mt-2 text-xs">
          DO NOT close this window, or change the tab...
        </p>
      )}
      {printedError.length > 0 && (
        <p className="text-tock-red mt-2 text-xs">{printedError}</p>
      )}
      {isError && <p className="text-tock-red mt-2 text-xs">{error?.name}</p>}
      {uwt.isError && <p className="text-tock-red mt-2 text-xs">tx failed</p>}
      {success && (
        <p className="text-tock-green mt-2 text-xs">
          Metadata successfully changed.
        </p>
      )}
      {emptyMetadata && (
        <p className="text-tock-red text-xs mt-2">cannot deploy empty CID</p>
      )}
      {incorrectMetadata && (
        <p className="text-tock-red text-xs mt-2">
          please provide a valid ipfs CID {"("}without https:// or ipfs://
          {")"}
        </p>
      )}
    </>
  );
}

/**
 *
 * @param {*} param0
 * @returns
 */
function ChangeExtension({ _project, abi }) {
  const [project, setProject] = useState(_project);
  const [isWriting, setWriting] = useState(false);
  const [key, setKey] = useState(1);
  const [success, setSuccess] = useState(false);

  const { config } = usePrepareContractWrite({
    address: project.contractAddress,
    abi: abi,
    functionName: "setMetadataHasExtension",
    args: [!project ? true : !project.hasExtension],
    // gas: 3_000_000n,
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
          hasExtension: !project.hasExtension,
        });

        setProject(updatedProject);
        setSuccess(true);
        setKey(key + 1);
        setWriting(false);
      } catch (err) {
        console.log(err.message);
      }
    })();

    setWriting(false);
  }, [uwt.isSuccess]);

  return (
    <section>
      <div key={key}>
        <p className="text-sm text-zinc-400 mt-4">
          By default, metadata extension is automatically detected and set by
          the platform. If you have a problem with current setting, and you are
          sure about your metadata extension, you can change it manually here.
        </p>
        <Button
          className="mt-4"
          variant={"secondary"}
          onClick={() => write?.()}
        >
          {(isLoading || uwt.isLoading || isWriting) && (
            <Loading
              isLoading={isLoading || uwt.isLoading || isWriting}
              size={10}
            />
          )}

          {!isLoading && !uwt.isLoading && !isWriting && (
            <p>
              {!project
                ? "Add .json"
                : project.hasExtension === true
                ? "Remove .json"
                : "Add .json"}
            </p>
          )}
        </Button>
      </div>
      {(isLoading || uwt.isLoading || isWriting) && (
        <p className="text-tock-orange mt-2 text-xs">
          DO NOT close this window, or change the tabs...
        </p>
      )}
      {isError && <p className="text-tock-red mt-2 text-xs">{error.name}</p>}
      {uwt.isError && (
        <p className="text-tock-red mt-2 text-xs">transaction failed</p>
      )}
      {success && (
        <p className="text-tock-green mt-2 text-xs">
          Metadata extension changed!
        </p>
      )}
    </section>
  );
}

/**
 *
 * @param {*} param0
 * @returns
 */
function FreezeMetadata({ _project, abi }) {
  const { config } = usePrepareContractWrite({
    address: _project.contractAddress,
    abi: abi,
    functionName: "freezeMetadata",
    // gas: 3_000_000n,
  });

  const { data, isLoading, isError, write, error } = useContractWrite(config);
  const uwt = useWaitForTransaction({ hash: data?.hash });

  return (
    <section>
      <p className="text-sm text-zinc-400 mt-4 mb-8">
        By freezing the metadata, you assure the collectors that their NFT
        metadata will always remain the same, and the "Metadata is frozen" will
        be included on the mint page.
      </p>
      <div>
        <Button
          className="mt-4"
          variant={"secondary"}
          onClick={() => write?.()}
        >
          {(isLoading || uwt.isLoading) && (
            <Loading isLoading={isLoading || uwt.isLoading} size={10} />
          )}

          {!isLoading && !uwt.isLoading && <p>Freeze metadata</p>}
        </Button>
      </div>
      {(isLoading || uwt.isLoading) && (
        <p className="text-tock-orange mt-2 text-xs">
          do not close this window, or change tabs...
        </p>
      )}
      {isError && <p className="text-tock-red mt-2 text-xs">{error.name}</p>}
      {uwt.isError && (
        <p className="text-tock-red mt-2 text-xs">transaction failed</p>
      )}
      {uwt.isSuccess && (
        <p className="text-tock-green mt-2 text-xs">Metadata is Frozen!</p>
      )}
    </section>
  );
}
