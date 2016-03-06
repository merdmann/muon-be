module.exports = function (grunt) {

    // Project configuration.
    grunt.initConfig({
    	// ..................................................................
        jshint: {
            files: ['Gruntfile.js',
                'scripts/**/*.js',
                'routes/**/*.js',
                'lib/**/*.js',
                'test/**/*.js'
            ],
            options: {
                bitwise: true,
                browser: true,
                node: true,

                globals: {
                    jQuery: true

                }
            }
        },

        // ....................................................................
        karma: {
            unit: { configFile: 'test/karma.conf.js' }
        },

        // ---------------------------------------------------------------------
        exec: {
            'start-test': { command: 'npm run-script start-test' },
            'stop-test': { command: 'npm run-script stop-test' }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-karma');
    grunt.loadNpmTasks('grunt-exec');


    // Default task(s).
    grunt.registerTask('default', ['jshint']);

    // important other tasks
    grunt.registerTask('test', ['exec:stop-test', 'exec:start-test', 'karma']);

};
