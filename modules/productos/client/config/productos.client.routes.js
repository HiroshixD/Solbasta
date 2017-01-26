(function () {
  'use strict';

  angular
    .module('productos.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('productos', {
        abstract: true,
        url: '/admin/productos',
        template: '<ui-view/>'
      })
      .state('productos.list', {
        url: '',
        templateUrl: 'modules/productos/client/views/list-productos.client.view.html',
        controller: 'ProductosListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Productos List'
        }
      })
      .state('productos.sliderlist', {
        url: '/sliders',
        templateUrl: 'modules/productos/client/views/list-sliders.client.view.html',
        controller: 'SlidersListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Tus Sliders'
        }
      })
      .state('productos.create', {
        url: '/create',
        templateUrl: 'modules/productos/client/views/form-producto.client.view.html',
        controller: 'ProductosController',
        controllerAs: 'vm',
        resolve: {
          productoResolve: newProducto
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Crear producto'
        }
      })
      .state('productos.slidercreate', {
        url: '/slidercreate',
        templateUrl: 'modules/productos/client/views/form-slider.client.view.html',
        controller: 'SliderController',
        controllerAs: 'vm',
        resolve: {
          productoResolve: newProducto
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Crear Slider'
        }
      })
      .state('productos.edit', {
        url: '/:productoId/edit',
        templateUrl: 'modules/productos/client/views/form-producto.client.view.html',
        controller: 'ProductosController',
        controllerAs: 'vm',
        resolve: {
          productoResolve: getProducto
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Producto {{ productoResolve.title }}'
        }
      })
      .state('productos.editslider', {
        url: '/:productoId/editslider',
        templateUrl: 'modules/productos/client/views/form-slider.client.view.html',
        controller: 'SliderController',
        controllerAs: 'vm',
        resolve: {
          productoResolve: getProducto
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Editar Slider {{ productoResolve.title }}'
        }
      })
      .state('productos.view', {
        url: '/:productoId',
        templateUrl: 'modules/productos/client/views/view-producto.client.view.html',
        controller: 'ProductosController',
        controllerAs: 'vm',
        resolve: {
          productoResolve: getProducto
        },
        data: {
          pageTitle: 'Producto {{ productoResolve.title }}'
        }
      })
      .state('productos.viewslider', {
        url: '/slider/:productoId',
        templateUrl: 'modules/productos/client/views/view-slider.client.view.html',
        controller: 'ProductosController',
        controllerAs: 'vm',
        resolve: {
          productoResolve: getProducto
        },
        data: {
          pageTitle: 'Producto {{ productoResolve.title }}'
        }
      })
      .state('productos.thumbnail', {
        url: '/thumbnails/:productoId',
        templateUrl: 'modules/productos/client/views/thumbnail-producto.client.view.html',
        controller: 'ProductosThumbnailController',
        controllerAs: 'vm',
        resolve: {
          productoResolve: getProducto
        },
        data: {
          pageTitle: 'Producto {{ productoResolve.title }}'
        }
      })
      .state('productos.sliderthumbnail', {
        url: '/sliderthumbnails/:productoId',
        templateUrl: 'modules/productos/client/views/slider-producto.client.view.html',
        controller: 'ProductosThumbnailController',
        controllerAs: 'vm',
        resolve: {
          productoResolve: getProducto
        },
        data: {
          pageTitle: 'Imagenes para Slider'
        }
      });
  }

  getProducto.$inject = ['$stateParams', 'ProductosService'];

  function getProducto($stateParams, ProductosService) {
    return ProductosService.get({
      productoId: $stateParams.productoId
    }).$promise;
  }

  newProducto.$inject = ['ProductosService'];

  function newProducto(ProductosService) {
    return new ProductosService();
  }
}());
