'use strict';

describe('Referrals E2E Tests:', function () {
  describe('Test referrals page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/referrals');
      expect(element.all(by.repeater('referral in referrals')).count()).toEqual(0);
    });
  });
});
