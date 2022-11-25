import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class BuildsetRoute extends Route {
  @service store;

  async model(params) {
    return this.store.findRecord('buildset', params.uuid);
  }
}
