import Backbone from 'backbone';
import Route from './route';
import _ from 'lodash';

var merge = _.merge;

export default class Cortex {
	constructor () {
		this.middlewares = [];
		this.routes = [];
	}

	use (fn) {
		if(typeof fn === 'function'){
			this.middlewares.push(fn);
		}
	}

	getMiddlewares () {
		return this.middlewares || [];
	}

	route (route) {
		var args = _.values(arguments);

		if(args.length < 2 || (args.length === 2 && _.isPlainObject(args[1]))) {
			return console.warn('Missing arguments; Cortex.route(route[, options], fn...)');
		}

		var options = {};
		if(_.isPlainObject(args[1])){
			options = args[1];
			args = args.slice(1);
		}

		this.routes.push(new Route(route, options, args.slice(1), this));
	}

	getRoutes (cb) {
		var routes = {};

		_.reduce(this.routes, function(routes, r){
			routes[r.getRoute()] = r.getHandler();
			return routes;
		}, routes);
		return routes;
	}
}

merge(Cortex.prototype, Backbone.Events);
