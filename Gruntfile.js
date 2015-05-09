module.exports = function (grunt) {
    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        eslint: {
            options: {
                configFile: 'conf/eslint.json',
            },
            target: ['src/**/*.js', 'examples/**/*.js']
        }
    });

    grunt.registerTask('default', ['eslint']);
};
