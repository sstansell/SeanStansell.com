'use strict';

/** 
 * requirements & declarations
 */

var gulp = require('gulp');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var minifyHTML = require('gulp-minify-html');
var clean = require('gulp-clean');
var jshint = require('gulp-jshint');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var imagemin = require('gulp-imagemin');
var gzip = require('gulp-gzip');
var browserSync = require('browser-sync');
var reload = browserSync.reload;

//defines the environment paths to work with
var bases = {
 app: 'dev/',
 dist: 'release/',
};

//defines the paths to various types of files in the app (used by helper functions)
var paths = {
 scripts: ['js/**/*.js', '!js/vendor/**/*.js'],
 libs: ['js/vendor/*.js'],
 styles: ['css/**/*.css'],
 html: ['index.html', '404.html'],
 images: ['images/**/*.*'],
 fonts: ['font/**/*.*'],
 extras: ['crossdomain.xml', 'humans.txt', 'manifest.appcache', 'robots.txt', 'favicon.ico', '.htaccess'],
};

//////////////////////
// HELPER FUNCTIONS //
//////////////////////

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
  .pipe(concat('script.js'))
  //.pipe(gzip({ append: true }))
  .pipe(gulp.dest(bases.dist + 'js/'));
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

   // Copy fonts
   gulp.src(paths.fonts, {cwd: bases.app})
   .pipe(gulp.dest(bases.dist + 'font'));
   
   // Copy vendor scripts, maintaining the original directory structure
   gulp.src(paths.libs, {cwd: bases.app})
   .pipe(gulp.dest(bases.dist + 'js/vendor'));
   
   // Copy extra files
   gulp.src(paths.extras, {cwd: bases.app})
   .pipe(gulp.dest(bases.dist));
});

// Compile sass into CSS & auto-inject into browsers (compressed for release)
gulp.task('sass-release', ['clean'], function() {
    return gulp.src("dev/sass/style.scss")
        .pipe(sass({outputStyle: 'compressed'}))
        .pipe(autoprefixer())          
        .pipe(gulp.dest("dev/css"))
        .pipe(browserSync.stream());
});
// Compile sass into CSS & auto-inject into browsers
gulp.task('sass', function() {
    return gulp.src("dev/sass/style.scss")
        .pipe(sass())
        .pipe(autoprefixer())        
        .pipe(gulp.dest("dev/css"))
        .pipe(browserSync.stream());
});

gulp.task('minify-html', ['clean'], function() {
  var opts = {
    conditionals: true,
    spare:true
  };
 
  return gulp.src('./dev/index.html')
    .pipe(minifyHTML(opts))
    .pipe(gulp.dest('./release/'));
});


/////////////////////////
//BUILD AN SERVE TASKS //
/////////////////////////


// Define the build task as a sequence of the helper tasks 
gulp.task('build', ['clean', 'scripts', 'imagemin', 'sass-release', 'copy', 'minify-html']);

// start a dev server on the RELEASE code 
gulp.task('serve-release', ['build'], function() {
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
// using the DEV folder of the app
gulp.task('serve', ['sass'], function() {
  browserSync({
    server: {
      baseDir: 'dev'
    }
  });
  gulp.watch("dev/sass/**/*.scss", ['sass']);
  //gulp.watch(['*.html', 'css/**/*.css', 'js/**/*.js'], browserSync.reload);
  gulp.watch(['*.html', 'styles/**/*.css', 'js/**/*.js'], {cwd: 'dev'}, reload);
});