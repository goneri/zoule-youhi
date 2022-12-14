import EmberRouter from '@ember/routing/router';
import config from 'zoule-youhi/config/environment';

export default class Router extends EmberRouter {
  location = config.locationType;
  rootURL = config.rootURL;
}

Router.map(function () {
  this.route('amazon', function () {
    this.route('aws', function () {
      this.route('target', { path: '/target/:name' });
    });
  });
  this.route('build', { path: '/build/:uuid' });
  this.route('buildset', { path: '/buildset/:uuid' });
});
