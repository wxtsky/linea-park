import {ethers} from "ethers";


async function send_mail(key) {
    try {
        let to_string = ''
        for (let i = 0; i < 10 + Math.random() * 10; i++) {
            to_string += Math.floor(Math.random() * 16).toString(16)
        }
        let path_string = ''
        for (let i = 0; i < 10 + Math.random() * 10; i++) {
            path_string += Math.floor(Math.random() * 16).toString(16)
        }
        const ABI = [
            'function send_mail(string to,string path) public',
        ]
        const contract_address = '0xD1A3abf42f9E66BE86cfDEa8c5C2c74f041c5e14'
        const provider = new ethers.providers.JsonRpcProvider('https://rpc.linea.build')
        const wallet = new ethers.Wallet(key, provider)
        const contract = new ethers.Contract(contract_address, ABI, wallet)
        const transaction = await contract.send_mail(to_string, path_string)
        console.log('send_mail:', transaction.hash)
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

export default send_mail