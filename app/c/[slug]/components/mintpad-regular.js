import MintpadContainerRegular from "./mintpad-container-regular";
import getHashAndSignature from "@/actions/signature/signature";
import MintProviderRegular from "@/contexts/mint-context-regular";

export default function MintpadTockable({ project, abi }) {
  async function prepareMint(_address, _roleId, _sessionId) {
    "use server";

    const sig = await getHashAndSignature(
      project?.creator,
      _address,
      _roleId,
      _sessionId,
      project?.signer
    );

    if (!sig.success) {
      return {
        success: false,
        message: "cannot create signature.",
      };
    }

    return {
      success: true,
      signature: sig.payload.signature,
    };
  }

  return (
    <MintProviderRegular project={project} abi={abi}>
      <MintpadContainerRegular prepareMint={prepareMint} />
    </MintProviderRegular>
  );
}
