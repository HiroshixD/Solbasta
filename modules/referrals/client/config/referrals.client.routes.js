(function () {
  'use strict';

  angular
    .module('referrals.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('referrals', {
        abstract: true,
        url: '/referrals',
        template: '<ui-view/>'
      })
      .state('referrals.list', {
        url: '',
        templateUrl: 'modules/referrals/client/views/list-referrals.client.view.html',
        controller: 'ReferralsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Referrals List'
        }
      })
      .state('referrals.create', {
        url: '/create',
        templateUrl: 'modules/referrals/client/views/form-referral.client.view.html',
        controller: 'ReferralsController',
        controllerAs: 'vm',
        resolve: {
          referralResolve: newReferral
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Crear articulo'
        }
      })
      .state('referrals.edit', {
        url: '/:referralId/edit',
        templateUrl: 'modules/referrals/client/views/form-referral.client.view.html',
        controller: 'ReferralsController',
        controllerAs: 'vm',
        resolve: {
          referralResolve: getReferral
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Referral {{ referralResolve.title }}'
        }
      })
      .state('referrals.view', {
        url: '/:referralId',
        templateUrl: 'modules/referrals/client/views/view-referral.client.view.html',
        controller: 'ReferralsController',
        controllerAs: 'vm',
        resolve: {
          referralResolve: getReferral
        },
        data: {
          pageTitle: 'Referral {{ referralResolve.title }}'
        }
      });
  }

  getReferral.$inject = ['$stateParams', 'ReferralsService'];

  function getReferral($stateParams, ReferralsService) {
    return ReferralsService.get({
      referralId: $stateParams.referralId
    }).$promise;
  }

  newReferral.$inject = ['ReferralsService'];

  function newReferral(ReferralsService) {
    return new ReferralsService();
  }
}());
