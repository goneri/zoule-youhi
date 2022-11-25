import Model, { attr, hasMany } from '@ember-data/model';

// Note: dup with build.js
export default class BuildsModel extends Model {
  @attr duration;
  @attr result;
  @attr uuid;
  @attr buildset;
  //@belongsTo('buildset', {async: true, inverse: 'builds'}) buildset;
}
