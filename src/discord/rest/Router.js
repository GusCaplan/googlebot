const util = require('util');
const request = require('./APIRequest');
const Ratelimiter = require('./Ratelimiter');

const noop = () => {}; // eslint-disable-line no-empty-function
const methods = ['get', 'post', 'delete', 'patch', 'put'];
const reflectors = [
  'toString', 'valueOf', 'inspect', 'constructor',
  Symbol.toPrimitive, util.inspect.custom,
];

module.exports = function router(client) {

}

class Router {
  constructor(client) {
    this.client = client;
    this.ratelimiter = new Ratelimiter(this.client);
  }

  api() {
    const route = [''];
    const handler = {
      get(target, name) {
        if (reflectors.includes(name)) return () => route.join('/');
        if (methods.includes(name)) {
          return options => this.ratelimiter.queue(name, router.join('/'), options);
        }
        route.push(name);
        return new Proxy(noop, handler);
      },
      apply(target, _, args) {
        route.push(...args.filter(x => x != null)); // eslint-disable-line eqeqeq
        return new Proxy(noop, handler);
      },
    };
    return new Proxy(noop, handler);
  }
}
