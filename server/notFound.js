let _404 = `<html><body>
<style>
    body { 
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 100px;
      font-family: monospace;
      background: radial-gradient(circle, #fff 0px, #000 200px );
      user-select: none;
    }
</style>
    404
</body></html>`;

function notFound(req, res) {
    return res.send(_404);
}

module.exports = notFound;