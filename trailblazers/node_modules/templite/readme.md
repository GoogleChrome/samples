# templite [![Build Status](https://travis-ci.org/lukeed/templite.svg?branch=master)](https://travis-ci.org/lukeed/templite)

> Lightweight templating in 154 bytes

Allows you to denote dynamic portions of a string using double curly brackets (`{{ example }}`) & then replace them with matching values from your data source.

You may attach an `Object` or an `Array` as your data source, which means you may use the object's keys or the array's indices to assign values.

Lastly, you may use dot-notated paths to access (deeply) nested values; eg: `foo.bar.baz`, `0.0.0`, or `foo.0.1.bar`.

## Install

```
$ npm install --save templite
```


## Usage

```js
const templite = require('templite');

templite('Hello, {{name}}!', { name: 'world' });
//=> Hello, world!

templite('Howdy, {{0}}! {{1}}', ['partner', '🤠']);
//=> Howdy, partner! 🤠

templite('foo: "{{foo}}"; bar: "{{bar}}";', { foo: 123 });
//=> foo: "123"; bar: "";

templite(`
  Name: {{name.last}}, {{name.first}}
  Location: {{address.city}} ({{address.country}})
  Hobbies: {{hobbies.0}}, {{hobbies.1}}, {{hobbies.2}}
`, {
  name: {
    first: 'Luke',
    last: 'Edwards'
  },
  address: {
    city: 'Los Angeles',
    country: 'USA'
  },
  hobbies: ['eat', 'sleep', 'repeat']
});
//=> Name: Edwards, Luke
//=> Location: Los Angeles (USA)
//=> Hobbies: eat, sleep, repeat
```


## API

### templite(input, values)

#### input
Type: `String`

The string template to operate upon.

Its dynamic placeholders are signified with double curly brackets (`{{foo}}` or `{{ foo }}`) and may map to key names or indices. They may also reference deeply nested values via dot-notation (`foo.bar.baz`).

Unknown keys/indices and `null` or `undefined` values are replaced with an empty string (`''`).

#### values
Type: `Array` or `Object`

The data source for your template injections.


## License

MIT © [Luke Edwards](https://lukeed.com)
