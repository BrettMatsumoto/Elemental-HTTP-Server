'use strict';

const http = require('http');
const fs = require('fs');
const css = require('./css/styles.css');
const helium = require('.z/helium.html');
const hydrogen = require('/public/hydrogen.html');
let response = '';

const httpServer = http.createServer((req, res) => {
  req.setEncoding('utf8');
  req.on('data', (data) => {

  })
})