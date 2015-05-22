'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var Route = (function () {
  function Route(route, options, handlers, Cortex) {
    _classCallCheck(this, Route);

    this.route = route;
    this.options = options || {};
    this.handlers = handlers;
    this.Cortex = Cortex;
  }

  _createClass(Route, [{
    key: 'tokenizeQueryString',
    value: function tokenizeQueryString(qs) {
      qs = qs || '';

      if (!qs.length || qs.length === 1 && qs[0] === '?') {
        return {};
      }

      qs = qs.replace(/^\?/, '');
      qs = qs.split('&');

      var params = {};
      _lodash2['default'].reduce(qs, function (parms, param) {
        param = param.split('=');

        params[param[0]] = param[1];
        return params;
      }, params);

      return params;
    }
  }, {
    key: 'getOptions',
    value: function getOptions() {
      return this.options || {};
    }
  }, {
    key: 'tokenizeUrlParams',
    value: function tokenizeUrlParams(parameters) {
      var params = {};
      parameters = _lodash2['default'].filter(parameters, function (a) {
        return !!a;
      });

      var tokenNames = _lodash2['default'].map(this.route.match(/(:[^\/|\*]+)/g), function (r) {
        return r.substring(1).replace(/[\(\)]/g, '');
      });

      _lodash2['default'].reduce(tokenNames, function (params, token, index) {
        params[token] = parameters[index] || undefined;
        return params;
      }, params);
      return params || {};
    }
  }, {
    key: 'getHandler',
    value: function getHandler() {
      var self = this;

      return function () {

        var routeStack = [].concat(self.Cortex.getMiddlewares()).concat(self.handlers);

        if (!routeStack.length) {
          return;
        }
        var args = _lodash2['default'].values(arguments);

        var scope = {
          query: self.tokenizeQueryString(args.pop()),
          params: self.tokenizeUrlParams(args),
          options: self.getOptions(),
          Route: self,
          data: {}
        };

        var processNext = function processNext() {
          var optionalArguments = _lodash2['default'].values(arguments) || [];

          if (!routeStack.length) {
            return self.Cortex.trigger('afterRoute', scope);
          }

          var current = routeStack.shift();

          if (typeof current !== 'function') {
            return;
          }
          try {
            var next = function next(err) {
              if (err) {
                return self.Cortex.trigger('error', err, scope, self);
              }

              processNext(_lodash2['default'].values(arguments).slice(1));
            };

            var routeArgs = _lodash2['default'].flatten([scope, next].concat(optionalArguments));
            current.apply(this, routeArgs);
          } catch (e) {
            self.Cortex.trigger('error', e, scope, self);
          }
        };
        processNext();
      };
    }
  }, {
    key: 'getRoute',
    value: function getRoute() {
      return this.route;
    }
  }]);

  return Route;
})();

exports['default'] = Route;
module.exports = exports['default'];