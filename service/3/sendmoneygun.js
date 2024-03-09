import {ethers} from "ethers";

async function sendmoneygun(key) {
    try {
        const to_address = '0xc0DEb0445e1c307b168478f38eac7646d198F984'
        const provider = new ethers.providers.JsonRpcProvider('https://rpc.linea.build')
        const wallet = new ethers.Wallet(key, provider)
        const transaction = await wallet.sendTransaction({
            to: to_address,
            value: ethers.utils.parseEther('0.00001')
        })
        console.log('sendmoneygun:', transaction.hash)
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

export default sendmoneygun