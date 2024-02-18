import WagmiProvider from "@/contexts/wagmi-provider";
import AuthContext from "@/contexts/auth-context";

export default function CreatorLayout({ children }) {
  return (
    <div>
      <WagmiProvider>
        <AuthContext>{children}</AuthContext>
      </WagmiProvider>
    </div>
  );
}
