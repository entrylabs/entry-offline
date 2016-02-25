var gulp = require('gulp');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var less = require('gulp-less');
var minifyCSS = require('gulp-minify-css');
var sourcemaps = require('gulp-sourcemaps');
var path = require('path');
var gutil = require("gulp-util");
var webpack = require('webpack');

var paths = {
  	scripts: ['src/**/*.js'],
  	less: ['src/**/*.less']
};

gulp.task('base', function(callback) {
    // run webpack
    return webpack({
        watch: true,
        errorDetails: true,
        entry: {
            main : './src/main.js'
        },
        output: {
            path: './dist/',
            filename: "[name].bundle.js"
        },
        module: {
            loaders: [
                { test: /\.(eot|ttf|cur|woff|woff2|svg)$/, loader: "file-loader" },
                { test: /\.css$/, loader: "style!css" },
                { test: /\.less$/, loader: "style-loader!css-loader!less-loader" },
                { test: /\.png$/, 
                    loader: "url-loader?limit=2&mimetype=image/png",
                }
            ]
        },
         externals: {
            "jquery": "jQuery",
            "angular": "angular"
        }
    }, function(err, stats) {
        console.error(err);
        if(err) throw new gutil.PluginError("webpack", err);
        gutil.log("[webpack]", stats.toString({
            // output options
        }));
        // callback();
    });
});

// Rerun the task when a file changes 
gulp.task('watch', function() {
  	// gulp.watch(paths.scripts, ['scripts']);
});
 
// The default task (called when you run `gulp` from cli) 
gulp.task('default', ['base']);

gulp.task('deploy', ['scripts']);