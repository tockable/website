"use client";

import { useState, useEffect } from "react";
import "@rainbow-me/rainbowkit/styles.css";
import {
  RainbowKitProvider,
  darkTheme,
  getDefaultWallets,
} from "@rainbow-me/rainbowkit";
// import { rabbyWallet } from "@rainbow-me/rainbowkit/wallets";
import { connectorsForWallets } from "@rainbow-me/rainbowkit";
import { configureChains, createConfig, WagmiConfig } from "wagmi";
import { publicProvider } from "wagmi/providers/public";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { TOCKABLE_CHAINS } from "./chains";

const { chains, publicClient } = configureChains(TOCKABLE_CHAINS, [
  alchemyProvider({ apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY }),
  publicProvider(),
]);

const appName = process.env.NEXT_PUBLIC_CONNECT_WALLET_APP_NAME;
const projectId = process.env.NEXT_PUBLIC_CONNECT_WALLET_PROJECT_ID;

const { wallets } = getDefaultWallets({
  appName,
  projectId,
  chains,
});


const connectors = connectorsForWallets([
  ...wallets,
  // {
  //   groupName: "New",
  //   wallets: [rabbyWallet({ projectId, chains })],
  // },
]);

// const connectors = connectorsForWallets(
//   [...wallets]

//   // {
//   //   appName: process.env.NEXT_PUBLIC_CONNECT_WALLET_APP_NAME,
//   //   projectId: process.env.NEXT_PUBLIC_CONNECT_WALLET_PROJECT_ID,
//   //   // chains,
//   // }
// );

// const { connectors } = getDefaultWallets({
//   appName: process.env.NEXT_PUBLIC_CONNECT_WALLET_APP_NAME,
//   projectId: process.env.NEXT_PUBLIC_CONNECT_WALLET_PROJECT_ID,
//   chains,
// });

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
});

export default function WagmiProvider({ children }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider
        theme={darkTheme({
          accentColor: "#41f79a",
          accentColorForeground: "black",
          borderRadius: "large",
          fontStack: "system",
          overlayBlur: "small",
        })}
        appInfo={{
          appName: "Tockable",
          learnMoreUrl: "https://tockable.xyz",
        }}
        chains={chains}
      >
        {mounted && <div>{children}</div>}
      </RainbowKitProvider>
    </WagmiConfig>
  );
}
