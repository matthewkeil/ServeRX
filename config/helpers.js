


const path = require('path');

const ROOT = path.resolve(__dirname, '../');

function root() {
	args = Array.prototype.slice.call(arguments, 0)
	return path.join.apply(path, [ROOT].concat(args));
}

const SRC = root('src');
const DEST = root('.build');

const SPECS_EXT = '**/*.spec.*';

const SOURCE = path.resolve(SRC, '**/*');
const BUILD = path.resolve(DEST, '**/*')
const TESTS = path.resolve(DEST, SPECS_EXT);

const PROJECT_TS = [SOURCE, '!'.concat(SPECS_EXT)];
const PROJECT_JS = [BUILD, '!'.concat(SPECS_EXT)];

module.exports = {
	root,
	ROOT,
	SRC,
	DEST,
	SOURCE,
	BUILD,
	TESTS,
	PROJECT_TS,
	PROJECT_JS
}