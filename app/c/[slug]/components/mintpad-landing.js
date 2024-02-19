import WagmiProvider from "@/contexts/wagmi-provider";
import Mintpad from "./mintpad";
import MintpadHeader from "./mintpad-project-header";
import MintpadProjectDetails from "./mintpad-project-details";
import getHashAndSignature from "@/actions/signature/signature";
import storeMultipleFilesToIpfs from "@/actions/ipfs/uploadMultipleFileToIpfs";
import getCidTuple from "@/actions/utils/cid-utils";
import MintProvider from "@/contexts/mint-context";
import Footer from "@/components/design/footer";

export default async function MintpadLanding({ project, abi }) {
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
    <main>
      <MintpadHeader project={project} />
      <div id="banner-static" className="flex justify-center">
        <div>
          <MintpadProjectDetails project={project} />
          <WagmiProvider>
            <MintProvider project={project} abi={abi}>
              <Mintpad prepareMint={prepareMint} />
            </MintProvider>
          </WagmiProvider>
          <Footer />
        </div>
      </div>
    </main>
  );
}
