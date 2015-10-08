var gulp = require('gulp');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var minifyCSS = require('gulp-minify-css');
var rename = require('gulp-rename');
var connect = require('gulp-connect');
var autoprefixer = require('gulp-autoprefixer');
var ghPages = require('gulp-gh-pages');

gulp.task('sass', function() {
  return gulp.src('sass/**/*.scss')
    .pipe(sass())
    .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    .pipe(gulp.dest('css'));
});

gulp.task('styles', function() {
  return gulp.src([
      'bower_components/normalize.css/normalize.css',
      'bower_components/minimal-devices/css/*.css',
      'css/main.css'
    ])
    .pipe(concat('all.css'))
    .pipe(rename('all.min.css'))
    .pipe(minifyCSS())
    .pipe(gulp.dest('css'))
    .pipe(connect.reload());
});

gulp.task('scripts', function() {
  return gulp.src([
      'bower_components/gsap/src/minified/TweenLite.min.js',
      'bower_components/gsap/src/minified/easing/EasePack.min.js',
      'scripts/rAF.js',
      'scripts/**/*.js'
    ])
    .pipe(concat('all.js'))
    .pipe(rename('all.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('js'))
    .pipe(connect.reload());
});

gulp.task('html', function() {
  gulp.src('index.html')
    .pipe(connect.reload());
});

gulp.task('watch', function() {
  gulp.watch('index.html', ['html']);
  gulp.watch('scripts/**/*.js', ['scripts']);
  gulp.watch('sass/**/*.scss', ['sass']);
  gulp.watch('css/main.css', ['styles']);
});

gulp.task('connect', function() {
  connect.server({ livereload: true });
});

gulp.task('deploy', ['scripts', 'sass', 'styles'], function() {
  gulp.src([
    'js/all.min.js',
    'css/all.min.css',
    'img/*',
    'index.html'
  ], { base: './' })
    .pipe(ghPages());
});

gulp.task('default', ['connect', 'watch']);
