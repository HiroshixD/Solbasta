(function () {
  'use strict';

  describe('Cuentas Route Tests', function () {
    // Initialize global variables
    var $scope,
      Cuentas;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _Cuentas_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      Cuentas = _Cuentas_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('cuentas');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/cuentas');
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
          liststate = $state.get('cuentas.list');
        }));

        it('Should have the correct URL', function () {
          expect(liststate.url).toEqual('');
        });

        it('Should not be abstract', function () {
          expect(liststate.abstract).toBe(undefined);
        });

        it('Should have template', function () {
          expect(liststate.templateUrl).toBe('modules/cuentas/client/views/list-cuentas.client.view.html');
        });
      });

      describe('View Route', function () {
        var viewstate,
          CuentasController,
          mockCuenta;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('cuentas.view');
          $templateCache.put('modules/cuentas/client/views/view-cuenta.client.view.html', '');

          // create mock cuenta
          mockCuenta = new Cuentas({
            _id: '525a8422f6d0f87f0e407a33',
            title: 'An Cuenta about MEAN',
            content: 'MEAN rocks!'
          });

          // Initialize Controller
          CuentasController = $controller('CuentasController as vm', {
            $scope: $scope,
            cuentaResolve: mockCuenta
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:cuentaId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.cuentaResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            cuentaId: 1
          })).toEqual('/cuentas/1');
        }));

        it('should attach an cuenta to the controller scope', function () {
          expect($scope.vm.cuenta._id).toBe(mockCuenta._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/cuentas/client/views/view-cuenta.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          CuentasController,
          mockCuenta;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('cuentas.create');
          $templateCache.put('modules/cuentas/client/views/form-cuenta.client.view.html', '');

          // create mock cuenta
          mockCuenta = new Cuentas();

          // Initialize Controller
          CuentasController = $controller('CuentasController as vm', {
            $scope: $scope,
            cuentaResolve: mockCuenta
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.cuentaResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/cuentas/create');
        }));

        it('should attach an cuenta to the controller scope', function () {
          expect($scope.vm.cuenta._id).toBe(mockCuenta._id);
          expect($scope.vm.cuenta._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/cuentas/client/views/form-cuenta.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          CuentasController,
          mockCuenta;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('cuentas.edit');
          $templateCache.put('modules/cuentas/client/views/form-cuenta.client.view.html', '');

          // create mock cuenta
          mockCuenta = new Cuentas({
            _id: '525a8422f6d0f87f0e407a33',
            title: 'An Cuenta about MEAN',
            content: 'MEAN rocks!'
          });

          // Initialize Controller
          CuentasController = $controller('CuentasController as vm', {
            $scope: $scope,
            cuentaResolve: mockCuenta
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:cuentaId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.cuentaResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            cuentaId: 1
          })).toEqual('/cuentas/1/edit');
        }));

        it('should attach an cuenta to the controller scope', function () {
          expect($scope.vm.cuenta._id).toBe(mockCuenta._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/cuentas/client/views/form-cuenta.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

      describe('Handle Trailing Slash', function () {
        beforeEach(inject(function ($state, $rootScope) {
          $state.go('cuentas.list');
          $rootScope.$digest();
        }));

        it('Should remove trailing slash', inject(function ($state, $location, $rootScope) {
          $location.path('cuentas/');
          $rootScope.$digest();

          expect($location.path()).toBe('/cuentas');
          expect($state.current.templateUrl).toBe('modules/cuentas/client/views/list-cuentas.client.view.html');
        }));
      });

    });
  });
}());
