(function () {
  'use strict';

  angular
    .module('homes.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('homes', {
        abstract: true,
        url: '/',
        template: '<ui-view/>'
      })
      .state('homes.dashboard', {
        url: '',
        templateUrl: 'modules/homes/client/views/home-dashboard.client.view.html',
        controller: 'HomesListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Inicio'
        }
      })
      .state('homes.categorias', {
        url: 'categorias',
        templateUrl: 'modules/homes/client/views/categorias.client.view.html',
        controller: 'CategoriasListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Categorias'
        }
      })
      .state('homes.detailscategorias', {
        url: 'categorias/:categoriaId',
        templateUrl: 'modules/homes/client/views/home-categories-details.client.view.html',
        controller: 'AuctionCategoriasController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Categorias'
        }
      })
      .state('homes.envivo', {
        url: 'en-vivo',
        templateUrl: 'modules/homes/client/views/envivo.client.view.html',
        controller: 'HomesLive',
        controllerAs: 'vm',
        data: {
          pageTitle: 'En vivo'
        }
      })
      .state('homes.terminadas', {
        url: 'terminadas',
        templateUrl: 'modules/homes/client/views/terminadas.client.view.html',
        controller: 'HomesCompletedController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Terminadas'
        }
      })
      .state('homes.proximas', {
        url: 'proximas',
        templateUrl: 'modules/homes/client/views/proximas.client.view.html',
        controller: 'HomesNextAndRemindersController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Próximas'
        }
      })
      .state('homes.testimonios', {
        url: 'testimonios',
        templateUrl: 'modules/homes/client/views/testimonios.client.view.html',
        controller: 'HomesListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Testimonios'
        }
      })
      .state('homes.contacto', {
        url: 'contacto',
        templateUrl: 'modules/homes/client/views/contact.client.view.html',
        controller: 'HomeContactController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Contáctanos'
        }
      })
      .state('homes.preguntas-frecuentes', {
        url: 'preguntas-frecuentes',
        templateUrl: 'modules/homes/client/views/preguntas-frecuentes.client.view.html',
        controller: 'HomeContactController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Preguntas Frecuentes'
        }
      })
      .state('homes.tipos', {
        url: 'tipos-subasta',
        templateUrl: 'modules/homes/client/views/tipos-subasta.client.view.html',
        controller: 'HomeContactController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Tipos de Subastas'
        }
      })
      .state('homes.reclamos', {
        url: 'reclamos',
        templateUrl: 'modules/homes/client/views/home-reclamos.client.view.html',
        controller: 'HomeContactController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Libro de reclamaciones'
        }
      })
      .state('homes.informacion-soporte', {
        url: 'informacion-soporte',
        templateUrl: 'modules/homes/client/views/informacion-soporte.client.view.html',
        controller: 'HomeContactController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Información y soporte'
        }
      })
      .state('homes.terminos-condiciones', {
        url: 'terminos-condiciones',
        templateUrl: 'modules/homes/client/views/terminos-condiciones.client.view.html',
        controller: 'HomeContactController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Términos y condiciones'
        }
      })
      .state('homes.politica-privacidad', {
        url: 'politica-privacidad',
        templateUrl: 'modules/homes/client/views/politica-privacidad.client.view.html',
        controller: 'HomeContactController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Politica y Privacidad'
        }
      })
      .state('homes.registersuccess', {
        url: 'register/success',
        templateUrl: 'modules/homes/client/views/home-register-success.client.view.html',
        controller: 'HomeContactController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Contáctanos'
        }
      })
      .state('homes.comojuego', {
        url: 'como-juego',
        templateUrl: 'modules/homes/client/views/comojuego.client.view.html',
        controller: 'HomesListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Cómo Juego'
        }
      })
      .state('home.register', {
        url: 'registrar',
        templateUrl: 'modules/homes/client/views/home-register.client.view.html',
        controller: 'AuthenticationController',
        controllerAs: 'vm',
        resolve: {
          detalle_subastaResolve: getHomeDetails
        },
        data: {
          pageTitle: '{{ detalle_subastaResolve.titulo }}'
        }
      })
      .state('homes.details', {
        url: 'detalles/:detalle_subastaId',
        templateUrl: 'modules/homes/client/views/home-details.client.view.html',
        controller: 'Home_DetailsController',
        controllerAs: 'vm',
        resolve: {
          detalle_subastaResolve: getHomeDetails
        },
        data: {
          pageTitle: 'Detalle de subasta {{ detalle_subastaResolve.titulo }}'
        }
      })
      .state('homes.charge', {
        url: 'charge',
        templateUrl: 'modules/homes/client/views/home-charge.client.view.html',
        controller: 'HomeChargeController',
        controllerAs: 'vm'
      })
      .state('homes.success', {
        url: 'charge/success',
        templateUrl: 'modules/homes/client/views/home-charge-success.client.view.html',
        controller: 'HomeSuccessController',
        controllerAs: 'vm'
      })
      .state('homes.cancel', {
        url: 'charge/cancel',
        templateUrl: 'modules/homes/client/views/home-charge-cancel.client.view.html',
        controllerAs: 'vm'
      })
      .state('homes.balance', {
        url: 'historial-saldo',
        templateUrl: 'modules/homes/client/views/home-account-balance.client.view.html',
        controller: 'HomeAccountController',
        controllerAs: 'vm'
      })
      .state('homes.settings', {
        url: 'mis-datos',
        templateUrl: 'modules/homes/client/views/home-account-settings.client.view.html',
        controller: 'HomeAccountController',
        controllerAs: 'vm'
      })
      .state('homes.referrals', {
        url: 'invitados',
        templateUrl: 'modules/homes/client/views/home-account-referrals.client.view.html',
        controller: 'ReferralController',
        controllerAs: 'vm'
      })
      .state('homes.address', {
        url: 'mis-direcciones',
        templateUrl: 'modules/homes/client/views/home-account-address.client.view.html',
        controller: 'HomeDataController',
        controllerAs: 'vm'
      })
      .state('homes.payments', {
        url: 'subastas-por-pagar',
        templateUrl: 'modules/homes/client/views/home-account-payments.client.view.html',
        controller: 'HomeSummaryAccountController',
        controllerAs: 'vm'
      })
      .state('homes.summary', {
        url: 'resumen',
        templateUrl: 'modules/homes/client/views/home-account-summary.client.view.html',
        controller: 'HomeSummaryAccountController',
        controllerAs: 'vm'
      })
      .state('homes.won', {
        url: 'subastas-ganadas',
        templateUrl: 'modules/homes/client/views/home-account-won-auctions.client.view.html',
        controller: 'HomeSummaryAccountController',
        controllerAs: 'vm'
      })
      .state('homes.landing', {
        url: 'landing',
        templateUrl: 'modules/homes/client/views/landing.client.view.html',
        controller: 'Landing_Users',
        controllerAs: 'vm'
      });
  }

  getHomeDetails.$inject = ['$stateParams', 'Home_Details'];

  function getHomeDetails($stateParams, Home_Details) {
    return Home_Details.get({
      detalle_subastaId: $stateParams.detalle_subastaId
    }).$promise;
  }

  newDetalle_subasta.$inject = ['Home_Details'];

  function newDetalle_subasta(Home_Details) {
    return new Home_Details();
  }

}());
