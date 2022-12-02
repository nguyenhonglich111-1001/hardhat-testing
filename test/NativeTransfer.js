const { expect } = require("chai");
const { ethers } = require("hardhat");
const hre = require("hardhat");

let NativeBatchTransferContract;
let owner, receiver1, receiver2;
let provider;
let ownerAddress, receiver1Address, receiver2Address;
let _receivers;
let amounts;
let contractAddress = "0xde5600b2de5f27c1127a9d19189c9bf23f3472e0";
before(async function () {
    NativeBatchTransferContract = await hre.ethers.getContractAt(
        "NativeBatchTransfer",
        "0xde5600b2DE5f27C1127A9D19189c9bf23f3472e0"
    );

    [owner, receiver1, receiver2] = await hre.ethers.getSigners();
    ownerAddress = await owner.getAddress();
    receiver1Address = await receiver1.getAddress();
    receiver2Address = await receiver2.getAddress();

    provider = new hre.ethers.providers.getDefaultProvider(
        `https://eth-goerli.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`
    );

    const contractBalance = await provider.getBalance(contractAddress);
    if (contractBalance.gt(ethers.utils.parseEther("0"))) {
        const Tx_NativeTransfer = await NativeBatchTransferContract.sendETH(
            [ownerAddress],
            [contractBalance]
        );

        await Tx_NativeTransfer.wait();
    }
});

describe("Native Transfer contract", () => {
    describe("Deployment", () => {
        it("Should get the right Owner", async () => {
            expect(await owner.getAddress()).to.equal(ownerAddress);
        });

        it("Should get the right contract address", async () => {
            expect(NativeBatchTransferContract.address).to.equal(
                "0xde5600b2DE5f27C1127A9D19189c9bf23f3472e0"
            );
        });

        it("Current Contract Balance must be 0", async () => {
            const contractBalance = await provider.getBalance(contractAddress);
            expect(contractBalance.toString()).to.equal("0");
        });
    });

    describe("Send ETH validation", function () {
        before(async () => {
            _receivers = [receiver1Address, receiver2Address];
            amounts = [
                ethers.utils.parseEther("0.002"),
                ethers.utils.parseEther("0.003"),
            ];
        });

        it("Validate balance after transfer", async () => {
            const valueTransfer = "0.005";
            const valueTransferStandardize =
                ethers.utils.parseEther(valueTransfer);
            const txData = {
                from: ownerAddress,
                to: contractAddress,
                value: valueTransferStandardize,
            };

            const tx = await owner.sendTransaction(txData);

            await tx.wait();

            const contractBalance = await provider.getBalance(contractAddress);
            expect(contractBalance.toString()).to.equal(
                valueTransferStandardize.toString()
            );
        });

        it("Contract Balance must greater or equal than sum amounts", async () => {
            const contractBalance = await provider.getBalance(contractAddress);

            let sumAmounts = ethers.utils.parseEther("0");

            amounts.forEach((amount) => {
                sumAmounts.add(amount);
            });

            expect(contractBalance.gte(sumAmounts)).to.equal(true);
        });

        describe("Validate receivers balance after call SendETH()", async () => {
            for (let i = 0; i < _receivers.length; ++i) {
                let receiverBalance = await provider.getBalance(
                    _receivers[i]
                );
                it(`Validate ${_receivers[i]} balance after call SendETH()`, async () => {
                    
                    expect(receiverBalance.eq(amounts[i])).to.equal(true);
                });
            }
        });
    });
});
