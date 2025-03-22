'use strict';
const {getUserHome} = require('./src/util.js');
const nconf = require('nconf');

const config = nconf.file({file: getUserHome() + '/hummingbird-config.json'});

function set(settingKey, settingValue) {
  config.set(settingKey, settingValue);
  config.save();
}

function get(settingKey) {
  config.load();
  return config.get(settingKey);
}

module.exports = {
  set,
  get
}
console.log(process.platform)

