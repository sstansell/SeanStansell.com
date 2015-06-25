'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var minifyHTML = require('gulp-minify-html');
var browserSync = require('browser-sync');
var reload = browserSync.reload;

// watch files for changes and reload
gulp.task('serve', ['sass'], function() {
  browserSync({
    server: {
      baseDir: 'dev'
    }
  });
  gulp.watch("dev/sass/**/*.scss", ['sass']);
  //gulp.watch(['*.html', 'css/**/*.css', 'js/**/*.js'], browserSync.reload);
  gulp.watch(['*.html', 'styles/**/*.css', 'scripts/**/*.js'], {cwd: 'dev'}, reload);
});

// Compile sass into CSS & auto-inject into browsers
gulp.task('sass', function() {
    return gulp.src("dev/sass/style.scss")
        .pipe(sass())
        .pipe(gulp.dest("dev/css"))
        .pipe(browserSync.stream());
});

gulp.task('minify-html', function() {
  var opts = {
    conditionals: true,
    spare:true
  };
 
  return gulp.src('./dev/index.html')
    .pipe(minifyHTML(opts))
    .pipe(gulp.dest('./release/'));
});