var gulp  = require('gulp'),
    compass = require('gulp-compass'),
    uglify = require('gulp-uglify'),
    del = require('del'),
    imagemin = require('gulp-imagemin'),
    jade = require('gulp-jade'),
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
    return gulp.src('./src/fonts/*')
            .pipe(gulp.dest('./dist/fonts'))
})

gulp.task('jscripts', function () {
    return gulp.src(['./src/jscripts/**/*.js', '!./src/jscripts/third_party/*.js'])
            .pipe(concat('app.js'))
            //.pipe(uglify())
            .pipe(gulp.dest('./dist/jscripts'));
})

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
            .pipe(jade({pretty: true}))
            .pipe(gulp.dest('dist'))
})

gulp.task('templates', function () {
    return gulp.src('./src/templates/*.jade')
            .pipe(jade({pretty: true}))
            .pipe(gulp.dest('dist/templates'))
})

gulp.task('watch', function () {
    gulp.watch('src/sass/style.scss', ['styles']);
    gulp.watch(['./src/jscripts/**/*.js', '!./src/jscripts/third_party/*.js'], ['jscripts']);
    gulp.watch('src/templates/*', ['templates']);
    gulp.watch('src/index.jade', ['html']);
})

gulp.task('default', ['clean'], function () {
    gulp.start(['html', 'templates', 'commonStyles', 'styles', 'fonts', 'images', 'jscripts', 'jsLibs', 'watch']);
})
