'use strict';

describe('Detalle_subastas E2E Tests:', function () {
  describe('Test detalle_subastas page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/detalle_subastas');
      expect(element.all(by.repeater('detalle_subasta in detalle_subastas')).count()).toEqual(0);
    });
  });
});
