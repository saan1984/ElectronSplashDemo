'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
//var esperanto = require('esperanto');
var map = require('vinyl-map');
var jetpack = require('fs-jetpack');
var utils = require('./utils');
var projectDir = jetpack;
var srcDir = projectDir.cwd('./app');
var destDir = projectDir.cwd('./build');

var paths = {
    toCopy: [
        'app/splash/**',
        'app/main.js',
        'app/app.js',
        'app/node_modules/**',
        'app/bower_components/**',
        'app/module/**',
        'app/stylesheets/css/**',
        'app/**/*.html'
    ]
}
//Task
gulp.task('clean', function(callback) {
    return destDir.dirAsync('.', { empty: true });
});
var copyTask = function () {
    return projectDir.copyAsync('app', destDir.path(), {
        overwrite: true,
        matching: paths.toCopy
    });
};
gulp.task('copy', ['clean'], copyTask);
gulp.task('copy-watch', copyTask);
gulp.task('sass', function () {
    gulp.src('app/stylesheets/sass/app.scss')
        .pipe(sass.sync().on('error', sass.logError))
        .pipe(gulp.dest('app/stylesheets/css'));
});
gulp.task('sass-watch', ['sass']);
gulp.task('finalize', ['clean'], function () {
    var manifest = srcDir.read('package.json', 'json');
    switch (utils.getEnvName()) {
        case 'development':
            manifest.name += '-dev';
            manifest.productName += ' Dev';
            break;
    }
    destDir.write('package.json', manifest);

    var configFilePath = projectDir.path('config/env_' + utils.getEnvName() + '.json');
    destDir.copy(configFilePath, 'env_config.json');
});
gulp.task('watch', function () {
    gulp.watch(paths.toCopy, ['copy-watch']);
    gulp.watch('app/**/*.scss', ['sass-watch']);
});
gulp.task('build', ['sass', 'copy', 'finalize']);
