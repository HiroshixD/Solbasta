(function () {
  'use strict';

  describe('Ubigeos Route Tests', function () {
    // Initialize global variables
    var $scope,
      UbigeosService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _UbigeosService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      UbigeosService = _UbigeosService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('ubigeos');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/ubigeos');
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
          liststate = $state.get('ubigeos.list');
        }));

        it('Should have the correct URL', function () {
          expect(liststate.url).toEqual('');
        });

        it('Should not be abstract', function () {
          expect(liststate.abstract).toBe(undefined);
        });

        it('Should have template', function () {
          expect(liststate.templateUrl).toBe('modules/ubigeos/client/views/list-ubigeos.client.view.html');
        });
      });

      describe('View Route', function () {
        var viewstate,
          UbigeosController,
          mockUbigeo;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('ubigeos.view');
          $templateCache.put('modules/ubigeos/client/views/view-ubigeo.client.view.html', '');

          // create mock ubigeo
          mockUbigeo = new UbigeosService({
            _id: '525a8422f6d0f87f0e407a33',
            title: 'An Ubigeo about MEAN',
            content: 'MEAN rocks!'
          });

          // Initialize Controller
          UbigeosController = $controller('UbigeosController as vm', {
            $scope: $scope,
            ubigeoResolve: mockUbigeo
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:ubigeoId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.ubigeoResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            ubigeoId: 1
          })).toEqual('/ubigeos/1');
        }));

        it('should attach an ubigeo to the controller scope', function () {
          expect($scope.vm.ubigeo._id).toBe(mockUbigeo._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/ubigeos/client/views/view-ubigeo.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          UbigeosController,
          mockUbigeo;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('ubigeos.create');
          $templateCache.put('modules/ubigeos/client/views/form-ubigeo.client.view.html', '');

          // create mock ubigeo
          mockUbigeo = new UbigeosService();

          // Initialize Controller
          UbigeosController = $controller('UbigeosController as vm', {
            $scope: $scope,
            ubigeoResolve: mockUbigeo
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.ubigeoResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/ubigeos/create');
        }));

        it('should attach an ubigeo to the controller scope', function () {
          expect($scope.vm.ubigeo._id).toBe(mockUbigeo._id);
          expect($scope.vm.ubigeo._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/ubigeos/client/views/form-ubigeo.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          UbigeosController,
          mockUbigeo;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('ubigeos.edit');
          $templateCache.put('modules/ubigeos/client/views/form-ubigeo.client.view.html', '');

          // create mock ubigeo
          mockUbigeo = new UbigeosService({
            _id: '525a8422f6d0f87f0e407a33',
            title: 'An Ubigeo about MEAN',
            content: 'MEAN rocks!'
          });

          // Initialize Controller
          UbigeosController = $controller('UbigeosController as vm', {
            $scope: $scope,
            ubigeoResolve: mockUbigeo
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:ubigeoId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.ubigeoResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            ubigeoId: 1
          })).toEqual('/ubigeos/1/edit');
        }));

        it('should attach an ubigeo to the controller scope', function () {
          expect($scope.vm.ubigeo._id).toBe(mockUbigeo._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/ubigeos/client/views/form-ubigeo.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

      describe('Handle Trailing Slash', function () {
        beforeEach(inject(function ($state, $rootScope) {
          $state.go('ubigeos.list');
          $rootScope.$digest();
        }));

        it('Should remove trailing slash', inject(function ($state, $location, $rootScope) {
          $location.path('ubigeos/');
          $rootScope.$digest();

          expect($location.path()).toBe('/ubigeos');
          expect($state.current.templateUrl).toBe('modules/ubigeos/client/views/list-ubigeos.client.view.html');
        }));
      });

    });
  });
}());
