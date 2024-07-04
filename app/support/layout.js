"use client";
import NavbarMintpad from "@/components/design/navbar/navbar-mintpad";
import WagmiProvider from "@/contexts/wagmi-provider";
export default function Supportlayout({ children }) {
  return (
    <WagmiProvider>
      <NavbarMintpad />
      {children}
    </WagmiProvider>
  );
}
