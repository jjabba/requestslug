/*jslint indent: 2, unparam: true, nomen: true, plusplus: true */
"use strict";


// import node module 'json-server'
var express, _, StringDecoder, options, concat, http, https, fs, responder;

express = require('express');
_ = require('underscore');
concat = require('concat-stream');
StringDecoder = require('string_decoder').StringDecoder;
https = require('https');
http = require('http');
fs = require('fs');

options = {
  httpPort: 80,
  httpsPort: 443,
  key: fs.readFileSync('key.pem'),
  cert: fs.readFileSync('cert.pem')
};

// process server arguments
process.argv.forEach(function (val, index) {
  if (index < 2) {
    return; // we do not process 'node' nor '*.js'
  }

  if (val.substr(0, 1) === '-') {
    switch (val) {
    case "-port":
      if (process.argv.length > index + 1 && _.isNumber(process.argv[index + 1])) {
        options.port = process.argv[index + 1];
      } else {
        console.log("Invalid port!");
      }
      break;
    default:
      console.log("Unknown option '" + val + "'");
      break;
    }
  }
});

var app = express();

// make sure express collects the request body
app.use(function (req, res, next) {
  req.pipe(concat(function (data) {
    req.bodyBuffer = data;
    next();
  }));
});

// this middleware will be executed for every request to the app
app.use(function (req, res, next) {
  var decoder = new StringDecoder('utf8');
  console.log('<-- ' + req.method + ' @ ' + new Date().toISOString().replace(/T/, ' ').replace(/\..+/, ''));
  console.log(JSON.stringify(req.headers));
  console.log(decoder.write(req.bodyBuffer));
  console.log('--------------------------------------------------------------------------------');
  next();
});

responder = function (req, res) {
  res.send('{"Request": "Slug"}');
};

app.get('*', responder);
app.post('*', responder);

http.createServer(app).listen(options.httpPort);
https.createServer(options, app).listen(options.httpsPort);
