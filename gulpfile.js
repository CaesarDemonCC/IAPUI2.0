require("babel-register");

var gulp = require('gulp'),
    compass = require('gulp-compass'),
    uglify = require('gulp-uglify'),
    del = require('del'),
    imagemin = require('gulp-imagemin'),
    jade = require('gulp-jade'),
    jsmin = require('gulp-jsmin'),
    modify = require('gulp-modify'),
    gulpFunction = require('gulp-function'),
    react = require('gulp-react'),
    webpack = require('gulp-webpack'),
    mocha = require('gulp-mocha'),
    concat = require('gulp-concat');

var rf = require("fs");  

gulp.task('clean', function () {
    del(['dist/*.html', 'dist/images/*', 'dist/styles/*', 'dist/jscripts/*.js', 'dist/jscripts/third_party/*.js', 'dist/fonts/*', 'dist/templates/*']);
})

gulp.task('images', function () {
    return gulp.src('./src/images/**/*')
            .pipe(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true }))
            .pipe(gulp.dest('./dist/images'))
})

gulp.task('fonts', function () {
    return gulp.src('./src/fonts/*')
            .pipe(gulp.dest('./dist/fonts'))
})

// gulp.task('jscripts', function () {
//     return gulp.src(['./src/jscripts/**/*.js', '!./src/jscripts/third_party/*.js'])
//             .pipe(react())
//             .pipe(concat('app.js'))
//             //.pipe(jsmin())
//             //.pipe(uglify())
//             .pipe(gulp.dest('./dist/jscripts'));
// })

gulp.task('jsLibs', function () {
    return gulp.src(['./src/jscripts/third_party/*'])
            //.pipe(uglify())
            .pipe(gulp.dest('./dist/jscripts/third_party/'));
})


gulp.task('commonStyles', function () {
    return gulp.src('./src/sass/common.scss')
            .pipe(compass({
                config_file: './config.rb',
                css: 'dist/styles',
                sass: 'src/sass'
            }))
})

gulp.task('styles', function() {  
    return gulp.src('./src/sass/style.scss')
            .pipe(compass({
                config_file: './config.rb',
                css: 'dist/styles',
                sass: 'src/sass'
            }))
})

gulp.task('html', function () {
    return gulp.src('src/index.jade')
            .pipe(jade({
                doctype: 'html',
                pretty: true
            }))
            .pipe(gulp.dest('dist'))
})

gulp.task('jscripts', function () {
    return gulp.src('./src/jscripts/app.jsx')
            .pipe(webpack(require('./webpack.config.js')))
            .pipe(gulp.dest('./dist/jscripts'))
})

gulp.task('watch', function () {
    gulp.watch('src/sass/style.scss', ['styles']);
    gulp.watch(['src/sass/*.scss', '!src/sass/style.scss'], ['commonStyles']);
    gulp.watch(['./src/jscripts/**/*.js', './src/jscripts/**/*.jsx', '!./src/jscripts/third_party/*.js'], ['jscripts']);
    // gulp.watch('src/templates/*', ['templatesCache']);
    gulp.watch('src/index.jade', ['html']);
})

gulp.task('testing', function () {
    return gulp.src(['testing/UT/**/*.js'], {read: false})
        // gulp-mocha needs filepaths so you can't have any plugins before it 
        .pipe(mocha({reporter: 'mochawesome', require:['./testing/.setup']}));// spec/dot/nyan/TAP
});


gulp.task('default', ['clean'], function () {
    gulp.start(['html', 'commonStyles', 'styles', 'fonts', 'images', 'jsLibs', 'jscripts', 'watch']);
})
