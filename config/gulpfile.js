const { SOURCE, DEST, BUILD, TESTS, PROJECT_JS } = require('./helpers');
const gulp = require('gulp');
const changed = require('gulp-changed');
const sourcemaps = require('gulp-sourcemaps');
const ts = require('gulp-typescript');
const mocha = require('gulp-mocha');
const nodemon = require('gulp-nodemon');

const tsProject = ts.createProject('./tsconfig.json');

gulp.task('transpile', function () {
	return gulp.src(SOURCE)
		.pipe(changed(DEST))
		.pipe(sourcemaps.init())
		.pipe(tsProject())
		.pipe(sourcemaps.write())
		.pipe(gulp.dest(DEST))
});
gulp.task('watchTS', ['transpile'], function () {
	return gulp.watch(SOURCE, ['transpile'])
});


let runTests = function () { 
	return gulp.src(TESTS, { read: false })
		.pipe(mocha({
			// noExit: true,
			timeout: 1000,
			reporter: 'dot'
		}))
		.on('error', function () { this.emit('end') })
};
gulp.task('runTests', runTests);
gulp.task('runTestsOnce', ['transpile'], runTests);
gulp.task('watchTests', ['runTestsOnce'], function () {
	return gulp.watch(BUILD, ['runTests'])
});


gulp.task('watch', ['watchTS', 'watchTests']);
gulp.task('nodemon', ['transpile'], function () {
	nodemon({
		script: DEST + '/index.js',
		watch: [PROJECT_JS],
		delay: 100
	})
});


gulp.task('dev', ['watch', 'nodemon']);
gulp.task('default', ['transpile']);
gulp.task('test', ['runTestsOnce']);