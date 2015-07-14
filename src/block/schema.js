'use strict';

var Joi = require('joi');

var idSchema = Joi.string().required();
var classesSchema = Joi.array().items(Joi.string()).default([]);
var sidesTemplateSchema = Joi.array().min(3).required();
var constraintsSchema = Joi.object().keys({
    maxOccupation: Joi.number().greater(0).default(null),
    maxOccupationPercentage: Joi.number().greater(0).less(100).default(null),
    minimumDistance: Joi.object().default(null)
});

module.exports = {
    id: idSchema,
    classes: classesSchema,
    sidesTemplate: sidesTemplateSchema,
    constraints: constraintsSchema
};
