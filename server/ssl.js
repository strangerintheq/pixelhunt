const fs = require('fs');

module.exports = {
    cert: readSslCert(),
    sslRedirect
}

function readSslCert() {

    if (!fs.existsSync('../sslcert1'))
        return console.log('../sslcert dir not found')

    let fileNames = fs.readdirSync('../sslcert');
    for (let i = 0; i < fileNames.length; i++) {
        let fileName = fileNames[i];
        const fileNameParts = fileName.split('.');
        const ext = fileNameParts.pop();
        fileName = fileNameParts.join('.')
        if (ext === 'crt') {
            try {
                let keyFilePath = `../sslcert/${fileName}.key`;
                console.log('reading ssl key file ' + keyFilePath)
                const key = fs.readFileSync(keyFilePath, 'utf8');
                let crtFilePath = `../sslcert/${fileName}.crt`;
                console.log('reading ssl crt file ' + crtFilePath)
                const cert = fs.readFileSync(crtFilePath, 'utf8');
                console.log('using ssl')
                return {key, cert};
            } catch (e) {}
        }
    }

    console.log('ssl not found')
}

function sslRedirect(req, res, next){
    if (req.secure)
        return next();
    res.redirect('https://' + req.headers.host + req.url)
}