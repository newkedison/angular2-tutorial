// This file is modify from article:
// http://blog.scottlogic.com/2015/12/24/creating-an-angular-2-build.html

const gulp = require('gulp');
const del = require('del');
const typescript = require('gulp-typescript');
const tscConfig = require('./tsconfig.json');
const tslint = require('gulp-tslint');

// clean the contents of the distribution directory
gulp.task('clean', function () {
  return del('dist/**/*');
});

// TypeScript compile
gulp.task('compile', ['clean'], function () {
  return gulp
    .src([
      // This line is very important, or compile will raise many error, saying
      // "Cannot find name 'Promise'", see:
      // https://github.com/angular/angular/issues/7280#issuecomment-193876308
      'node_modules/angular2/typings/browser.d.ts',
      // include all .ts files
      'app/**/*.ts',
    ])
    .pipe(typescript(tscConfig.compilerOptions))
    // redirect output to another place
    .pipe(gulp.dest('dist/app'));
});

gulp.task('tslint', function() {
  return gulp.src('app/**/*.ts')
             .pipe(tslint())
             .pipe(tslint.report('verbose'));
});

// Copy 3rd-party libs
gulp.task('copy:libs', ['clean'], function() {
  return gulp.src([
			'node_modules/es6-shim/es6-shim.min.js',
			'node_modules/systemjs/dist/system-polyfills.js',
			'node_modules/angular2/es6/dev/src/testing/shims_for_IE.js',
			'node_modules/angular2/bundles/angular2-polyfills.js',
			'node_modules/systemjs/dist/system.src.js',
			'node_modules/rxjs/bundles/Rx.js',
			'node_modules/angular2/bundles/angular2.dev.js',
			'node_modules/angular2/bundles/router.dev.js',
    ], {base: "."})
    .pipe(gulp.dest('dist'))
});

// Copy static files
gulp.task('copy:assets', ['clean'], function() {
  return gulp.src([
      'app/**/*',
      'index.html',
      'styles.css',
      '!app/**/*.ts'],
      { base : './' })
    .pipe(gulp.dest('dist'))
});

gulp.task('build', ['tslint', 'copy:libs', 'copy:assets', 'compile']);
gulp.task('default', ['build']);

