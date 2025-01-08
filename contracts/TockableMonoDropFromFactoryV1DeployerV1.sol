// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import {TockableMonoDropFromFactoryV1} from "./TockableMonoDropFromFactoryV1.sol";

contract TockableMonoDropFromFactoryV1DeployerV1 {
    function deployTockableMonoDropFromFactoryV1(
        address _tockableAddress,
        address _signerAddress,
        string memory _contractName,
        string memory _tokenName,
        string memory _tokenSymbol,
        uint256 _baseFee,
        uint256 _totalSupply,
        uint256 _firstTokenId,
        bool _isUnlimited
    ) external returns (address) {
        TockableMonoDropFromFactoryV1 newCollection = new TockableMonoDropFromFactoryV1(
            _tockableAddress,
            _signerAddress,
            _contractName,
            _tokenName,
            _tokenSymbol,
            _baseFee,
            _totalSupply,
            _firstTokenId,
            _isUnlimited
        );

        newCollection.transferOwnership(msg.sender);

        return address(newCollection);
    }
}
