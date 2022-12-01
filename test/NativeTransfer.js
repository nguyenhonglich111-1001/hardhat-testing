const { expect } = require("chai");
const { ethers } = require("hardhat");
const hre = require("hardhat");

let NativeBatchTransferContract;
let owner;
let provider;
let ownerAddress;
let contractAddress = "0xde5600b2de5f27c1127a9d19189c9bf23f3472e0";
before(async function () {
    NativeBatchTransferContract = await hre.ethers.getContractAt(
        "NativeBatchTransfer",
        "0xde5600b2DE5f27C1127A9D19189c9bf23f3472e0"
    );

    [owner, _] = await hre.ethers.getSigners();
    ownerAddress = await owner.getAddress();

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
            expect(await owner.getAddress()).to.equal(
                "0x72598E10eF4c7C0E651f1eA3CEEe74FCf0A76CF2"
            );
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

    describe("Transfer native token to contract", function () {
        it("Should get the right Balance", async () => {
            const valueTransfer = "0.005";
            const valueTransferStandardize =
                ethers.utils.parseEther(valueTransfer);
            const txData = {
                from: ownerAddress,
                to: contractAddress,
                value: valueTransferStandardize,
            };

            const tx = await owner.sendTransaction(txData)

            await tx.wait()
            
            const contractBalance = await provider.getBalance(contractAddress);
            expect(contractBalance.toString()).to.equal(
                valueTransferStandardize.toString()
            );
        });
    });
});
