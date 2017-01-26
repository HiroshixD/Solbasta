(function () {
  'use strict';

  describe('Eventos Route Tests', function () {
    // Initialize global variables
    var $scope,
      EventosService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _EventosService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      EventosService = _EventosService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('eventos');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/eventos');
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
          liststate = $state.get('eventos.list');
        }));

        it('Should have the correct URL', function () {
          expect(liststate.url).toEqual('');
        });

        it('Should not be abstract', function () {
          expect(liststate.abstract).toBe(undefined);
        });

        it('Should have template', function () {
          expect(liststate.templateUrl).toBe('modules/eventos/client/views/list-eventos.client.view.html');
        });
      });

      describe('View Route', function () {
        var viewstate,
          EventosController,
          mockEvento;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('eventos.view');
          $templateCache.put('modules/eventos/client/views/view-evento.client.view.html', '');

          // create mock evento
          mockEvento = new EventosService({
            _id: '525a8422f6d0f87f0e407a33',
            title: 'An Evento about MEAN',
            content: 'MEAN rocks!'
          });

          // Initialize Controller
          EventosController = $controller('EventosController as vm', {
            $scope: $scope,
            eventoResolve: mockEvento
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:eventoId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.eventoResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            eventoId: 1
          })).toEqual('/eventos/1');
        }));

        it('should attach an evento to the controller scope', function () {
          expect($scope.vm.evento._id).toBe(mockEvento._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/eventos/client/views/view-evento.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          EventosController,
          mockEvento;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('eventos.create');
          $templateCache.put('modules/eventos/client/views/form-evento.client.view.html', '');

          // create mock evento
          mockEvento = new EventosService();

          // Initialize Controller
          EventosController = $controller('EventosController as vm', {
            $scope: $scope,
            eventoResolve: mockEvento
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.eventoResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/eventos/create');
        }));

        it('should attach an evento to the controller scope', function () {
          expect($scope.vm.evento._id).toBe(mockEvento._id);
          expect($scope.vm.evento._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/eventos/client/views/form-evento.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          EventosController,
          mockEvento;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('eventos.edit');
          $templateCache.put('modules/eventos/client/views/form-evento.client.view.html', '');

          // create mock evento
          mockEvento = new EventosService({
            _id: '525a8422f6d0f87f0e407a33',
            title: 'An Evento about MEAN',
            content: 'MEAN rocks!'
          });

          // Initialize Controller
          EventosController = $controller('EventosController as vm', {
            $scope: $scope,
            eventoResolve: mockEvento
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:eventoId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.eventoResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            eventoId: 1
          })).toEqual('/eventos/1/edit');
        }));

        it('should attach an evento to the controller scope', function () {
          expect($scope.vm.evento._id).toBe(mockEvento._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/eventos/client/views/form-evento.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

      describe('Handle Trailing Slash', function () {
        beforeEach(inject(function ($state, $rootScope) {
          $state.go('eventos.list');
          $rootScope.$digest();
        }));

        it('Should remove trailing slash', inject(function ($state, $location, $rootScope) {
          $location.path('eventos/');
          $rootScope.$digest();

          expect($location.path()).toBe('/eventos');
          expect($state.current.templateUrl).toBe('modules/eventos/client/views/list-eventos.client.view.html');
        }));
      });

    });
  });
}());
