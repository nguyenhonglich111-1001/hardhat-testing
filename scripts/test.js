const hre = require("hardhat")

async function main() {

    const [owner, otherAccount] = await hre.ethers.getSigners();

    console.log(await owner.getAddress())
}


main().catch((error) => {
    console.error(error)
    process.exitCode = 1
})