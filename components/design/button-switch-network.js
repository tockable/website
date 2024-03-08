import { useSwitchNetwork } from "wagmi";
import Loading from "@/components/loading/loading";
import Button from "./button";

export default function SwitchNetworkButton({ project, forDeploy = true }) {
  const { isLoading, pendingChainId, switchNetwork, error } =
    useSwitchNetwork();

  return (
    <div className="flex flex-col justify-center items-center">
      <Button
        className="mt-2 sm:mt-0"
        variant="warning"
        type="button"
        onClick={() => switchNetwork?.(Number(project.chainId))}
        disabled={isLoading}
      >
        <div>
          {isLoading && pendingChainId === Number(project.chainId) && (
            <Loading
              isLoading={
                isLoading && pendingChainId === Number(project.chainId)
              }
              size={10}
            />
          )}
          {!isLoading && (
            <div>
              switch network to {project.chain || project.name}{" "}
              {forDeploy === true && <span>for deploy</span>}
            </div>
          )}
        </div>
      </Button>
      {error && (
        <p className="text-tock-red text-xs mt-6">
          Switch network failed. please try again, or changing manually using
          one of the following:
          <div className="text-center">
            <ul className="mt-2">
              <li className="my-1">
                <a
                  className="text-blue-400 hover:text-blue-300"
                  href="https://chainlist.org"
                >
                  chainlist.org
                </a>
              </li>
              <li>
                <a
                  className="text-blue-400 hover:text-blue-300"
                  href="https://chainlist.wtf"
                >
                  chainlist.wtf
                </a>
              </li>
            </ul>
          </div>
        </p>
      )}
    </div>
  );
}
