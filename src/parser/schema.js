'use strict';

var Joi = require('joi');

/* Map bounds schema */
var boundsSchema = Joi.object().keys({
    horizontal: Joi.number().required(),
    vertical: Joi.number().required()
});

var blockConstraintsSchema = Joi.object().keys({
    maxOccupation: Joi.number().min(1),
    maxOccupationPercentage: Joi.number().min(1).max(99),
    minimumDistance: Joi.object()
});

/* Block schema */
var blockSchema = Joi.object().keys({
    id: Joi.string().required(),
    classes: Joi.array().items(Joi.string()),
    connectors: Joi.object().required(),
    constraints: blockConstraintsSchema
}).required();

/* Connector schema */
var connectorSchema = Joi.object().keys({
    id: Joi.string().required(),
    type: Joi.string().valid('whitelist', 'blacklist'),
    blockIds: Joi.array(Joi.string()).min(1).required(),
    blockClasses: Joi.array(Joi.string())
}).required();

var configSchema = Joi.object().keys({
    seed: Joi.number().required(),
    strategy: Joi.string().required(),
    initialMapSize: Joi.number().min(2).required(),
    bounds: boundsSchema,
    mapCenter: Joi.string(),
    blocks: Joi.array().items(blockSchema).min(1),
    connectors: Joi.array().items(connectorSchema).min(1)
}).required();

module.exports = {
    config: configSchema
};
