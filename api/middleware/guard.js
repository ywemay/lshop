// const guard = require('express-jwt-permissions')();
var get = require('lodash.get')

var UnauthorizedError = require('./error')
var PermissionError = new UnauthorizedError(
  'permission_denied', { message: 'Permission denied' }
)

var Guard = function (options) {
  var defaults = {
    permissions: []
  };
  this._options = Object.assign({}, defaults, options)
}

function isArray (value) {
  return value instanceof Array
}
function isString (value) {
  return typeof value === 'string'
}

Guard.prototype = {
  check: function(required) {
    const _middleware = function _middleware (req, res, next) {

      var self = this
      var options = self._options
      var structure = options.permissions

      var roles = req.userData.roles

      if (!isArray(roles)) {
        return next(new UnauthorizedError('no_roles', {
          message: 'No roles available.'
        }))
      }
      var permissions = [];
      var buf;
      for (i in roles) {
        buf = get(structure, roles[i], undefined);
        if (buf) {
          buf = !Array.isArray(buf) ? buf.split(' ') : buf;
          for (j in buf) permissions.push(buf[j]);
        }
      }

      if (isString(required)) {
        required = [[required]]
      } else if (isArray(required) && required.every(isString)) {
        required = [required]
      }

      var sufficient = required.some(function (required) {
        return required.every(function (permission) {
          return permissions.indexOf(permission) !== -1
        })
      });

      next(!sufficient ? PermissionError : null);
    }.bind(this)

    _middleware.unless = require('express-unless')
    return _middleware
  }
}

module.exports = function(options) {
  return new Guard(options)
}
