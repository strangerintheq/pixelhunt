const express = require('express');
const http = require('http');
const WebSocketServer = require('ws');

const app = express();
app.use(express.static('./client'));

const server = http.createServer(app);
server.listen(process.env.PORT | 80);
console.log("http server listening on port:", 80);

//

const clients = {};
const state = [];

const wss = new WebSocketServer.Server({server});
wss.on('connection', (ws) => {

    const id = Date.now() + '_' + Math.random().toString(36).substring(2)

    clients[id] = ws;

    ws.send(JSON.stringify({
        type: 'scene',
        state
    }));

    ws.on('message', (msg) => {
        const o = JSON.parse(msg);
        if (!state[o.x])
            state[o.x] = [];
        state[o.x][o.y] = 1;

        for (let client in clients)
            clients[client].send(msg);
    });

    ws.on('close', () => {
        delete clients[id];
    });

});
