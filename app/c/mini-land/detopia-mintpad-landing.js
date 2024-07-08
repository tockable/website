import WagmiProvider from "@/contexts/wagmi-provider";
import MintpadHeader from "../[slug]/components/mintpad-project-header";
import MintpadProjectDetails from "../[slug]/components/mintpad-project-details";
import MintpadDetopia from "./mintpad-detopia";
import Footer from "@/components/design/footer";
import Support from "@/app/support";

export default async function MintpadLandingDeetopia({ project, abi }) {
  return (
    <main>
      <MintpadHeader project={project} />
      <div id="banner-static" className="flex justify-center">
        <div>
          <MintpadProjectDetails project={project} />
          <WagmiProvider>
            <MintpadDetopia project={project} abi={abi} />
          </WagmiProvider>
          <Support />
          <Footer />
        </div>
      </div>
    </main>
  );
}
