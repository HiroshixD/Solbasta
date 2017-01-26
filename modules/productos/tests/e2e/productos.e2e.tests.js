'use strict';

describe('Productos E2E Tests:', function () {
  describe('Test productos page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/productos');
      expect(element.all(by.repeater('producto in productos')).count()).toEqual(0);
    });
  });
});
