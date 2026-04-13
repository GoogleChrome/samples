function truthy(val) { return val; }
function trim(str) { return str.trim(); }

function listToArray (str, delimiter) {
	if (Array.isArray(str)) {
		return str;
	}
	if (!str || typeof str !== 'string') {
		return [];
	}
	if (!delimiter) {
		delimiter = ' ';
		str = str.replace(/\,/g, ' ');
	}
	return str.split(delimiter).map(trim).filter(truthy);
}

module.exports = listToArray;
