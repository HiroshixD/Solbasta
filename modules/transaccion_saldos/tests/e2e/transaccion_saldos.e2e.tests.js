'use strict';

describe('Transaccion_saldos E2E Tests:', function () {
  describe('Test transaccion_saldos page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/transaccion_saldos');
      expect(element.all(by.repeater('transaccion_saldo in transaccion_saldos')).count()).toEqual(0);
    });
  });
});
