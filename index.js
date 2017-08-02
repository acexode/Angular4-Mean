const express = require('express'),
    app = express(),
    path = require('path')
mongoose = require('mongoose'),
    config = require('./config/db.js');


mongoose.Promise = global.Promise
mongoose.createConnection(config.uri, (err) => {
    if (err) {
        console.log(`could not connect to db`, err)
    } else {
        console.log(`Connect to db ${config.db}`)

    }
});
app.use(express.static(__dirname + '/client/dist/'))
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/client/dist/index.html'));
});

port = 3000
app.listen(port, () => {
    console.log(`listening on port ${port}`)
});