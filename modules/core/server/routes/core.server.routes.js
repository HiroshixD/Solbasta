'use strict';

module.exports = function (app) {
  // Root routing
  var core = require('../controllers/core.server.controller');
  var user = require('../controllers/user.server.controller');
  var subasta = require('../controllers/subasta.server.controller');

  // Define error pages
  app.route('/server-error').get(core.renderServerError);

  // Return a 404 for all undefined api, module or lib routes
  app.route('/:url(api|modules|lib)/*').get(core.renderNotFound);

  // Define application route
  app.route('/').get(core.renderSolBastaIndex);
  app.route('/password/').get(core.renderSolBastaIndex);
  app.route('/password/*').get(core.renderSolBastaIndex);
  app.route('/detalles').get(core.renderSolBastaIndex);
  app.route('/charge').get(core.renderSolBastaIndex);
  app.route('/user').get(core.renderSolBastaIndex);
  app.route('/historial-saldo').get(core.renderSolBastaIndex);
  app.route('/resumen').get(core.renderSolBastaIndex);
  app.route('/subastas-ganadas').get(core.renderSolBastaIndex);
  app.route('/mis-datos').get(core.renderSolBastaIndex);
  app.route('/invitados').get(core.renderSolBastaIndex);
  app.route('/contacto').get(core.renderSolBastaIndex);
  app.route('/mis-direcciones').get(core.renderSolBastaIndex);
  app.route('/subastas-por-pagar').get(core.renderSolBastaIndex);
  app.route('/charge/*').get(core.renderSolBastaIndex);
  app.route('/detalles/*').get(core.renderSolBastaIndex);
  app.route('/not-found').get(core.renderHomeIndex);
  app.route('/bad-request').get(core.renderHomeIndex);
  app.route('/forbidden').get(core.renderHomeIndex);
  app.route('/admin/').get(core.renderAdminIndex);
  app.route('/admin/*').get(core.renderAdminIndex);
  app.route('/landing').get(core.renderLandingIndex);
  app.route('/categorias/*').get(core.renderSolBastaIndex);
  app.route('/tipos-subasta').get(core.renderSolBastaIndex);
  app.route('/informacion-soporte').get(core.renderSolBastaIndex);
  app.route('/terminos-condiciones').get(core.renderSolBastaIndex);
  app.route('/politica-privacidad').get(core.renderSolBastaIndex);
  app.route('/preguntas-frecuentes').get(core.renderSolBastaIndex);
  app.route('/reclamos').get(core.renderSolBastaIndex);


  //  USUARIO
/*  app.route('/user/').get(user.renderUserIndex);
  app.route('/user/*').get(user.renderUserIndex);*/

  //  SUBASTAS
  app.route('/terminadas').get(subasta.renderSubastaTerminadas);
  app.route('/proximas').get(subasta.renderSubastaProximas);
  app.route('/en-vivo').get(subasta.renderSubastaEnVivo);

  //  HOME
  app.route('/categorias').get(core.renderSolBastaIndex);
  app.route('/como-juego').get(core.renderSolBastaIndex);
  app.route('/testimonios').get(core.renderSolBastaIndex);
  app.route('/login').get(core.renderSolBastaIndex);
  app.route('/register').get(core.renderSolBastaIndex);
  app.route('/register/success').get(core.renderSolBastaIndex);

  //  ERROR 404
  app.route('*').get(core.renderServerError404);
};
