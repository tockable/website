export const TockableRegularDropFromFactoryV1DeployerV1Abi = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "deployer",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "contractAddress",
        type: "address",
      },
    ],
    name: "ContractDeployed",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_tockableAddress",
        type: "address",
      },
      {
        internalType: "address",
        name: "_signerAddress",
        type: "address",
      },
      {
        internalType: "string",
        name: "_contractName",
        type: "string",
      },
      {
        internalType: "string",
        name: "_tokenName",
        type: "string",
      },
      {
        internalType: "string",
        name: "_tokenSymbol",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "_baseFee",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_totalSupply",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_firstTokenId",
        type: "uint256",
      },
    ],
    name: "deployTockableRegularDropFromFactoryV1",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
];
