const gulp = require('gulp');
const sass = require('gulp-sass');
const concat = require('gulp-concat');
const sassLint = require('gulp-sass-lint');
const uglify = require('gulp-uglify');
const sourcemaps = require('gulp-sourcemaps');
const { execSync } = require('child_process');  


const options = {
  dest: './min',
  glob: {
    eslint: './components/**/*.js',
    js: './components/**/*.js',
    sass: [
      './components/mixins.scss',
      './components/variables.scss',
      './components/normalize.scss',
      './components/**/*.scss',
    ],
  },
  sassLint: {
    // maxBuffer default is 300 * 1024
    maxBuffer: 1000 * 1024,
    rules: {
      'class-name-format': 0,
      'empty-args': 0,
      'empty-line-between-blocks': 0,
      'force-element-nesting': 0,
      'nesting-depth': 0,
      'no-vendor-prefixes': 0,
      'property-sort-order': 0,
      'no-css-comments': 0,
      'no-important': 0,
      'one-declaration-per-line': 0,
      'force-pseudo-nesting': 0,
      'no-qualifying-elements': 0,
    },
    config: '.scss-lint.yml',
  },
  uglify: {
    compress: {
      unused: false,
    },
  },
  sass: {
    outputStyle: 'compressed',
  },
};

exports.updateTestSite = (cb) => {
  execSync('scp -r ./min soe:/www/wades.soe.ucsc.edu/htdocs/themes/ucsc_plain');
  cb();
};

// JS Tasks
exports.js = () => (
  gulp.src(options.glob.js)
  .pipe(concat('script.js'))
  .pipe(gulp.dest(options.dest))
  .pipe(uglify(options.uglify))
  .pipe(gulp.dest(options.dest))
);

// Sass Tasks
exports.sass = () => (
  gulp.src(options.glob.sass)
  .pipe(concat('styles.css'))
  .pipe(sourcemaps.init())
  .pipe(sass(options.sass))
  .pipe(sourcemaps.write('.'))
  .pipe(gulp.dest(options.dest))
);

exports.sassLint = () => (
  gulp.src(options.glob.sass)
  .pipe(concat('styles.css'))
  .pipe(sassLint(options.sassLint))
  .pipe(sassLint.format())
  .pipe(sourcemaps.init())
  .pipe(sass(options.sass).on('error', sass.logError))
  .pipe(sourcemaps.write('.'))
  .pipe(gulp.dest(options.dest))
);

exports.watch = () => {
  gulp.watch(options.glob.sass, gulp.series('sass', 'updateTestSite'));
  gulp.watch(options.glob.js, gulp.series('js', 'updateTestSite'));
};

exports.default = (cb) => gulp.series('sass', 'js')(cb);
