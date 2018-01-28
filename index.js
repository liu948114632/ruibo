let express = require('express');
let app = express();
// app.get('/user', function(req, res){
//     res.send('Hello World Expressjs');
// });
require('./app/api')(app);
app.listen(3000);