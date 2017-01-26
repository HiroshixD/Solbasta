(function () {
  'use strict';

  describe('Cupones Route Tests', function () {
    // Initialize global variables
    var $scope,
      CuponesService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _CuponesService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      CuponesService = _CuponesService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('cupones');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/cupones');
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
          liststate = $state.get('cupones.list');
        }));

        it('Should have the correct URL', function () {
          expect(liststate.url).toEqual('');
        });

        it('Should not be abstract', function () {
          expect(liststate.abstract).toBe(undefined);
        });

        it('Should have template', function () {
          expect(liststate.templateUrl).toBe('modules/cupones/client/views/list-cupones.client.view.html');
        });
      });

      describe('View Route', function () {
        var viewstate,
          CuponesController,
          mockCupone;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('cupones.view');
          $templateCache.put('modules/cupones/client/views/view-cupone.client.view.html', '');

          // create mock cupone
          mockCupone = new CuponesService({
            _id: '525a8422f6d0f87f0e407a33',
            title: 'An Cupone about MEAN',
            content: 'MEAN rocks!'
          });

          // Initialize Controller
          CuponesController = $controller('CuponesController as vm', {
            $scope: $scope,
            cuponeResolve: mockCupone
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:cuponeId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.cuponeResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            cuponeId: 1
          })).toEqual('/cupones/1');
        }));

        it('should attach an cupone to the controller scope', function () {
          expect($scope.vm.cupone._id).toBe(mockCupone._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/cupones/client/views/view-cupone.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          CuponesController,
          mockCupone;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('cupones.create');
          $templateCache.put('modules/cupones/client/views/form-cupone.client.view.html', '');

          // create mock cupone
          mockCupone = new CuponesService();

          // Initialize Controller
          CuponesController = $controller('CuponesController as vm', {
            $scope: $scope,
            cuponeResolve: mockCupone
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.cuponeResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/cupones/create');
        }));

        it('should attach an cupone to the controller scope', function () {
          expect($scope.vm.cupone._id).toBe(mockCupone._id);
          expect($scope.vm.cupone._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/cupones/client/views/form-cupone.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          CuponesController,
          mockCupone;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('cupones.edit');
          $templateCache.put('modules/cupones/client/views/form-cupone.client.view.html', '');

          // create mock cupone
          mockCupone = new CuponesService({
            _id: '525a8422f6d0f87f0e407a33',
            title: 'An Cupone about MEAN',
            content: 'MEAN rocks!'
          });

          // Initialize Controller
          CuponesController = $controller('CuponesController as vm', {
            $scope: $scope,
            cuponeResolve: mockCupone
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:cuponeId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.cuponeResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            cuponeId: 1
          })).toEqual('/cupones/1/edit');
        }));

        it('should attach an cupone to the controller scope', function () {
          expect($scope.vm.cupone._id).toBe(mockCupone._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/cupones/client/views/form-cupone.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

      describe('Handle Trailing Slash', function () {
        beforeEach(inject(function ($state, $rootScope) {
          $state.go('cupones.list');
          $rootScope.$digest();
        }));

        it('Should remove trailing slash', inject(function ($state, $location, $rootScope) {
          $location.path('cupones/');
          $rootScope.$digest();

          expect($location.path()).toBe('/cupones');
          expect($state.current.templateUrl).toBe('modules/cupones/client/views/list-cupones.client.view.html');
        }));
      });

    });
  });
}());
