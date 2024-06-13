import { ConnectButton } from "@rainbow-me/rainbowkit";
import Button from "./design/button";
export default function TockConnectButton() {
  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        mounted,
      }) => {
        const ready = mounted;
        const connected = ready && account && chain;
        return (
          <div
            {...(!ready && {
              "aria-hidden": true,
              style: {
                opacity: 0,
                pointerEvents: "none",
                userSelect: "none",
              },
            })}
          >
            {(() => {
              if (!connected) {
                return (
                  <Button
                    variant={"primary"}
                    type="button"
                    onClick={openConnectModal}
                  >
                    Connect Wallet
                  </Button>
                );
              }
              if (chain.unsupported) {
                return (
                  <Button
                    variant={"warninng"}
                    type="button"
                    onClick={openChainModal}
                  >
                    Wrong network
                  </Button>
                );
              }
              return (
                <div className="flex gap-2">
                  <button
                    className="bg-black/50 text-xs flex items-center p-3 rounded-xl hover:bg-black/20 hover:ring text-tock-blue transition duration-200"
                    onClick={openChainModal}
                    type="button"
                  >
                    {chain.hasIcon && (
                      <div>
                        {chain.iconUrl && (
                          <img
                            className="hidden sm:flex w-4 h-4"
                            alt={chain.name ?? "Chain icon"}
                            src={chain.iconUrl}
                          />
                        )}
                      </div>
                    )}
                    {!chain.hasIcon && <span> {chain.name}</span>}
                  </button>
                  <button
                    className="bg-black/50 flex items-center p-3 rounded-xl hover:bg-black/20 hover:ring text-tock-blue transition duration-200"
                    onClick={openAccountModal}
                    type="button"
                  >
                    {account.displayName}
                  </button>
                </div>
              );
            })()}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
}
