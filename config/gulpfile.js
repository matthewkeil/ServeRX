


const { root, ROOT, SOURCE, DEST, BUILD, TESTS, PROJECT_JS } = require('./helpers');

const gulp = require('gulp');
const changed = require('gulp-changed');
const sourcemaps = require('gulp-sourcemaps');

const ts = require('gulp-typescript');
const tsProject = ts.createProject('./tsconfig.json');

const mocha = require('gulp-spawn-mocha');
const launcher = require('simple-autoreload-server');
const opn = require('opn');

const nodemon = require('gulp-nodemon');


/**
 * 
 * 
 * Typescript transpilation
 * 
 *
 */
gulp.task('transpile', function () {
	return gulp.src(SOURCE)
		.pipe(changed(DEST))
		.pipe(sourcemaps.init())
		.pipe(tsProject())
		.pipe(sourcemaps.write())
		.pipe(gulp.dest(DEST))
});
/**
 * 
 * 
 * Servers
 *
 *  
 */

gulp.task('startTestResultsServer', function () {
	launcher({
		port: 9876,
		path: root('.reports'),
		mount: [{
			target: '/spec',
			path: root('.reports', 'spec')
		}],
		reload: root('.reports', '**/*'),
		watch: root('.reports', '**/*'),
		watchDelay: 50
	})
});

gulp.task('startDevServer', ['transpile', 'startTestResultsServer'], function () {
	nodemon({
		script: DEST + '/index.js',
		watch: [PROJECT_JS],
		delay: 100
	})
});
/**
 * 
 * 
 * Testing related tasks
 * 
 * 
 */
let runTests = function () {
	return gulp.src(TESTS)
		.pipe(mocha({
			env: {
				'NODE_ENV': 'testing',
				'MOCHAWESOME_REPORTDIR': root('.reports', 'spec'),
				'MOCHAWESOME_REPORTFILENAME': 'index'
			},
			reporter: 'mochawesome'
		}))
		.on('error', function () { this.emit('end') })
}

let openBrowser = function () {
	opn('http://localhost:9876/spec/index.html');
}

gulp.task('runTests', runTests);

gulp.task('runTestsOnce', ['transpile'], function () {
	runTests();
	openBrowser();
}); 
/**
 * 
 * 
 * Watch related tasks
 * 
 * 
 */

gulp.task('watchTS', ['transpile'], function () {
	return gulp.watch(SOURCE, ['transpile'])
});

gulp.task('watchTests', ['runTestsOnce'], function () {
	return gulp.watch(BUILD, ['runTests'])
});

gulp.task('watch', ['watchTS', 'watchTests']);
/**
 * 
 * 
 * NPM task names
 * 
 * 
 */
gulp.task('dev', ['watch', 'startDevServer']);
gulp.task('default', ['transpile']);
gulp.task('test', ['runTestsOnce']);