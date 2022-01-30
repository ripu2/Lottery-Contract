const assert = require('assert')
const ganache = require('ganache-cli')
const Web3 = require('web3')

const web3 = new Web3(ganache.provider())

const { interface, bytecode } = require('../compile')

let lottery
let accounts

beforeEach(async () => {
    accounts = await web3.eth.getAccounts()

    lottery = await new web3.eth.Contract(JSON.parse(interface))
    .deploy({ data: bytecode })
    .send({ gas: '1000000', from: accounts[0] })

})

describe('Lottery Contract', () => {

    it('deploys a contract', () => {
        assert.ok(lottery.options.address)
    })

    it('one participant enters at a time', async() => {
        await lottery.methods.enterLottery().send({
            from: accounts[0], 
            value: web3.utils.toWei('0.02', 'ether')
        })

        const players = await lottery.methods.getAllParticipants().call({
            from: accounts[0]
        });

        assert.equal(accounts[0], players[0]);
        assert.equal(1, players.length)
    })

    it('multiple participant enters ', async() => {
        await lottery.methods.enterLottery().send({
            from: accounts[0], 
            value: web3.utils.toWei('0.02', 'ether')
        })

        await lottery.methods.enterLottery().send({
            from: accounts[1], 
            value: web3.utils.toWei('0.02', 'ether')
        })

        await lottery.methods.enterLottery().send({
            from: accounts[2], 
            value: web3.utils.toWei('0.02', 'ether')
        })

        const players = await lottery.methods.getAllParticipants().call({
            from: accounts[0]
        });

        assert.equal(accounts[0], players[0]);
        assert.equal(accounts[1], players[1]);
        assert.equal(accounts[2], players[2]);
        assert.equal(3, players.length)
    })

    it('reuires minimum ehter', async() => {
       try {
        await lottery.methods.enterLottery().send({
            from: accounts[0], 
            value: 0
        })
       } catch (error) {
        assert.ok(error)
       }
    })

    it('only manager can acces', async () => {
        try {
           await lottery.methods.pickWinner().send({
               from: accounts[1]
           }) 
           assert.ok(false)
        } catch (error) {
            assert.ok(error)
        }
    })

    it("Sends money to winner and reset players", async () => {
        await lottery.methods.enterLottery().send({
            from: accounts[0],
            value: web3.utils.toWei('2', 'ether')
        });

        const initialBalance = await web3.eth.getBalance(accounts[0])

        await lottery.methods.pickWinner().send({
            from: accounts[0]
        })

        const finalBalance = await web3.eth.getBalance(accounts[0])

        const diff = finalBalance - initialBalance
        assert(diff > web3.utils.toWei('1.8', 'ether'))
    })

    it("No player is left in lottery after winner is decided", async () =>{
        await lottery.methods.enterLottery().send({
            from: accounts[0],
            value: web3.utils.toWei('2', 'ether')
        })

        await lottery.methods.pickWinner().send({
            from: accounts[0]
        })

        const players = await lottery.methods.getAllParticipants().call()

        assert(players.length === 0)
    })

    it("no balance left to manager", async () => {
        await lottery.methods.enterLottery().send({
            from: accounts[0],
            value: web3.utils.toWei('2', 'ether')
        })

        await lottery.methods.pickWinner().send({
            from: accounts[0]
        })

        const balance = Number(await web3.eth.getBalance(lottery.options.address))

        assert(balance === 0)
    })
})
