'use strict';

describe('Paquetes E2E Tests:', function () {
  describe('Test paquetes page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/paquetes');
      expect(element.all(by.repeater('paquete in paquetes')).count()).toEqual(0);
    });
  });
});
