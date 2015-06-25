'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var minifyHTML = require('gulp-minify-html');
var clean = require('gulp-clean');
var jshint = require('gulp-jshint');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var imagemin = require('gulp-imagemin');
 

var browserSync = require('browser-sync');
var reload = browserSync.reload;

var bases = {
 app: 'dev/',
 dist: 'release/',
};

var paths = {
 scripts: ['js/**/*.js', '!js/vendor/**/*.js'],
 libs: ['js/vendor/*.js'],
 styles: ['css/**/*.css'],
 html: ['index.html', '404.html'],
 images: ['images/**/*.*'],
 fonts: ['font/**/*.*'],
 extras: ['crossdomain.xml', 'humans.txt', 'manifest.appcache', 'robots.txt', 'favicon.ico', '.htaccess'],
};


// Delete the dist directory
gulp.task('clean', function() {
  return gulp.src(bases.dist)
  .pipe(clean());
});

// Process scripts and concatenate them into one output file
gulp.task('scripts', ['clean'], function() {
  gulp.src(paths.scripts, {cwd: bases.app})
  .pipe(jshint())
  .pipe(jshint.reporter('default'))
  .pipe(uglify())
  .pipe(concat('app.min.js'))
  .pipe(gulp.dest(bases.dist + 'scripts/'));
});

// Imagemin images and ouput them in dist
gulp.task('imagemin', ['clean'], function() {
   gulp.src(paths.images, {cwd: bases.app})
   .pipe(imagemin())
   .pipe(gulp.dest(bases.dist + 'images/'));
});

// Copy all other files to dist directly
gulp.task('copy', ['clean'], function() {
   // Copy html
   gulp.src(paths.html, {cwd: bases.app})
   .pipe(gulp.dest(bases.dist));
   
   // Copy styles
   gulp.src(paths.styles, {cwd: bases.app})
   .pipe(gulp.dest(bases.dist + 'css'));
   
   // Copy lib scripts, maintaining the original directory structure
   /*gulp.src(paths.libs, {cwd: 'app/**'})
   .pipe(gulp.dest(bases.dist));*/
   
   // Copy extra files
   gulp.src(paths.extras, {cwd: bases.app})
   .pipe(gulp.dest(bases.dist));
});

// Define the build task as a sequence of the above tasks
gulp.task('build', ['clean', 'scripts', 'imagemin', 'copy']);

// start a dev server on the RELEASE code
gulp.task('serve-release', function() {
    browserSync.init({
        server: {
            baseDir: "release"
        },
        ui: false,
        ghostMode: false,
        notify: false
    });
});

// start a dev server, including watching files for changes and reloading
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