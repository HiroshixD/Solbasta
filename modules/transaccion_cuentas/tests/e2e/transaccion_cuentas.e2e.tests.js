'use strict';

describe('Transaccion_cuentas E2E Tests:', function () {
  describe('Test transaccion_cuentas page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/transaccion_cuentas');
      expect(element.all(by.repeater('transaccion_cuenta in transaccion_cuentas')).count()).toEqual(0);
    });
  });
});
