# ES7 Decorator

This is [an ES7 decorator](https://github.com/wycats/javascript-decorators) (very experimental!) that reschedules code that reads and writes to the DOM, similarly to [FastDOM](https://github.com/wilsonpage/fastdom) (albeit with a smaller API surface).

It will also throw warnings if you call [layout-triggering methods or properties](http://gent.ilcore.com/2011/03/how-not-to-trigger-layout-in-webkit.html) during a `@write` block, or mutate the DOM during a `@read` block.

## Usage

Typically if you interleave reads and writes, like the code below, you can trigger [layout thrashing](http://wilsonpage.co.uk/preventing-layout-thrashing/):

```javascript

class SampleController {

  constructor () {
    this.writeSomeStuff();
    this.readSomeStuff();
    this.writeSomeStuff();
    this.readSomeStuff();
  }

  readSomeStuff () {
    console.log('read');
  }

  writeSomeStuff () {
    console.log('write');
  }
}

```

This would give the output:

```
write
read
write
read
```

With the decorator, these blocks of code are automatically rescheduled with a `requestAnimationFrame` (which will change the runtime characteristics since they will now be executed at the start of the next frame), such that they now execute in read-first order:

```
read
read
write
write
```

To achieve that you import the decorator and annotate the function with either `@read` or `@write`:

```javascript
import { read, write } from '../libs/ReadWrite/ReadWrite';

class SampleController {

  constructor () {
    this.writeSomeStuff();
    this.readSomeStuff();
    this.writeSomeStuff();
    this.readSomeStuff();
  }

  @read
  readSomeStuff () {
    console.log('read');
  }

  @write
  writeSomeStuff () {
    console.log('write');
  }
}
```

Furthermore, if you attempt to mutate the DOM inside of a `@read` block, you will be thrown a warning, and vice-versa:

```javascript
class SampleController {
  @read
  readSomeStuff () {
    console.log('read');

    // Throws a warning.
    document.querySelector('.main').style.top = '100px';
  }

  @write
  writeSomeStuff () {
    console.log('write');

    // Throws a warning.
    document.querySelector('.main').focus();
  }
}
```

## Building and running

There's a gulpfile, which will use Babelify to convert the ES6 and ES7 (the decorator) to ES5 code.

```
npm install
gulp
```

Then load the `index.html` file inside of `dist/`.

## TODOs

**Please note:** _This is a work-in-progress._ As such, there are todos:

 - [ ] Allow scoping of mutations, e.g. `@read('.main')`.
 - [ ] Allow strict mode (throw errors over warnings).
 - [ ] Write tests for all available properties.

Author: [@aerotwist](https://twitter.com/aerotwist)
