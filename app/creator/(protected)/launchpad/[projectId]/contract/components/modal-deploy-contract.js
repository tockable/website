"use client";

import { useState, useRef, useEffect } from "react";
import { useAccount } from "wagmi";
import { createWalletClient, custom, createPublicClient, http } from "viem";
import { TOCKABLE_ADDRESS } from "@/tock.config";
import { TOCKABLE_CHAINS } from "@/contexts/chains";
import { createNewSigner } from "@/actions/signature/createWallet";
import { updateProject } from "@/actions/launchpad/projects";
import { getAddress } from "viem";
import Modal from "@/components/design/modal";
import Button from "@/components/design/button";
import Loading from "@/components/loading/loading";

export default function DeployContractModal({
  onClose,
  project,
  bytecode,
  abi,
}) {
  const tockable_type = process.env.NEXT_PUBLIC_TOCKABLE_TYPE;

  const { address } = useAccount();

  const [takeMoment, setTakeMoment] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [callWallet, setCallWallet] = useState(false);
  const [loadingRouter, setLoadingRouter] = useState(false);

  const [signer, setSigner] = useState(null);
  const txhash = useRef(null);
  const [txreciept, setTxReciept] = useState(null);

  useEffect(() => {
    if (!bytecode.length) return;
    if (!project) return;

    (async () => {
      try {
        const signer = await createNewSigner(address, project.uuid);
        setSuccess("");
        setError("");
        setSigner(signer);
        setTakeMoment(false);
      } catch (err) {
        setTakeMoment(false);
        if (err.message === "forbidden") setError("Forbidden");
        else setError("Something happened in our side, please try again.");
      }
    })();
  }, [bytecode, project]);

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

  async function deploy() {
    setCallWallet(true);

    try {
      // const client = await getWalletClient({
      //   chainId: Number(project.chainId),
      // });
      const chain = TOCKABLE_CHAINS[tockable_type].find(
        (c) => c.id === Number(project.chainId)
      );
      const client = createWalletClient({
        chain,
        transport: custom(window.ethereum),
      });

      const hash = await client.deployContract({
        abi,
        bytecode,
        account: address,
        args: [TOCKABLE_ADDRESS, signer],
        gas: 5_000_000n,
      });

      if (hash) {
        txhash.current = hash;
      } else {
        setTakeMoment(false);
        setSuccess("");
        setError("deployment failed at sending tx stage, please try again.");
        return;
      }

      // const publicClient = getPublicClient({
      //   chainId: Number(project.chainId),
      // });
      const publicClient = createPublicClient({
        chain,
        transport: http(),
      });

      const reciept = await publicClient.waitForTransactionReceipt({ hash });

      if (!reciept) {
        setTakeMoment(false);
        setSuccess("");
        setError("Deployment tx failed, please try again.");
        return;
      }

      if (reciept.status == "success") {
        setTxReciept(reciept);

        const { creator, uuid, chainId } = project;

        const contractAddress = getAddress(
          reciept.contractAddress,
          Number(chainId)
        );

        await updateProject(creator, {
          uuid,
          signer,
          contractAddress,
          totalSupply: project.totalSupply,
          isDeployed: true,
        });

        setError("");
        setSuccess("Contract deployed successfully!");
        setTakeMoment(false);
      } else {
        setTakeMoment(false);
        setSuccess("");
        setError("Deployment tx failed, please try again.");
        return;
      }
    } catch (err) {
      if (
        err.message.match(/^User rejected the request./g) ||
        err.message.match(
          /^MetaMask Tx Signature: User denied trancsaction signature./g
        ) ||
        err.code == 4001
      ) {
        setError("Rejected by user.");
      } else {
        setError("wallet error occured");
      }

      setTakeMoment(false);
      setSuccess("");
      setCallWallet(false);
    }
  }

  return (
    <Modal isOpen={true} onClose={closeOnSuccess}>
      <div className="flex basis-3/4 px-4">
        <div className="flex flex-col w-full">
          <h1 className="text-tock-green font-bold text-xl mt-4 mb-6 ">
            deploying...
          </h1>
          {takeMoment && (
            <p className="text-tock-orange text-sm mb-4">
              deploying contract may take some time... please do not close this
              window...
            </p>
          )}

          {takeMoment && error.length == 0 && (
            <div className="flex justify-center items-center">
              <Loading isLoading={takeMoment} size={20} />
            </div>
          )}

          <div className="mb-6">
            {signer && error.length == 0 && !txreciept && (
              <div className="flex flex-col items-center">
                <p className="text-xs text-tock-green">
                  Please sign to deploy the contract
                </p>
                <Button
                  className="mt-8 w-40"
                  variant="primary"
                  onClick={() => deploy()}
                  disabled={callWallet}
                >
                  {!callWallet && <p>Sign and deploy</p>}
                  {callWallet && !txreciept && (
                    <Loading isLoading={callWallet && !txreciept} size={10} />
                  )}
                </Button>
              </div>
            )}
            {error.length > 0 && (
              <div className="flex flex-col justify-center items-center">
                <p className="text-xs text-tock-red">{error}</p>
                <Button className="mt-8" variant="warning" onClick={onClose}>
                  Close
                </Button>
              </div>
            )}
            {success.length > 0 && (
              <div className="flex flex-col justify-center items-center">
                <p className="text-xs text-tock-green">{success}</p>
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
    </Modal>
  );
}
