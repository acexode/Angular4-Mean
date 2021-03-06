const express = require('express'),
    cors = require('cors'),
    app = express(),
    router = express.Router(),
    path = require('path'),
    expressValidator = require('express-validator'),
    mongoose = require('mongoose'),
    bodyParser = require('body-parser'),
    config = require('./config/db.js'),
    auth = require('./routes/auth.js')(router),
    blog = require('./routes/blog.js')(router),
    port = process.env.PORT || 3000

mongoose.Promise = global.Promise
mongoose.connect(config.uri, { useMongoClient: true }, (err) => {
    if (err) {
        console.log(`could not connect to db`, err)
    } else {
        console.log(`Connect to db ${config.db}`)

    }
});

app.use(cors({
        origin: 'http://localhost:4200'
    }))
    // parse application/x-www-form-urlencoded 
app.use(bodyParser.urlencoded({ extended: false }))
    // parse application/json 
app.use(bodyParser.json())
app.use(expressValidator({
    errorFormatter: function(param, msg, value) {
        var namespace = param.split('.'),
            root = namespace.shift(),
            formParam = root;

        while (namespace.length) {
            formParam += '[' + namespace.shift() + ']';
        }
        return {
            param: formParam,
            msg: msg,
            value: value
        };
    }
}));
app.use(express.static(__dirname + '/public'))
app.use('/auth', auth)
app.use('/blog', blog)
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/public/index.html'));
});


app.listen(port, () => {
    console.log(`listening on port ${port}`)
});