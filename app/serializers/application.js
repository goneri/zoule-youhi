import DS from 'ember-data';

export default class ApplicationSerializer extends DS.JSONSerializer {
  primaryKey = 'uuid';

  normalize(typeClass, payload) {
    if (typeClass.modelName == 'build') {
      payload.attributes = {
        branch: payload.branch,
        //buildset: payload.buildset.uuid,
        duration: payload.duration,
        end_time: payload.end_time,
        job_name: payload.job_name,
        log_url: payload.log_url,
        nodeset: payload.nodeset,
        project: payload.project,
        ref_url: payload.ref_url,
        result: payload.result,
        start_time: payload.start_time,
        id: payload.uuid,
        uuid: payload.uuid,
      };
      // Not really sure why we've got to do that
      // and why the buildset from 'attributes'
      // is not required
      payload.buildset = payload.buildset.uuid;
    }
    if (typeClass.modelName == 'buildset') {
      payload.attributes = {
        pipeline: payload.pipeline,
        result: payload.result,
        id: payload.uuid,
        uuid: payload.uuid,
      };
    }
    return super.normalize(typeClass, payload);
  }
}
