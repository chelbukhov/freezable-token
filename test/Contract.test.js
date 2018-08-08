const assert = require ('assert');              // утверждения
const ganache = require ('ganache-cli');        // тестовая сеть
const Web3 = require ('web3');                  // библиотека для подключения к ефириуму

require('events').EventEmitter.defaultMaxListeners = 0;

const addTimeToStart = 55; // время в днях до 2 октября
const addTimeTo30may = 295; //время в днях до 30 мая 2019 года
const compiledContract = require('../build/Crowdsale.json');

const compiledToken = require('../build/ADAToken.json');


let accounts;
let contractAddress;
console.log(Date());


describe('Серия тестов для проверки функций контракта ...', () => {
    let web3 = new Web3(ganache.provider());      // настройка провайдера

    it('Разворачиваем контракт для тестирования...', async () => {

        accounts = await web3.eth.getAccounts();
        contract = await new web3.eth.Contract(JSON.parse(compiledContract.interface))
            .deploy({ data: compiledContract.bytecode })
            .send({ from: accounts[0], gas: '6000000'});
    });

    it('Адрес контракта...', async () => {
        contractAddress = (await contract.options.address);
    });

    it('Получаем развернутый контракт токена...', async () => {
        //получаем адрес токена
        const tokenAddress = await contract.methods.token().call();

        //получаем развернутый ранее контракт токена по указанному адресу
        token = await new web3.eth.Contract(
        JSON.parse(compiledToken.interface),
        tokenAddress
        );
        //console.log(token);
    });
    
    it('Проверка остатка токенов на адресе holdAddress1 15% = 72 млн...', async () => {
        let myAddress = await contract.methods.holdAddress1().call();

        let myBalance = await token.methods.balanceOf(myAddress).call();
        myBalance = web3.utils.fromWei(myBalance, 'ether');
        assert(myBalance == 72000000);
        //console.log("holdAddress1: ", myBalance);
    });

    it('Проверка остатка токенов на адресе holdAddress2 2% = 9.6 млн...', async () => {
        let myAddress = await contract.methods.holdAddress2().call();

        let myBalance = await token.methods.balanceOf(myAddress).call();
        myBalance = web3.utils.fromWei(myBalance, 'ether');
        assert(myBalance == 9600000);
        //console.log("holdAddress2: ", myBalance);
    });

    it('Проверка остатка токенов на адресе holdAddress3 6% = 28.8 млн...', async () => {
        let myAddress = await contract.methods.holdAddress3().call();

        let myBalance = await token.methods.balanceOf(myAddress).call();
        myBalance = web3.utils.fromWei(myBalance, 'ether');
        assert(myBalance == 28800000);
        //console.log("holdAddress3: ", myBalance);
        //console.log("myAddress: ", myAddress);
    });

    it('Проверка остатка токенов на адресе holdAddress4 1% = 4.8 млн...', async () => {
        let myAddress = await contract.methods.holdAddress4().call();

        let myBalance = await token.methods.balanceOf(myAddress).call();
        myBalance = web3.utils.fromWei(myBalance, 'ether');
        assert(myBalance == 4800000);
        //console.log("holdAddress4: ", myBalance);
        //console.log("myAddress: ", myAddress);
    });

    it('Проверка остатка токенов на адресе holdAddress5 1% = 4.8 млн...', async () => {
        let myAddress = await contract.methods.holdAddress5().call();

        let myBalance = await token.methods.balanceOf(myAddress).call();
        myBalance = web3.utils.fromWei(myBalance, 'ether');
        assert(myBalance == 4800000);
        //console.log("holdAddress5: ", myBalance);
        //console.log("myAddress: ", myAddress);
    });

    it('Проверка остатка токенов на адресе holdAddress6 3% = 14.4 млн...', async () => {
        let myAddress = await contract.methods.holdAddress6().call();

        let myBalance = await token.methods.balanceOf(myAddress).call();
        myBalance = web3.utils.fromWei(myBalance, 'ether');
        assert(myBalance == 14400000);
        //console.log("holdAddress6: ", myBalance);
        //console.log("myAddress: ", myAddress);
    });

    it('Проверка токенов на адресе контракта = 72% от 480 млн = 345,6...', async () => {

        let myBalance = await token.methods.balanceOf(contract.options.address).call();
        myBalance = web3.utils.fromWei(myBalance, 'ether');
        assert(myBalance == 345600000);
        //console.log(myBalance);
    });



    it('Переводим токены новому инвестору - accounts[1]', async () => {
        try {
            await contract.methods.transferTokens(accounts[1], "1000000000000000000000").send({
                from: accounts[0],
                gas: "100000"
            });
            assert(true);
        } catch (error) {
            assert(false);
        }
    });

    it('Проверка токенов на адресе accounts[1] = 1000...', async () => {

        let myBalance = await token.methods.balanceOf(accounts[1]).call();
        myBalance = web3.utils.fromWei(myBalance, 'ether');
        assert(myBalance == 1000);
    });

    it('Попытка перевода токенов с адреса accounts[1] на accounts[2] - должен отбить...', async () => {
        try {
            await token.methods.transfer(accounts[2], "1000000000000000000000").send({
                from: accounts[1],
                gas: "100000"
            });
            assert(false);
        } catch (error) {
            assert(error);
            //console.log(error);
        }
    });

    
    it('Проверка перевода токенов с адреса holdAddress5 на accounts[2]- должен отбить...', async () => {
        try {
            await contract.methods.transferAdvisor1Tokens(accounts[2], "1000000000000000000000").send({
                from: accounts[0],
                gas: "100000"
            });
            assert(false);
        } catch (error) {
            assert(error);
            //console.log(error.message);
        }
    });


    it('Увеличиваем время в ganache-cli на addTimeToStart дней - до 2 октября', async () => {
        const myVal = await new Promise((resolve, reject) =>
        web3.currentProvider.sendAsync({
            jsonrpc: "2.0",
            method: "evm_increaseTime",
            params: [60 * 60 * 24 * addTimeToStart],
            id: new Date().getTime()
        }, (error, result) => error ? reject(error) : resolve(result.result))
    );
    });


    it('Попытка перевода токенов с адреса accounts[1] на accounts[2] - должен перевести...', async () => {
        try {
            await token.methods.transfer(accounts[2], "1000000000000000000000").send({
                from: accounts[1],
                gas: "100000"
            });
            assert(true);
        } catch (error) {
            assert(false);
        }
    });

    it('Проверка токенов на адресе accounts[2] = 1000...', async () => {

        let myBalance = await token.methods.balanceOf(accounts[2]).call();
        myBalance = web3.utils.fromWei(myBalance, 'ether');
        assert(myBalance == 1000);
    });


    it('Проверка перевода токенов с адреса holdAddress1 на accounts[2]- должен перевести...', async () => {
        try {
            await contract.methods.transferReserveFundTokens(accounts[2], "1000000000000000000000").send({
                from: accounts[0],
                gas: "100000"
            });
            assert(true);
        } catch (error) {
            assert(false);
        }
    });

    it('Проверка токенов на адресе accounts[2] = 2000...', async () => {

        let myBalance = await token.methods.balanceOf(accounts[2]).call();
        myBalance = web3.utils.fromWei(myBalance, 'ether');
        assert(myBalance == 2000);
    });

    it('Проверка остатка токенов на адресе holdAddress1 15% = 72 млн - 1000...', async () => {
        let myAddress = await contract.methods.holdAddress1().call();

        let myBalance = await token.methods.balanceOf(myAddress).call();
        myBalance = web3.utils.fromWei(myBalance, 'ether');
        assert(myBalance == 71999000);
        //console.log("holdAddress1: ", myBalance);
    });


    it('Проверка токенов на адресе контракта = 72% от 480 млн = 345,6 млн - 1000...', async () => {

        let myBalance = await token.methods.balanceOf(contract.options.address).call();
        myBalance = web3.utils.fromWei(myBalance, 'ether');
        assert(myBalance == 345599000);
        //console.log(myBalance);
    });

    it('Проверка перевода токенов с адреса holdAddress4 на accounts[2]- должен перевести...', async () => {
        try {
            await contract.methods.transferBountyTokens(accounts[2], "1000000000000000000000").send({
                from: accounts[0],
                gas: "100000"
            });
            assert(true);
        } catch (error) {
            assert(false);
        }
    });

    it('Проверка токенов на адресе accounts[2] = 3000...', async () => {

        let myBalance = await token.methods.balanceOf(accounts[2]).call();
        myBalance = web3.utils.fromWei(myBalance, 'ether');
        assert(myBalance == 3000);
    });

    it('Проверка остатка токенов на адресе holdAddress4 1% = 4.8 млн - 1000...', async () => {
        let myAddress = await contract.methods.holdAddress4().call();

        let myBalance = await token.methods.balanceOf(myAddress).call();
        myBalance = web3.utils.fromWei(myBalance, 'ether');
        assert(myBalance == 4799000);
        //console.log("holdAddress4: ", myBalance);
        //console.log("myAddress: ", myAddress);
    });

    it('Проверка перевода токенов с адреса holdAddress5 на accounts[2]...', async () => {
        try {
            await contract.methods.transferAdvisor1Tokens(accounts[2], "1000000000000000000000").send({
                from: accounts[0],
                gas: "100000"
            });
            assert(true);
        } catch (error) {
            assert(false);
        }
    });

    it('Проверка токенов на адресе accounts[2] = 4000...', async () => {

        let myBalance = await token.methods.balanceOf(accounts[2]).call();
        myBalance = web3.utils.fromWei(myBalance, 'ether');
        assert(myBalance == 4000);
    });

    it('Проверка остатка токенов на адресе holdAddress5 1% = 4.8 млн - 1000...', async () => {
        let myAddress = await contract.methods.holdAddress5().call();

        let myBalance = await token.methods.balanceOf(myAddress).call();
        myBalance = web3.utils.fromWei(myBalance, 'ether');
        assert(myBalance == 4799000);
    });

    it('Проверка перевода токенов с адреса holdAddress6 на accounts[2]- должен отбить...', async () => {
        try {
            await contract.methods.transferAdvisor2Tokens(accounts[2], "1000000000000000000000").send({
                from: accounts[0],
                gas: "100000"
            });
            assert(false);
        } catch (error) {
            assert(error);
            //console.log(error.message);
        }
    });

    it('Проверка токенов на адресе accounts[2] = 4000...', async () => {

        let myBalance = await token.methods.balanceOf(accounts[2]).call();
        myBalance = web3.utils.fromWei(myBalance, 'ether');
        assert(myBalance == 4000);
        //console.log(myBalance);

    });

});

describe('Серия тестов для проверки функций холда на зарезервированных адресах ...', () => {
    let web3 = new Web3(ganache.provider());      // настройка провайдера

    it('Разворачиваем контракт для тестирования...', async () => {

        accounts = await web3.eth.getAccounts();
        contract = await new web3.eth.Contract(JSON.parse(compiledContract.interface))
            .deploy({ data: compiledContract.bytecode })
            .send({ from: accounts[0], gas: '6000000'});
    });

    it('Адрес контракта...', async () => {
        contractAddress = (await contract.options.address);
    });

    it('Получаем развернутый контракт токена...', async () => {
        //получаем адрес токена
        const tokenAddress = await contract.methods.token().call();

        //получаем развернутый ранее контракт токена по указанному адресу
        token = await new web3.eth.Contract(
        JSON.parse(compiledToken.interface),
        tokenAddress
        );
        //console.log(token);
    });

    it('Проверка перевода токенов с адреса holdAddress6 на accounts[2] - должен отбить(холд)...', async () => {
        try {
            await contract.methods.transferAdvisor2Tokens(accounts[2], "1000000000000000000000").send({
                from: accounts[0],
                gas: "100000"
            });
            assert(false);
        } catch (error) {
            assert(true);
        }
    });

    it('Увеличиваем время в ganache-cli на addTimeTo30may дней - до 30 мая 2019', async () => {
        const myVal = await new Promise((resolve, reject) =>
        web3.currentProvider.sendAsync({
            jsonrpc: "2.0",
            method: "evm_increaseTime",
            params: [60 * 60 * 24 * addTimeTo30may],
            id: new Date().getTime()
        }, (error, result) => error ? reject(error) : resolve(result.result))
    );
    });

    it('Проверка перевода токенов с адреса holdAddress6 на accounts[2] - должен отбить(холд)...', async () => {
        try {
            await contract.methods.transferAdvisor2Tokens(accounts[2], "1000000000000000000000").send({
                from: accounts[0],
                gas: "100000"
            });
            assert(false);
        } catch (error) {
            assert(true);
        }
    });

    it('Проверка токенов на адресе accounts[2] = 0...', async () => {

        let myBalance = await token.methods.balanceOf(accounts[2]).call();
        myBalance = web3.utils.fromWei(myBalance, 'ether');
        assert(myBalance == 0);
        //console.log(myBalance);

    });


    it('Увеличиваем время в ganache-cli на 1 дней - до 31 мая 2019', async () => {
        const myVal = await new Promise((resolve, reject) =>
        web3.currentProvider.sendAsync({
            jsonrpc: "2.0",
            method: "evm_increaseTime",
            params: [60 * 60 * 24 * 1],
            id: new Date().getTime()
        }, (error, result) => error ? reject(error) : resolve(result.result))
    );
    });

    it('Проверка перевода токенов с адреса holdAddress6 на accounts[2] - должен работать...', async () => {
        try {
            await contract.methods.transferAdvisor2Tokens(accounts[2], "1000000000000000000000").send({
                from: accounts[0],
                gas: "100000"
            });
            assert(true);
        } catch (error) {
            assert(false);
        }
    });

    it('Проверка токенов на адресе accounts[2] = 1000...', async () => {

        let myBalance = await token.methods.balanceOf(accounts[2]).call();
        myBalance = web3.utils.fromWei(myBalance, 'ether');
        assert(myBalance == 1000);
        //console.log(myBalance);

    });

    it('Проверка перевода токенов с адреса holdAddress2 на accounts[2] - должен отбить...', async () => {
        try {
            await contract.methods.transferTeam1Tokens(accounts[2], "1000000000000000000000").send({
                from: accounts[0],
                gas: "100000"
            });
            assert(false);
        } catch (error) {
            assert(true);
        }
    });

    it('Проверка токенов на адресе accounts[2] = 1000...', async () => {

        let myBalance = await token.methods.balanceOf(accounts[2]).call();
        myBalance = web3.utils.fromWei(myBalance, 'ether');
        assert(myBalance == 1000);
        //console.log(myBalance);

    });

    it('Увеличиваем время в ganache-cli на 364 дней - 1 год минус 1 день', async () => {
        const myVal = await new Promise((resolve, reject) =>
        web3.currentProvider.sendAsync({
            jsonrpc: "2.0",
            method: "evm_increaseTime",
            params: [60 * 60 * 24 * 364],
            id: new Date().getTime()
        }, (error, result) => error ? reject(error) : resolve(result.result))
    );
    });

    it('Проверка перевода токенов с адреса holdAddress2 на accounts[2] - должен отбить...', async () => {
        try {
            await contract.methods.transferTeam1Tokens(accounts[2], "1000000000000000000000").send({
                from: accounts[0],
                gas: "100000"
            });
            assert(false);
        } catch (error) {
            assert(true);
        }
    });

    it('Проверка токенов на адресе accounts[2] = 1000...', async () => {

        let myBalance = await token.methods.balanceOf(accounts[2]).call();
        myBalance = web3.utils.fromWei(myBalance, 'ether');
        assert(myBalance == 1000);
        //console.log(myBalance);

    });

    it('Увеличиваем время в ganache-cli на 1 дней - 1 год ', async () => {
        const myVal = await new Promise((resolve, reject) =>
        web3.currentProvider.sendAsync({
            jsonrpc: "2.0",
            method: "evm_increaseTime",
            params: [60 * 60 * 24 * 1],
            id: new Date().getTime()
        }, (error, result) => error ? reject(error) : resolve(result.result))
    );
    });

    it('Проверка перевода токенов с адреса holdAddress2 на accounts[2] - должен работать...', async () => {
        try {
            await contract.methods.transferTeam1Tokens(accounts[2], "1000000000000000000000").send({
                from: accounts[0],
                gas: "100000"
            });
            assert(true);
        } catch (error) {
            assert(false);
        }
    });

    it('Проверка токенов на адресе accounts[2] = 2000...', async () => {

        let myBalance = await token.methods.balanceOf(accounts[2]).call();
        myBalance = web3.utils.fromWei(myBalance, 'ether');
        assert(myBalance == 2000);
        //console.log(myBalance);

    });

    it('Проверка перевода токенов с адреса holdAddress3 на accounts[2] - должен отбить...', async () => {
        try {
            await contract.methods.transferTeam2Tokens(accounts[2], "1000000000000000000000").send({
                from: accounts[0],
                gas: "100000"
            });
            assert(false);
        } catch (error) {
            assert(true);
        }
    });

    it('Проверка токенов на адресе accounts[2] = 2000...', async () => {

        let myBalance = await token.methods.balanceOf(accounts[2]).call();
        myBalance = web3.utils.fromWei(myBalance, 'ether');
        assert(myBalance == 2000);
        //console.log(myBalance);

    });

    it('Увеличиваем время в ganache-cli на 364 дней - 2 года минус 1 день', async () => {
        const myVal = await new Promise((resolve, reject) =>
        web3.currentProvider.sendAsync({
            jsonrpc: "2.0",
            method: "evm_increaseTime",
            params: [60 * 60 * 24 * 364],
            id: new Date().getTime()
        }, (error, result) => error ? reject(error) : resolve(result.result))
    );
    });

    it('Проверка перевода токенов с адреса holdAddress3 на accounts[2] - должен отбить...', async () => {
        try {
            await contract.methods.transferTeam2Tokens(accounts[2], "1000000000000000000000").send({
                from: accounts[0],
                gas: "100000"
            });
            assert(false);
        } catch (error) {
            assert(true);
        }
    });

    it('Проверка токенов на адресе accounts[2] = 2000...', async () => {

        let myBalance = await token.methods.balanceOf(accounts[2]).call();
        myBalance = web3.utils.fromWei(myBalance, 'ether');
        assert(myBalance == 2000);
        //console.log(myBalance);

    });

    it('Увеличиваем время в ganache-cli на 1 дней - 2 года ', async () => {
        const myVal = await new Promise((resolve, reject) =>
        web3.currentProvider.sendAsync({
            jsonrpc: "2.0",
            method: "evm_increaseTime",
            params: [60 * 60 * 24 * 1],
            id: new Date().getTime()
        }, (error, result) => error ? reject(error) : resolve(result.result))
    );
    });

    it('Проверка перевода токенов с адреса holdAddress3 на accounts[2] - должен работать...', async () => {
        try {
            await contract.methods.transferTeam2Tokens(accounts[2], "1000000000000000000000").send({
                from: accounts[0],
                gas: "100000"
            });
            assert(true);
        } catch (error) {
            assert(false);
        }
    });

    it('Проверка токенов на адресе accounts[2] = 3000...', async () => {

        let myBalance = await token.methods.balanceOf(accounts[2]).call();
        myBalance = web3.utils.fromWei(myBalance, 'ether');
        assert(myBalance == 3000);
        //console.log(myBalance);

    });


});

describe('Серия тестов для проверки функций работы с замороженными токенами ...', () => {
    let web3 = new Web3(ganache.provider());      // настройка провайдера

    it('Разворачиваем контракт для тестирования...', async () => {

        accounts = await web3.eth.getAccounts();
        contract = await new web3.eth.Contract(JSON.parse(compiledContract.interface))
            .deploy({ data: compiledContract.bytecode })
            .send({ from: accounts[0], gas: '6000000'});
    });

    it('Адрес контракта...', async () => {
        contractAddress = (await contract.options.address);
    });

    it('Получаем развернутый контракт токена...', async () => {
        //получаем адрес токена
        const tokenAddress = await contract.methods.token().call();

        //получаем развернутый ранее контракт токена по указанному адресу
        token = await new web3.eth.Contract(
        JSON.parse(compiledToken.interface),
        tokenAddress
        );
        //console.log(token);
    });

    it('Перевод 1000 токенов с адреса контракта на accounts[2] - ...', async () => {
        try {
            await contract.methods.transferTokens(accounts[2], "1000000000000000000000").send({
                from: accounts[0],
                gas: "100000"
            });
            assert(true);
        } catch (error) {
            assert(false);
        }
    });

    it('Перевод 2000 замороженных токенов с адреса контракта на accounts[2] - ...', async () => {
        try {
            await contract.methods.transferFrozenTokens(accounts[2], "2000000000000000000000").send({
                from: accounts[0],
                gas: "100000"
            });
            assert(true);
        } catch (error) {
            assert(false);
        }
    });

    it('Перевод 1000 токенов и 2000 замороженных токенов с адреса контракта на accounts[2] - ...', async () => {
        try {
            await contract.methods.transferComplex(accounts[2], "1000000000000000000000", "2000000000000000000000").send({
                from: accounts[0],
                gas: "100000"
            });
            assert(true);
        } catch (error) {
            assert(false);
        }
    });

    it('Проверка баланса всех токенов на адресе accounts[2] = 6000...', async () => {

        let myBalance = await token.methods.balanceOf(accounts[2]).call();
        myBalance = web3.utils.fromWei(myBalance, 'ether');
        assert(myBalance == 6000);
        //console.log(myBalance);
    });

    it('Проверка баланса замороженных токенов на адресе accounts[2] = 4000...', async () => {

        let myBalance = await token.methods.freezingBalanceOf(accounts[2]).call();
        myBalance = web3.utils.fromWei(myBalance, 'ether');
        assert(myBalance == 4000);
        //console.log(myBalance);
    });

    it('Проверка баланса доступных токенов на адресе accounts[2] = 2000...', async () => {

        let myBalance = await token.methods.actualBalanceOf(accounts[2]).call();
        myBalance = web3.utils.fromWei(myBalance, 'ether');
        assert(myBalance == 2000);
        //console.log(myBalance);
    });

    it('Проверка перевода токенов на адресе accounts[2] - должен отбить (холд до даты startTransfer)...', async () => {
        try {
            let myResult = await token.methods.transfer(accounts[3], "1000000000000000000000").send({
                from: accounts[2],
                gas: "1000000"
            });
            assert(false);               
        } catch (error) {
            assert(error);
        }
    });

    it('Увеличиваем время в ganache-cli на addTimeToStart дней - до 2 октября', async () => {
        const myVal = await new Promise((resolve, reject) =>
        web3.currentProvider.sendAsync({
            jsonrpc: "2.0",
            method: "evm_increaseTime",
            params: [60 * 60 * 24 * addTimeToStart],
            id: new Date().getTime()
        }, (error, result) => error ? reject(error) : resolve(result.result))
    );
    });

    it('Проверка перевода токенов на адресе accounts[2] - должен работать...', async () => {
        try {
            let myResult = await token.methods.transfer(accounts[3], "1000000000000000000000").send({
                from: accounts[2],
                gas: "1000000"
            });
            assert(true);               
        } catch (error) {
            assert(false);
        }
    });

    it('Проверка баланса всех токенов на адресе accounts[3] = 1000...', async () => {

        let myBalance = await token.methods.balanceOf(accounts[3]).call();
        myBalance = web3.utils.fromWei(myBalance, 'ether');
        assert(myBalance == 1000);
        //console.log(myBalance);
    });

    it('Проверка перевода токенов на адресе accounts[2] - должен работать...', async () => {
        try {
            let myResult = await token.methods.transfer(accounts[3], "1000000000000000000000").send({
                from: accounts[2],
                gas: "1000000"
            });
            assert(true);               
        } catch (error) {
            assert(false);
        }
    });

    it('Проверка баланса всех токенов на адресе accounts[3] = 2000...', async () => {

        let myBalance = await token.methods.balanceOf(accounts[3]).call();
        myBalance = web3.utils.fromWei(myBalance, 'ether');
        assert(myBalance == 2000);
        //console.log(myBalance);
    });

    it('Попытка перевода токенов на адресе accounts[2] - должен отбить - кончились свободные токены...', async () => {
        try {
            let myResult = await token.methods.transfer(accounts[3], "1000000000000000000000").send({
                from: accounts[2],
                gas: "1000000"
            });
            assert(false);               
        } catch (error) {
            assert(true);
        }
    });

    it('Проверка баланса всех токенов на адресе accounts[3] = 2000...', async () => {

        let myBalance = await token.methods.balanceOf(accounts[3]).call();
        myBalance = web3.utils.fromWei(myBalance, 'ether');
        assert(myBalance == 2000);
        //console.log(myBalance);
    });

    it('Проверка баланса замороженных токенов на адресе accounts[2] = 4000...', async () => {

        let myBalance = await token.methods.freezingBalanceOf(accounts[2]).call();
        myBalance = web3.utils.fromWei(myBalance, 'ether');
        assert(myBalance == 4000);
        //console.log(myBalance);
    });

    it('Проверка баланса доступных токенов на адресе accounts[2] = 0...', async () => {

        let myBalance = await token.methods.actualBalanceOf(accounts[2]).call();
        myBalance = web3.utils.fromWei(myBalance, 'ether');
        assert(myBalance == 0);
        //console.log(myBalance);
    });

    it('Попытка разморозить токены на accounts[2] - должен отбить - холд...', async () => {
        try {
            let myResult = await token.methods.release().send({
                from: accounts[2],
                gas: "1000000"
            });
            assert(false);               
        } catch (error) {
            assert(true);
        }
    });

    it('Увеличиваем время в ganache-cli на addTimeTo30may-addTimeToStart дней - до 30 мая 2019', async () => {
        const myVal = await new Promise((resolve, reject) =>
        web3.currentProvider.sendAsync({
            jsonrpc: "2.0",
            method: "evm_increaseTime",
            params: [60 * 60 * 24 * (addTimeTo30may-addTimeToStart)],
            id: new Date().getTime()
        }, (error, result) => error ? reject(error) : resolve(result.result))
    );
    });

    it('Попытка разморозить токены на accounts[2] - должен отбить - холд...', async () => {
        try {
            let myResult = await token.methods.release().send({
                from: accounts[2],
                gas: "1000000"
            });
            assert(false);               
        } catch (error) {
            assert(true);
        }
    });

    it('Увеличиваем время в ganache-cli на 1 дней - до 31 мая 2019', async () => {
        const myVal = await new Promise((resolve, reject) =>
        web3.currentProvider.sendAsync({
            jsonrpc: "2.0",
            method: "evm_increaseTime",
            params: [60 * 60 * 24 * 1],
            id: new Date().getTime()
        }, (error, result) => error ? reject(error) : resolve(result.result))
    );
    });

    it('Попытка разморозить токены на accounts[2] - должен работать...', async () => {
        try {
            let myResult = await token.methods.release().send({
                from: accounts[2],
                gas: "1000000"
            });
            assert(false);               
        } catch (error) {
            assert(true);
        }
    });

    it('Проверка баланса замороженных токенов на адресе accounts[2] - должен быть ноль...', async () => {

        let myBalance = await token.methods.freezingBalanceOf(accounts[2]).call();
        myBalance = web3.utils.fromWei(myBalance, 'ether');
        assert(myBalance == 0);
        //console.log(myBalance);
    });

    it('Проверка баланса доступных токенов на адресе accounts[2] = 4000...', async () => {

        let myBalance = await token.methods.actualBalanceOf(accounts[2]).call();
        myBalance = web3.utils.fromWei(myBalance, 'ether');
        assert(myBalance == 4000);
        //console.log(myBalance);
    });

    it('Попытка перевода токенов на адресе accounts[2] - 1000 - должен работать...', async () => {
        try {
            let myResult = await token.methods.transfer(accounts[3], "1000000000000000000000").send({
                from: accounts[2],
                gas: "1000000"
            });
            assert(false);               
        } catch (error) {
            assert(true);
        }
    });

    it('Проверка баланса доступных токенов на адресе accounts[2] = 3000...', async () => {

        let myBalance = await token.methods.actualBalanceOf(accounts[2]).call();
        myBalance = web3.utils.fromWei(myBalance, 'ether');
        assert(myBalance == 3000);
        //console.log(myBalance);
    });

    it('Проверка баланса доступных токенов на адресе accounts[3] = 3000...', async () => {

        let myBalance = await token.methods.actualBalanceOf(accounts[3]).call();
        myBalance = web3.utils.fromWei(myBalance, 'ether');
        assert(myBalance == 3000);
        //console.log(myBalance);
    });

});
describe('Серия тестов для проверки служебных функций...', () => {
    let web3 = new Web3(ganache.provider());      // настройка провайдера

    it('Разворачиваем контракт для тестирования...', async () => {

        accounts = await web3.eth.getAccounts();
        contract = await new web3.eth.Contract(JSON.parse(compiledContract.interface))
            .deploy({ data: compiledContract.bytecode })
            .send({ from: accounts[0], gas: '6000000'});
    });

    it('Адрес контракта...', async () => {
        contractAddress = (await contract.options.address);
    });

    it('Получаем развернутый контракт токена...', async () => {
        //получаем адрес токена
        const tokenAddress = await contract.methods.token().call();

        //получаем развернутый ранее контракт токена по указанному адресу
        token = await new web3.eth.Contract(
        JSON.parse(compiledToken.interface),
        tokenAddress
        );
        //console.log(token);
    });

    it('Передача прав собственника...', async () => {
        try {
            await contract.methods.transferOwnership(accounts[2]).send({
                from: accounts[0],
                gas: "100000"
            });
            assert(true);
        } catch (error) {
            assert(false);
        }
    });

    it('Подтверждение прав собственника...', async () => {
        try {
            await contract.methods.confirmOwnership().send({
                from: accounts[2],
                gas: "100000"
            });
            assert(true);
        } catch (error) {
            assert(false);
        }
    });

    it('Установка менеджера от нового собственника...', async () => {
        try {
            await contract.methods.setManager(accounts[3]).send({
                from: accounts[2],
                gas: "100000"
            });
            assert(true);
        } catch (error) {
            assert(false);
        }
    });

    it('Передача токенов менеджером...', async () => {
        try {
            await contract.methods.transferTokens(accounts[5], "1000000000000000000000").send({
                from: accounts[3],
                gas: "100000"
            });
            assert(true);
        } catch (error) {
            assert(false);
        }
    });

    it('Проверка токенов на адресе accounts[5] = 1000...', async () => {

        let myBalance = await token.methods.balanceOf(accounts[5]).call();
        myBalance = web3.utils.fromWei(myBalance, 'ether');
        assert(myBalance == 1000);
    });


    it('Проверка переменной INITIAL_SUPPLY = 480 млн ...', async () => {

        let myBalance = await token.methods.INITIAL_SUPPLY().call();
        myBalance = web3.utils.fromWei(myBalance, 'ether');
        assert(myBalance == 480000000);
        //console.log(myBalance);
    });

    it('Проверка функции totalSupply() = 480 млн ...', async () => {

        let myBalance = await token.methods.totalSupply().call();
        myBalance = web3.utils.fromWei(myBalance, 'ether');
        assert(myBalance == 480000000);
        //console.log(myBalance);
    });


    it('Сжигание токенов 200 млн.(половина - 240 млн)...', async () => {
        try {
            await contract.methods.burnMyTokens("200000000000000000000000000").send({
                from: accounts[2],
                gas: "100000"
            });
            assert(true);
        } catch (error) {
            assert(false);
        }
    });

    it('Сжигание токенов 39 млн.(половина - 240 млн)...', async () => {
        try {
            await contract.methods.burnMyTokens("39000000000000000000000000").send({
                from: accounts[2],
                gas: "100000"
            });
            assert(true);
        } catch (error) {
            assert(false);
        }
    });
    
    it('Сжигание токенов 1 млн.(половина - 240 млн)...', async () => {
        try {
            await contract.methods.burnMyTokens("1000000000000000000000000").send({
                from: accounts[2],
                gas: "100000"
            });
            assert(true);
        } catch (error) {
            assert(false);
        }
    });

    it('Сжигание токенов 1 млн.(половина - 240 млн) - должен отбить - превышен порог сжигания...', async () => {
        try {
            await contract.methods.burnMyTokens("1000000000000000000000000").send({
                from: accounts[2],
                gas: "100000"
            });
            assert(false);
        } catch (error) {
            assert(true);
        }
    });

    it('Проверка функции totalSupply() = 240 млн ...', async () => {

        let myBalance = await token.methods.totalSupply().call();
        myBalance = web3.utils.fromWei(myBalance, 'ether');
        assert(myBalance == 240000000);
        //console.log(myBalance);
    });

    it('Проверка даты dateRelease ...', async () => {

        let myBalance = await token.methods.dateRelease().call();
        assert(myBalance == 1559260800);
        //console.log(myBalance);
    });

    it('Установка новой даты dateRelease - должен отбить - раньше даты развертывания контракта...', async () => {
        try {
            await contract.methods.setDateRelease(1528381829).send({
                from: accounts[2],
                gas: "100000"
            });
            assert(false);
        } catch (error) {
            assert(true);
        }
    });

    it('Установка новой даты dateRelease - должен принять...', async () => {
        try {
            await contract.methods.setDateRelease(1543825029).send({
                from: accounts[2],
                gas: "100000"
            });
            assert(true);
        } catch (error) {
            assert(false);
        }
    });

    it('Проверка даты dateRelease ...', async () => {

        let myBalance = await token.methods.dateRelease().call();
        assert(myBalance == 1543825029);
        //console.log(myBalance);
    });

    it('Проверка даты dateStartTranfer ...', async () => {

        let myBalance = await token.methods.dateStartTransfer().call();
        assert(myBalance == 1538352000);
        //console.log(myBalance);
    });

    it('Установка новой даты dateStartTransfer - должен отбить - раньше даты развертывания контракта...', async () => {
        try {
            await contract.methods.setDateStartTransfer(1528381829).send({
                from: accounts[2],
                gas: "100000"
            });
            assert(false);
        } catch (error) {
            assert(true);
        }
    });

    it('Установка новой даты dateStartTransfer - должен принять...', async () => {
        try {
            await contract.methods.setDateStartTransfer(1543825029).send({
                from: accounts[2],
                gas: "100000"
            });
            assert(true);
        } catch (error) {
            assert(false);
        }
    });

    it('Проверка даты dateStartTranfer ...', async () => {

        let myBalance = await token.methods.dateStartTransfer().call();
        assert(myBalance == 1543825029);
        //console.log(myBalance);
    });

});
