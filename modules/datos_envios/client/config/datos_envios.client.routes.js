(function () {
  'use strict';

  angular
    .module('datos_envios.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('datos_envios', {
        abstract: true,
        url: '/datos_envios',
        template: '<ui-view/>'
      })
      .state('datos_envios.list', {
        url: '',
        templateUrl: 'modules/datos_envios/client/views/list-datos_envios.client.view.html',
        controller: 'Datos_enviosListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Datos_envios List'
        }
      })
      .state('datos_envios.create', {
        url: '/create',
        templateUrl: 'modules/datos_envios/client/views/form-datos_envio.client.view.html',
        controller: 'Datos_enviosController',
        controllerAs: 'vm',
        resolve: {
          datos_envioResolve: newDatos_envio
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Crear articulo'
        }
      })
      .state('datos_envios.edit', {
        url: '/:datos_envioId/edit',
        templateUrl: 'modules/datos_envios/client/views/form-datos_envio.client.view.html',
        controller: 'Datos_enviosController',
        controllerAs: 'vm',
        resolve: {
          datos_envioResolve: getDatos_envio
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Datos_envio {{ datos_envioResolve.title }}'
        }
      })
      .state('datos_envios.view', {
        url: '/:datos_envioId',
        templateUrl: 'modules/datos_envios/client/views/view-datos_envio.client.view.html',
        controller: 'Datos_enviosController',
        controllerAs: 'vm',
        resolve: {
          datos_envioResolve: getDatos_envio
        },
        data: {
          pageTitle: 'Datos_envio {{ datos_envioResolve.title }}'
        }
      });
  }

  getDatos_envio.$inject = ['$stateParams', 'Datos_enviosService'];

  function getDatos_envio($stateParams, Datos_enviosService) {
    return Datos_enviosService.get({
      datos_envioId: $stateParams.datos_envioId
    }).$promise;
  }

  newDatos_envio.$inject = ['Datos_enviosService'];

  function newDatos_envio(Datos_enviosService) {
    return new Datos_enviosService();
  }
}());
