import { useState } from "react";
import {
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";
import Button from "@/components/design/button";
import Loading from "@/components/loading/loading";

export default function ActionWithdraw({ abi, _project }) {
  return (
    <>
      <Withdraw _project={_project} abi={abi} />
      {_project?.chainID === 168587773 && (
        <div>
          <ClaimAllGas _project={_project} abi={abi} />
          <ClaimMaxGas _project={_project} abi={abi} />
        </div>
      )}
    </>
  );
}

function Withdraw({ abi, _project }) {
  const [project] = useState(_project);

  const { config } = usePrepareContractWrite({
    address: project.contractAddress,
    abi: abi,
    functionName: "withdraw",
    // gas: 3_000_000n,
  });

  const { data, isLoading, isError, write, error } = useContractWrite(config);
  const uwt = useWaitForTransaction({ hash: data?.hash });

  return (
    <section
      id="withdraw"
      className="border border-zinc-700 rounded-xl p-4 mb-6"
    >
      <div>
        <h1 className="font-bold text-sm text-tock-blue mb-4 ">Withdraw</h1>
      </div>
      <p className="text-zinc-400 font-normal text-xs mt-2 mb-2">
        Withdraw from sale
      </p>
      <p className="text-zinc-400 font-normal text-xs mt-2 mb-6">
        contract owner (destination address):{" "}
        <span className="text-tock-orange">{project.creator}</span>
      </p>
      <Button
        className="mt-6"
        variant={"secondary"}
        disabled={isLoading || uwt.isLoading || !write}
        onClick={() => write?.()}
      >
        {(isLoading || uwt.isLoading) && (
          <Loading isLoading={isLoading || uwt.isLoading} size={10} />
        )}
        {!isLoading && !uwt.isLoading && <p>Withdraw all</p>}
      </Button>
      {isError && <p className="text-tock-red mt-2 text-xs">{error?.name}</p>}
      {uwt.isError && <p className="text-tock-red mt-2 text-xs">tx failed</p>}
      {uwt.isSuccess && (
        <p className="text-tock-green mt-2 text-xs">Successfully Withdrew.</p>
      )}
    </section>
  );
}

function ClaimAllGas({ abi, _project }) {
  const [project] = useState(_project);

  const { config } = usePrepareContractWrite({
    address: project.contractAddress,
    abi: abi,
    functionName: "claimAllGas",
    // gas: 3_000_000n,
  });

  const { data, isLoading, isError, write, error } = useContractWrite(config);
  const uwt = useWaitForTransaction({ hash: data?.hash });

  return (
    <section
      id="claimAllGas"
      className="border border-zinc-700 rounded-xl p-4 mb-6"
    >
      <div>
        <h1 className="font-bold text-sm text-tock-blue mb-4 ">ClaimAllGas</h1>
      </div>
      <p className="text-zinc-400 font-normal text-xs mt-2 mb-2">
        Withdraw all available gas with current claim-rate.
      </p>
      <p className="text-xs">
        <a
          className="text-blue-400 hover:text-blue-300"
          href="https://docs.blast.io/building/guides/gas-fees"
          target="_blank"
          rel="noopener noreferrer"
        >
          learn about claiming gas fees on Blast &gt;
        </a>
      </p>
      <p className="text-zinc-400 font-normal text-xs mt-2 mb-6">
        contract owner (destination address):{" "}
        <span className="text-tock-orange">{project.creator}</span>
      </p>
      <Button
        className="mt-6"
        variant={"secondary"}
        disabled={isLoading || uwt.isLoading || !write}
        onClick={() => write?.()}
      >
        {(isLoading || uwt.isLoading) && (
          <Loading isLoading={isLoading || uwt.isLoading} size={10} />
        )}
        {!isLoading && !uwt.isLoading && <p>Claim All Gas</p>}
      </Button>
      {isError && <p className="text-tock-red mt-2 text-xs">{error?.name}</p>}
      {uwt.isError && <p className="text-tock-red mt-2 text-xs">tx failed</p>}
      {uwt.isSuccess && (
        <p className="text-tock-green mt-2 text-xs">Successfully Claimed.</p>
      )}
    </section>
  );
}

function ClaimMaxGas({ abi, _project }) {
  const [project] = useState(_project);

  const { config } = usePrepareContractWrite({
    address: project.contractAddress,
    abi: abi,
    functionName: "claimMaxGas",
    // gas: 3_000_000n,
  });

  const { data, isLoading, isError, write, error } = useContractWrite(config);
  const uwt = useWaitForTransaction({ hash: data?.hash });

  return (
    <section
      id="claimMaxGas"
      className="border border-zinc-700 rounded-xl p-4 mb-6"
    >
      <div>
        <h1 className="font-bold text-sm text-tock-blue mb-4 ">ClaimMaxGas</h1>
      </div>
      <p className="text-zinc-400 font-normal text-xs mt-2 mb-2">
        Withdraw max available gas fees.
      </p>
      <p className="text-xs">
        <a
          className="text-blue-400 hover:text-blue-300"
          href="https://docs.blast.io/building/guides/gas-fees"
          target="_blank"
          rel="noopener noreferrer"
        >
          learn about gas claim-rates on blast &gt;
        </a>
      </p>
      <p className="text-zinc-400 font-normal text-xs mt-2 mb-6">
        contract owner (destination address):{" "}
        <span className="text-tock-orange">{project.creator}</span>
      </p>
      <Button
        className="mt-6"
        variant={"secondary"}
        disabled={isLoading || uwt.isLoading || !write}
        onClick={() => write?.()}
      >
        {(isLoading || uwt.isLoading) && (
          <Loading isLoading={isLoading || uwt.isLoading} size={10} />
        )}
        {!isLoading && !uwt.isLoading && <p>Claim Max Gas</p>}
      </Button>
      {isError && <p className="text-tock-red mt-2 text-xs">{error?.name}</p>}
      {uwt.isError && <p className="text-tock-red mt-2 text-xs">tx failed</p>}
      {uwt.isSuccess && (
        <p className="text-tock-green mt-2 text-xs">Successfully Claimed.</p>
      )}
    </section>
  );
}
