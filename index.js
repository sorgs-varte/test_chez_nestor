const express = require('express');
const fs = require('fs');
const http = require('http');
const conf = require('./config');
const path = require('path');
//const privateKey  = fs.readFileSync('./server.key', 'utf8');
//const certificate = fs.readFileSync('./server.crt', 'utf8');
//const credentials = {key: privateKey, cert: certificate};

const app = express();
const router = require('./router');
const mongoose = require('mongoose');
mongoose.connect('mongodb://'+conf.dbpath+"/"+conf.dbname,{useNewUrlParser:true});
const port = 8080;
const httpServer = http.createServer(app);


router(app);


httpServer.listen(port);
console.log('Server listening  on:', port);

module.exports = app;