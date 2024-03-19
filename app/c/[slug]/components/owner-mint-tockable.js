import { useState, useContext, useEffect } from "react";
import { BaseError, ContractFunctionRevertedError } from "viem";
import {
  usePrepareContractWrite,
  useContractWrite,
  useAccount,
  useWaitForTransaction,
} from "wagmi";
import { EMPTY_BYTES_32 } from "@/constants/constants";
import { MintContextTockable } from "@/contexts/mint-context-tockable";
import Button from "@/components/design/button";
import Loading from "@/components/loading/loading";
import storeFileToIpfs from "@/actions/ipfs/uploadFileToIpfs";

const initialArgs = [
  1,
  [{ part1: EMPTY_BYTES_32, part2: EMPTY_BYTES_32 }],
  [[{ trait_type: EMPTY_BYTES_32, value: EMPTY_BYTES_32 }]],
];

export default function OwnerMintTockable({ prepareMint }) {
  const [show, setShow] = useState(false);

  const handleClick = () => setShow(true);

  return (
    <div className="w-full">
      <div
        onClick={handleClick}
        className={`flex grow bg-tock-black rounded-2xl py-3 px-4 my-4 mx-4 ${
          !show &&
          "hover:bg-tock-semiblack hover:ring hover:ring-zinc-600 transition ease-in-out duration-200 cursor-pointer"
        }`}
      >
        <div className="flex flex-col gap-4 w-full">
          <div className="flex">
            <div className="flex-auto">
              <p className="text-zinc-400 text-xs items-center">
                mint as <span className="text-tock-orange text-sm">owner</span>{" "}
                | Max mint/wallet:{" "}
                <span className="text-tock-orange text-xl">
                  <sub>&infin;</sub>
                </span>{" "}
                | price: <span className="text-tock-orange">Free</span>
              </p>
            </div>
            <div className="text-tock-green text-xs justify-end">
              {!show && <span>click to see</span>}
            </div>
          </div>

          {show && <MintHandler prepareMint={prepareMint} />}
        </div>
      </div>
    </div>
  );
}

function MintHandler({ prepareMint }) {
  const { abi, project, blobs, setDuplicatedIndexes, setSuccessfullyMinted } =
    useContext(MintContextTockable);
  const { address } = useAccount();

  const [preparing, setPreparing] = useState(false);
  const [readyToMint, setReadyToMint] = useState(false);
  const [apiError, setApiError] = useState(false);
  const [enableState, setEnableState] = useState(false);
  const [printedError, setPrintedError] = useState("");
  const [warning, setWarning] = useState("");
  const [writeArgs, setwriteArgs] = useState(initialArgs);

  function resetMint() {
    setPreparing(false);
    setEnableState(false);
    setReadyToMint(false);
    setwriteArgs(initialArgs);
  }

  const { config } = usePrepareContractWrite({
    address: project.contractAddress,
    abi: abi,
    functionName: "ownerMint",
    args: writeArgs,
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
            setPrintedError("This traits has been taken before.");
            setDuplicatedIndexes(revertError.data.args[0]);
          } else if (errorName == "TokenIsTakenBefore") {
            setPrintedError("This traits has been taken before.");
          } else {
            setWarning("");
            setPrintedError("Unknown error occured.");
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
    async function w() {
      wc.write?.();
    }
    if (wc.write) {
      w();
    }
  }, [readyToMint]);

  useEffect(() => {
    if (!uwt.isSuccess) return;
    setSuccessfullyMinted(true);
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
      setPrintedError("Rejected by user.");
    } else {
      setPrintedError("An Error occured");
    }
  }, [wc.isError]);

  const [numberOfFiles, setNumberOfFiles] = useState(0);

  async function mint() {
    setNumberOfFiles(0);
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

    const ipfs = await storeMultipleFilesToIpfsClient(files);
    const res = await prepareMint(address, 0, 0, ipfs);
    if (res.success === true) {
      const { cids } = res;
      const _args = [Number(blobs.length), cids, traits];
      setApiError(false);
      setwriteArgs(_args);
    } else {
      setApiError(true);
      setPreparing(false);
    }
  }

  async function storeMultipleFilesToIpfsClient(_files) {
    setNumberOfFiles(0);
    const buffers = await prepareBuffers(_files);
    let _success = true;

    const cids = [];

    for (let key of _files.entries()) {
      const res = await storeFileToIpfs(
        buffers[Number(key[0])].buffer,
        buffers[Number(key[0])].type
      );

      if (res.success === true) {
        cids.push(res.cid);
        setNumberOfFiles(cids.length);
      } else {
        _success = false;
        return;
      }
    }

    if (!_success) return { success: false, cids: null };

    return { success: true, cids };
  }

  async function prepareBuffers(_files) {
    const buffers = [];

    for (let key of _files.entries()) {
      const file = key[1];
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      buffers.push({ buffer, type: "image/png" });
    }

    return buffers;
  }

  return (
    <div className="flex flex-col">
      <div className="flex justify-center">
        <Button
          variant="primary"
          disabled={
            wc.isLoading || uwt.isLoading || preparing || blobs.length === 0
          }
          onClick={() => mint()}
        >
          {!wc.isLoading && !uwt.isLoading && !preparing && (
            <div>
              {blobs.length === 0 && <p>basket is empty</p>}
              {blobs.length > 0 && (
                <p className="text-sm">
                  mint {blobs.length} {blobs.length === 1 ? "token" : "tokens"}{" "}
                  for Free
                </p>
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
      </div>
      {preparing && (
        <p className="text-center text-xs mt-22 text-tock-orange">
          Uploading {numberOfFiles}/{blobs.length}. Please wait. it may take a
          while...
        </p>
      )}

      {printedError.length > 0 && (
        <p className="text-tock-red text-xs">{printedError}</p>
      )}
      {warning.length > 0 && (
        <p className="text-tock-orange text-xs mt-2">{warning}</p>
      )}
      {apiError && (
        <p className="text-tock-red text-xs mt-2">
          something went wrong, please try again.
        </p>
      )}
    </div>
  );
}

function invalidArgs(_args) {
  if (
    _args[1].length === 0 ||
    _args[1][0].part1 === EMPTY_BYTES_32 ||
    _args[1][0].part2 === EMPTY_BYTES_32 ||
    _args[2].length === 0 ||
    _args[2][0][0] === EMPTY_BYTES_32
  ) {
    return true;
  } else {
    return false;
  }
}
