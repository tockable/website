export default function DeployedMetadataView({ project }) {
  return (
    <>
      <h1 className="font-bold text-xl mt-4 mb-6">
        <span className="text-tock-green ">contract info of </span>
        <span className="text-tock-orange">{project.tokenName}</span>
      </h1>
      <div className="p-4 border border-zinc-600 rounded-2xl mb-4 bg-zinc-800">
        <section className="mt-2 mb-8">
          {((project.hasOwnProperty("cid") && project.cid.length === 0) ||
            (project.hasOwnProperty("cids") && project.cids.length === 0)) && (
            <div>
              <p className="text-tock-blue font-bold text-sm">
                {project.cid ? "Base URI" : "URI directories"}
              </p>
              <p className="text-tock-orange font-normal text-sm">
                Not deployed yet
              </p>
            </div>
          )}
          {project.hasOwnProperty("cid") && project.cid.length > 0 && (
            <>
              {project.dropType === "regular" && (
                <div>
                  <p className="text-tock-blue font-bold text-sm">Base URI</p>
                  <p className="text-zinc-400 text-sm mt-2">
                    {`ipfs://${project.cid}/`}
                  </p>
                </div>
              )}
              {project.dropType === "mono" && (
                <div>
                  <p className="text-tock-blue font-bold text-sm">Image URI</p>
                  <p className="text-zinc-400 text-sm mt-2">
                    {`ipfs://${project.cid}`}
                  </p>
                </div>
              )}
            </>
          )}
          {project.hasOwnProperty("cids") && project.cids.length > 0 && (
            <div>
              <p className="text-tock-blue font-bold text-sm">
                URI directories
              </p>
              {project.cids.map((cid, i) => (
                <p
                  key={"cid_" + i}
                  className="text-zinc-400 text-sm mt-2 p-2 border-[0.5px] border-zinc-700 rounded-2xl transition duration-200 hover:bg-zinc-700"
                >
                  {`ipfs://${cid}/`}
                </p>
              ))}
            </div>
          )}
        </section>
      </div>
    </>
  );
}
