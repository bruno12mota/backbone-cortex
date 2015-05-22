import _ from 'lodash';

export default class Route {
  constructor (route, options, handlers, Cortex) {
    this.route = route;
    this.options = options || {};
    this.handlers = handlers;
    this.Cortex = Cortex;
  }

  tokenizeQueryString (qs) {
    qs = qs || '';

    if(!qs.length || (qs.length === 1 && qs[0] === '?')){
      return {};
    }

    qs = qs.replace(/^\?/, '');
    qs = qs.split('&');

    var params = {};
    _.reduce(qs, function(parms, param){
      param = param.split('=');

      params[param[0]] = param[1];
      return params;
    }, params);

    return params;
  }

  getOptions () {
    return this.options || {};
  }

  tokenizeUrlParams (parameters) {
    var params = {};
    parameters = _.filter(parameters, function(a){ return !!a; });

    var tokenNames = _.map(this.route.match(/(:[^\/|\*]+)/g), function(r){
      return r.substring(1).replace(/[\(\)]/g, '');
    });

    _.reduce(tokenNames, function(params, token, index){
      params[token] = parameters[index] || undefined;
      return params;
    }, params);
    return params || {};
  }

  getHandler () {
    var self = this;

    return function(){

      var routeStack = [].concat(self.Cortex.getMiddlewares()).concat(self.handlers);

      if(!routeStack.length){
        return;
      }
      var args = _.values(arguments);

      var scope = {
        query: self.tokenizeQueryString(args.pop()),
        params: self.tokenizeUrlParams(args),
        options: self.getOptions(),
        Route: self,
        data: {}
      };

      var processNext = function () {
        var optionalArguments = _.values(arguments) || [];

        if(!routeStack.length){
          return self.Cortex.trigger('afterRoute', scope);
        }

        var current = routeStack.shift();

        if(typeof current !== 'function'){
          return;
        }
        try {
          var next = function(err){
            if(err){
              return self.Cortex.trigger('error', err, scope, self);
            }

            processNext(_.values(arguments).slice(1));
          };

          var routeArgs = _.flatten([scope, next].concat(optionalArguments));
          current.apply(this, routeArgs);
        } catch(e){
          self.Cortex.trigger('error', e, scope, self);
        }
      };
      processNext();

    };
  }

  getRoute () {
    return this.route;
  }
}
