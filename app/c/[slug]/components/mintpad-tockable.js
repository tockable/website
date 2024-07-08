import MintpadContainerTockable from "./mintpad-container-tockable";
import getHashAndSignature from "@/actions/signature/signature";
import getCidTuple from "@/actions/utils/cid-utils";
import MintProviderTockable from "@/contexts/mint-context-tockable";

export default function MintpadTockable({ project, abi }) {
  async function prepareMint(_address, _roleId, _sessionId, ipfs) {
    "use server";

    if (ipfs.success === false) {
      return {
        success: false,
        message: "cannot upload to ipfs at this moment, please try again.",
      };
    }

    const cids = [];

    if (ipfs.cids.length > 0) {
      ipfs.cids.forEach((cid) => {
        const _cid = getCidTuple(cid);
        cids.push(_cid);
      });
    }

    let sig = {};

    if (_sessionId != 0) {
      sig = await getHashAndSignature(
        project?.creator,
        _address,
        _roleId,
        _sessionId,
        project?.signer
      );
    } else {
      sig = {
        success: true,
        payload:
          "0x1111111111111111111111111111111111111111111111111111111111111111",
      };
    }

    if (!sig.success) {
      return {
        success: false,
        message: "cannot create signature.",
      };
    }

    return {
      success: true,
      cids,
      signature: sig.payload.signature,
    };
  }

  return (
    <MintProviderTockable project={project} abi={abi}>
      <MintpadContainerTockable prepareMint={prepareMint} />
    </MintProviderTockable>
  );
}
