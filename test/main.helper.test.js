// Libraries
const chai = require('chai');
const expect = chai.expect;
// Imports
const mainHelp = require('../api/helpers/main.helper');
const errorHelp = require('../api/helpers/error.helper');

describe('Test helper: main.', () => {
  describe('Test method: validateRequest.', () => {
    it('Field a is required.', () => {
      expect(() => {
        mainHelp.validateRequest({
          'b': '5',
        });
      }).to.throw(
        new errorHelp.BadRequest(
          'El campo a es requerido y debe ser de tipo string.'
        )
      );
    });

    it('Field b is required.', () => {
      expect(() => {
        mainHelp.validateRequest({
          'a': '5',
        });
      }).to.throw(
        new errorHelp.BadRequest(
          'El campo b es requerido y debe ser de tipo string.'
        )
      );
    });
  });
});
