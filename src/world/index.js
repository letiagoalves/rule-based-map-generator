'use strict';

var Joi = require('joi');

function World(strategy, blocks) {
    this.blocks = {};
    this.connectors = {}; // do I really need this? they can be referenced in block sides
}

module.exports = World;
