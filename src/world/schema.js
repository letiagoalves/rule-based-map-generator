'use strict';

var Joi = require('joi');
var Strategy = require('./../strategies/strategy.js');
var Block = require('./../block');

var strategySchema = Joi.object().type(Strategy).required();
var blocksSchema = Joi.array().items(Joi.object().type(Block)).min(2).required();

module.exports = {
    strategy: strategySchema,
    blocks: blocksSchema
};
