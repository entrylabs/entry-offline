'use strict';

module.exports = function(grunt) {
    // Project Configuration
    grunt.initConfig({
        'create-windows-installer': {
            // x64: {
            //     appDirectory: '/tmp/build/my-app-64',
            //     outputDirectory: '/tmp/build/installer64',
            //     authors: 'My App Inc.',
            //     exe: 'myapp.exe'
            // },
            ia32: {
                appDirectory: './app',
                outputDirectory: './tmp/build/installer32',
                authors: 'EntryLabs',
                exe: 'entry.exe'
            }
        }
    });

    //Load NPM tasks
    grunt.loadNpmTasks('grunt-electron-installer')

    //Default task(s).
    grunt.registerTask('default', ['create-windows-installer']);

    //Test task.
    //grunt.registerTask('test', ['env:test', 'mochaTest', 'karma:unit']);
};
