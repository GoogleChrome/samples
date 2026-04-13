const RGX = /{{(.*?)}}/g;

export default function (str, mix) {
	return str.replace(RGX, (x, key, y) => {
		x = 0;
		y = mix;
		key = key.trim().split('.');
		while (y && x < key.length) {
			y = y[key[x++]];
		}
		return y != null ? y : '';
	});
}
