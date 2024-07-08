import MintpadContainerDetopia from "./mintpad-container-detopia";
import getHashAndSignature from "@/actions/signature/signature";
import getCidTuple from "@/actions/utils/cid-utils";
import MintProviderTockable from "@/contexts/mint-context-tockable";

export default function MintpadDetopia({ project, abi }) {
  async function prepareMint(_address, _roleId, _sessionId, ipfs) {
    "use server";

    return {
      success: true,
      cids: [],
      signature: "0x",
    };
  }

  return (
    <MintProviderTockable project={project} abi={abi}>
      <MintpadContainerDetopia prepareMint={prepareMint} />
    </MintProviderTockable>
  );
}
