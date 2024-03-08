"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAccount } from "wagmi";
import { DROP_TYPES, SUPPORTED_CHAINS } from "@/tock.config";
import getChainData from "@/utils/chain-utils";
import Link from "next/link";
import Loading from "@/components/loading/loading";
import Modal from "@/components/design/modal";
import Button from "@/components/design/button";
import Input from "@/components/design/input";
import { createNewProject } from "@/actions/launchpad/dashboard";

export default function NewProjectModal({ isOpen, onClose }) {
  // Contexts & Hooks
  const router = useRouter();
  const { address } = useAccount();

  // States
  const [name, setName] = useState("");
  const [chainId, setChainId] = useState("1");
  const [dropType, setDropType] = useState(DROP_TYPES[0].type);
  const [creating, setCreating] = useState(false);

  const onChangeName = (e) => setName(e.target.value);
  const onChangeChain = (e) => setChainId(e.target.value);

  async function handleCreateNewProject() {
    if (name.length == 0) return;

    setCreating(true);

    const chain = getChainData(Number(chainId)).name;
    const project = {
      name: name,
      chainId: Number(chainId),
      chain,
      dropType: dropType,
    };

    const res = await createNewProject(address, project);

    if (res.success === true) {
      const launchpadSlug = res.uuid;
      router.push(`/creator/launchpad/${launchpadSlug}/details`);
    } else {
      setError(true);
      setCreating(false);
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="flex basis-3/4 px-4">
        <div className="flex flex-col w-full">
          <h1 className="text-tock-green font-bold text-xl mt-4 mb-6">
            create project
          </h1>

          <div className="mb-10 rounded-2xl bg-zinc-800 p-4">
            <h2 className="text-sm font-bold text-tock-blue mb-2">
              choose your drop{" "}
              <Link
                href="/docs/drop-types"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-blue-400 hover:text-blue-300 transition duration-200 cursor-pointer"
              >
                learn more about NFT drops &gt;
              </Link>
            </h2>
            {DROP_TYPES.map((drop, i) => {
              return (
                <div key={"drop_" + i} className="mt-4">
                  <button
                    type="button"
                    className={`rounded-xl min-h-24 w-full border-2 ${
                      drop.type === dropType
                        ? "border-tock-green bg-zinc-800"
                        : "duration-200 ease-in-out border-zinc-600 bg-tock-semiblack hover:bg-zinc-700 hover:border-zinc-400"
                    }`}
                    onClick={() => setDropType(drop.type)}
                  >
                    <div className="p-4">
                      <h1 className="text-sm text-tock-blue text-start mb-2">
                        {drop.title}
                      </h1>
                      <p className="text-xs text-start text-zinc-400">
                        {drop.description}
                      </p>
                    </div>
                  </button>
                </div>
              );
            })}
          </div>
          <div>
            <div className="bg-zinc-800 rounded-2xl p-4">
              <label className="block text-tock-blue text-sm font-bold mb-2">
                project name{" "}
                <span className="text-xs font-normal text-zinc-400">
                  (required)
                </span>
              </label>
              <Input
                id="project-name"
                type="text"
                placeholder="Cool Collection"
                onChange={onChangeName}
                required
              />
              <label className="mt-6 block text-tock-blue text-sm font-bold mb-2">
                chain
              </label>
              <select
                className="text-sm bg-zinc-700 rounded-xl w-full py-3 px-3 text-gray-200 leading-tight focus:outline-none focus:ring focus:ring-2 focus:ring-zinc-500"
                id="chain"
                name="chain"
                onChange={onChangeChain}
                required
              >
                {SUPPORTED_CHAINS.map((c, i) => (
                  <option key={"chain_" + i} value={c.value}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex justify-center">
              <Button
                variant="primary"
                className="my-8 w-[150px]"
                type="button"
                disabled={name.length == 0 || creating}
                onClick={() => {
                  handleCreateNewProject();
                }}
              >
                {creating && <Loading isLoading={creating} size={10} />}
                {!creating && <p>+ Create</p>}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
