(function () {
  'use strict';

  angular
    .module('marcas.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('marcas', {
        abstract: true,
        url: '/admin/marcas',
        template: '<ui-view/>'
      })
      .state('marcas.list', {
        url: '',
        templateUrl: 'modules/marcas/client/views/list-marcas.client.view.html',
        controller: 'MarcasListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Marcas List'
        }
      })
      .state('marcas.create', {
        url: '/create',
        templateUrl: 'modules/marcas/client/views/form-marca.client.view.html',
        controller: 'MarcasController',
        controllerAs: 'vm',
        resolve: {
          marcaResolve: newMarca
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Crear articulo'
        }
      })
      .state('marcas.edit', {
        url: '/:marcaId/edit',
        templateUrl: 'modules/marcas/client/views/form-marca.client.view.html',
        controller: 'MarcasController',
        controllerAs: 'vm',
        resolve: {
          marcaResolve: getMarca
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Marca {{ marcaResolve.title }}'
        }
      })
      .state('marcas.view', {
        url: '/:marcaId',
        templateUrl: 'modules/marcas/client/views/view-marca.client.view.html',
        controller: 'MarcasController',
        controllerAs: 'vm',
        resolve: {
          marcaResolve: getMarca
        },
        data: {
          pageTitle: 'Marca {{ marcaResolve.title }}'
        }
      });
  }

  getMarca.$inject = ['$stateParams', 'MarcasService'];

  function getMarca($stateParams, MarcasService) {
    return MarcasService.get({
      marcaId: $stateParams.marcaId
    }).$promise;
  }

  newMarca.$inject = ['MarcasService'];

  function newMarca(MarcasService) {
    return new MarcasService();
  }
}());
