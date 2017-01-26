'use strict';

describe('Ubigeos E2E Tests:', function () {
  describe('Test ubigeos page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/ubigeos');
      expect(element.all(by.repeater('ubigeo in ubigeos')).count()).toEqual(0);
    });
  });
});
