import Model, { attr, belongsTo } from '@ember-data/model';

export default class BuildsModel extends Model {
  @attr duration;
  @attr result;
  @attr uuid;
  @attr buildset;
  //@belongsTo('buildset', {async: true, inverse: 'builds'}) buildset;
}
