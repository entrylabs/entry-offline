'use strict';

module.exports = function(grunt) {
    // Project Configuration
    grunt.initConfig({
         electron: {
            winBuild: {
                options: {
                    name: 'Entry',
                    dir: 'app',
                    out: 'dist',
                    version: '0.36.8',
                    platform: 'win32',
                    arch: 'x64'
                }
            }
            // osxBuild: {
            //     options: {
            //         name: 'Fixture',
            //         dir: 'app',
            //         out: 'dist',
            //         version: '0.25.3',
            //         platform: 'darwin',
            //         arch: 'x64'
            //     }
            // }
        },
        'create-windows-installer': {
            ia32: {
                appDirectory: './dist/Entry-win32-x64',
                outputDirectory: '/dist/installer/installer32',
                authors: 'EntryLabs',
                exe: 'Entry.exe'
            },
            x64: {
                appDirectory: './dist/Entry-win32-x64',
                outputDirectory: './dist/installer/installer64',
                authors: 'EntryLabs',
                exe: 'Entry.exe'
            }
        }
    });

    //Load NPM tasks
    grunt.loadNpmTasks('grunt-electron-installer');
    grunt.loadNpmTasks('grunt-electron');

    //Default task(s).
    grunt.registerTask('default', ['electron', 'create-windows-installer']);
    grunt.registerTask('build', ['electron']);
    grunt.registerTask('install', ['create-windows-installer']);

    //Test task.
    //grunt.registerTask('test', ['env:test', 'mochaTest', 'karma:unit']);
};
