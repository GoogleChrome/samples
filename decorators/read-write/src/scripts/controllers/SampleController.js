import { read, write } from '../libs/ReadWrite/ReadWrite';

export default class SampleController {

  constructor () {
    this.writeSomeStuff();
    this.readSomeStuff();
    this.writeSomeStuff();
    this.readSomeStuff();
  }

  @read
  readSomeStuff () {
    console.log('read');
    document.querySelector('.main').style.top = '100px';
    console.log(document.querySelector('.main').offsetTop);
  }

  @write
  writeSomeStuff () {
    console.log('write');
    document.querySelector('.main').focus();
    document.querySelector('.main').offsetTop;
  }
}
