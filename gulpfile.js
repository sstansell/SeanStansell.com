'use strict';

var gulp = require('gulp');
var sass = require('gulp-ruby-sass');
var browserSync = require('browser-sync');
var reload = browserSync.reload;

// watch files for changes and reload
gulp.task('serve', ['sass'], function() {
  browserSync({
    server: {
      baseDir: 'dev'
    }
  });

  gulp.watch(['*.html', 'css/**/*.css', 'sass/**/*.scss', 'js/**/*.js'], {cwd: 'dev'}, reload);
});

gulp.task('sass', function() {
  return sass('dev/sass/*.scss')
    .pipe(gulp.dest('dev/css'))
    .pipe(reload({ stream:true }));
});
