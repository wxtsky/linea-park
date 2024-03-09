import {ethers} from "ethers";


async function asmatch(key) {
    try {

        const contract_address = '0xc043bce9af87004398181a8de46b26e63b29bf99'
        const provider = new ethers.providers.JsonRpcProvider('https://rpc.linea.build')
        const wallet = new ethers.Wallet(key, provider)
        const data = '0xefef39a10000000000000000000000000000000000000000000000000000000000000001'
        const transaction = await wallet.sendTransaction({
            to: contract_address,
            data: data,
            value: ethers.utils.parseEther('0.0001')
        })
        console.log('asmatch:', transaction.hash)
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

export default asmatch