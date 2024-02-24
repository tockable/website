import WagmiProvider from "@/contexts/wagmi-provider";
import MintpadHeader from "./mintpad-project-header";
import MintpadProjectDetails from "./mintpad-project-details";
import MintpadMainRouter from "./mintpad-main-router";
import Footer from "@/components/design/footer";

export default async function MintpadLanding({ project, abi }) {
  return (
    <main>
      <MintpadHeader project={project} />
      <div id="banner-static" className="flex justify-center">
        <div>
          <MintpadProjectDetails project={project} />
          <WagmiProvider>
            <MintpadMainRouter project={project} abi={abi} />
          </WagmiProvider>
          <Footer />
        </div>
      </div>
    </main>
  );
}
