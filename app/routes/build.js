import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class BuildRoute extends Route {
  @service store;

  async model(params) {
    return this.store.findRecord('build', params.uuid);
  }
}
