(function () {
  'use strict';

  angular
    .module('paquetes.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('paquetes', {
        abstract: true,
        url: '/admin/paquetes',
        template: '<ui-view/>'
      })
      .state('paquetes.list', {
        url: '',
        templateUrl: 'modules/paquetes/client/views/list-paquetes.client.view.html',
        controller: 'PaquetesListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Listado de paquetes'
        }
      })
      .state('paquetes.create', {
        url: '/create',
        templateUrl: 'modules/paquetes/client/views/form-paquete.client.view.html',
        controller: 'PaquetesController',
        controllerAs: 'vm',
        resolve: {
          paqueteResolve: newPaquete
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Crear nuevo paquete'
        }
      })
      .state('paquetes.edit', {
        url: '/:paqueteId/edit',
        templateUrl: 'modules/paquetes/client/views/form-paquete.client.view.html',
        controller: 'PaquetesController',
        controllerAs: 'vm',
        resolve: {
          paqueteResolve: getPaquete
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Editar Paquete {{ paqueteResolve.nombre }}'
        }
      })
      .state('paquetes.view', {
        url: '/:paqueteId',
        templateUrl: 'modules/paquetes/client/views/view-paquete.client.view.html',
        controller: 'PaquetesController',
        controllerAs: 'vm',
        resolve: {
          paqueteResolve: getPaquete
        },
        data: {
          pageTitle: 'Paquete {{ paqueteResolve.nombre }}'
        }
      });
  }

  getPaquete.$inject = ['$stateParams', 'PaquetesService'];

  function getPaquete($stateParams, PaquetesService) {
    return PaquetesService.get({
      paqueteId: $stateParams.paqueteId
    }).$promise;
  }

  newPaquete.$inject = ['PaquetesService'];

  function newPaquete(PaquetesService) {
    return new PaquetesService();
  }
}());
