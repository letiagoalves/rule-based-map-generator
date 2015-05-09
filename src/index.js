'use strict';

//var Joi = require('joi');
//var validator = require('./validator');
var Connector = require('./connector');

var conn1 = new Connector('someId', 'whitelist', ['someItem']);
console.info('conn1', conn1);

//var World = require('./world');
//console.info('hello world', new World());

/*
var result = validator.assert({}, Joi.object().keys({
    id: Joi.number().required(),
    type: Joi.string().required()
}));

console.info('result', result);
*/
