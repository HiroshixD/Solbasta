(function () {
  'use strict';

  describe('Tipo_subastas Route Tests', function () {
    // Initialize global variables
    var $scope,
      Tipo_subastasService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _Tipo_subastasService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      Tipo_subastasService = _Tipo_subastasService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('tipo_subastas');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/tipo_subastas');
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
          liststate = $state.get('tipo_subastas.list');
        }));

        it('Should have the correct URL', function () {
          expect(liststate.url).toEqual('');
        });

        it('Should not be abstract', function () {
          expect(liststate.abstract).toBe(undefined);
        });

        it('Should have template', function () {
          expect(liststate.templateUrl).toBe('modules/tipo_subastas/client/views/list-tipo_subastas.client.view.html');
        });
      });

      describe('View Route', function () {
        var viewstate,
          Tipo_subastasController,
          mockTipo_subasta;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('tipo_subastas.view');
          $templateCache.put('modules/tipo_subastas/client/views/view-tipo_subasta.client.view.html', '');

          // create mock tipo_subasta
          mockTipo_subasta = new Tipo_subastasService({
            _id: '525a8422f6d0f87f0e407a33',
            title: 'An Tipo_subasta about MEAN',
            content: 'MEAN rocks!'
          });

          // Initialize Controller
          Tipo_subastasController = $controller('Tipo_subastasController as vm', {
            $scope: $scope,
            tipo_subastaResolve: mockTipo_subasta
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:tipo_subastaId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.tipo_subastaResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            tipo_subastaId: 1
          })).toEqual('/tipo_subastas/1');
        }));

        it('should attach an tipo_subasta to the controller scope', function () {
          expect($scope.vm.tipo_subasta._id).toBe(mockTipo_subasta._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/tipo_subastas/client/views/view-tipo_subasta.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          Tipo_subastasController,
          mockTipo_subasta;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('tipo_subastas.create');
          $templateCache.put('modules/tipo_subastas/client/views/form-tipo_subasta.client.view.html', '');

          // create mock tipo_subasta
          mockTipo_subasta = new Tipo_subastasService();

          // Initialize Controller
          Tipo_subastasController = $controller('Tipo_subastasController as vm', {
            $scope: $scope,
            tipo_subastaResolve: mockTipo_subasta
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.tipo_subastaResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/tipo_subastas/create');
        }));

        it('should attach an tipo_subasta to the controller scope', function () {
          expect($scope.vm.tipo_subasta._id).toBe(mockTipo_subasta._id);
          expect($scope.vm.tipo_subasta._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/tipo_subastas/client/views/form-tipo_subasta.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          Tipo_subastasController,
          mockTipo_subasta;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('tipo_subastas.edit');
          $templateCache.put('modules/tipo_subastas/client/views/form-tipo_subasta.client.view.html', '');

          // create mock tipo_subasta
          mockTipo_subasta = new Tipo_subastasService({
            _id: '525a8422f6d0f87f0e407a33',
            title: 'An Tipo_subasta about MEAN',
            content: 'MEAN rocks!'
          });

          // Initialize Controller
          Tipo_subastasController = $controller('Tipo_subastasController as vm', {
            $scope: $scope,
            tipo_subastaResolve: mockTipo_subasta
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:tipo_subastaId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.tipo_subastaResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            tipo_subastaId: 1
          })).toEqual('/tipo_subastas/1/edit');
        }));

        it('should attach an tipo_subasta to the controller scope', function () {
          expect($scope.vm.tipo_subasta._id).toBe(mockTipo_subasta._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/tipo_subastas/client/views/form-tipo_subasta.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

      describe('Handle Trailing Slash', function () {
        beforeEach(inject(function ($state, $rootScope) {
          $state.go('tipo_subastas.list');
          $rootScope.$digest();
        }));

        it('Should remove trailing slash', inject(function ($state, $location, $rootScope) {
          $location.path('tipo_subastas/');
          $rootScope.$digest();

          expect($location.path()).toBe('/tipo_subastas');
          expect($state.current.templateUrl).toBe('modules/tipo_subastas/client/views/list-tipo_subastas.client.view.html');
        }));
      });

    });
  });
}());
