import MintpadSocialbar from "@/components/design/mintpad-socialbar";
import { NFT_STORAGE_GATEWAY } from "@/tock.config";
import { IoOpenOutline } from "react-icons/io5";

export default function MintpadProjectDetails({ project }) {
  const imageSrc =
    project.hasOwnProperty("ipfsProvider") && project.ipfsProvider == "pinata"
      ? `https://ipfs.io/ipfs/${project.image}`
      : `https://${project.image}.${NFT_STORAGE_GATEWAY}`;

  return (
    <div>
      <div className="flex mx-[5%] flex-col lg:flex-row mb-12">
        <figure className="mb-4 lg:mb-0 flex justify-center lg:flex-none">
          <img
            className="rounded-2xl h-[300px] w-[300px] object-cover"
            src={imageSrc}
            width={300}
            height={300}
          />
        </figure>
        <section className="px-8 text-start flex flex-col">
          <h1 className="text-tock-blue font-bold text-4xl mb-8 text-center lg:text-start">
            {project.name}
          </h1>
          <MintpadSocialbar project={project} />
          {project.description.length > 0 && (
            <div className="bg-zinc-800 bg-opacity-70 p-4 border rounded-2xl border-zinc-600">
              <p className="text-sm text-zinc-400">{project.description}</p>
            </div>
          )}

          <article className="text-xs mt-4">
            <p className="text-zinc-400 my-2">
              Total supply:{" "}
              <span className="text-tock-orange">
                {project.isUnlimited && project.isUnlimited === true
                  ? "unlimited"
                  : project.totalSupply}
              </span>
            </p>

            {project.hasOwnProperty("isFrozen") &&
              project.isFrozen === true && (
                <p className="text-zinc-400 my-2">
                  Metadata: <span className="text-tock-orange">Immutable</span>
                </p>
              )}
            {project.hasOwnProperty("isFrozen") &&
              project.isFrozen === false && (
                <p className="text-zinc-400 my-2">
                  Metadata: <span className="text-tock-orange">Mutable</span>
                </p>
              )}
            {project.hasOwnProperty("duplicateVerification") &&
              project.duplicateVerification === true && (
                <p className="text-zinc-400 my-2">
                  Are all tokens unique:{" "}
                  <span className="text-tock-orange">Yes</span>
                </p>
              )}
            {project.hasOwnProperty("duplicateVerification") &&
              project.duplicateVerification === false && (
                <p className="text-zinc-400 my-2">
                  Duplicate minting:{" "}
                  <span className="text-tock-orange">Allowed</span>
                </p>
              )}
            <p className="text-zinc-400 text-xs my-2 flex items-center gap-1">
              Contract:{" "}
              <a
                className="flex gap-2 text-blue-400 transition duration-300 ease-in-out hover:text-blue-300"
                href={`https://${project.chainData.scan}/address/${project.contractAddress}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {project.contractAddress} <IoOpenOutline />
              </a>
            </p>
            <p className="text-zinc-400 text-xs my-2">
              Chain:{" "}
              <span className="text-tock-orange">{project.chainData.name}</span>
            </p>
          </article>
        </section>
      </div>
    </div>
  );
}
