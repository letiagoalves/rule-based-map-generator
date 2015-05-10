'use strict';

function Strategy(name) {
    // TODO: assertions
    var props = {
        name: name
    };

    this.getName = function getName() {
        return props.name;
    };
}

module.exports = Strategy;
