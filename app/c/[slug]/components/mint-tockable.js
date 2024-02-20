import { useState, useContext, useEffect } from "react";
import { parseEther, BaseError, ContractFunctionRevertedError } from "viem";
import {
  usePrepareContractWrite,
  useContractWrite,
  useAccount,
  useWaitForTransaction,
  useContractRead,
} from "wagmi";
import { EMPTY_BYTES_32 } from "@/constants/constants";
import { MintContextTockable } from "@/contexts/mint-context-tockable";
import Loading from "@/components/loading/loading";
import Button from "@/components/design/button";

const initialArgs = {
  args: [
    1,
    [{ part1: EMPTY_BYTES_32, part2: EMPTY_BYTES_32 }],
    EMPTY_BYTES_32,
    0,
    [[EMPTY_BYTES_32]],
  ],
  value: 0,
};

export default function MintTockable({
  handleRoleVisibility,
  prepareMint,
  role,
  session,
  show,
}) {
  const { project } = useContext(MintContextTockable);
  const handleClick = () => handleRoleVisibility(role.id);

  return (
    <div
      onClick={handleClick}
      className={`flex grow bg-tock-black rounded-2xl p-4 my-4 mx-4 ${
        !show &&
        "hover:bg-tock-semiblack hover:ring hover:ring-zinc-600 transition ease-in-out duration-200 cursor-pointer"
      }`}
    >
      <div className="flex flex-col gap-4 w-full">
        <div className="flex">
          <div className="flex-auto">
            <p className="text-zinc-400 text-xs items-center pr-4">
              mint as{" "}
              <span className="text-tock-orange text-sm">{role.name}</span> |
              max mint/wallet:{" "}
              <span className="text-tock-orange">{role.quota}</span> | price:{" "}
              {project.slug.toLowerCase() === "tock" && (
                <span>
                  <span className="text-tock-orange">Free</span>
                </span>
              )}
              {project.slug.toLowerCase() !== "tock" && (
                <span className="text-tock-orange">
                  {Number(role.price) + getBaseFee(project)}{" "}
                  {project.chainData.nativeToken}
                </span>
              )}
            </p>
          </div>
          <div className="text-tock-green text-xs justify-end">
            {!show && <p className="">click to expand</p>}
          </div>
        </div>

        {show && (
          <MintHandler
            role={role}
            session={session}
            prepareMint={prepareMint}
          />
        )}
      </div>
    </div>
  );
}

function MintHandler({ role, prepareMint, session }) {
  const { address } = useAccount();
  const { abi, project, blobs, setDuplicatedIndexes, setSuccessfullyMinted } =
    useContext(MintContextTockable);

  const [preparing, setPreparing] = useState(false);
  const [readyToMint, setReadyToMint] = useState(false);
  const [apiError, setApiError] = useState(false);
  const [enableState, setEnableState] = useState(false);
  const [printedError, setPrintedError] = useState("");
  const [warning, setWarning] = useState("");
  const [writeArgs, setwriteArgs] = useState(initialArgs);

  const { data, refetch } = useContractRead({
    address: project.contractAddress,
    abi,
    functionName: "getSupplyData",
    args: [address, Number(role.id)],
    structuralSharing: (prev, next) => (prev === next ? prev : next),
  });

  useEffect(() => {
    refetch?.();
  }, []);

  function resetMint() {
    setPreparing(false);
    setEnableState(false);
    setReadyToMint(false);
    setwriteArgs(initialArgs);
  }

  const { config } = usePrepareContractWrite({
    address: project.contractAddress,
    abi: abi,
    functionName: "mint",
    args: writeArgs.args,
    value: writeArgs.value,
    // gas: 3_000_000n,
    enabled: enableState,
    onSuccess(_) {
      setReadyToMint(true);
    },
    onError(error) {
      if (error instanceof BaseError) {
        const revertError = error.walk(
          (error) => error instanceof ContractFunctionRevertedError
        );
        if (revertError instanceof ContractFunctionRevertedError) {
          const errorName = revertError.data?.errorName ?? "";
          if (errorName === "MoreThanAllowed") {
            setPrintedError("Mint limit exceeded on this role.");
          } else if (errorName === "MoreThanAvailable") {
            setPrintedError("Mint limit exceeded on this session/contract.");
          } else if (errorName === "NotElligible") {
            setPrintedError("Mint session changed, Please refresh the page.");
          } else if (errorName === "TokenHasBeenTakenBefore") {
            setDuplicatedIndexes(revertError.data.args[0]);
            setPrintedError("This traits has been taken before.");
          } else if (errorName == "TokenIsTakenBefore") {
            setPrintedError("This traits has been taken before.");
          } else {
            setPrintedError(errorName);
          }
        }
      } else {
        setWarning("");
        setPrintedError("Unknown error occured.");
      }
      setSuccessfullyMinted(false);
      resetMint();
    },
  });

  const wc = useContractWrite(config);
  const uwt = useWaitForTransaction({ hash: wc.data?.hash });

  useEffect(() => {
    if (invalidArgs(writeArgs)) {
      setPreparing(false);
      return;
    }
    setEnableState(true);
  }, [writeArgs]);

  useEffect(() => {
    if (!readyToMint) return;
    (async () => wc.write?.())();
  }, [readyToMint]);

  useEffect(() => {
    if (!uwt.isSuccess) return;
    setSuccessfullyMinted(true);
    refetch?.();
    resetMint();
    setWarning("");
    setPrintedError("");
  }, [uwt.isSuccess]);

  useEffect(() => {
    if (!uwt.isError) return;
    setSuccessfullyMinted(false);
    setWarning("");
    setPrintedError("Transaction failed.");
    resetMint();
  }, [uwt.isError]);

  useEffect(() => {
    if (!wc.isError) return;
    setSuccessfullyMinted(false);
    setWarning("");
    resetMint();

    if (
      wc.error.message.match(/^User rejected the request./g) ||
      wc.error.message.match(
        /^MetaMask Tx Signature: User denied trancsaction signature./g
      ) ||
      wc.error.code == 4001
    ) {
      setPrintedError("rejected by user");
    } else {
      setPrintedError("wallet Error occured");
    }
  }, [wc.isError]);

  async function mint() {
    setSuccessfullyMinted(false);
    if (blobs.length === 0) return;

    setPreparing(true);
    setPrintedError("");
    setWarning("");

    const files = new FormData();
    const traits = [];
    blobs.forEach((blob, i) => {
      files.append(`${i}`, blob.blob);
      traits.push(blob.traits);
    });

    const res = await prepareMint(address, role.id, session, files);
    if (res.success === true) {
      const { cids, signature } = res;
      const args = [
        Number(blobs.length),
        cids,
        signature,
        Number(role.id),
        traits,
      ];

      const fee =
        project.slug === "tock"
          ? 1
          : parseEther(
              (
                (Number(role.price) + getBaseFee(project)) *
                blobs.length
              ).toString(),
              "wei"
            );

      setApiError(false);
      setwriteArgs({ args, value: fee });
    } else {
      setApiError(true);
      setPreparing(false);
    }
  }

  return (
    <div>
      {data && (
        <div className="flex flex-col">
          <p className="text-zinc-400 text-xs items-center my-2">
            mint left for wallet on this role:{" "}
            <span className="text-tock-orange text-sm">
              {maxMintable(data)}
            </span>
          </p>
          <div className="flex justify-center">
            {maxMintable(data) != 0 && (
              <Button
                variant="primary"
                disabled={
                  wc.isLoading ||
                  uwt.isLoading ||
                  preparing ||
                  blobs.length > maxMintable(data) ||
                  maxMintable(data) == 0 ||
                  blobs.length === 0
                }
                onClick={() => mint()}
              >
                {!wc.isLoading && !uwt.isLoading && !preparing && (
                  <div>
                    {blobs.length === 0 && <p>basket is empty</p>}
                    {blobs.length > 0 && (
                      <div>
                        {project.slug.toLowerCase() !== "tock" && (
                          <p className="text-sm">
                            mint {blobs.length}{" "}
                            {blobs.length === 1 ? "token" : "tokens"} for{" "}
                            {accPrice(role, project, blobs)}{" "}
                            {project.chainData.nativeToken}
                          </p>
                        )}
                        {project.slug.toLowerCase() === "tock" && (
                          <p className="text-sm">
                            mint {blobs.length}{" "}
                            {blobs.length === 1 ? "token" : "tokens"} for Free
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                )}
                <div>
                  {(wc.isLoading || uwt.isLoading || preparing) && (
                    <Loading
                      isLoading={wc.isLoading || uwt.isLoading || preparing}
                      size={10}
                    />
                  )}
                </div>
              </Button>
            )}
          </div>
          {maxMintable(data) === 0 && (
            <p className="text-tock-red text-xs mt-4 border rounded-2xl border-tock-red p-4">
              currnent wallet does not have any tokens to mint on this role
            </p>
          )}
          {blobs.length > maxMintable(data) && maxMintable(data) !== 0 && (
            <p className="text-tock-red text-xs mt-2 border rounded-2xl border-zinc-400 p-4">
              you are elligible to mint {maxMintable(data)} max in this role,
              please consider removing {blobs.length - maxMintable(data)}{" "}
              {blobs.length - maxMintable(data) === 1 ? "token" : "tokens"} from
              the basket to enable minting in this role.{" "}
            </p>
          )}
          {printedError.length > 0 && (
            <p className="text-tock-red text-xs mt-2">{printedError}</p>
          )}
          {preparing && (
            <p className="text-blue-400 text-xs mt-2">
              preparing basket... please wait...
            </p>
          )}
          {warning.length > 0 && (
            <p className="text-tock-orange text-xs mt-2">{warning}</p>
          )}
          {apiError && (
            <p className="text-tock-red text-xs mt-2">
              something went wrong, please try again.
            </p>
          )}
          {/* <div className="text-tock-green text-xs mt-2">{success.current}</div> */}
        </div>
      )}
    </div>
  );
}

function invalidArgs(_args) {
  if (
    _args.args[1].length === 0 ||
    _args.args[1][0].part1 === EMPTY_BYTES_32 ||
    _args.args[1][0].part2 === EMPTY_BYTES_32 ||
    _args.args[2] === EMPTY_BYTES_32 ||
    _args.args[4].length === 0 ||
    _args.args[4][0][0] === EMPTY_BYTES_32 ||
    _args.value === 0
  ) {
    return true;
  } else {
    return false;
  }
}

function maxMintable(d) {
  if (d) {
    return Math.min(parseInt(d[0]), Math.min(parseInt(d[1]), parseInt(d[2])));
  } else {
    0;
  }
}

function getBaseFee(project) {
  return Number(
    project.chainData[
      project.dropType === "tockable" ? "base_fee" : "regular_base_fee"
    ]
  );
}

function accPrice(role, project, blobs) {
  const BASE_FEE = getBaseFee(project);
  return parseFloat((Number(role.price) + BASE_FEE) * blobs.length)
    .toPrecision(2)
    .toString()
    .charAt(
      parseFloat((Number(role.price) + BASE_FEE) * blobs.length)
        .toPrecision(2)
        .toString().length - 1
    ) === "0"
    ? parseFloat((Number(role.price) + BASE_FEE) * blobs.length)
        .toPrecision(2)
        .toString()
        .slice(0, -1)
    : parseFloat((Number(role.price) + BASE_FEE) * blobs.length)
        .toPrecision(2)
        .toString();
}
