(function () {
  'use strict';

  describe('Datos_envios Route Tests', function () {
    // Initialize global variables
    var $scope,
      Datos_enviosService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _Datos_enviosService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      Datos_enviosService = _Datos_enviosService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('datos_envios');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/datos_envios');
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
          liststate = $state.get('datos_envios.list');
        }));

        it('Should have the correct URL', function () {
          expect(liststate.url).toEqual('');
        });

        it('Should not be abstract', function () {
          expect(liststate.abstract).toBe(undefined);
        });

        it('Should have template', function () {
          expect(liststate.templateUrl).toBe('modules/datos_envios/client/views/list-datos_envios.client.view.html');
        });
      });

      describe('View Route', function () {
        var viewstate,
          Datos_enviosController,
          mockDatos_envio;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('datos_envios.view');
          $templateCache.put('modules/datos_envios/client/views/view-datos_envio.client.view.html', '');

          // create mock datos_envio
          mockDatos_envio = new Datos_enviosService({
            _id: '525a8422f6d0f87f0e407a33',
            title: 'An Datos_envio about MEAN',
            content: 'MEAN rocks!'
          });

          // Initialize Controller
          Datos_enviosController = $controller('Datos_enviosController as vm', {
            $scope: $scope,
            datos_envioResolve: mockDatos_envio
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:datos_envioId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.datos_envioResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            datos_envioId: 1
          })).toEqual('/datos_envios/1');
        }));

        it('should attach an datos_envio to the controller scope', function () {
          expect($scope.vm.datos_envio._id).toBe(mockDatos_envio._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/datos_envios/client/views/view-datos_envio.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          Datos_enviosController,
          mockDatos_envio;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('datos_envios.create');
          $templateCache.put('modules/datos_envios/client/views/form-datos_envio.client.view.html', '');

          // create mock datos_envio
          mockDatos_envio = new Datos_enviosService();

          // Initialize Controller
          Datos_enviosController = $controller('Datos_enviosController as vm', {
            $scope: $scope,
            datos_envioResolve: mockDatos_envio
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.datos_envioResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/datos_envios/create');
        }));

        it('should attach an datos_envio to the controller scope', function () {
          expect($scope.vm.datos_envio._id).toBe(mockDatos_envio._id);
          expect($scope.vm.datos_envio._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/datos_envios/client/views/form-datos_envio.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          Datos_enviosController,
          mockDatos_envio;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('datos_envios.edit');
          $templateCache.put('modules/datos_envios/client/views/form-datos_envio.client.view.html', '');

          // create mock datos_envio
          mockDatos_envio = new Datos_enviosService({
            _id: '525a8422f6d0f87f0e407a33',
            title: 'An Datos_envio about MEAN',
            content: 'MEAN rocks!'
          });

          // Initialize Controller
          Datos_enviosController = $controller('Datos_enviosController as vm', {
            $scope: $scope,
            datos_envioResolve: mockDatos_envio
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:datos_envioId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.datos_envioResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            datos_envioId: 1
          })).toEqual('/datos_envios/1/edit');
        }));

        it('should attach an datos_envio to the controller scope', function () {
          expect($scope.vm.datos_envio._id).toBe(mockDatos_envio._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/datos_envios/client/views/form-datos_envio.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

      describe('Handle Trailing Slash', function () {
        beforeEach(inject(function ($state, $rootScope) {
          $state.go('datos_envios.list');
          $rootScope.$digest();
        }));

        it('Should remove trailing slash', inject(function ($state, $location, $rootScope) {
          $location.path('datos_envios/');
          $rootScope.$digest();

          expect($location.path()).toBe('/datos_envios');
          expect($state.current.templateUrl).toBe('modules/datos_envios/client/views/list-datos_envios.client.view.html');
        }));
      });

    });
  });
}());
