'use strict';

describe('Compartidos E2E Tests:', function () {
  describe('Test compartidos page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/compartidos');
      expect(element.all(by.repeater('compartido in compartidos')).count()).toEqual(0);
    });
  });
});
