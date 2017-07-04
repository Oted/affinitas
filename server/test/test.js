const App = require('../');
const Utils = require('../lib/Utils');
const Expect = require('chai').expect;
const Ws = require('ws');

describe('Backend', () => {
  describe('utils', () => {
    it('should return error string on fail', () => {
      Expect(typeof Utils.parse('sdsd')).to.equal('string');
    });

    it('should return object when success', () => {
      Expect(typeof Utils.parse('{}')).to.equal('object');
    });
  });

  describe('main', () => {
    it('should connect and get an empty list', (done) => {
      let client = new Ws('ws://localhost:1337/');
      client.once('message', (message) => {
        const parsed = JSON.parse(message);
        Expect(parsed.clients.length).to.equal(0);
        client.close();
        return done()
      });
    });
  });
});


