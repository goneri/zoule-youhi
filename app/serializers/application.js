import DS from 'ember-data';
import { decamelize } from '@ember/string';

export default class ApplicationSerializer extends DS.JSONSerializer {
  primaryKey = 'uuid';
  normalizeFindRecordResponse(store, type, payload) {
    console.log(payload);
    console.log(type);
    if (type.modelName == 'build') {
      return {
        data: {
          id: payload.uuid,
          type: type.modelName,
          attributes: {
            buildset: payload.buildset.uuid,
            duration: payload.duration,
            job_name: type.job_name,
            result: payload.result,
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
