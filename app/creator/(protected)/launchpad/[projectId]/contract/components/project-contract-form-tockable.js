"use client";

import { useState, useEffect } from "react";
import { useNetwork, useSwitchNetwork } from "wagmi";
import { useSession } from "next-auth/react";
import { regex } from "@/constants/regex";
import { updateProject } from "@/actions/launchpad/projects";
import { createAndCompile } from "@/actions/contract/compile";
import { getContractBytecode } from "@/actions/contract/metadata";
import { getContractAbi } from "@/actions/contract/metadata";
import DeployContractModal from "./modal-deploy-contract";
import LabeledInput from "@/components/design/labeled-input";
import Loading from "@/components/loading/loading";
import Button from "@/components/design/button";

export default function ProjectContractFormTockable({ _project }) {
  // Contexts
  const session = useSession();
  const { chain } = useNetwork();
  const { error, isLoading, pendingChainId, switchNetwork } =
    useSwitchNetwork();

  const [lastState, setLastState] = useState(_project);
  const [project, setProject] = useState(_project);

  const [saving, setSaving] = useState(false);
  const [deploying, setDeploying] = useState(false);
  const [takeMoment, setTakeMoment] = useState(false);
  const [success, setSuccess] = useState(false);
  const [failed, setFailed] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [pleaseFillRequired, setPleaseFillRequied] = useState(false);
  const [nonZeroSupply, setNonZeroSupply] = useState(false);
  const [abi, setAbi] = useState([]);

  const [unlimitedDisabled, setUnlimitedDisabled] = useState(false);
  const [totalSupplyDisabled, setTotalSupplyDisabled] = useState(false);
  const [duplicateVerificationDisable, setDuplicateVerificationDisable] =
    useState(project.duplicateVerification);

  const [abiReady, setAbiReady] = useState(false);
  const [bytecode, setBytecode] = useState("");
  const [readyToDeploy, setReadyToDeploy] = useState(false);

  const onChangeTokenName = (e) =>
    setProject({ ...project, tokenName: e.target.value });

  const onChangeTokenSymbol = (e) =>
    setProject({ ...project, tokenSymbol: e.target.value });

  const onChangeTotalSupply = (e) => {
    if (e.target.value.match(regex.number) || e.target.value === "")
      setProject({ ...project, totalSupply: e.target.value });
  };

  const onChangeUnlimited = (e) => {
    if (e.target.value == "false") {
      setTotalSupplyDisabled(false);
      setDuplicateVerificationDisable(false);
      setProject({ ...project, isUnlimited: false });
    }
    if (e.target.value == "true") {
      setTotalSupplyDisabled(true);
      setDuplicateVerificationDisable(true);
      setProject({ ...project, isUnlimited: true });
    }
  };

  const onChangeDuplicateVerifiction = (e) => {
    if (e.target.value == "false") {
      setUnlimitedDisabled(false);
      if (project.isUnlimited) setTotalSupplyDisabled(true);
      else setTotalSupplyDisabled(false);
      setProject({ ...project, duplicateVerification: false });
    }
    if (e.target.value == "true") {
      setTotalSupplyDisabled(false);
      setUnlimitedDisabled(true);
      setProject({ ...project, duplicateVerification: true });
    }
  };

  // Deploy
  const [contractCreated, setContarctCreated] = useState(false);
  const [showDeployContractModal, setShowDeployContractModal] = useState(false);
  const handleShowDeployModalContract = () => setShowDeployContractModal(true);

  const handleCloseDeployModalContract = () => {
    setReadyToDeploy(false);
    setAbiReady(false);
    setTakeMoment(false);
    setSaving(false);
    setDeploying(false);
    setShowDeployContractModal(false);
  };

  const noSubmit = (e) => e.key === "Enter" && e.preventDefault();

  const updateNeeded = () => {
    if (
      project.tokenName != lastState.tokenName ||
      project.tokenSymbol != lastState.tokenSymbol ||
      project.totalSupply != lastState.totalSupply ||
      Number(project.totalSupply) != lastState.totalSupply ||
      project.totalSupply != lastState.totalSupply ||
      project.isUnlimited != lastState.isUnlimited ||
      project.duplicateVerification != lastState.duplicateVerification
    ) {
      return true;
    } else {
      return false;
    }
  };

  async function save() {
    setSuccess(false);
    setFailed(false);
    setPleaseFillRequied(false);
    setNonZeroSupply(false);

    if (project.tokenName.length == 0 || project.tokenSymbol.length == 0) {
      if (!pleaseFillRequired) setPleaseFillRequied(true);
      return;
    }

    if (project.totalSupply === 0 || project.totalSupply === "0") {
      if (!project.isUnlimited) {
        if (!nonZeroSupply) setNonZeroSupply(true);
        return;
      }
    }

    setSaving(true);

    const projectContract = {
      uuid: project.uuid,
      tokenName: project.tokenName,
      isUnlimited: project.duplicateVerification ? false : project.isUnlimited,
      duplicateVerification: project.isUnlimited
        ? false
        : project.duplicateVerification,
      totalSupply: project.isUnlimited ? 0 : project.totalSupply,
      tokenSymbol: project.tokenSymbol,
      firstTokenId: 1,
    };

    try {
      const updatedProject = await updateProject(
        session.data.user.address,
        projectContract
      );

      if (project.isUnlimited) setProject({ ...project, totalSupply: "0" });

      setProject(updatedProject);
      setLastState(updatedProject);
      setSuccess(true);
    } catch (err) {
      setTakeMoment(false);
      setFailed(true);

      if (err.message === "forbidden") {
        setErrorMessage("Only project creator can edit the project");
      } else {
        setErrorMessage("Something wrong in our side, please try again.");
      }
    }

    setSaving(false);
  }

  async function saveAndDeploy() {
    if (!updateNeeded() && contractCreated) {
      setAbiReady(true);
      setTakeMoment(true);
      setDeploying(true);
      setSaving(true);
      return;
    }

    setSuccess(false);
    setFailed(false);
    setPleaseFillRequied(false);
    setNonZeroSupply(false);

    if (project.tokenName.length == 0 || project.tokenSymbol.length == 0) {
      if (!pleaseFillRequired) setPleaseFillRequied(true);
      return;
    }

    if (project.totalSupply === 0 || project.totalSupply === "0") {
      if (!project.isUnlimited) {
        setNonZeroSupply(true);
        return;
      }
    }

    setTakeMoment(true);
    setDeploying(true);
    setSaving(true);

    let isUpdated = true;

    if (updateNeeded()) {
      isUpdated = false;

      const projectContract = {
        uuid: project.uuid,
        tokenName: project.tokenName,
        isUnlimited: project.duplicateVerification
          ? false
          : project.isUnlimited,
        duplicateVerification: project.isUnlimited
          ? false
          : project.duplicateVerification,
        totalSupply: project.isUnlimited ? 0 : project.totalSupply,
        tokenSymbol: project.tokenSymbol,
        firstTokenId: 1,
      };

      try {
        const updatedProject = await updateProject(
          session.data.user.address,
          projectContract
        );

        isUpdated = true;

        setProject(updatedProject);
        setLastState(updatedProject);
      } catch (err) {
        setTakeMoment(false);
        setFailed(true);
        setSaving(false);
        setDeploying(false);
        if (err.message === "forbidden") {
          setErrorMessage("Only creator can edit the project");
        } else {
          setErrorMessage("Something wrong in our side, please try again.");
        }
      }
    }

    if (isUpdated) {
      const res = await createAndCompile(
        session.data.user.address,
        project.uuid
      );

      if (res.success === true) {
        if (project.isUnlimited) setProject({ ...project, totalSupply: "0" });
        setContarctCreated(true);
        setAbiReady(true);
      } else {
        setTakeMoment(false);
        setFailed(true);
        setErrorMessage("something wrong in our side, please try again");
        setSaving(false);
        setDeploying(false);
      }
    }
  }

  useEffect(() => {
    if (!contractCreated) return;

    if (!abiReady) {
      setReadyToDeploy(false);
      return;
    }

    (async () => {
      try {
        if (!abi.length) {
          const abi = await getContractAbi(project);
          setAbi(abi);
        }

        if (!bytecode.length) {
          const bytecode = await getContractBytecode(
            session.data.user.address,
            project.uuid,
            project.name
          );

          setBytecode(`0x${bytecode}`);
        }

        setReadyToDeploy(true);
      } catch (_) {
        setReadyToDeploy(false);
        setAbiReady(false);
        setTakeMoment(false);
        setDeploying(false);
        setSaving(false);
        setErrorMessage("An error occured, please try again.");
      }
    })();
  }, [abiReady]);

  useEffect(() => {
    if (!bytecode.length) return;
    if (!readyToDeploy) return;
    handleShowDeployModalContract();
  }, [readyToDeploy, bytecode]);

  return (
    <div className="basis-11/12 bg-tock-semiblack rounded-2xl p-4 mb-4">
      <form onKeyDown={noSubmit}>
        <div id="modals">
          {showDeployContractModal && (
            <DeployContractModal
              project={project}
              onClose={handleCloseDeployModalContract}
              bytecode={bytecode}
              abi={abi}
            />
          )}
        </div>
        <h1 className="text-tock-green font-bold text-xl mb-6 ">
          contract info & deploy
        </h1>
        <div className="rounded-2xl bg-zinc-800 p-3 mt-8 mb-4">
          <h1 className="text-zinc-500 font-bold text-md pb-1">
            Token general info
          </h1>
          <LabeledInput
            value={project.tokenName}
            id="token-name"
            type="text"
            placeholder="Tockable Donkeys"
            onChange={onChangeTokenName}
            subtitle={
              <p>
                This will be your token name in token metadata: e.g name:
                Tockable Donkeys #23
              </p>
            }
          >
            Token Name / Collection name
          </LabeledInput>

          <LabeledInput
            value={project.tokenSymbol}
            id="token-symbol"
            type="text"
            placeholder="TCKBL"
            onChange={onChangeTokenSymbol}
          >
            Token symbol
          </LabeledInput>
        </div>
        <div className="rounded-2xl bg-zinc-800 p-3 mt-8 mb-4">
          <h1 className="text-zinc-500 font-bold text-md pb-1">Supply info</h1>
          <div className="mb-12 border border-zinc-700 p-4 rounded-xl">
            <label
              className={`block ${
                !project.duplicateVerification
                  ? "text-tock-blue"
                  : "text-zinc-600"
              } text-sm font-bold mb-2`}
            >
              Do you want unlimited supply collection?
              <div>
                <p
                  className={`${
                    project.duplicateVerification
                      ? "text-zinc-600"
                      : "text-zinc-400 "
                  } text-xs mt-1 mb-6 font-normal`}
                >
                  With Tockable drops, you can create erc721 collection with an
                  unlimited (max 2^256) supply
                </p>
              </div>
            </label>
            <div className="flex items-center mb-2">
              <input
                id="unlimited-0"
                type="radio"
                value="false"
                name="isUnlimited"
                className="w-4 h-4 accent-tock-green text-blue-100"
                onChange={onChangeUnlimited}
                checked={!project.isUnlimited}
                disabled={unlimitedDisabled}
              />
              <label className="ml-2 text-sm text-gray-200 dark:text-gray-300">
                No
              </label>
            </div>
            <div className="flex items-center">
              <input
                id="unlimited-1"
                type="radio"
                value="true"
                name="isUnlimited"
                className="w-4 h-4 accent-tock-green text-blue-100"
                onChange={onChangeUnlimited}
                checked={project.isUnlimited}
                disabled={unlimitedDisabled}
              />
              <label className="ml-2 text-sm text-gray-200 dark:text-gray-300">
                Yes
              </label>
            </div>
          </div>
          <LabeledInput
            value={!project.isUnlimited ? project.totalSupply || "" : ""}
            id="total-suplly"
            type="text"
            placeholder={!project.isUnlimited ? "10000" : "unlimited"}
            onChange={onChangeTotalSupply}
            required={true}
            disabled={totalSupplyDisabled}
          >
            Total supply{" "}
            <span className="text-xs font-normal text-zinc-400">
              (Max: 10000, required if not unlimited)
            </span>
          </LabeledInput>
          <div className="mt-4 mb-12 border border-zinc-700 rounded-xl p-4">
            <label
              className={`block ${
                duplicateVerificationDisable
                  ? "text-zinc-600"
                  : "text-tock-blue"
              }  text-sm font-bold mb-2`}
            >
              Do you want to enforce collectors to mint only unique NFTs?{" "}
              <span
                className={`${
                  duplicateVerificationDisable
                    ? "text-zinc-600"
                    : "text-zinc-400"
                } text-xs mt-1 mb-1 font-normal`}
              >
                With customizable NFTs, there is a chance that collectors may
                create similar (non-unique) NFTs.{" "}
              </span>
              <div>
                <p
                  className={`${
                    duplicateVerificationDisable
                      ? "text-zinc-600"
                      : "text-zinc-400"
                  } text-xs mt-1 mb-1 font-normal`}
                >
                  Uniqueness verification will be handled on-chain.
                </p>
                <p
                  className={`${
                    duplicateVerificationDisable
                      ? "text-zinc-600"
                      : "text-zinc-400"
                  } text-xs mb-6 font-normal`}
                >
                  Uniqueness verification cannot be used with unlimited-supply
                  option.
                </p>
              </div>
            </label>
            <div className="flex items-center mb-2">
              <input
                id="duplicate-0"
                type="radio"
                value="false"
                name="duplication"
                className="w-4 h-4 accent-tock-green text-blue-100"
                onChange={onChangeDuplicateVerifiction}
                checked={!project.duplicateVerification}
                disabled={duplicateVerificationDisable}
              />
              <label className="ml-2 text-sm text-gray-200 dark:text-gray-300">
                No
              </label>
            </div>
            <div className="flex items-center">
              <input
                id="duplicate-1"
                type="radio"
                value="true"
                name="duplication"
                className="w-4 h-4 accent-tock-green text-blue-100"
                onChange={onChangeDuplicateVerifiction}
                checked={project.duplicateVerification}
                disabled={duplicateVerificationDisable}
              />
              <label className="ml-2 text-sm text-gray-200 dark:text-gray-300">
                Yes
              </label>
            </div>
          </div>
        </div>
        <div className="mb-10">
          <label>
            <p className="text-blue-400 text-xs font-normal t-1">
              All Tockable dynamic drops starts with tokenId = 1
            </p>
          </label>
        </div>
        <p className="text-tock-orange text-xs mb-2">
          IMPORTANT: please note that contract data connot be changed after
          deployment.
        </p>
        <Button
          variant="primary"
          type="button"
          onClick={() => save()}
          disabled={saving || !updateNeeded()}
        >
          Save
        </Button>

        {chain.id != project.chainId && (
          <Button
            className="mt-0 sm:mt-2 ml-2"
            variant="warning"
            type="button"
            onClick={() => switchNetwork?.(Number(project.chainId))}
            disabled={isLoading}
          >
            <div>
              {isLoading && pendingChainId === Number(project.chainId) && (
                <Loading
                  isLoading={
                    isLoading && pendingChainId === Number(project.chainId)
                  }
                  size={10}
                />
              )}
              {!isLoading && <div> switch to {project.chain} for deploy</div>}
            </div>
          </Button>
        )}

        {chain.id === Number(project.chainId) && (
          <Button
            className="xs:mt-2 ml-2"
            variant="secondary"
            type="button"
            onClick={() => saveAndDeploy()}
            disabled={deploying}
          >
            <div>
              {deploying && <Loading isLoading={deploying} size={10} />}
            </div>
            {!deploying && <div> Save & Deploy</div>}
          </Button>
        )}
        {success && !updateNeeded() && (
          <p className="mt-2 text-xs text-tock-green">
            Contract info updated successfully.
          </p>
        )}
        {takeMoment && (
          <p className="mt-2 text-xs text-blue-400">
            creating contract... please wait...
          </p>
        )}
        {nonZeroSupply && (
          <p className="mt-2 text-xs text-tock-red">
            Total supply should be more than zero.
          </p>
        )}
        {failed && <p className="mt-2 text-xs text-tock-red">{errorMessage}</p>}
        {pleaseFillRequired && (
          <p className="mt-2 text-xs text-tock-red">
            Please provide valid information for all fields.
          </p>
        )}
        {error && (
          <p className="text-tock-red text-xs mt-2">
            Switch network failed. please try again, or changing manually using
            one of the following:
            <ul className="mt-2">
              <li>
                <a
                  className="text-blue-400 hover:text-blue-300"
                  href="https://chainlist.org"
                >
                  chainlist.org
                </a>
              </li>
              <li>
                <a
                  className="text-blue-400 hover:text-blue-300"
                  href="https://chainlist.wtf"
                >
                  chainlist.wtf
                </a>
              </li>
            </ul>
          </p>
        )}
      </form>
    </div>
  );
}
