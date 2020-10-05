const loc = document.location;
const isSecure = ~loc.href.indexOf('https');
const url = `${isSecure ? 'wss' : 'ws'}://${loc.hostname}`;

let socket,
    connected = false,
    timeout = 625
    s = 8;

const canvas = document.createElement('canvas');
document.body.append(canvas);
const ctx = canvas.getContext('2d');

let state;

function newConnection() {

    socket = new WebSocket(url);

    socket.onmessage = e => {

        const o = JSON.parse(e.data)

        if (o.type === 'set'){
            ctx.fillRect(o.x*s, o.y*s, s, s);
            if (!state[o.x])
                state[o.x] = [];
            state[o.x][o.y] = 1;
        }

        if (o.type === 'scene'){
            state = o.state;
            restore();
        }

    };

    socket.onclose = () => {
        setTimeout(() => newConnection(), timeout);
        if (this.timeout <= 2e4)
            this.timeout *= 2;
        console.log('connection timeout ' + timeout)
    };

    socket.onopen = () => {
        connected = true;
        console.log('new connection');
        timeout = 625;
    };
}

newConnection();

addEventListener('click', (e) => {
    const x = Math.floor(e.clientX / s);
    const y = Math.floor(e.clientY / s);
    socket.send(JSON.stringify({x, y, type: 'set'}))
});


requestAnimationFrame(function upd() {

    if (canvas.width !== innerWidth || canvas.height !== innerHeight) {
        canvas.width = innerWidth;
        canvas.height = innerHeight;
        state && restore()
    }


    requestAnimationFrame(upd)
});

function restore() {
    state.forEach((row, x) => {
        row && row.forEach((value, y) => {
            if (value) {
                ctx.fillRect(x*s, y*s, s, s);
            }
        });
    });
}