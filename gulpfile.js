var gulp = require('gulp');
var gulpsync = require('gulp-sync')(gulp);
var electron = require('gulp-electron');
var createInstaller = require('electron-installer-squirrel-windows')
var packageJson = require('./app/package.json');

gulp.task('build', function(callback) {    
    gulp.src("")
    .pipe(electron({
        src: './app',
        packageJson: packageJson,
        release: './dist',
        cache: './cache',
        version: 'v0.36.9',
        packaging: true,
        platforms: ['win32-x64'],
        platformResources: {
            darwin: {
                CFBundleDisplayName: packageJson.name,
                CFBundleIdentifier: packageJson.name,
                CFBundleName: packageJson.name,
                CFBundleVersion: packageJson.version,
                icon: 'gulp-electron.icns'
            },
            win: {
                "version-string": packageJson.version,
                "file-version": packageJson.version,
                "product-version": packageJson.version,
                "icon": './build/icon.ico'
            }
        }
    }))
    .pipe(gulp.dest(""));
});

gulp.task('install', function(callback) {
    var opts = {
        path: './dist/v0.36.9/win32-x64',
        out: './dist/win32-x64',
        authors: 'EntryLabs',
        owners: 'EntryLabs',
        setup_icon: './build/icon.ico',
        overwrite: true
    }
    createInstaller(opts, function done (err) {
        if(err)
            console.log(err);
    })

});

// The default task (called when you run `gulp` from cli) 
gulp.task('default', gulpsync.async(['build', 'install']));