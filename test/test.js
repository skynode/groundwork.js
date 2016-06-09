/*global require*/
/*eslint-disable no-extend-native, new-cap */

import Promise from 'babel-runtime/core-js/promise';
window.Promise = Promise;

// This is for PhantomJS's benefit
if (!Function.prototype.bind) {
  Function.prototype.bind = function bind(oThis) {
    if (typeof this !== 'function') {
      // closest thing possible to the ECMAScript 5
      // internal IsCallable function
      throw new TypeError('Function.prototype.bind - what is trying to be bound is not callable');
    }

    const aArgs = Array.prototype.slice.call(arguments, 1);
    const fToBind = this;
    const fNOP = function fNOP() {};
    const fBound = function fBound() {
      return fToBind.apply(this instanceof fNOP
                           ? this
                           : oThis,
                           aArgs.concat(Array.prototype.slice.call(arguments)));
    };

    fNOP.prototype = this.prototype;
    fBound.prototype = new fNOP();

    return fBound;
  };
}

const testsContext = require.context('.', true, /_test$/);
testsContext.keys().forEach(testsContext);
