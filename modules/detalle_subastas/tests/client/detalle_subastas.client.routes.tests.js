(function () {
  'use strict';

  describe('Detalle_subastas Route Tests', function () {
    // Initialize global variables
    var $scope,
      Detalle_subastasService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _Detalle_subastasService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      Detalle_subastasService = _Detalle_subastasService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('detalle_subastas');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/detalle_subastas');
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
          liststate = $state.get('detalle_subastas.list');
        }));

        it('Should have the correct URL', function () {
          expect(liststate.url).toEqual('');
        });

        it('Should not be abstract', function () {
          expect(liststate.abstract).toBe(undefined);
        });

        it('Should have template', function () {
          expect(liststate.templateUrl).toBe('modules/detalle_subastas/client/views/list-detalle_subastas.client.view.html');
        });
      });

      describe('View Route', function () {
        var viewstate,
          Detalle_subastasController,
          mockDetalle_subasta;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('detalle_subastas.view');
          $templateCache.put('modules/detalle_subastas/client/views/view-detalle_subasta.client.view.html', '');

          // create mock detalle_subasta
          mockDetalle_subasta = new Detalle_subastasService({
            _id: '525a8422f6d0f87f0e407a33',
            title: 'An Detalle_subasta about MEAN',
            content: 'MEAN rocks!'
          });

          // Initialize Controller
          Detalle_subastasController = $controller('Detalle_subastasController as vm', {
            $scope: $scope,
            detalle_subastaResolve: mockDetalle_subasta
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:detalle_subastaId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.detalle_subastaResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            detalle_subastaId: 1
          })).toEqual('/detalle_subastas/1');
        }));

        it('should attach an detalle_subasta to the controller scope', function () {
          expect($scope.vm.detalle_subasta._id).toBe(mockDetalle_subasta._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/detalle_subastas/client/views/view-detalle_subasta.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          Detalle_subastasController,
          mockDetalle_subasta;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('detalle_subastas.create');
          $templateCache.put('modules/detalle_subastas/client/views/form-detalle_subasta.client.view.html', '');

          // create mock detalle_subasta
          mockDetalle_subasta = new Detalle_subastasService();

          // Initialize Controller
          Detalle_subastasController = $controller('Detalle_subastasController as vm', {
            $scope: $scope,
            detalle_subastaResolve: mockDetalle_subasta
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.detalle_subastaResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/detalle_subastas/create');
        }));

        it('should attach an detalle_subasta to the controller scope', function () {
          expect($scope.vm.detalle_subasta._id).toBe(mockDetalle_subasta._id);
          expect($scope.vm.detalle_subasta._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/detalle_subastas/client/views/form-detalle_subasta.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          Detalle_subastasController,
          mockDetalle_subasta;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('detalle_subastas.edit');
          $templateCache.put('modules/detalle_subastas/client/views/form-detalle_subasta.client.view.html', '');

          // create mock detalle_subasta
          mockDetalle_subasta = new Detalle_subastasService({
            _id: '525a8422f6d0f87f0e407a33',
            title: 'An Detalle_subasta about MEAN',
            content: 'MEAN rocks!'
          });

          // Initialize Controller
          Detalle_subastasController = $controller('Detalle_subastasController as vm', {
            $scope: $scope,
            detalle_subastaResolve: mockDetalle_subasta
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:detalle_subastaId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.detalle_subastaResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            detalle_subastaId: 1
          })).toEqual('/detalle_subastas/1/edit');
        }));

        it('should attach an detalle_subasta to the controller scope', function () {
          expect($scope.vm.detalle_subasta._id).toBe(mockDetalle_subasta._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/detalle_subastas/client/views/form-detalle_subasta.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

      describe('Handle Trailing Slash', function () {
        beforeEach(inject(function ($state, $rootScope) {
          $state.go('detalle_subastas.list');
          $rootScope.$digest();
        }));

        it('Should remove trailing slash', inject(function ($state, $location, $rootScope) {
          $location.path('detalle_subastas/');
          $rootScope.$digest();

          expect($location.path()).toBe('/detalle_subastas');
          expect($state.current.templateUrl).toBe('modules/detalle_subastas/client/views/list-detalle_subastas.client.view.html');
        }));
      });

    });
  });
}());
