const SSL = require("./ssl");

function startServer(app) {
    let server;

    if (SSL.cert) {
        app.listen(80);
        console.log("redirect http server listening on port:", 80);
        server = require('https').createServer(SSL.cert, app);
        server.listen(443);
        console.log("https server listening on port:", 443);
    } else {
        server = require('http').createServer(app);
        server.listen(80);
        console.log("http server listening on port:", 80);
    }
    return server;
}

module.exports = startServer