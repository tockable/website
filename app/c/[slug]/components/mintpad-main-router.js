import MintpadTockable from "./mintpad-tockable";
import MintpadRegular from "./mintpad-regular";

export default function MintpadMainRouter({ project, abi }) {
  if (project.dropType === "tockable") {
    <MintpadTockable project={project} abi={abi} />;
  }
  
  if (project.dropType === "regular") {
    <MintpadRegular project={project} abi={abi} />;
  }
}
