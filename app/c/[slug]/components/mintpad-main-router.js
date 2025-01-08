// import MintpadTockable from "./mintpad-tockable";
import MintpadRegular from "./mintpad-regular";
import dynamic from "next/dynamic";

const MintpadTockable = dynamic(() => import("./mintpad-tockable"));

export default function MintpadMainRouter({ project, abi }) {
  if (project.dropType === "tockable" || project.dropType === "temp") {
    return <MintpadTockable project={project} abi={abi} />;
  }

  if (project.dropType === "regular" || project.dropType === "mono") {
    return <MintpadRegular project={project} abi={abi} />;
  }
}
