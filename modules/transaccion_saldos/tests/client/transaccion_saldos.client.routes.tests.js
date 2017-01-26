(function () {
  'use strict';

  describe('Transaccion_saldos Route Tests', function () {
    // Initialize global variables
    var $scope,
      Transaccion_saldosService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _Transaccion_saldosService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      Transaccion_saldosService = _Transaccion_saldosService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('transaccion_saldos');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/transaccion_saldos');
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
          liststate = $state.get('transaccion_saldos.list');
        }));

        it('Should have the correct URL', function () {
          expect(liststate.url).toEqual('');
        });

        it('Should not be abstract', function () {
          expect(liststate.abstract).toBe(undefined);
        });

        it('Should have template', function () {
          expect(liststate.templateUrl).toBe('modules/transaccion_saldos/client/views/list-transaccion_saldos.client.view.html');
        });
      });

      describe('View Route', function () {
        var viewstate,
          Transaccion_saldosController,
          mockTransaccion_saldo;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('transaccion_saldos.view');
          $templateCache.put('modules/transaccion_saldos/client/views/view-transaccion_saldo.client.view.html', '');

          // create mock transaccion_saldo
          mockTransaccion_saldo = new Transaccion_saldosService({
            _id: '525a8422f6d0f87f0e407a33',
            title: 'An Transaccion_saldo about MEAN',
            content: 'MEAN rocks!'
          });

          // Initialize Controller
          Transaccion_saldosController = $controller('Transaccion_saldosController as vm', {
            $scope: $scope,
            transaccion_saldoResolve: mockTransaccion_saldo
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:transaccion_saldoId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.transaccion_saldoResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            transaccion_saldoId: 1
          })).toEqual('/transaccion_saldos/1');
        }));

        it('should attach an transaccion_saldo to the controller scope', function () {
          expect($scope.vm.transaccion_saldo._id).toBe(mockTransaccion_saldo._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/transaccion_saldos/client/views/view-transaccion_saldo.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          Transaccion_saldosController,
          mockTransaccion_saldo;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('transaccion_saldos.create');
          $templateCache.put('modules/transaccion_saldos/client/views/form-transaccion_saldo.client.view.html', '');

          // create mock transaccion_saldo
          mockTransaccion_saldo = new Transaccion_saldosService();

          // Initialize Controller
          Transaccion_saldosController = $controller('Transaccion_saldosController as vm', {
            $scope: $scope,
            transaccion_saldoResolve: mockTransaccion_saldo
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.transaccion_saldoResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/transaccion_saldos/create');
        }));

        it('should attach an transaccion_saldo to the controller scope', function () {
          expect($scope.vm.transaccion_saldo._id).toBe(mockTransaccion_saldo._id);
          expect($scope.vm.transaccion_saldo._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/transaccion_saldos/client/views/form-transaccion_saldo.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          Transaccion_saldosController,
          mockTransaccion_saldo;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('transaccion_saldos.edit');
          $templateCache.put('modules/transaccion_saldos/client/views/form-transaccion_saldo.client.view.html', '');

          // create mock transaccion_saldo
          mockTransaccion_saldo = new Transaccion_saldosService({
            _id: '525a8422f6d0f87f0e407a33',
            title: 'An Transaccion_saldo about MEAN',
            content: 'MEAN rocks!'
          });

          // Initialize Controller
          Transaccion_saldosController = $controller('Transaccion_saldosController as vm', {
            $scope: $scope,
            transaccion_saldoResolve: mockTransaccion_saldo
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:transaccion_saldoId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.transaccion_saldoResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            transaccion_saldoId: 1
          })).toEqual('/transaccion_saldos/1/edit');
        }));

        it('should attach an transaccion_saldo to the controller scope', function () {
          expect($scope.vm.transaccion_saldo._id).toBe(mockTransaccion_saldo._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/transaccion_saldos/client/views/form-transaccion_saldo.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

      describe('Handle Trailing Slash', function () {
        beforeEach(inject(function ($state, $rootScope) {
          $state.go('transaccion_saldos.list');
          $rootScope.$digest();
        }));

        it('Should remove trailing slash', inject(function ($state, $location, $rootScope) {
          $location.path('transaccion_saldos/');
          $rootScope.$digest();

          expect($location.path()).toBe('/transaccion_saldos');
          expect($state.current.templateUrl).toBe('modules/transaccion_saldos/client/views/list-transaccion_saldos.client.view.html');
        }));
      });

    });
  });
}());
