'use strict';

describe('Eventos E2E Tests:', function () {
  describe('Test eventos page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/eventos');
      expect(element.all(by.repeater('evento in eventos')).count()).toEqual(0);
    });
  });
});
