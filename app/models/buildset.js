import Model, { attr, hasMany } from '@ember-data/model';

// Note: dup with build.js
export default class BuildsetModel extends Model {
  @attr duration;
  @attr result;
  @attr uuid;
}
