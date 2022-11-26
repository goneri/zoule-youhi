import Model, { attr, belongsTo } from '@ember-data/model';

// How can we only use the model from build.js?
export default class BuildsModel extends Model {
  @attr branch;
  @attr buildset;
  @attr duration;
  @attr end_time;
  @attr job_name;
  @attr log_url;
  @attr nodeset;
  @attr project;
  @attr result;
  @attr start_time;
  @attr uuid;
  //@belongsTo('buildset', {async: true, inverse: 'builds'}) buildset;
}
