'use strict';

describe('Testimonios E2E Tests:', function () {
  describe('Test testimonios page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/testimonios');
      expect(element.all(by.repeater('testimonio in testimonios')).count()).toEqual(0);
    });
  });
});
