// setup
var config = require('./config');
var logger = require('./log');

var scriptsPath = config.folders.scripts;
var scriptsRemoteFolder = 'scripts';
var assetsPath = config.folders.assetsPath;
var assetsRemoteFolder = 'assets';

var express = require('express');
var fs = require('fs');

var app = express();

var engines = require('consolidate');

// pasta onde serao servidos os scripts
app.use('/' + scriptsRemoteFolder, express.static(__dirname + '/' + scriptsPath));
// pasta onde serao servidos os diferentes assets (css, images, etc)
app.use('/' + assetsRemoteFolder, express.static(__dirname + '/' + assetsPath));

app.set('views', __dirname + '/views');
app.engine('html', engines.ejs);
app.set('view engine', 'html');
// app.set('html', require('ejs').renderFile);

// Forma sem express (apenas node.js)
app.get('/hello.txt', function(req, res) {
    var body = "Hello world without fancy express thing, I'm the ThatsIt Playlist Manager";
    res.setHeader('Content-Type', 'text/plain');
    res.setHeader('Content-Length', body.length);
    res.end(body);
});

// Forma com recurso ao express
app.get('/', function(req, res) {
    res.send("Hello world, I'm the ThatsIt Playlist Manager");
});

var nodemailer = require("nodemailer");

app.get('/test', function(req, res) {
    // create reusable transport method (opens pool of SMTP connections)
    var smtpTransport = nodemailer.createTransport("SMTP", {
        service: "Gmail",
        auth: {
            user: "outdoors.thatsit@gmail.com",
            pass: "macksodius"
        }
    });

    // setup e-mail data with unicode symbols
    var mailOptions = {
        from: "Thatsit Outdoors ✔ <outdoors.thatsit@gmail.com>", // sender address
        to: "andre.m.de.albuquerque@gmail.com, dre_albuquerque@hotmail.com", // list of receivers
        subject: "Hello ✔", // Subject line
        text: "Hello world ✔", // plaintext body
        html: ("<b>Hello world ✔</b> at " + (new Date()).toString()) // html body
    }

    // send mail with defined transport object
    smtpTransport.sendMail(mailOptions, function(error, response){
        if(error){
            console.log(error);
        }else{
            console.log("Message sent: " + response.message);
        }

        // if you don't want to use this transport object anymore, uncomment following line
        smtpTransport.close(); // shut down the connection pool, no more messages
    });

    res.send("Hello world, I'm the ThatsIt Playlist Manager. Sent mail!");
});

app.listen(config.web.port);
logger.info('Listening on port ' + config.web.port);
logger.info('Running on: ' + process.cwd());
