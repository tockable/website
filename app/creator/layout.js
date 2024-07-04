import WagmiProvider from "@/contexts/wagmi-provider";
import AuthContext from "@/contexts/auth-context";
import Support from "../support";
export default function CreatorLayout({ children }) {
  return (
    <div>
      <WagmiProvider>
        <AuthContext>{children}</AuthContext>
        <Support />
      </WagmiProvider>
    </div>
  );
}
