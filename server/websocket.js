const WebSocketServer = require('ws');

const clients = {};
const state = []

function listenWebsocket(server) {



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

            for (let client in clients) {
               // if (client !== id) {
                    clients[client].send(msg);
               // }
            }
        });

        ws.on('close', () => {
            delete clients[id];
        });
    });

}

module.exports = listenWebsocket;

