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
    webpack = require('webpack-stream'),
    mocha = require('gulp-mocha'),
    shell = require('gulp-shell'),
    concat = require('gulp-concat');

gulp.task('clean', function () {
    del(['dist/*.html', 'dist/images/*', 'dist/styles/*', 'dist/jscripts/*.js', 'dist/jscripts/third_party/*.js', 'dist/fonts/*', 'dist/templates/*']);
})

gulp.task('images', function () {
    return gulp.src('./src/images/**/*')
            .pipe(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true }))
            .pipe(gulp.dest('./dist/images'))
})

gulp.task('fonts', function () {
    gulp.src('src/styles/font-awesome.min.css')
        .pipe(gulp.dest('dist/styles'))
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
    return gulp.src('src/styles/arubaUI/common.scss')
            .pipe(compass({
                config_file: './config.rb',
                css: 'dist/styles',
                sass: 'src/styles/arubaUI'
            }))
})

gulp.task('styles', function() {  
    return gulp.src('src/styles/arubaUI/style.scss')
            .pipe(compass({
                config_file: './config.rb',
                css: 'dist/styles',
                sass: 'src/styles/arubaUI'
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

gulp.task('webpackServer', shell.task('npm run webpack'));
gulp.task('webpackBuild', shell.task('npm run build'));

gulp.task('watch', function () {
    gulp.watch('src/styles/arubaUI/style.scss', ['styles']);
    gulp.watch(['src/styles/arubaUI/*.scss', '!src/styles/arubaUI/style.scss'], ['commonStyles']);
    //gulp.watch(['./src/jscripts/**/*.js', './src/jscripts/**/*.jsx', '!./src/jscripts/third_party/*.js'], ['jscripts']);
    gulp.watch('src/index.jade', ['html']);
})

gulp.task('testing', function () {
    return gulp.src(['testing/UT/**/*.js'], {read: false})
        // gulp-mocha needs filepaths so you can't have any plugins before it 
        .pipe(mocha({reporter: 'mochawesome', require:['./testing/.setup']}));// spec/dot/nyan/TAP
});

gulp.task('dev', ['clean'], function () {
    gulp.start(['html', 'commonStyles', 'styles', 'fonts', 'images', 'jsLibs', 'webpackServer', 'watch']);
})

gulp.task('default', ['clean'], function () {
    gulp.start(['html', 'commonStyles', 'styles', 'fonts', 'images', 'jsLibs', 'webpackBuild', 'watch']);
})
