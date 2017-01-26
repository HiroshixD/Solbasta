'use strict';

describe('Transaccions E2E Tests:', function () {
  describe('Test transaccions page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/transaccions');
      expect(element.all(by.repeater('transaccion in transaccions')).count()).toEqual(0);
    });
  });
});
