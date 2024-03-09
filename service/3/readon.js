import {ethers} from "ethers";

function generateRandomNumber() {
    const min = "1000000000000000000";
    const max = "9999999999999999999";
    const randomNum = Math.floor(Math.random() * (Number(max) - Number(min) + 1)) + Number(min);
    return ethers.BigNumber.from(randomNum.toString());
}

async function readon(key) {
    try {

        const contract_address = '0x8286d601a0ed6cf75e067e0614f73a5b9f024151'
        const provider = new ethers.providers.JsonRpcProvider('https://rpc.linea.build')
        const wallet = new ethers.Wallet(key, provider)
        const ABI = [
            'function curate(uint64 contentUrl) public',
        ]
        const contract = new ethers.Contract(contract_address, ABI, wallet)
        const transaction = await contract.curate(generateRandomNumber())
        console.log('readon:', transaction.hash)
        const receipt = await transaction.wait()
        if (receipt.status === 1) {
            return transaction.hash
        } else {
            return false
        }
    } catch (e) {
        console.log(e)
        return false
    }
}

export default readon