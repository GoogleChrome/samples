'use strict';
var deepAssign = require('deep-assign');
var def = require('./');

def = deepAssign({}, def);

def.env.browser = true;
def.env.node = false;

module.exports = def;
