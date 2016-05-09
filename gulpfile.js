var gulp = require('gulp');
var concat = require('gulp-concat');
var minify = require('gulp-minify');
var addsrc = require('gulp-add-src');
var rename = require('gulp-rename');


gulp.task('default', ['assets:scripts']);

gulp.task('assets:scripts', [], function() {
    return gulp.src(['src/js/**/*.js', '!src/js/config.js'])
        .pipe(concat('emoji.js'))
        .pipe(minify())
        .pipe(rename({
                basename: "emoji",
                suffix: '.min'
            }))
        .pipe(addsrc('src/js/config.js'))
        .pipe(gulp.dest('dist/js'));
 });
