const fs = require('fs');
// eslint-disable-next-line no-unused-vars
const colors = require('colors');

exports.log = function(message) {
    if(!fs.existsSync('./logs')) {
        fs.mkdirSync('./logs');
    }
    if(!fs.existsSync(`./logs/${getFileName()}`)) {
        fs.writeFileSync(`./logs/${getFileName()}`, '');
    }
    fs.appendFileSync(`./logs/${getFileName()}`, `${getDate()} [INFO]: ${message}\n`);
    console.log(`${getDate()} [INFO]: ${message}`.yellow);
};
exports.error = function(message) {
    if(!fs.existsSync('./logs')) {
        fs.mkdirSync('./logs');
    }
    if(!fs.existsSync(`./logs/${getFileName()}`)) {
        fs.writeFileSync(`./logs/${getFileName()}`, '');
    }
    fs.appendFileSync(`./logs/${getFileName()}`, `${getDate()} [ERR ]: ${message}\n`);
    console.log(`${getDate()} [ERR ]: ${message}`.red);
};
exports.cmd = function(message) {
    if(!fs.existsSync('./logs')) {
        fs.mkdirSync('./logs');
    }
    if(!fs.existsSync(`./logs/${getFileName()}`)) {
        fs.writeFileSync(`./logs/${getFileName()}`, '');
    }
    fs.appendFileSync(`./logs/${getFileName()}`, `${getDate()} [CMD ]: ${message}\n`);
    console.log(`${getDate()} [CMD ]: ${message}`.green);
};

function getFileName() {
    const date = new Date();
    return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}.log`;
}
function getDate() {
    const date = new Date();
    return `[${date.toString()}]`;
}