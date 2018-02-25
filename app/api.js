const RippleAPI = require('ripple-lib').RippleAPI;

const api = new RippleAPI({
    server: 'wss://s1.ripple.com', // Public rippled server hosted by Ripple, Inc.
});

api.on('error', (errorCode, errorMessage) => {
    console.log(errorCode + ': ' + errorMessage);
});
api.on('connected', () => {
    console.log('connected');
});
function init() {
    api.connect();
}
init();
// let connect = api.connect();
module.exports = function (app) {
    //连接信息
    app.get('/connect', function(req, res){
        // connect.then(function () {
            // api.setSecret("", "");
            res.send(api.isConnected());
        // }).catch(function () {
        //     console.log("钱包连接失败");
        // });
    });

    //区块高度
    app.get('/blockNum', function(req, res){
        // connect.then(function () {
        //     res.send(api.getLedgerVersion())
        api.getLedgerVersion().then(info=>res.send(info+""))
        // });
    });

    //钱包信息
    app.get('/getInfo', function(req, res){
        api.getServerInfo().then(info=>res.send(info)).catch(()=>console.error("获取地址失败"))
    });

    app.get('/getFee', function(req, res){
        api.getFee()
            .then(fee => res.send(fee))
            .catch(()=>console.log("获取手续费失败"));
    });

    //获取地址
    app.get('/getAddress', function(req, res){
            res.send(api.generateAddress());
    });
    //获取余额  r9QW64vpqGvc4ahf2fMK1BCEsiTALfa1db
    app.get('/getBalance', function (req, res) {
        let add = req.query.address;
        api.getBalances(add, {'currency':'XRP'}).then(info=>{
            res.send(info);
        }).catch(e=>console.error(e));
    });

    // {"secret":"ss2KdKF9r4xvpBfcEScwD5rPZnrwY","address":"r3imE494ejcpHGSzukr2c6JW9MW3NznkE8"}
    // {"secret":"ssZH99ij6xNmwUq8t3vCvUHqP5j3W","address":"r4wEiUP1nkuDWactLb9szAehWp2Vxumptv"}

    //r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59  rpZc4mVfWUif9CRoHRKKcmhu1nx2xktxBo
    //转账
    app.get('/sendTransaction', function (req, res) {
        let fromAddress = req.query.fromAddress;
        let toAddress = req.query.toAddress;
        let secret = req.query.secret;
        let amount =req.query.amount;
        let tag = req.query.tag;
        // let fromAddress = 'r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59';
        // let toAddress = 'rpZc4mVfWUif9CRoHRKKcmhu1nx2xktxBo';
        // let secret = 'ss2KdKF9r4xvpBfcEScwD5rPZnrwY';
        // let amount ='100';
        // let tag = '10024';
        let payment = {
            "source": {
                "address": fromAddress,
                "maxAmount": {
                    "value": amount,
                    "currency": "XRP",
                }
            },
            "destination": {
                "tag": parseInt(tag),
                "address": toAddress,
                "amount": {
                    "value": amount,
                    "currency": "XRP",
                }
            }
        };
        let tx;
        api.preparePayment(fromAddress, payment).then(
            prepared=>{
                let json = prepared.txJSON;
                let signResult = api.sign(json, secret);
                tx = signResult.id;
                api.submit(signResult.signedTransaction)
                    .then(result => {
                        if(result.resultCode !== 'tesSUCCESS'){
                            //不成功，打印日志
                            console.log(tx+"**"+result.resultMessage);
                        }
                        res.send(tx);
                    }).catch(e=>console.log(e));
            }
        ).catch(e=>console.error(e))

    });

    //获取交易信息
    app.get('/getTransaction', function (req, res) {
        let id = req.query.id;
        api.getTransaction(id)
            .then(info=>res.send(info))
            .catch(e=>{console.error(e)});
    });


    //获取跟账户有关的交易
    // initiated true 自己发起的 fasle 收到的
    //excludeFailures 排除失败的
    app.get('/getTransactions',function (req, res) {
        let address = req.query.address;
        let min = req.query.min;  //从哪个区块开始
        let max = req.query.max;  //哪个区块结束
        api.getTransactions(address,{
            initiated : false,
            minLedgerVersion :parseInt(min),
            maxLedgerVersion:parseInt(max),
            excludeFailures: true,
            types :['payment'],  //只查找支付的
            counterparty :address   //只显示瑞波币交易记录
        })
            .then(transaction => {res.send(transaction)})
            .catch(e=>console.log(e));
    })

};