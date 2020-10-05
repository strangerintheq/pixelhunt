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

    const color = Math.random()*360;
    const id = Date.now() + '_' + color;

    clients[id] = ws;

    ws.send(JSON.stringify({
        type: 'auth',
        id,
        state
    }));

    ws.on('message', (msg) => {
        const o = JSON.parse(msg);
        if (!state[o.x])
            state[o.x] = [];
        state[o.x][o.y] = color;
        o.color = color;
        msg = JSON.stringify(o);

        for (let client in clients)
            clients[client].send(msg);
    });

    ws.on('close', () => {
        delete clients[id];
    });

});
