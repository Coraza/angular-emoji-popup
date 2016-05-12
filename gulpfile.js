var gulp = require('gulp'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify');


gulp.task('build-js', function() {
    return gulp.src(['src/js/**/**', '!src/js/config.js'])
        .pipe(concat('emoji.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('dist/js/'));
});
