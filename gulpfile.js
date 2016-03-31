var gulp  = require('gulp'),
    compass = require('gulp-compass');

gulp.task('clean', function () {
    
})

gulp.task('styles', function() {  
  return gulp.src('src/sass/*.scss')
        .pipe(compass({
            config_file: './config.rb',
            css: 'mobile/styles',
            sass: 'src/sass'
        }))
        .pipe(gulp.dest('mobile/styles/style.css'))
})

gulp.task('default', ['clean'], function () {
    gulp.start([]);
})
