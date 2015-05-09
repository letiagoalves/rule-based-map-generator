'use strict';

var Joi = require('joi');
var CONSTANTS = require('./../constants.json');

var idSchema = Joi.string().required();

var typeSchema = Joi.string().valid(
    CONSTANTS.connector.type.blacklist,
    CONSTANTS.connector.type.whitelist
).required();

var blockIds = Joi.array().min(1).items(Joi.string()).required();

var blockClasses = Joi.array().items(Joi.string()).default([]);

var connectorSchema = Joi.object().keys({
    id: idSchema,
    type: typeSchema,
    blockIds: blockIds,
    blockClasses: blockClasses
});

module.exports = {
    id: idSchema,
    type: typeSchema,
    blockIds: blockIds,
    blockClasses: blockClasses,
    connector: connectorSchema
};
