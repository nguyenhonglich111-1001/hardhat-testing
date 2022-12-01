const hre = require("hardhat")

async function main() {

    const NativeBatchTransferFactory = await hre.ethers.getContractFactory("NativeBatchTransfer")
    const NativeBatchTransferInstance = await NativeBatchTransferFactory.deploy()

    await NativeBatchTransferInstance.deployed()

    console.log(
        'NativeBatchTransfer deploy to :', NativeBatchTransferInstance.address
    )
}


main().catch((error) => {
    console.error(error)
    process.exitCode = 1
})