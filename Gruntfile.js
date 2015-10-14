module.exports = function (grunt) {
    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        eslint: {
            src: {
                options: {
                    configFile: 'conf/eslint/src.json',
                },
                src: ['src/**/*.js', 'examples/**/*.js']
            },
            test: {
                options: {
                    configFile: 'conf/eslint/test.json',
                },
                src: ['test/**/*.js']
            }
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
