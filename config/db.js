const crypto = require('crypto').randomBytes(256).toString('hex');

module.exports = {
    uri: 'mongodb://Myself:myself@ds151153.mlab.com:51153/acecodedb',
    secret: crypto,
    db: 'acecodedb'

}