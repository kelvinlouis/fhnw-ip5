const gulp = require('gulp');
const runSequence = require('run-sequence');
const browserSync = require('browser-sync').create();
const reload = browserSync.reload;

const babel = require('gulp-babel');
const concat = require('gulp-concat');
const csso = require('gulp-csso');
const gulpif = require('gulp-if');
const notify = require('gulp-notify');
const plumber = require('gulp-plumber');
const rename = require('gulp-rename');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');

const minifySass = false;
var sassError = false;

var nodeVersion = (process && process.versions && process.versions.node);
var minNodeVersion = '4.4.0';
var canProceed = (nodeVersion >= minNodeVersion);

if (!canProceed) {
  console.log(`
    Warning!
    Your Node version is outdated.
    At least Node ${minNodeVersion} is required. Your Node version is currently at ${nodeVersion}.
    Please visit https://nodejs.org/ and download the latest version
     OR update Node through the package manager of your choice, e.g. homebrew.
`
  );
  return;
}

let userconfig;
try {
  userconfig = require('./userconfig.json');

} catch (e) {
  userconfig = {};
}

// Process SASS files
gulp.task('compile:sass', function() {
  return gulp
    .src([
      'src/*.scss'
    ])
    .pipe(plumber({
      errorHandler: function (err) {
        sassError = true;
        notify.onError({
          title: 'compile:sass',
          //icon: notifyInfo.icon,
          message: '<%= error.message %>'
        })(err);
        this.emit('end');
      }
    }))
    // .pipe(sourcemaps.init())
    .pipe(sass())
    // .pipe(sourcemaps.write())
    .pipe(gulp.dest('./build/'))
    // .pipe(gulpif(minifySass,rename(function (path) {
    //   var tempname = path.basename.split('.');
    //   tempname.splice(1, 0, 'min');
    //   path.basename = tempname.join('.');
    //   // path.basename += '.min';
    // })))
    // // .pipe(gulpif(minifySass, csso()))
    // .pipe(plumber.stop())
    // .pipe(gulp.dest('./build/'))
    .pipe(browserSync.stream({match: '**/*.css'})) // Exclude sourcemaps (".map")
    .pipe(notify(function (files) {
      if (sassError){
        sassError = false;
        return 'SASS files back to normal';
      }
      return false;
    }));
});

gulp.task('compile:js', () =>
  gulp.src('src/**.js')
    .pipe(babel())
    .pipe(gulp.dest('./build/'))
);

// Run browsersync for development
gulp.task('serve', ['build'], function() {
  browserSync.init(userconfig.browserSync || {
      server: {
        baseDir: './'
      }
    });

  gulp.watch(
    [
      'src/**.scss'
    ],
    ['compile:sass']
  );

  gulp.watch(
    [
      'src/**.js'
    ],
    ['compile:js']
  );

  gulp.watch(
    [
      '**/*',
      '!node_modules/**/*',
      '!dist/**/*',
      '!.git/**/*'
    ]
  ).on('change', browserSync.reload);
});

gulp.task('build', function(callback) {
  runSequence(
    ['compile:sass'],
    ['compile:js'],
    callback
  );
});

gulp.task('buildAndReload', ['build'], reload);
gulp.task('default', ['build']);
