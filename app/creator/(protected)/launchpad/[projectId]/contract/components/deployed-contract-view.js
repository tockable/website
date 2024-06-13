"use client";

import { useState, useEffect } from "react";
import { GoCopy } from "react-icons/go";
import { CopyToClipboard } from "react-copy-to-clipboard";
import verify from "@/actions/contract/verify";
import { getContractVerificationArgs } from "@/actions/contract/verify";
import getChainData from "@/utils/chain-utils";
import Button from "@/components/design/button";
import Loading from "@/components/loading/loading";

export default function DeployedContractView({ _project }) {
  const [project, setProject] = useState(_project);
  const [chainData, setChainData] = useState();
  const [verifying, setVerifying] = useState(false);
  const [verificationError, setVerificationError] = useState(false);
  const [showManualVerify, setShowManualVerify] = useState(false);

  async function callVerify() {
    setVerifying(true);
    setVerificationError(false);

    const res = await verify(project);
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
                <p className="text-zinc-400 text-sm mt-2 break-all">
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
                    className="text-zinc-400 text-sm mt-2 p-2 border-[0.5px] border-zinc-700 rounded-2xl transition duration-200 text-xs hover:bg-zinc-700 break-all"
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
            <p className="text-tock-blue font-bold text-sm">
              Verification status:
            </p>
            {project.isVerified && (
              <>
                <p className="text-tock-green text-sm mt-2">Verified</p>
                <p className="text-zinc400 text-xs mt-1">
                  It usually takes about 5min for a chain scanner to process the
                  contract verification request, If the contract has not been
                  verificated after the mentioned period, please try manual
                  verification.
                </p>
              </>
            )}
            {!project.isVerified && (
              <div>
                <Button
                  variant="secondary"
                  className="mt-2"
                  onClick={() => callVerify()}
                  disabled={
                    verifying ||
                    isUnsupportedChainForVerification(Number(project.chainId))
                  }
                >
                  {verifying ? (
                    <Loading isLoading={verifying} size={10} />
                  ) : (
                    "Verify contract"
                  )}
                </Button>
                {verificationError && (
                  <div>
                    <p className="text-tock-red text-sm mt-2">
                      an error occured during verification, please try again or
                      use manuall verify.
                    </p>
                  </div>
                )}
                {isUnsupportedChainForVerification(Number(project.chainId)) && (
                  <div>
                    <p className="text-tock-red text-xs mt-2">
                      currently automatic verification is not supported for this
                      network.
                    </p>
                  </div>
                )}
              </div>
            )}

            <button
              onClick={() => setShowManualVerify(true)}
              className="text-tock-orange hover:text-orange-100 text-sm mt-2"
            >
              I want to verify manually {">"}
            </button>
            {showManualVerify && <ManualVerify project={project} />}
          </section>
        </div>
      )}
    </>
  );
}

function ManualVerify({ project }) {
  const [error, setError] = useState(false);
  const [verificationData, setVerificationData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copy, setCopy] = useState({
    address: false,
    args: false,
    source: false,
  });

  useEffect(() => {
    if (copy.address === false && copy.args === false && copy.source === false)
      return;
    setTimeout(
      () =>
        setCopy({
          address: false,
          args: false,
          source: false,
        }),
      2000
    );
  }, [copy]);

  const handleCopy = () => setCopy({ ...copy, address: true });
  const handleCopy1 = () => setCopy({ ...copy, args: true });
  const handleCopy2 = () => setCopy({ ...copy, source: true });

  useEffect(() => {
    (async () => {
      try {
        const res = await getContractVerificationArgs(project);
        setVerificationData(res);
      } catch (err) {
        setError(true);
      }
    })();
    setLoading(false);
  }, []);

  return (
    <div>
      {loading ? (
        <div className="h-24 flex justify-center">
          <Loading isLoading={loading} size={20} />
        </div>
      ) : (
        <div>
          {error && (
            <p className="text-xs text-tock-red">Something went wrong</p>
          )}{" "}
          {verificationData && (
            <div className="text-xs">
              <div className="bg-orange-500/10 text-tock-orange p-2 mt-6 mb-4 rounded-xl">
                <p>You can manually verify the contract.</p>
                <p className="text-zinc-400">
                  visit{" "}
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300"
                    href={getChainData(Number(project.chainId)).verifyurl}
                  >
                    {getChainData(Number(project.chainId)).verifyurl}
                  </a>{" "}
                  and fill the verification form using following info:
                </p>
              </div>
              <p className="text-zinc-400 my-2">
                - <b>Contract name:</b>{" "}
                <span className="text-tock-orange">
                  {verificationData.contractName}
                </span>
              </p>
              <div className="flex gap-2 text-zinc-400 my-2">
                - <b>Contract address:</b>{" "}
                <CopyToClipboard
                  text={project.contractAddress}
                  onCopy={handleCopy}
                >
                  <div className="flex text-tock-orange hover:text-orange-100 hover:cursor-pointer gap-2">
                    {project.contractAddress} <GoCopy />{" "}
                    {copy.address && (
                      <span className="text-tock-green">copied!</span>
                    )}
                  </div>
                </CopyToClipboard>
              </div>
              <p className="text-zinc-400 mt-2 mb-4">
                - <b>Compiler Type/Verification method:</b>{" "}
                <span className="text-tock-orange">
                  Solidity (Flattened source code) or Solidity (Single file){" "}
                </span>
                <span className="text-xs text-zinc-500">
                  (Each one is available)
                </span>
              </p>
              <p className="text-zinc-400 my-2">
                - <b>Compiler version:</b>{" "}
                <span className="text-tock-orange">
                  v0.8.21+commit.d9974bed
                </span>
              </p>
              <p className="text-zinc-400 my-2">
                - <b>EVM version:</b>{" "}
                <span className="text-tock-orange">paris</span>
              </p>
              <p className="text-zinc-400 my-2">
                - <b>Optimization enabled:</b>{" "}
                <span className="text-tock-orange">yes</span>
              </p>
              <p className="text-zinc-400 my-2">
                - <b>Optimization runs:</b>{" "}
                <span className="text-tock-orange">200</span>
              </p>
              <p className="text-zinc-400 my-2">
                - <b>License Type:</b>{" "}
                <span className="text-tock-orange">3 (MIT License)</span>
              </p>
              <div className="flex gap-2 text-zinc-400 my-2">
                - <b>Copy/paste the constructor arguments:</b>
                <CopyToClipboard
                  text={verificationData.args}
                  onCopy={handleCopy1}
                >
                  <div className="flex text-tock-orange hover:text-orange-100 hover:cursor-pointer gap-2">
                    Copy constructor args <GoCopy />{" "}
                    {copy.args && (
                      <span className="text-tock-green">copied!</span>
                    )}
                  </div>
                </CopyToClipboard>
              </div>
              <div className="flex gap-2 text-zinc-400 my-2">
                - <b>Copy/paste the source code:</b>
                <CopyToClipboard
                  text={verificationData.source}
                  onCopy={handleCopy2}
                >
                  <div className="flex text-tock-orange hover:text-orange-100 hover:cursor-pointer gap-2 mb-2">
                    Copy source code <GoCopy />{" "}
                    {copy.source && (
                      <span className="text-tock-green">copied!</span>
                    )}
                  </div>
                </CopyToClipboard>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function isUnsupportedChainForVerification(_chainId) {
  _chainId === 59140 ||
    _chainId == 80001 ||
    _chainId == 420 ||
    _chainId === 84532 ||
    _chainId === 34443 ||
    _chainId === 11155420 ||
    _chainId === 168587773 ||
    _chainId === 7777777 ||
    _chainId === 11501 ||
    _chainId === 60808;
}
