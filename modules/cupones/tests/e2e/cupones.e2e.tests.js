'use strict';

describe('Cupones E2E Tests:', function () {
  describe('Test cupones page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/cupones');
      expect(element.all(by.repeater('cupone in cupones')).count()).toEqual(0);
    });
  });
});
