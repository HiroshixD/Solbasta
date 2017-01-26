'use strict';

describe('Datos_envios E2E Tests:', function () {
  describe('Test datos_envios page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/datos_envios');
      expect(element.all(by.repeater('datos_envio in datos_envios')).count()).toEqual(0);
    });
  });
});
