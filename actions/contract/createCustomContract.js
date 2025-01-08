import fs from "fs";
import path from "path";
import getChainData from "@/utils/chain-utils";
import { capitalize } from "@/utils/string-utils";

function getBaseContract(_project, _chainId) {
  // const isBlast = _chainId == 168587773 || _chainId == 81457 ? "Blast" : "";
  const isBlast = "";
  const dropType = capitalize(_project.dropType);

  const constructedName = `Flatten${isBlast}${dropType}DropV${_project.version}.sol`;

  const baseContract = fs.readFileSync(
    path.resolve(".", "contracts", constructedName),
    "utf8"
  );

  return baseContract;
}

export default async function createCostimizedContractFile(
  _project,
  _buildDirectory,
  _contractName
) {
  const chainData = getChainData(Number(_project.chainId));
  const baseContract = getBaseContract(_project, chainData.chainId);
  const base_fee =
    _project.dropType === "tockable" || _project.dropType === "temp"
      ? Number(chainData.base_fee)
      : Number(chainData.regular_base_fee);

  let editedBaseContract = baseContract.replace(
    /TockableContractName/g,
    `${_contractName}`
  );

  editedBaseContract = editedBaseContract.replace(
    /string private constant CONTRACT_NAME = "Tockable";/g,
    `string private constant CONTRACT_NAME = "${_contractName}";`
  );
  editedBaseContract = editedBaseContract.replace(
    /string private constant TOKEN_NAME = "tockable";/g,
    `string private constant TOKEN_NAME = "${_project.tokenName}";`
  );
  editedBaseContract = editedBaseContract.replace(
    /string private constant TOKEN_SYMBOL = "TCKBLE";/g,
    `string private constant TOKEN_SYMBOL = "${_project.tokenSymbol}";`
  );
  if (Number(_project.totalSupply) == 0) {
    editedBaseContract = editedBaseContract.replace(
      /uint256 public constant TOTAL_SUPPLY = 0;/g,
      `uint256 public constant TOTAL_SUPPLY = 2 ** 256 - 1;`
    );
  } else {
    editedBaseContract = editedBaseContract.replace(
      /uint256 public constant TOTAL_SUPPLY = 0;/g,
      `uint256 public constant TOTAL_SUPPLY = ${Number(_project.totalSupply)};`
    );
  }

  if (_project.slug.toLowerCase() === "tock") {
    editedBaseContract = editedBaseContract.replace(
      /uint256 private constant BASE_FEE = 0.00025 ether;/g,
      `uint256 private constant BASE_FEE = 0 ether;`
    );
  } else {
    editedBaseContract = editedBaseContract.replace(
      /uint256 private constant BASE_FEE = 0.00025 ether;/g,
      `uint256 private constant BASE_FEE = ${Number(base_fee)} ether;`
    );
  }

  editedBaseContract = editedBaseContract.replace(
    /uint256 private constant FIRST_TOKEN_ID = 1;/g,
    `uint256 private constant FIRST_TOKEN_ID = ${Number(
      _project.firstTokenId
    )};`
  );
  if (
    _project.duplicateVerification === true ||
    _project.duplicateVerification === "true"
  ) {
    editedBaseContract = editedBaseContract.replace(
      /bool public constant duplicateVerification = false;/g,
      `bool public constant duplicateVerification = true;`
    );
  }

  if (_project.isUnlimited === true || _project.isUnlimited === "true") {
    editedBaseContract = editedBaseContract.replace(
      /bool public constant isUnlimited = false;/g,
      `bool public constant isUnlimited = true;`
    );
  }

  return editedBaseContract;
}
