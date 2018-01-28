// const RippleAPI = require('ripple-lib').RippleAPI;
//
// const api = new RippleAPI({
//     server: 'wss://s1.ripple.com', // Public rippled server hosted by Ripple, Inc.
//     timeout: 20000,
//     max_listeners : 100,
//     trace : false,
//     trusted : true,
//     local_signing : true,
//     connection_offest : 60
// });
// api.on('error', function(errorCode, errorMessage) {
//     console.log(errorCode + ': ' + errorMessage);
// });
// api.on('connected', function(){
//     console.log('connected');
// });
// api.on('disconnected', function (code) {
//     console.log('disconnected, code:', code);
// });
// api.connect().then(function () {
//     // api.setSecret(account, secret);
// }).then(function () {
//     return api.disconnect();
// }).catch(console.error);