const express = require('express');

const notFound = require("./notFound");
const SSL = require("./ssl");


function makeRouting (app) {
    SSL.cert && app.use(SSL.sslRedirect);
    app.use(express.static('./client'));
    app.use(notFound);
}


module.exports = makeRouting;
