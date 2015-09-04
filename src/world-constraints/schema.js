'use strict';

var Joi = require('joi');

var initialMapSizeSchema = Joi.number().integer().required();

var boundsSchema = Joi.object().keys({
    horizontal: Joi.number().required(),
    vertical: Joi.number().required()
}).allow(null);

var mapCenterSchema = Joi.string().allow(null);

module.exports = {
    initialMapSize: initialMapSizeSchema,
    bounds: boundsSchema,
    mapCenter: mapCenterSchema
};
