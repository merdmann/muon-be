module.exports = function (grunt) {

    // Project configuration.
    grunt.initConfig({
        karma: {

            unit: { configFile: 'test/karma.conf.js'}
        }
    });

    grunt.loadNpmTasks('grunt-karma');

    // Default task(s).
    grunt.registerTask('default', ['karma']);

};
