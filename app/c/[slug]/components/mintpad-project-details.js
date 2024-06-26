import MintpadSocialbar from "@/components/design/mintpad-socialbar";
import { NFT_STORAGE_GATEWAY } from "@/tock.config";
export default function MintpadProjectDetails({ project }) {
  return (
    <div>
      <h1 className=" mx-[5%]  mt-4 text-tock-blue font-bold text-4xl mb-8 text-center lg:text-start">
        {project.name}
      </h1>
      <div className="flex mx-[5%] flex-col lg:flex-row mb-12">
        <figure className="mb-4 lg:mb-0 flex justify-center lg:flex-none">
          <img
            className="rounded-2xl h-[300px] w-[300px] object-cover"
            src={`https://${project.image}.${NFT_STORAGE_GATEWAY}`}
            width={300}
            height={300}
          />
        </figure>
        <section className="px-8 text-center lg:text-start flex flex-col">
          <div className="bg-zinc-800 bg-opacity-70 p-4 border rounded-2xl border-zinc-600">
            <p className="text-sm text-zinc-400">{project.description}</p>
          </div>
          {(project.twitter.length > 0 ||
            project.discord.length > 0 ||
            project.website.length > 0) && (
            <MintpadSocialbar project={project} />
          )}
          <article className="text-xs mt-4">
            {project.slug !== "tock" && (
              <p className="text-zinc-400 my-2">
                total supply:{" "}
                <span className="text-tock-orange">
                  {project.isUnlimited && project.isUnlimited === true
                    ? "unlimited"
                    : project.totalSupply}
                </span>
              </p>
            )}
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
            <p className="text-zinc-400 text-xs my-2">
              Contract:{" "}
              <span className="text-tock-orange">
                {project.contractAddress}
              </span>
            </p>
            <p className="text-zinc-400 text-xs my-2">
              Chain:{" "}
              <span className="text-tock-orange">{project.chainData.name}</span>
            </p>
            <p className="text-zinc-400 text-xs my-2">
              See contract on:{" "}
              <a
                className="text-blue-400 transition duration-300 ease-in-out hover:text-blue-300"
                href={`https://${project.chainData.scan}/address/${project.contractAddress}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {project.chainData.scan}
              </a>
            </p>
          </article>
        </section>
      </div>
    </div>
  );
}
