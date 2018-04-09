# eslint-config-google [![Build Status](https://travis-ci.org/google/eslint-config-google.svg?branch=master)](https://travis-ci.org/google/eslint-config-google)

> ESLint [shareable config](http://eslint.org/docs/developer-guide/shareable-configs.html) for the [Google style](http://google.github.io/styleguide/javascriptguide.xml)


## Install

```
$ npm install --save-dev eslint eslint-config-google
```


## Usage

Add some ESLint config to your `package.json`:

```json
{
	"scripts": {
		"lint": "eslint ."
	},
	"devDependencies": {
		"eslint": "^1.8.0",
		"eslint-config-google": "^0.2.0"
	},
	"eslintConfig": {
		"extends": "google"
	}
}
```

Then lint with `$ npm run lint`.


## License

Apache-2 © Google
