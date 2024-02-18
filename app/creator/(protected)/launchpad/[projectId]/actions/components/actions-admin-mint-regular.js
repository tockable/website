import { useState } from "react";
import { zeroAddress } from "viem";
import {
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";
import { regex } from "@/constants/regex";
import Loading from "@/components/loading/loading";
import LabeledInput from "@/components/design/labeled-input";
import Button from "@/components/design/button";

export default function ActionAdminMintRegular({ abi, _project }) {
  const [project] = useState(_project);
  const [address, setAddress] = useState(_project?.creator);
  const [correctAddress, setCorreactAddress] = useState(false);
  const [showAddressError, setAddressError] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const onChangeAddress = (e) => {
    if (e.target.value === "") {
      setCorreactAddress(false);
      setAddressError(false);
    } else if (
      e.target.value.match(regex.evmAddress) &&
      e.target.value !== zeroAddress
    ) {
      setCorreactAddress(true);
      setAddressError(false);
    } else {
      setCorreactAddress(false);
      setAddressError(true);
    }
    setAddress(e.target.value);
  };

  const onChangeQuantity = (e) => setQuantity(Number(e.target.value));

  const { config } = usePrepareContractWrite({
    address: project.contractAddress,
    abi: abi,
    functionName: "ownerMint",
    args: [address, quantity],
    enabled: quantity > 0 && correctAddress,
    // gas: 3_000_000n,
  });

  const { data, isLoading, isError, write, error } = useContractWrite(config);
  const uwt = useWaitForTransaction({ hash: data?.hash });

  return (
    <section id="withdraw">
      <div>
        <h1 className="font-bold text-sm text-tock-blue mb-4 ">Admin Mint</h1>
      </div>
      <LabeledInput
        className="mb-8"
        value={address}
        type="text"
        onChange={onChangeAddress}
        placeholder="0x..."
      >
        Destination Address
      </LabeledInput>
      <LabeledInput
        className="mb-8"
        type="number"
        min={1}
        step={1}
        onChange={onChangeQuantity}
        placeholder="1"
        subtitle="Wrong address may cause permanent loss of your assets."
      >
        Quantity
      </LabeledInput>
      <Button
        className="mt-6 w-32"
        variant={"secondary"}
        disabled={isLoading || uwt.isLoading || !correctAddress}
        onClick={() => write?.()}
      >
        {(isLoading || uwt.isLoading) && (
          <Loading isLoading={isLoading || uwt.isLoading} size={10} />
        )}
        {!isLoading && !uwt.isLoading && <p>Mint</p>}
      </Button>
      {showAddressError && (
        <p className="text-tock-red mt-2 text-xs">Address is invalid</p>
      )}
      {isError && <p className="text-tock-red mt-2 text-xs">{error?.name}</p>}
      {uwt.isError && <p className="text-tock-red mt-2 text-xs">tx failed</p>}
      {uwt.isSuccess && (
        <p className="text-tock-green mt-2 text-xs">Successfully Minted.</p>
      )}
    </section>
  );
}
