(function () {
  'use strict';

  angular
    .module('categorias.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('categorias', {
        abstract: true,
        url: '/admin/categorias',
        template: '<ui-view/>'
      })
      .state('categorias.list', {
        url: '',
        templateUrl: 'modules/categorias/client/views/list-categorias.client.view.html',
        controller: 'CategoriasListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Categorias List'
        }
      })
      .state('categorias.create', {
        url: '/create',
        templateUrl: 'modules/categorias/client/views/form-categoria.client.view.html',
        controller: 'CategoriasController',
        controllerAs: 'vm',
        resolve: {
          categoriaResolve: newCategoria
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Crear categoria'
        }
      })
      .state('categorias.edit', {
        url: '/:categoriaId/edit',
        templateUrl: 'modules/categorias/client/views/form-categoria.client.view.html',
        controller: 'CategoriasController',
        controllerAs: 'vm',
        resolve: {
          categoriaResolve: getCategoria
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Categoria {{ categoriaResolve.title }}'
        }
      })
      .state('categorias.view', {
        url: '/:categoriaId',
        templateUrl: 'modules/categorias/client/views/view-categoria.client.view.html',
        controller: 'CategoriasController',
        controllerAs: 'vm',
        resolve: {
          categoriaResolve: getCategoria
        },
        data: {
          pageTitle: 'Categoria {{ categoriaResolve.title }}'
        }
      });
  }

  getCategoria.$inject = ['$stateParams', 'CategoriasService'];

  function getCategoria($stateParams, CategoriasService) {
    return CategoriasService.get({
      categoriaId: $stateParams.categoriaId
    }).$promise;
  }

  newCategoria.$inject = ['CategoriasService'];

  function newCategoria(CategoriasService) {
    return new CategoriasService();
  }
}());
