'use strict';

/**
 * Module dependencies
 */
var detalle_subastasPolicy = require('../policies/detalle_subastas.server.policy'),
  detalle_subastas = require('../controllers/detalle_subastas.server.controller');

module.exports = function (app) {
  // Detalle_subastas collection routes
  app.route('/api/detalle_subastas').all(detalle_subastasPolicy.isAllowed)
    .get(detalle_subastas.list)
    .post(detalle_subastas.create);

  // Single detalle_subasta routes
  app.route('/api/detalle_subastas/:detalle_subastaId').all(detalle_subastasPolicy.isAllowed)
    .get(detalle_subastas.read)
    .put(detalle_subastas.update)
    .delete(detalle_subastas.delete);

  app.route('/api/subastas/:statusId')
    .get(detalle_subastas.readforStatus);

  app.route('/api/detalle_subasta/:detalle_subastaId')
      .put(detalle_subastas.updateTimer);

  app.route('/api/detalle_subasta_tipo/:detalle_subastaId').all(detalle_subastasPolicy.isAllowed)
      .put(detalle_subastas.updateType);

  app.route('/api/auctions/process/:auctionStatus').all(detalle_subastasPolicy.isAllowed)
      .get(detalle_subastas.readListAuctionsAndProcess);

  app.route('/api/auctions/fiveprocess/:auctionId').all(detalle_subastasPolicy.isAllowed)
      .get(detalle_subastas.readListAuctionsAndProcess);

  app.route('/api/auctionswon/:userId')
      .get(detalle_subastas.getAuctionByUserId);

  app.route('/api/auctionswonskip')
      .post(detalle_subastas.getAuctionSkipByUserId);

  app.route('/api/banusers/:userId')
      .put(detalle_subastas.banUser);

  app.route('/api/unbanusers/:userId')
      .put(detalle_subastas.unbanUser);

  app.route('/api/getnext')
      .get(detalle_subastas.getNext);

  app.route('/api/getnext5')
      .get(detalle_subastas.getNext5);

  app.route('/api/subastas_month/threemonths')
      .get(detalle_subastas.threeMonths);

  app.route('/api/subastas_month/sixmonths')
      .get(detalle_subastas.sixMonths);

  app.route('/api/search/:text')
      .get(detalle_subastas.listData);

  app.route('/api/lastfifteen')
    .get(detalle_subastas.listLastFifteen);

  app.route('/api/getauctionforcategorie/:idcategorie')
    .get(detalle_subastas.listForCategorie);

  app.route('/api/featured')
    .get(detalle_subastas.listFeatured);

  app.route('/api/listfortype')
    .post(detalle_subastas.listForType);

  app.route('/api/payandsend')
    .post(detalle_subastas.payAndSend);

  // Finish by binding the detalle_subasta middleware
  app.param('detalle_subastaId', detalle_subastas.detalle_subastaByID);
  app.param('statusId', detalle_subastas.listForStatus);
  app.param('auctionStatus', detalle_subastas.listAuctionsAndProcess);
  app.param('auctionId', detalle_subastas.listFiveAuctionsAndProcess);
  app.param('text', detalle_subastas.customizedSearch);
};
