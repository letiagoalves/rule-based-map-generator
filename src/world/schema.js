'use strict';

var Joi = require('joi');
var Block = require('./../block');
var WorldConstraints = require('./../world-constraints');
var Strategy = require('./../strategies/strategy.js');

var strategySchema = Joi.object().type(Strategy).required();

var blocksSchema = Joi.array().items(Joi.object().type(Block)).min(2).required();

var constraintsSchema = Joi.object().type(WorldConstraints).required();

module.exports = {
    strategy: strategySchema,
    blocks: blocksSchema,
    constraints: constraintsSchema
};
