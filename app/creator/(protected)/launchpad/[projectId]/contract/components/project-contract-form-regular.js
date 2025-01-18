"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useNetwork, useSwitchNetwork } from "wagmi";
import { regex } from "@/constants/regex";
import { updateProject } from "@/actions/launchpad/projects";
import { getContractAbi } from "@/actions/contract/metadata";
import { createAndCompile } from "@/actions/contract/compile";
import { getContractBytecode } from "@/actions/contract/metadata";
import DeployContractModal from "./modal-deploy-contract";
import Fade from "@/components/design/fade/fade";
import LabeledInput from "@/components/design/labeled-input";
import Loading from "@/components/loading/loading";
import Button from "@/components/design/button";
import DeployContractFactoryRegularModal from "./modal-deploy-contract-factory-regular";
import { FACTORY_CONTRACTS } from "@/tock.config";

export default function ProjectContractFormRegular({ _project }) {
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

  const [abiReady, setAbiReady] = useState(false);
  const [bytecode, setBytecode] = useState("");
  const [abi, setAbi] = useState([]);
  const [readyToDeploy, setReadyToDeploy] = useState(false);
  const [contractCreated, setContarctCreated] = useState(false);
  const [showDeployContractModal, setShowDeployContractModal] = useState(false);

  const onChangeTokenName = (e) =>
    setProject({ ...project, tokenName: e.target.value });

  const onChangeTokenSymbol = (e) =>
    setProject({ ...project, tokenSymbol: e.target.value });

  // const onChangeFirstTokenId = (e) =>
  //   setProject({ ...project, firstTokenId: e.target.value });

  const onChangeTotalSupply = (e) => {
    if (e.target.value.match(regex.number) || e.target.value === "")
      setProject({ ...project, totalSupply: e.target.value });
  };

  const handleShowDeployModalContract = () => setShowDeployContractModal(true);

  const handleCloseDeployModalContract = () => {
    setReadyToDeploy(false);
    setAbiReady(false);
    setTakeMoment(false);
    setSaving(false);
    setDeploying(false);
    setShowDeployContractModal(false);
  };

  const updateNeeded = () => {
    if (
      project.tokenName != lastState.tokenName ||
      project.tokenSymbol != lastState.tokenSymbol ||
      Number(project.firstTokenId) != lastState.firstTokenId ||
      project.totalSupply != lastState.totalSupply ||
      Number(project.totalSupply).toString() != lastState.totalSupply ||
      Number(project.totalSupply) != lastState.totalSupply ||
      project.totalSupply != lastState.totalSupply
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
      setPleaseFillRequied(true);
      return;
    }

    if (
      project.totalSupply === 0 ||
      project.totalSupply === "0" ||
      !project.totalSupply
    ) {
      setNonZeroSupply(true);
      return;
    }

    setSaving(true);

    const { uuid, tokenName, tokenSymbol, totalSupply } = project;

    const projectContract = {
      uuid,
      tokenName,
      totalSupply,
      tokenSymbol,
      firstTokenId: 1,
    };

    try {
      const updatedProject = await updateProject(
        session.data.user.address,
        projectContract
      );

      setProject(updatedProject);
      setLastState(updatedProject);
      setSuccess(true);
    } catch (err) {
      setTakeMoment(false);
      setFailed(true);

      if (err.message === "forbidden") {
        setErrorMessage("It seems you are not the dashboard owner.");
      } else {
        setErrorMessage("Something is wrong in our side, please try again.");
      }
    }

    setSaving(false);
  }

  async function saveAndDeploy() {
    // if project is updated and chain id supports contract factory
    if (
      !updateNeeded() &&
      FACTORY_CONTRACTS[project.dropType].hasOwnProperty(project.chainId)
    ) {
      setAbiReady(true);
      setDeploying(true);
      setSaving(true);
      return;
    }

    // if project is updated and chain id not supports contract factory
    // but contract created before and abi fetched
    if (!updateNeeded() && contractCreated) {
      setAbiReady(true);
      setTakeMoment(true);
      setDeploying(true);
      setSaving(true);
      return;
    }

    // if not support factory and contract and abi not created before
    setSuccess(false);
    setFailed(false);
    setPleaseFillRequied(false);
    setNonZeroSupply(false);

    if (project.tokenName.length == 0 || project.tokenSymbol.length == 0) {
      setPleaseFillRequied(true);
      return;
    }

    if (
      project.totalSupply === 0 ||
      project.totalSupply === "0" ||
      !project.totalSupply
    ) {
      setNonZeroSupply(true);
      return;
    }

    setTakeMoment(true);
    setDeploying(true);
    setSaving(true);

    let isUpdated = true;

    // if inputs changed
    if (updateNeeded()) {
      isUpdated = false;

      const { uuid, tokenName, totalSupply, tokenSymbol } = project;

      const projectContract = {
        uuid,
        tokenName,
        totalSupply,
        tokenSymbol,
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

    // if project already updated
    if (isUpdated) {
      // create contract
      const res = await createAndCompile(
        session.data.user.address,
        project.uuid
      );
      if (res.success === true) {
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
    if (!abiReady) {
      setReadyToDeploy(false);
      return;
    }

    if (FACTORY_CONTRACTS[project.dropType].hasOwnProperty(project.chainId)) {
      setReadyToDeploy(true);
      return;
    }

    if (!contractCreated) return;

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
    if (!readyToDeploy) return;

    if (FACTORY_CONTRACTS[project.dropType].hasOwnProperty(project.chainId)) {
      handleShowDeployModalContract();
      return;
    }

    if (!bytecode.length) return;

    handleShowDeployModalContract();
  }, [readyToDeploy, bytecode]);

  return (
    <Fade show={project}>
      <div className="basis-11/12 bg-tock-semiblack rounded-2xl p-4 mb-4">
        <div>
          <div id="modals">
            {showDeployContractModal && (
              <>
                {FACTORY_CONTRACTS[project.dropType].hasOwnProperty(
                  project.chainId
                ) ? (
                  <DeployContractFactoryRegularModal
                    project={project}
                    onClose={handleCloseDeployModalContract}
                  />
                ) : (
                  <DeployContractModal
                    project={project}
                    onClose={handleCloseDeployModalContract}
                    bytecode={bytecode}
                    abi={abi}
                  />
                )}
              </>
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
            <h1 className="text-zinc-500 font-bold text-md pb-1">
              Supply info
            </h1>

            <LabeledInput
              value={project.totalSupply || ""}
              id="total-suplly"
              type="text"
              placeholder={1000}
              onChange={onChangeTotalSupply}
              required={true}
            >
              Total supply{" "}
              <span className="text-xs font-normal text-zinc-400">
                (Max: 10000)
              </span>
            </LabeledInput>

            <div className="mb-10">
              <label>
                <p className="text-blue-400 text-xs font-normal t-1">
                  All drops starts with tokenId = 1
                </p>
              </label>
            </div>
            {/* <div className="mb-10">
              <label className="block text-tock-blue text-sm font-bold mb-2">
                First token Id (0 or 1){" "}
                <span className="text-zinc-400 text-xs">
                  you should choose based on your generated metadata
                </span>
              </label>
              <div className="flex items-center mb-4">
                <input
                  id="first-token-id-0"
                  type="radio"
                  value="0"
                  name="first-token-id"
                  className="w-4 h-4 accent-tock-green text-blue-100"
                  onChange={onChangeFirstTokenId}
                  checked={project.firstTokenId == 0}
                />
                <label className="ml-2 text-sm text-gray-200 dark:text-gray-300">
                  0
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="first-token-id-1"
                  type="radio"
                  value="1"
                  name="first-token-id"
                  className="w-4 h-4 accent-tock-green text-blue-100"
                  onChange={onChangeFirstTokenId}
                  checked={project.firstTokenId == 1}
                />
                <label className="ml-2 text-sm text-gray-200 dark:text-gray-300">
                  1
                </label>
              </div>
            </div> */}
          </div>
          <p className="text-tock-orange text-xs mb-2">
            IMPORTANT: please note that contract data cannot be changed after
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
              className="mt-2 sm:mt-0 ml-2"
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
                {!isLoading && <div> Switch to {project.chain} for deploy</div>}
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
              {!deploying && <div>Save & Deploy</div>}
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
              total supply cannot be zero.
            </p>
          )}
          {failed && (
            <p className="mt-2 text-xs text-tock-red">{errorMessage}</p>
          )}
          {pleaseFillRequired && (
            <p className="mt-2 text-xs text-tock-red">
              Please provide valid information for all fields.
            </p>
          )}
          {error && (
            <div>
              <p className="text-tock-red text-xs mt-2">
                Switch network failed. please try again, or changing manually
                using one of the following:
              </p>
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
            </div>
          )}
        </div>
      </div>
    </Fade>
  );
}
