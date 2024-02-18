"use client";

import { useState, useEffect } from "react";
import { SiweMessage } from "siwe";
import { useAccount, useSignMessage } from "wagmi";
import { getCsrfToken, signIn } from "next-auth/react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Button from "@/components/design/button";
import Loading from "@/components/loading/loading";
import { useNetwork } from "wagmi";
import TockableLogo from "@/svgs/logo";
import Fade from "@/components/design/fade/fade";

export default function SignInWithEthereum() {
  const [hasSigned, setHasSigned] = useState(false);

  const [showSwe, setShowSwe] = useState(false);
  const [showConnect, setShowConnect] = useState(true);
  const { address, isConnected } = useAccount();
  const [showFullAddress, setShowFullAddress] = useState(false);
  const [addressChanged, setAddressChanged] = useState(false);
  const [connectedAcc, setConnectedAcc] = useState(null);
  const { signMessageAsync } = useSignMessage();
  const { chains, chain } = useNetwork();

  function handleShowFullAddress() {
    setShowFullAddress(true);
  }

  function handleHideFullAddress() {
    setShowFullAddress(false);
  }

  async function handleSign() {
    const connectedChainId = chains.find((c) => (c.id = chain?.id));
    if (!isConnected) return;
    try {
      const message = new SiweMessage({
        domain: window.location.host,
        uri: window.location.origin,
        version: "1",
        address: address,
        statement: process.env.NEXT_PUBLIC_SIGNIN_MESSAGE,
        nonce: await getCsrfToken(),
        chainId: connectedChainId.id,
      });

      const signedMessage = await signMessageAsync({
        message: message.prepareMessage(),
      });

      setHasSigned(true);

      const _callBackurl = (() => {
        const _url = sessionStorage.getItem("tock") || "dashboard";
        sessionStorage.removeItem("tock");
        return `/creator/${_url}`;
      })();

      const response = await signIn("web3", {
        message: JSON.stringify(message),
        signedMessage,
        redirect: true,
        callbackUrl: _callBackurl,
      });
      if (response?.error) {
        console.log("Error occured:", response.error);
      }
    } catch (error) {
      console.log("Error Occured", error);
    }
  }

  useEffect(() => {
    if (!connectedAcc) return;
    if (!address) {
      setConnectedAcc(null);
      setAddressChanged(false);
      setShowConnect(true);
      return;
    }
    if (connectedAcc.toLowerCase() !== address.toLowerCase()) {
      setAddressChanged(true);
      setShowSwe(false);
      setTimeout(() => setShowConnect(true, 400));
    }
  }, [address]);

  useEffect(() => {
    if (!isConnected) return;
    setConnectedAcc(address);
    setTimeout(() => setShowSwe(true), 400);
  }, [isConnected]);

  function continueToSign() {
    setAddressChanged(false);
    setConnectedAcc(address);
    setShowConnect(false);
    setTimeout(() => setShowSwe(true), 400);
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="bg-tock-semiblack rounded-xl m-4 p-4 flex flex-col basis-11/12 lg:basis-1/2 h-[600px] ">
        <h1 className="text-xl text-center font-bold text-tock-green mb-4 border-b border-zinc-700 pb-2 w-full">
          Sign in to Tockable
        </h1>
        <div className="flex h-64 flex-auto flex-col items-center justify-center mt-4">
          <h3 className="text-center text-md font-normal text-gray-300 mb-4">
            Welcome to <b>Tockable.xyz</b>'s creator hub!
          </h3>

          <div>
            <TockableLogo className="h-24 rounded-xl" />
          </div>
        </div>
        <div className="">
          {(!isConnected || addressChanged) && !hasSigned && (
            <Fade show={showConnect}>
              <div className="bg-tock-black rounded-xl w-full border-zinc-400 p-4">
                <p className="text-sm text-center font-normal text-gray-400 mb-4">
                  please connect your wallet
                </p>
                <div className="my-4 flex justify-center">
                  <ConnectButton />
                </div>
                {addressChanged && (
                  <div className="flex flex-col justify-center items-center">
                    <p className="text-xs font-normal text-orange-400 mb-4">
                      It seems you've changed your account, do you wish to
                      continue?
                    </p>
                    <Button
                      variant="primary"
                      className="w-64"
                      onClick={continueToSign}
                    >
                      Continue with this account
                    </Button>
                  </div>
                )}
              </div>
            </Fade>
          )}
          {isConnected && !addressChanged && !hasSigned && (
            <Fade show={showSwe && !addressChanged && !hasSigned}>
              <div className="bg-tock-black rounded-xl w-full border-zinc-400 p-4">
                <p className="text-xl text-center font-bold text-tock-green mb-4">
                  welcome
                </p>
                <div
                  onMouseEnter={handleShowFullAddress}
                  onMouseLeave={handleHideFullAddress}
                  className="bg-tock-semiblack h-18 flex justify-center items-center text-center p-4 rounded-xl border-zinc-400 text-sm text-tock-blue font-bold rounded-xl p-2 mb-4"
                >
                  {!showFullAddress && (
                    <p>
                      {address.slice(0, -35)}...{address.slice(35)}
                    </p>
                  )}
                  {showFullAddress && <p className="break-all">{address}</p>}
                </div>

                <p className="text-center text-sm font-normal text-zinc-400 my-8">
                  You can securely sign in to Tockable.xyz with Ethereum
                </p>
                <div className="flex justify-center">
                  <Button onClick={handleSign} variant="secondary">
                    Sign in wtih Ethereum
                  </Button>
                </div>
              </div>
            </Fade>
          )}
          {isConnected && hasSigned && (
            <div className="flex justify-center items-center h-44">
              <Loading isLoading={isConnected && hasSigned} size={20} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
