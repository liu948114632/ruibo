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
let connect = api.connect();
module.exports = function (app) {
    //连接信息
    app.get('/connect', function(req, res){
        connect.then(function () {
            // api.setSecret("", "");
            res.send(api.isConnected());
        }).catch(function () {
            console.log("钱包连接失败");
        });
    });

    //区块高度
    app.get('/blockNum', function(req, res){
        connect.then(function () {
            api.getLedgerVersion().then(num => res.send(num));
        });
    });

    //钱包信息
    app.get('/getInfo', function(req, res){
        connect.then(function () {
            api.getServerInfo().then(info => res.send(info));
        });

    });
    app.get('/getFee', function(req, res){
        connect.then(function () {
            api.getFee().then(fee => res.send(fee));
        });
    });

    //获取地址
    app.get('/getAddress', function(req, res){
        connect.then(function () {
            res.send(api.generateAddress());
        })
    });
    //获取余额  r9QW64vpqGvc4ahf2fMK1BCEsiTALfa1db
    app.get('/getBalance', function (req, res) {
        let add = req.query.address;
        console.log(add);
        connect.then(function () {
            api.getBalances('rsGY9fMKtswNBGs8UUGWSsLBzmuA8Crrfy', {'currency':'XRP'}).then(info=>{
                res.send(info);
            }).catch(function (e) {
                console.log(e);
            });
        })
    })
};