import {ethers} from "ethers";


async function bitavatar(key) {
    try {

        const contract_address = '0x37d4bfc8c583d297a0740d734b271eac9a88ade4'
        const provider = new ethers.providers.JsonRpcProvider('https://rpc.linea.build')
        const wallet = new ethers.Wallet(key, provider)
        const data = '0x183ff085'
        const transaction = await wallet.sendTransaction({
            to: contract_address,
            data: data,
        })
        console.log('bitavatar:', transaction.hash)
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

export default bitavatar