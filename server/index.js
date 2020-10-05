
const express = require('express');

const makeRouting = require("./route");
const startServer = require("./server");
const listenWebsocket = require("./websocket");

const app = express();
makeRouting(app);
const server = startServer(app);
listenWebsocket(server);


