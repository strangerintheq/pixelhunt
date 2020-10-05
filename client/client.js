const loc = document.location;
const isSecure = ~loc.href.indexOf('https');
const url = `${isSecure ? 'wss' : 'ws'}://${loc.hostname}`;

let socket,
    connected = false,
    timeout = 625
    s = 4;

const canvas = document.createElement('canvas');
document.body.append(canvas);
const ctx = canvas.getContext('2d');

let state;

function newConnection() {

    socket = new WebSocket(url);

    socket.onmessage = e => {

        const o = JSON.parse(e.data)

        if (o.type === 'set') {
            placePixel(o.color, o.x, o.y);
            if (!state[o.x])
                state[o.x] = [];
            state[o.x][o.y] = o.color;
            console.log('set', o)
        }

        if (o.type === 'auth') {
            state = o.state;
            restore();
            console.log('auth', o)
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

function placePixel(value, x, y) {
    ctx.fillStyle = `hsl(${value}, 55%, 55%)`;
    ctx.fillRect(x * s, y * s, s, s);
}

function restore() {
    state.forEach((row, x) => {
        row && row.forEach((value, y) => {
            if (value) {
                placePixel(value, x, y);
            }
        });
    });
}