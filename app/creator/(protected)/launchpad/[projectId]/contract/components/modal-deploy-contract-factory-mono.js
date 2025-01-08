"use client";

import { useState, useEffect } from "react";
import { TOCKABLE_ADDRESS, FACTORY_CONTRACTS } from "@/tock.config";
import { createNewSigner } from "@/actions/signature/createWallet";
import { updateProject } from "@/actions/launchpad/projects";
import Modal from "@/components/design/modal";
import Button from "@/components/design/button";
import Loading from "@/components/loading/loading";
import {
  useAccount,
  usePrepareContractWrite,
  useContractWrite,
  useWaitForTransaction,
} from "wagmi";
import { camelize, capitalize } from "@/utils/string-utils";
import getChainData from "@/utils/chain-utils";
import { parseEther, getAddress } from "viem";
import { TockableMonoDropFromFactoryV1DeployerV1Abi } from "@/contracts/TockableMonoDropFromFactoryV1DeployerV1Abi";

export default function DeployContractFactoryMonoModal({ onClose, project }) {
  const chain = getChainData(project.chainId);

  const { address } = useAccount();

  const [serverError, setServerError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [txInProgress, setTxInProgress] = useState(false);
  const [loadingRouter, setLoadingRouter] = useState(false);
  const [signer, setSigner] = useState(null);
  const [signerError, setSignerError] = useState(false);

  const retrySigner = async () => {
    try {
      const signer = await createNewSigner(address, project.uuid);
      setSigner(signer);
      setServerError(false);
    } catch (err) {
      setSignerError(true);
    }
  };

  useEffect(() => {
    if (!project) return;

    (async () => {
      try {
        const signer = await createNewSigner(address, project.uuid);
        setSigner(signer);
        setServerError(false);
      } catch (err) {
        setSignerError(true);
      }
    })();
  }, [project]);

  const { config } = usePrepareContractWrite({
    address: FACTORY_CONTRACTS[project.dropType][project.chainId],
    abi: TockableMonoDropFromFactoryV1DeployerV1Abi,
    functionName:
      "deployTockable" + capitalize(project.dropType) + "DropFromFactoryV1",
    args: [
      TOCKABLE_ADDRESS,
      signer ? signer : "0x0000000000000000000000000000000000000000",
      camelize(project.tokenName),
      project.tokenName,
      project.tokenSymbol,
      parseEther(chain.regular_base_fee.toString(), "wei"),
      project.totalSupply,
      project.firstTokenId,
      project.isUnlimited,
    ],
    gas: 5_000_000n,
  });

  const write = useContractWrite(config);
  const reciept = useWaitForTransaction({ hash: write?.data?.hash });

  useEffect(() => {
    if (write.isError) {
      setTxInProgress(false);
    }
  }, [write.isError]);

  useEffect(() => {
    if (!reciept.isSuccess) return;

    const { creator, uuid, chainId } = project;

    const _contractAddress = reciept?.data?.logs[0].address;

    const contractAddress = getAddress(_contractAddress, Number(chainId));

    (async () => {
      try {
        await updateProject(creator, {
          uuid,
          signer,
          contractAddress,
          totalSupply: project.totalSupply,
          isDeployed: true,
        });
        setSuccess(true);
        setServerError(false);
        setTxInProgress(false);
      } catch (e) {
        setServerError(true);
        setTxInProgress(false);
        return;
      }
    })();
  }, [reciept.isSuccess]);

  function closeOnSuccess() {
    if (success.length > 0) {
      setLoadingRouter(true);
      window.location.reload(true);
    } else {
      onClose();
    }
  }

  const proceed = () => {
    setLoadingRouter(true);
    window.location.reload(true);
  };

  async function callDeployer() {
    setTxInProgress(true);
    write.write?.();
  }

  async function retry() {
    setTxInProgress(true);
    const { creator, uuid, chainId } = project;

    const address = reciept.data.logs.find(
      (log) => log.event === "OwnershipTransferred"
    ).from;

    console.log("write", write?.data);
    console.log("rercipt", reciept?.data);
    if (!address) {
      console.log("no address");
      return;
    }
    console.log("address", address);

    const contractAddress = getAddress(address, Number(chainId));

    try {
      await updateProject(creator, {
        uuid,
        signer,
        contractAddress,
        totalSupply: project.totalSupply,
        isDeployed: true,
      });
      setTxInProgress(false);
      setSuccess(true);
      setServerError(false);
    } catch (e) {
      setTxInProgress(false);
      setServerError(true);
      return;
    }
  }

  return (
    <Modal isOpen={true} onClose={closeOnSuccess}>
      {signer && !signerError && (
        <div className="flex basis-3/4 px-4">
          <div className="flex flex-col w-full">
            <h1 className="text-tock-green font-bold text-xl mt-4 mb-6 ">
              deployment
            </h1>

            <div className="mb-6">
              {!success && !serverError && (
                <div className="flex flex-col items-center">
                  <p className="text-xs text-tock-green">
                    Please sign to deploy the contract
                  </p>
                  <Button
                    className="mt-8 w-40"
                    variant="primary"
                    onClick={() => callDeployer()}
                    disabled={txInProgress}
                  >
                    {!txInProgress && <p>Sign and deploy</p>}
                    {txInProgress && (
                      <Loading isLoading={txInProgress} size={10} />
                    )}
                  </Button>
                </div>
              )}

              {serverError && (
                <div className="flex flex-col justify-center items-center">
                  <p className="text-xs text-tock-red">
                    We couldn't index the contract address, please retry
                  </p>
                  <Button
                    className="mt-8"
                    variant="warning"
                    disabled={txInProgress}
                    onClick={() => retry()}
                  >
                    {!txInProgress && <p>Retry</p>}
                    {txInProgress && (
                      <Loading isLoading={txInProgress} size={10} />
                    )}
                  </Button>
                </div>
              )}

              {success && !serverError && (
                <div className="flex flex-col justify-center items-center">
                  <p className="text-xs text-tock-green">
                    Contract deployed successfully!
                  </p>
                  <Button
                    className="mt-8"
                    variant="primary"
                    disabled={loadingRouter}
                    onClick={proceed}
                  >
                    {loadingRouter ? (
                      <Loading isLoading={loadingRouter} size={10} />
                    ) : (
                      "Proceed"
                    )}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      {signerError && (
        <div className="flex basis-3/4 px-4">
          <div className="flex flex-col w-full py-6">
            <p className="text-rose-500 text-sm">
              Something happend! please retry!
            </p>
            <Button
              className="mt-8"
              variant="primary"
              onClick={() => retrySigner()}
            >
              Retry
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
}
