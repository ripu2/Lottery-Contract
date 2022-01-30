const HDWalletProvider = require('@truffle/hdwallet-provider')
const Web3 = require('web3')

const { interface, bytecode } = require('./contracts')

const provider = new HDWalletProvider(
    'zero idle knock obtain science cotton equal soon maid shy couple ability',
    'https://rinkeby.infura.io/v3/16d5d06c796f4d94aaa9bb8e5a93fa74'
)

const web3 = new Web3(provider)

const deploy = async () => {
    const accounts = await web3.eth.getAccounts();

    console.log('Attempting to deploy form =====>', accounts[0], '🚀')

    if(accounts) {
        const res = await new Web3.eth.Contract(JSON.parse(interface))
        .deploy({ data: bytecode })
        .send({ gas: '1000000', from: accounts[0] })

        if(res) {
            console.log('Contract deployed at ===>', response.options.address, '🔥');
            provider.engine.stop()
        }
    } else {
        console.log('failed to deploy contract ☹️')
    }
}