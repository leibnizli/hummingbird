'use strict';

var nconf = require('nconf').file({file: getUserHome() + '/hummingbird-config.json'});

function set(settingKey, settingValue) {
    nconf.set(settingKey, settingValue);
    nconf.save();
}

function get(settingKey) {
    nconf.load();
    return nconf.get(settingKey);
}
console.log(process.platform)
function getUserHome() {
    return process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'];
}

module.exports = {
    set: set,
    get: get
};