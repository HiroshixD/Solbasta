(function () {
  'use strict';

  angular
    .module('cupones.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('cupones', {
        abstract: true,
        url: '/admin/cupones',
        template: '<ui-view/>'
      })
      .state('cupones.list', {
        url: '',
        templateUrl: 'modules/cupones/client/views/list-cupones.client.view.html',
        controller: 'CuponesListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Listado de cupones'
        }
      })
      .state('cupones.create', {
        url: '/create',
        templateUrl: 'modules/cupones/client/views/form-cupones.client.view.html',
        controller: 'CuponesController',
        controllerAs: 'vm',
        resolve: {
          cuponResolve: newCupon
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Crear nuevo cupon'
        }
      })
      .state('cupones.edit', {
        url: '/:cuponId/edit',
        templateUrl: 'modules/cupones/client/views/form-cupones.client.view.html',
        controller: 'CuponesController',
        controllerAs: 'vm',
        resolve: {
          cuponResolve: getCupon
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Editar cupon {{ cuponResolve.codigo }}'
        }
      })
      .state('cupones.view', {
        url: '/:cuponId',
        templateUrl: 'modules/cupones/client/views/view-cupones.client.view.html',
        controller: 'CuponesController',
        controllerAs: 'vm',
        resolve: {
          cuponResolve: getCupon
        },
        data: {
          pageTitle: 'Cupon {{ cuponResolve.codigo }}'
        }
      });
  }

  getCupon.$inject = ['$stateParams', 'CuponesService'];

  function getCupon($stateParams, CuponesService) {
    return CuponesService.get({
      cuponId: $stateParams.cuponId
    }).$promise;
  }

  newCupon.$inject = ['CuponesService'];

  function newCupon(CuponesService) {
    return new CuponesService();
  }
}());
