'use strict';

var interfaceDeclaration = ['init', 'get', 'getAll'];

function Strategy(name, sides, interfaceImplementation) {
    var that = this;

    // TODO: assertions
    //assert(Object.keys(interfaceImplementation)).toequal(interfaceDeclaration);
    var props = {
        name: name
    };

    this.getName = function getName() {
        return props.name;
    };

    // set interface methods
    interfaceDeclaration.forEach(function setMethodImplementation (methodName) {
        //TODO assert interfaceImplementation[methodName]
        that[methodName] = interfaceImplementation[methodName];
    });
}

module.exports = Strategy;
