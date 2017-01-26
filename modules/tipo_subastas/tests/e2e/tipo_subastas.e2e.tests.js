'use strict';

describe('Tipo_subastas E2E Tests:', function () {
  describe('Test tipo_subastas page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/tipo_subastas');
      expect(element.all(by.repeater('tipo_subasta in tipo_subastas')).count()).toEqual(0);
    });
  });
});
