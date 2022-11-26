import DS from 'ember-data';
import { decamelize } from '@ember/string';

export default class ApplicationSerializer extends DS.JSONSerializer {
  primaryKey = 'uuid';
  normalizeFindRecordResponse(store, type, payload) {
    console.log(payload);
    console.log(type);
    console.log(payload.job_name);
    if (type.modelName == 'build' || type.modelName == 'builds') {
      return {
        data: {
          id: payload.uuid,
          type: type.modelName,
          attributes: {
            branch: payload.branch,
            buildset: payload.buildset.uuid,
            duration: payload.duration,
            end_time: payload.end_time,
            job_name: payload.job_name,
            log_url: payload.log_url,
            nodeset: payload.nodeset,
            project: payload.project,
            ref_url: payload.ref_url,
            result: payload.result,
            start_time: payload.start_time,
            uuid: payload.uuid,
          }
        }
        
      }
    }

    if (type.modelName == 'buildset') {
      return {
        data: {
          id: payload.uuid,
          type: type.modelName,
          attributes: {
            pipeline: payload.pipeline,
            result: payload.result,
            uuid: payload.uuid,
            builds: payload.builds,
          }
        }
        
      }
    }
  }
}
