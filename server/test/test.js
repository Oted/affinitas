let Assert  = require('assert');
const App   = require('../index');
const Utils = require('../lib/Utils');
const Expect = require('chai').expect;

describe('Backend', () => {
  describe('utils', () => {
    it('should set up server', () => {
      Expect(typeof Utils.parse('sdsd')).to.equal('string');
    });

    it('should set up server', () => {
      Expect(typeof Utils.parse('{}')).to.equal('object');
    });
  });
});


