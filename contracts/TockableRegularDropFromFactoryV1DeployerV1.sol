// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import {TockableRegularDropFromFactoryV1} from "./TockableRegularDropFromFactoryV1.sol";

contract TockableRegularDropFromFactoryV1DeployerV1 {
    function deployTockableRegularDropFromFactoryV1(
        address _tockableAddress,
        address _signerAddress,
        string memory _contractName,
        string memory _tokenName,
        string memory _tokenSymbol,
        uint256 _baseFee,
        uint256 _totalSupply
    ) external returns (address) {
        TockableRegularDropFromFactoryV1 newCollection = new TockableRegularDropFromFactoryV1(
                _tockableAddress,
                _signerAddress,
                _contractName,
                _tokenName,
                _tokenSymbol,
                _baseFee,
                _totalSupply
            );

        newCollection.transferOwnership(msg.sender);

        return address(newCollection);
    }
}
