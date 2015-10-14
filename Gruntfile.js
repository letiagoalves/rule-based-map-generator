module.exports = function (grunt) {
    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        eslint: {
            options: {
                configFile: 'conf/eslint.json',
            },
            target: ['src/**/*.js', 'examples/**/*.js', 'test/**/*.js']
        },

        mocha_istanbul: {
            coverage: {
                src: 'test/unit/**/*.js',
                root: 'src/'
            }
        }
    });

    grunt.registerTask('unit', ['mocha_istanbul:coverage']);

    grunt.registerTask('test', ['eslint', 'unit']);
};
