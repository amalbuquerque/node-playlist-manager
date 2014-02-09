// thatsit-manager: app.js
// setup
var config = require('./config');
var logger = require('./log');
var myutils = require('./utils');

var express = require('express');
var formidable = require('formidable');
var fs = require('fs');
var restler = require('restler');
var engines = require('consolidate');

var scriptsPath = config.folders.scripts;
var scriptsRemoteFolder = 'scripts';
var assetsPath = config.folders.assetsPath;
var assetsRemoteFolder = 'assets';

var app = express();

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
    console.log('returning: ' + JSON.stringify ( config.clients.hosts ));
    res.render('index.html', {
        // <%= hosts %> renderiza HTML, escapa caracteres
        // <%- hosts %> coloca a string que passamos, sem qq escape
        hosts: JSON.stringify ( config.clients.hosts ),
        infopath: config.clients.infoPath
    });
});

var nodemailer = require("nodemailer");

app.get('/mailtest', function(req, res) {
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

// 2013-12-18, AA: Upload para permitir o save
// dos spots directamente
app.get('/upload-spot', function(req, res) {
    res.render('upload.html', {
            hosts: config.clients.hosts,
        });
});

// 2013-12-22, AA: podemos colocar o Parser (ou mais do que um)
// que devera ser utilizado no tratamento do request
app.post('/ajax/upload-spot', function(req, res) {

    // parse a file upload
    var form = new formidable.IncomingForm();

    /*
    form.on('end', function() {
      logger.info("On Form.end!");
      res.send({
          filesystemPath: "req.files.userSpot.path",
          sentWithSuccess: true
      });
    });
    */

    form.parse(req, function(err, fields, files) {
      logger.info("fields = " + myutils.JSONstringify(fields));
      logger.info("files = " + myutils.JSONstringify(files));
      var upload_result = handle_spot_upload(fields.hostToSend,
          fields.durationSpot,
          files.userSpot.name,
          files.userSpot.path);

      res.send({
          filesystemPath: (upload_result !== null ? files.userSpot.path : "CHOSEN HOST NOT FOUND"),
          // se o upload_result == null, nao encontrou o host
          sentWithSuccess: (upload_result !== null ? upload_result : false)
      });
    });
});

// Devolve boolean consoante o envio com sucesso caso tenha encontrado
// o host passado como argumento no config; se nao encontrou o host,
// devolve null
var handle_spot_upload = function(chosen_host, spot_duration, filename, input_path) {

    /*
    var chosen_host = req.body.hostToSend;
    var spot_duration = req.body.durationSpot;
    var filename = req.files.userSpot.name;
    var input_path = req.files.userSpot.path;
    */

    logger.info('Received spot: ' + filename);
    logger.info('With duration: ' + spot_duration);

    var endpoint = "http://";

    var found_host = config.clients.hosts.some(function (h) {
        if (h.host === chosen_host) {
            endpoint += h.host + ":" + h.port + "/ajax/upload-spot";
            return true;
        }
        // .some para no primeiro true
        return false;
    });

    if ( found_host ) {
        logger.info('Send to endpoint: ', endpoint);

        fs.stat(input_path, function(err, stats) {
            restler.post(endpoint, {
                multipart: true,
                data: {
                    "userSpot": restler.file(input_path, filename, stats.size, null, "application/x-shockwave-flash"),
                    "durationSpot": spot_duration
                }
            }).on("complete", function(result) {
                if (result instanceof Error) {
                    logger.info("ERRO no Sent!:", result);
                } else {
                    logger.info("Complete!:", result);
                }
                /* 2014-02-09, AA: Quando esta funcao
                 * no fim devolvia a resposta ao form POST
                res.send({
                    filesystemPath: input_path,
                    sentWithSuccess: (result instanceof Error)
                });
                */
                // TODO: Depois de enviado,
                // temos de apagar o ficheiro temporario
                // senao fica la pendurado ad eternum
                return (result instanceof Error);
            });
        });
    } else {
        return null;
    }
};

// 2013-12-23, AA: OK a bombar
// falta passar o caminho do ficheiro,
// a duration do spot e o URL em que posta
app.get('/xptu', function(req, res) {
    var filename = "zzzzzCasadasCasas.swf";
    var input_path = "C:\\" + filename;

    fs.stat(input_path, function(err, stats) {
        restler.post("http://localhost:3000/ajax/upload-spot", {
            multipart: true,
            data: {
                "userSpot": restler.file(input_path, filename, stats.size, null, "application/x-shockwave-flash"),
                "durationSpot": 14
            }
        }).on("complete", function(data) {
            logger.info("Complete!:", data);
        });
    });

    res.send("OK");
});


app.listen(config.web.port);
logger.info('Listening on port ' + config.web.port);
logger.info('Running on: ' + process.cwd());
