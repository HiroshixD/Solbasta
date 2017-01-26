(function () {
  'use strict';

  angular
    .module('ubigeos.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('ubigeos', {
        abstract: true,
        url: '/admin/ubigeos',
        template: '<ui-view/>'
      })
      .state('ubigeos.list', {
        url: '',
        templateUrl: 'modules/ubigeos/client/views/list-ubigeos.client.view.html',
        controller: 'UbigeosListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Ubigeos List'
        }
      })
      .state('ubigeos.create', {
        url: '/create',
        templateUrl: 'modules/ubigeos/client/views/form-ubigeo.client.view.html',
        controller: 'UbigeosController',
        controllerAs: 'vm',
        resolve: {
          ubigeoResolve: newUbigeo
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Crear articulo'
        }
      })
      .state('ubigeos.edit', {
        url: '/:ubigeoId/edit',
        templateUrl: 'modules/ubigeos/client/views/form-ubigeo.client.view.html',
        controller: 'UbigeosController',
        controllerAs: 'vm',
        resolve: {
          ubigeoResolve: getUbigeo
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Ubigeo {{ ubigeoResolve.title }}'
        }
      })
      .state('ubigeos.view', {
        url: '/:ubigeoId',
        templateUrl: 'modules/ubigeos/client/views/view-ubigeo.client.view.html',
        controller: 'UbigeosController',
        controllerAs: 'vm',
        resolve: {
          ubigeoResolve: getUbigeo
        },
        data: {
          pageTitle: 'Ubigeo {{ ubigeoResolve.title }}'
        }
      });
  }

  getUbigeo.$inject = ['$stateParams', 'UbigeosService'];

  function getUbigeo($stateParams, UbigeosService) {
    return UbigeosService.get({
      ubigeoId: $stateParams.ubigeoId
    }).$promise;
  }

  newUbigeo.$inject = ['UbigeosService'];

  function newUbigeo(UbigeosService) {
    return new UbigeosService();
  }
}());
