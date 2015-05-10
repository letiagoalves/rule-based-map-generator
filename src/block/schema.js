'use strict';

var Joi = require('joi');

var idSchema = Joi.string().required();
var classesSchema = Joi.array().items(Joi.string()).default([]);
var sidesTemplateSchema = Joi.array().min(3).required();

module.exports = {
    id: idSchema,
    classes: classesSchema,
    sidesTemplate: sidesTemplateSchema
};
