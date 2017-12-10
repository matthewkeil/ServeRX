




function _pathToMatchString(path) {
	
if (path.startsWith('/')) path = path.substring(1);
if (path.endsWith('/')) path = path.slice(0, path.length-1);

return path === '' ? [] : path.split('/');
}


console.log(_pathToMatchString('/booga/boo/'))