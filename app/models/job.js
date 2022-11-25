import Model, { attr } from '@ember-data/model';

export default class JobModel extends Model {
  @attr name;
}
