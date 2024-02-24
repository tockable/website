"use client";

import { useState, useEffect } from "react";
import getChainData from "@/utils/chain-utils";
import verify from "@/actions/contract/verify";
import Button from "@/components/design/button";
import Loading from "@/components/loading/loading";

export default function DeployedContractView({ _project }) {
  const [project, setProject] = useState(_project);
  const [chainData, setChainData] = useState();
  const [verifying, setVerifying] = useState(false);
  const [verificationError, setVerificationError] = useState(false);

  async function callVerify() {
    setVerifying(true);
    setVerificationError(false);

    const res = await verify(project);
    console.log(res);
    if (res.success === true) setProject(res.payload);
    else setVerificationError(true);

    setVerifying(false);
  }

  useEffect(() => {
    if (!project) return;
    if (!project.isDeployed) return;
    const _chainData = getChainData(project.chainId);
    setChainData(_chainData);
  }, [project]);

  return (
    <>
      <h1 className="font-bold text-xl mt-4 mb-6">
        <span className="text-tock-green ">contract info of </span>
        <span className="text-tock-orange">{project.tokenName}</span>
      </h1>

      {chainData && (
        <div className="p-4 border border-zinc-600 rounded-2xl mb-4 bg-zinc-800">
          <section className="mt-2 mb-8">
            <p className="text-tock-blue font-bold text-sm">Token name</p>
            <p className="text-zinc-400 text-sm mt-2">{project.tokenName}</p>
          </section>
          <section className="mt-2 mb-8">
            <p className="text-tock-blue font-bold text-sm">Token symbol</p>
            <p className="text-zinc-400 text-sm mt-2">{project.tokenSymbol}</p>
          </section>
          <section className="mt-2 mb-8">
            <p className="text-tock-blue font-bold text-sm">Drop type</p>
            <p className="text-zinc-400 text-sm mt-2">{project.dropType}</p>
          </section>
          <section className="mt-2 mb-8">
            <p className="text-tock-blue font-bold text-sm">Contract address</p>
            <p className="text-zinc-400 text-sm mt-2 break-all">
              {project.contractAddress}
            </p>
          </section>
          <section className="mt-2 mb-8">
            <p className="text-tock-blue font-bold text-sm">Chain</p>
            <p className="text-zinc-400 text-sm mt-2">{project.chain}</p>
          </section>
          <section className="mt-2 mb-8">
            <p className="text-tock-blue font-bold text-sm">Total supply</p>
            <p className="text-zinc-400 text-sm mt-2">
              {project.isUnlimited ? "Unlimited (2^256)" : project.totalSupply}
            </p>
          </section>
          <section className="mt-2 mb-8">
            {((project.cid && project.cid.length === 0) ||
              (project.cids && project.cids.length === 0)) && (
              <div>
                <p className="text-tock-blue font-bold text-sm">
                  {project.cid ? "Base URI" : "URI directories"}
                </p>
                <p className="text-tock-orange font-normal text-sm">
                  Not deployed yet
                </p>
              </div>
            )}
            {project.cid && project.cid.length > 0 && (
              <div>
                <p className="text-tock-blue font-bold text-sm">Base URI</p>
                <p className="text-zinc-400 text-sm mt-2">
                  {`ipfs://${project.cid}/`}
                </p>
              </div>
            )}
            {project.cids && project.cids.length > 0 && (
              <div>
                <p className="text-tock-blue font-bold text-sm">
                  URI directories
                </p>
                {project.cids.map((cid, i) => (
                  <p
                    key={"cid_" + i}
                    className="text-zinc-400 text-sm mt-2 p-2 border-[0.5px] border-zinc-700 rounded-2xl transition duration-200 hover:bg-zinc-700"
                  >
                    {`ipfs://${cid}/`}
                  </p>
                ))}
              </div>
            )}
          </section>
          <section className="mt-2 mb-8">
            <p className="text-tock-blue font-bold text-sm">See contract on</p>
            <a
              className="text-blue-400 hover:text-blue-200 text-sm mt-2"
              href={`${chainData?.url}/address/${project.contractAddress}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {chainData.scan}
            </a>
          </section>
          <section className="mt-2 mb-8">
            <p className="text-tock-blue font-bold text-sm">Verification:</p>
            {project.isVerified && (
              <p className="text-tock-green text-sm mt-2">verified</p>
            )}
            {!project.isVerified && (
              <div>
                <Button
                  variant="secondary"
                  className="mt-2"
                  onClick={() => callVerify()}
                  disabled={
                    verifying ||
                    Number(project.chainId) === 59144 ||
                    Number(project.chainId) === 84532 ||
                    Number(project.chainId) === 11155420
                  }
                >
                  {verifying ? (
                    <Loading isLoading={verifying} size={10} />
                  ) : (
                    "verify contract"
                  )}
                </Button>
                {verificationError && (
                  <p className="text-tock-red text-sm mt-2">
                    an error occured during verification, please try again.
                  </p>
                )}
                {(Number(project.chainId) == 59144 ||
                  Number(project.chainId) == 84532 ||
                  Number(project.chainId) == 11155420) && (
                  <p className="text-tock-red text-sm mt-2">
                    currently verification is not supported for this network
                  </p>
                )}
              </div>
            )}
          </section>
        </div>
      )}
    </>
  );
}
