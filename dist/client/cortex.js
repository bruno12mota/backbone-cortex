'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _backbone = require('backbone');

var _backbone2 = _interopRequireDefault(_backbone);

var _route2 = require('./route');

var _route3 = _interopRequireDefault(_route2);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var Cortex = (function () {
	function Cortex() {
		_classCallCheck(this, Cortex);

		this.middlewares = [];
		this.routes = [];
	}

	_createClass(Cortex, [{
		key: 'use',
		value: function use(fn) {
			if (typeof fn === 'function') {
				this.middlewares.push(fn);
			}
		}
	}, {
		key: 'getMiddlewares',
		value: function getMiddlewares() {
			return this.middlewares || [];
		}
	}, {
		key: 'route',
		value: function route(_route) {
			var args = _lodash2['default'].values(arguments);

			if (args.length < 2 || args.length === 2 && _lodash2['default'].isPlainObject(args[1])) {
				return console.warn('Missing arguments; Cortex.route(route[, options], fn...)');
			}

			var options = {};
			if (_lodash2['default'].isPlainObject(args[1])) {
				options = args[1];
				args = args.slice(1);
			}

			this.routes.push(new _route3['default'](_route, options, args.slice(1), this));
		}
	}, {
		key: 'getRoutes',
		value: function getRoutes(cb) {
			var routes = {};

			_lodash2['default'].reduce(this.routes, function (routes, r) {
				routes[r.getRoute()] = r.getHandler();
				return routes;
			}, routes);
			return routes;
		}
	}]);

	return Cortex;
})();

exports['default'] = Cortex;

Cortex.prototype = Object.create(_backbone2['default'].Events);
module.exports = exports['default'];