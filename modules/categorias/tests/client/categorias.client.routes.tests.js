(function () {
  'use strict';

  describe('Categorias Route Tests', function () {
    // Initialize global variables
    var $scope,
      CategoriasService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _CategoriasService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      CategoriasService = _CategoriasService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('categorias');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/categorias');
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
          liststate = $state.get('categorias.list');
        }));

        it('Should have the correct URL', function () {
          expect(liststate.url).toEqual('');
        });

        it('Should not be abstract', function () {
          expect(liststate.abstract).toBe(undefined);
        });

        it('Should have template', function () {
          expect(liststate.templateUrl).toBe('modules/categorias/client/views/list-categorias.client.view.html');
        });
      });

      describe('View Route', function () {
        var viewstate,
          CategoriasController,
          mockCategoria;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('categorias.view');
          $templateCache.put('modules/categorias/client/views/view-categoria.client.view.html', '');

          // create mock categoria
          mockCategoria = new CategoriasService({
            _id: '525a8422f6d0f87f0e407a33',
            title: 'An Categoria about MEAN',
            content: 'MEAN rocks!'
          });

          // Initialize Controller
          CategoriasController = $controller('CategoriasController as vm', {
            $scope: $scope,
            categoriaResolve: mockCategoria
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:categoriaId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.categoriaResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            categoriaId: 1
          })).toEqual('/categorias/1');
        }));

        it('should attach an categoria to the controller scope', function () {
          expect($scope.vm.categoria._id).toBe(mockCategoria._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/categorias/client/views/view-categoria.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          CategoriasController,
          mockCategoria;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('categorias.create');
          $templateCache.put('modules/categorias/client/views/form-categoria.client.view.html', '');

          // create mock categoria
          mockCategoria = new CategoriasService();

          // Initialize Controller
          CategoriasController = $controller('CategoriasController as vm', {
            $scope: $scope,
            categoriaResolve: mockCategoria
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.categoriaResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/categorias/create');
        }));

        it('should attach an categoria to the controller scope', function () {
          expect($scope.vm.categoria._id).toBe(mockCategoria._id);
          expect($scope.vm.categoria._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/categorias/client/views/form-categoria.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          CategoriasController,
          mockCategoria;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('categorias.edit');
          $templateCache.put('modules/categorias/client/views/form-categoria.client.view.html', '');

          // create mock categoria
          mockCategoria = new CategoriasService({
            _id: '525a8422f6d0f87f0e407a33',
            title: 'An Categoria about MEAN',
            content: 'MEAN rocks!'
          });

          // Initialize Controller
          CategoriasController = $controller('CategoriasController as vm', {
            $scope: $scope,
            categoriaResolve: mockCategoria
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:categoriaId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.categoriaResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            categoriaId: 1
          })).toEqual('/categorias/1/edit');
        }));

        it('should attach an categoria to the controller scope', function () {
          expect($scope.vm.categoria._id).toBe(mockCategoria._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/categorias/client/views/form-categoria.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

      describe('Handle Trailing Slash', function () {
        beforeEach(inject(function ($state, $rootScope) {
          $state.go('categorias.list');
          $rootScope.$digest();
        }));

        it('Should remove trailing slash', inject(function ($state, $location, $rootScope) {
          $location.path('categorias/');
          $rootScope.$digest();

          expect($location.path()).toBe('/categorias');
          expect($state.current.templateUrl).toBe('modules/categorias/client/views/list-categorias.client.view.html');
        }));
      });

    });
  });
}());
