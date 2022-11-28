import Route from '@ember/routing/route';
import { service } from '@ember/service';
import RSVP from 'rsvp';

export default class BuildRoute extends Route {
  @service store;

  async model(params) {
    return RSVP.hash({
      build: this.store.findRecord('build', params.uuid),
    });
  }
}
