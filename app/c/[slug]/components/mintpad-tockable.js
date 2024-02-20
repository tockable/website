import MintpadContainerTockable from "./mintpad-container-tockable";
import getHashAndSignature from "@/actions/signature/signature";
import storeMultipleFilesToIpfs from "@/actions/ipfs/uploadMultipleFileToIpfs";
import getCidTuple from "@/actions/utils/cid-utils";
import MintProviderTockable from "@/contexts/mint-context-tockable";

export default function MintpadTockable({ project, abi }) {
  async function prepareMint(_address, _roleId, _sessionId, _files) {
    "use server";

    const ipfs = await storeMultipleFilesToIpfs(_files);

    if (ipfs.success === false) {
      return {
        success: false,
        message: "cannot upload to ipfs at this moment, please try again.",
      };
    }

    const cids = [];

    ipfs.cids.forEach((cid) => {
      const _cid = getCidTuple(cid);
      cids.push(_cid);
    });

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
