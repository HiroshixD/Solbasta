(function () {
  'use strict';

  describe('Productos Route Tests', function () {
    // Initialize global variables
    var $scope,
      ProductosService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _ProductosService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      ProductosService = _ProductosService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('productos');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/productos');
        });

        it('Should be abstract', function () {
          expect(mainstate.abstract).toBe(true);
        });

        it('Should have template', function () {
          expect(mainstate.template).toBe('<ui-view/>');
        });
      });

      describe('List Route', function () {
        var liststate;
        beforeEach(inject(function ($state) {
          liststate = $state.get('productos.list');
        }));

        it('Should have the correct URL', function () {
          expect(liststate.url).toEqual('');
        });

        it('Should not be abstract', function () {
          expect(liststate.abstract).toBe(undefined);
        });

        it('Should have template', function () {
          expect(liststate.templateUrl).toBe('modules/productos/client/views/list-productos.client.view.html');
        });
      });

      describe('View Route', function () {
        var viewstate,
          ProductosController,
          mockProducto;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('productos.view');
          $templateCache.put('modules/productos/client/views/view-producto.client.view.html', '');

          // create mock producto
          mockProducto = new ProductosService({
            _id: '525a8422f6d0f87f0e407a33',
            title: 'An Producto about MEAN',
            content: 'MEAN rocks!'
          });

          // Initialize Controller
          ProductosController = $controller('ProductosController as vm', {
            $scope: $scope,
            productoResolve: mockProducto
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:productoId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.productoResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            productoId: 1
          })).toEqual('/productos/1');
        }));

        it('should attach an producto to the controller scope', function () {
          expect($scope.vm.producto._id).toBe(mockProducto._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/productos/client/views/view-producto.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          ProductosController,
          mockProducto;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('productos.create');
          $templateCache.put('modules/productos/client/views/form-producto.client.view.html', '');

          // create mock producto
          mockProducto = new ProductosService();

          // Initialize Controller
          ProductosController = $controller('ProductosController as vm', {
            $scope: $scope,
            productoResolve: mockProducto
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.productoResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/productos/create');
        }));

        it('should attach an producto to the controller scope', function () {
          expect($scope.vm.producto._id).toBe(mockProducto._id);
          expect($scope.vm.producto._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/productos/client/views/form-producto.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          ProductosController,
          mockProducto;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('productos.edit');
          $templateCache.put('modules/productos/client/views/form-producto.client.view.html', '');

          // create mock producto
          mockProducto = new ProductosService({
            _id: '525a8422f6d0f87f0e407a33',
            title: 'An Producto about MEAN',
            content: 'MEAN rocks!'
          });

          // Initialize Controller
          ProductosController = $controller('ProductosController as vm', {
            $scope: $scope,
            productoResolve: mockProducto
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:productoId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.productoResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            productoId: 1
          })).toEqual('/productos/1/edit');
        }));

        it('should attach an producto to the controller scope', function () {
          expect($scope.vm.producto._id).toBe(mockProducto._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/productos/client/views/form-producto.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

      describe('Handle Trailing Slash', function () {
        beforeEach(inject(function ($state, $rootScope) {
          $state.go('productos.list');
          $rootScope.$digest();
        }));

        it('Should remove trailing slash', inject(function ($state, $location, $rootScope) {
          $location.path('productos/');
          $rootScope.$digest();

          expect($location.path()).toBe('/productos');
          expect($state.current.templateUrl).toBe('modules/productos/client/views/list-productos.client.view.html');
        }));
      });

    });
  });
}());
