'use strict';

/**
 * Module dependencies
 */
var acl = require('acl');

// Using the memory backend
acl = new acl(new acl.memoryBackend());

/**
 * Invoke Detalle_subastas Permissions
 */
exports.invokeRolesPolicies = function () {
  acl.allow([{
    roles: ['admin'],
    allows: [{
      resources: '/api/detalle_subastas',
      permissions: '*'
    }, {
      resources: '/api/detalle_subastas/:detalle_subastaId',
      permissions: '*'
    }, {
      resources: '/api/auctions/process/:auctionStatus',
      permissions: '*'
    }]
  }, {
    roles: ['user'],
    allows: [{
      resources: '/api/detalle_subastas',
      permissions: ['get', 'post']
    }, {
      resources: '/api/detalle_subastas/:detalle_subastaId',
      permissions: ['get']
    }, {
      resources: '/api/auctions/process/:auctionStatus',
      permissions: '*'
    }]
  }, {
    roles: ['guest'],
    allows: [{
      resources: '/api/detalle_subastas',
      permissions: ['get']
    }, {
      resources: '/api/detalle_subastas/:detalle_subastaId',
      permissions: ['get']
    }, {
      resources: '/api/auctions/process/:auctionStatus',
      permissions: '*'
    }]
  }]);
};

/**
 * Check If Detalle_subastas Policy Allows
 */
exports.isAllowed = function (req, res, next) {
  var roles = (req.user) ? req.user.roles : ['guest'];

  // If an detalle_subasta is being processed and the current user created it then allow any manipulation
  if (req.detalle_subasta && req.user && req.detalle_subasta.user && req.detalle_subasta.user.id === req.user.id) {
    return next();
  }

  // Check for user roles
  acl.areAnyRolesAllowed(roles, req.route.path, req.method.toLowerCase(), function (err, isAllowed) {
    if (err) {
      // An authorization error occurred
      return res.status(500).send('Unexpected authorization error');
    } else {
      if (isAllowed) {
        // Access granted! Invoke next middleware
        return next();
      } else {
        return res.status(403).json({
          message: 'User is not authorized'
        });
      }
    }
  });
};
