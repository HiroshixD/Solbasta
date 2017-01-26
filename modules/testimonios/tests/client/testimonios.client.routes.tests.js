(function () {
  'use strict';

  describe('Testimonios Route Tests', function () {
    // Initialize global variables
    var $scope,
      TestimoniosService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _TestimoniosService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      TestimoniosService = _TestimoniosService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('testimonios');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/testimonios');
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
          liststate = $state.get('testimonios.list');
        }));

        it('Should have the correct URL', function () {
          expect(liststate.url).toEqual('');
        });

        it('Should not be abstract', function () {
          expect(liststate.abstract).toBe(undefined);
        });

        it('Should have template', function () {
          expect(liststate.templateUrl).toBe('modules/testimonios/client/views/list-testimonios.client.view.html');
        });
      });

      describe('View Route', function () {
        var viewstate,
          TestimoniosController,
          mockTestimonio;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('testimonios.view');
          $templateCache.put('modules/testimonios/client/views/view-testimonio.client.view.html', '');

          // create mock testimonio
          mockTestimonio = new TestimoniosService({
            _id: '525a8422f6d0f87f0e407a33',
            title: 'An Testimonio about MEAN',
            content: 'MEAN rocks!'
          });

          // Initialize Controller
          TestimoniosController = $controller('TestimoniosController as vm', {
            $scope: $scope,
            testimonioResolve: mockTestimonio
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:testimonioId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.testimonioResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            testimonioId: 1
          })).toEqual('/testimonios/1');
        }));

        it('should attach an testimonio to the controller scope', function () {
          expect($scope.vm.testimonio._id).toBe(mockTestimonio._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/testimonios/client/views/view-testimonio.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          TestimoniosController,
          mockTestimonio;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('testimonios.create');
          $templateCache.put('modules/testimonios/client/views/form-testimonio.client.view.html', '');

          // create mock testimonio
          mockTestimonio = new TestimoniosService();

          // Initialize Controller
          TestimoniosController = $controller('TestimoniosController as vm', {
            $scope: $scope,
            testimonioResolve: mockTestimonio
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.testimonioResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/testimonios/create');
        }));

        it('should attach an testimonio to the controller scope', function () {
          expect($scope.vm.testimonio._id).toBe(mockTestimonio._id);
          expect($scope.vm.testimonio._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/testimonios/client/views/form-testimonio.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          TestimoniosController,
          mockTestimonio;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('testimonios.edit');
          $templateCache.put('modules/testimonios/client/views/form-testimonio.client.view.html', '');

          // create mock testimonio
          mockTestimonio = new TestimoniosService({
            _id: '525a8422f6d0f87f0e407a33',
            title: 'An Testimonio about MEAN',
            content: 'MEAN rocks!'
          });

          // Initialize Controller
          TestimoniosController = $controller('TestimoniosController as vm', {
            $scope: $scope,
            testimonioResolve: mockTestimonio
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:testimonioId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.testimonioResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            testimonioId: 1
          })).toEqual('/testimonios/1/edit');
        }));

        it('should attach an testimonio to the controller scope', function () {
          expect($scope.vm.testimonio._id).toBe(mockTestimonio._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/testimonios/client/views/form-testimonio.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

      describe('Handle Trailing Slash', function () {
        beforeEach(inject(function ($state, $rootScope) {
          $state.go('testimonios.list');
          $rootScope.$digest();
        }));

        it('Should remove trailing slash', inject(function ($state, $location, $rootScope) {
          $location.path('testimonios/');
          $rootScope.$digest();

          expect($location.path()).toBe('/testimonios');
          expect($state.current.templateUrl).toBe('modules/testimonios/client/views/list-testimonios.client.view.html');
        }));
      });

    });
  });
}());
