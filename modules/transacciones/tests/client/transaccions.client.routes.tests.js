(function () {
  'use strict';

  describe('Transaccions Route Tests', function () {
    // Initialize global variables
    var $scope,
      TransaccionsService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _TransaccionsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      TransaccionsService = _TransaccionsService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('transaccions');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/transaccions');
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
          liststate = $state.get('transaccions.list');
        }));

        it('Should have the correct URL', function () {
          expect(liststate.url).toEqual('');
        });

        it('Should not be abstract', function () {
          expect(liststate.abstract).toBe(undefined);
        });

        it('Should have template', function () {
          expect(liststate.templateUrl).toBe('modules/transaccions/client/views/list-transaccions.client.view.html');
        });
      });

      describe('View Route', function () {
        var viewstate,
          TransaccionsController,
          mockTransaccion;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('transaccions.view');
          $templateCache.put('modules/transaccions/client/views/view-transaccion.client.view.html', '');

          // create mock transaccion
          mockTransaccion = new TransaccionsService({
            _id: '525a8422f6d0f87f0e407a33',
            title: 'An Transaccion about MEAN',
            content: 'MEAN rocks!'
          });

          // Initialize Controller
          TransaccionsController = $controller('TransaccionsController as vm', {
            $scope: $scope,
            transaccionResolve: mockTransaccion
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:transaccionId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.transaccionResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            transaccionId: 1
          })).toEqual('/transaccions/1');
        }));

        it('should attach an transaccion to the controller scope', function () {
          expect($scope.vm.transaccion._id).toBe(mockTransaccion._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/transaccions/client/views/view-transaccion.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          TransaccionsController,
          mockTransaccion;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('transaccions.create');
          $templateCache.put('modules/transaccions/client/views/form-transaccion.client.view.html', '');

          // create mock transaccion
          mockTransaccion = new TransaccionsService();

          // Initialize Controller
          TransaccionsController = $controller('TransaccionsController as vm', {
            $scope: $scope,
            transaccionResolve: mockTransaccion
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.transaccionResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/transaccions/create');
        }));

        it('should attach an transaccion to the controller scope', function () {
          expect($scope.vm.transaccion._id).toBe(mockTransaccion._id);
          expect($scope.vm.transaccion._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/transaccions/client/views/form-transaccion.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          TransaccionsController,
          mockTransaccion;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('transaccions.edit');
          $templateCache.put('modules/transaccions/client/views/form-transaccion.client.view.html', '');

          // create mock transaccion
          mockTransaccion = new TransaccionsService({
            _id: '525a8422f6d0f87f0e407a33',
            title: 'An Transaccion about MEAN',
            content: 'MEAN rocks!'
          });

          // Initialize Controller
          TransaccionsController = $controller('TransaccionsController as vm', {
            $scope: $scope,
            transaccionResolve: mockTransaccion
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:transaccionId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.transaccionResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            transaccionId: 1
          })).toEqual('/transaccions/1/edit');
        }));

        it('should attach an transaccion to the controller scope', function () {
          expect($scope.vm.transaccion._id).toBe(mockTransaccion._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/transaccions/client/views/form-transaccion.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

      describe('Handle Trailing Slash', function () {
        beforeEach(inject(function ($state, $rootScope) {
          $state.go('transaccions.list');
          $rootScope.$digest();
        }));

        it('Should remove trailing slash', inject(function ($state, $location, $rootScope) {
          $location.path('transaccions/');
          $rootScope.$digest();

          expect($location.path()).toBe('/transaccions');
          expect($state.current.templateUrl).toBe('modules/transaccions/client/views/list-transaccions.client.view.html');
        }));
      });

    });
  });
}());
