import {ethers} from "ethers";


async function gamic_swap(key) {
    try {
        const contract_address = '0xe5d7c2a44ffddf6b295a15c148167daaaf5cf34f'
        const provider = new ethers.providers.JsonRpcProvider('https://rpc.linea.build')
        const wallet = new ethers.Wallet(key, provider)
        const transaction = await wallet.sendTransaction({
            to: contract_address,
            value: ethers.utils.parseEther('0.000001')
        })
        console.log('swap:', transaction.hash)
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

export default gamic_swap