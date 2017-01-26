'use strict';

describe('Cuentas E2E Tests:', function () {
  describe('Test cuentas page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/cuentas');
      expect(element.all(by.repeater('cuenta in cuentas')).count()).toEqual(0);
    });
  });
});
