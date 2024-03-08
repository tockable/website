import TXPTables from "./components/points-table";
import WagmiProvider from "@/contexts/wagmi-provider";
import NavbarMintpad from "@/components/design/navbar/navbar-mintpad";
import Footer from "@/components/design/footer";

export default function Page() {
  return (
    <>
      <WagmiProvider>
        <NavbarMintpad />
        <div className="flex justify-center mt-20">
          <div className="basis-11/12 md:basis-3/4 lg:basis-3/5">
            <div className="rounded-2xl p-4 mt-8 bg-tock-semiblack">
              <TXPTables />
            </div>
          </div>
        </div>
      </WagmiProvider>
      <Footer />
    </>
  );
}
