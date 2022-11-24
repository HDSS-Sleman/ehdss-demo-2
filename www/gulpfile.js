var gulp = require('gulp');
// minify and uglify js
var uglify = require('gulp-uglify');
// Strip console and debugger statements from JavaScript code
var stripDebug = require('gulp-strip-debug');

// file-file javascript yg akan di uglify + minified
gulp.task('js-min', function() {
    gulp.src(['js/*.js',
        '!js/*.min.js'], {
        // agar file dan folder yg dihasilkan menyesuaikan src
            base: '.'
        })
        .pipe(stripDebug())
        .pipe(uglify())
        .pipe(gulp.dest('.'));
});

// task didalam array dijalankan secara parallel, bukan urut..
// kalau mau urut lihat dokumentasi berikut
// https://github.com/gulpjs/gulp/blob/master/docs/recipes/running-tasks-in-series.md
gulp.task('default', ['js-min']);
