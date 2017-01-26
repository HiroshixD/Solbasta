'use strict';

describe('Categorias E2E Tests:', function () {
  describe('Test categorias page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/categorias');
      expect(element.all(by.repeater('categoria in categorias')).count()).toEqual(0);
    });
  });
});
