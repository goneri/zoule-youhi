import Route from '@ember/routing/route';
import { service } from '@ember/service';
import RSVP from 'rsvp';

export default class AmazonAwsBuildRoute extends Route {
  @service store;

  get_timeout(job_name, project, branch) {
    const target = job_name.split('target-')[1];
    const aliases_url = `https://raw.githubusercontent.com/${project}/${branch}/tests/integration/targets/${target}/aliases`;

    return fetch(aliases_url)
      .then((response) => response.text())
      .then((text) => {
        const candidates = text
          .split('\n')
          .filter((line) => line.startsWith('time='));
        console.log(candidates);
        if (candidates.length > 0) {
          const raw_value = candidates[0].split('=')[1];
          if (raw_value.charAt(raw_value.length - 1) == 'm') {
            return raw_value.substr(0, raw_value.length - 1) * 60;
          } else {
            return raw_value;
          }
        } else return 180;
      });
  }

  get_graph_data(job_name, project, branch) {
    var timeout;
    return this.get_timeout(job_name, project, branch)
      .then((new_timeout) => {
        timeout = new_timeout;
        return (
          timeout,
          this.store.query('builds', {
            job_name: job_name,
            pipeline: 'periodic',
            limit: 10,
          })
        );
      })
      .then((builds) => {
        const column_date = ['x'].concat(
          builds.map((build) => build.start_time.split('T')[0])
        );
        const column_data = ['duration (minutes)'].concat(
          builds.map((build) => build.duration / 60)
        );
        const column_max = ['timeout (minutes)'].concat(
          builds.map((build) => timeout / 60)
        );
        console.log(column_date);
        console.log(column_data);

        const axis = {
          x: {
            type: 'timeseries',
            tick: {
              format: '%Y-%m-%d',
            },
          },
        };

        const data = {
          x: 'x',
          columns: [column_date, column_data, column_max],
        };
        const final = {
          data: data,
          axis: axis,
        };
        console.log(final);
        return final;
      });
  }

  async model(params) {
    return RSVP.hash({
      build: this.store.findRecord('build', params.uuid),
      graph: this.store
        .findRecord('build', params.uuid)
        .then((build) => this.get_graph_data(build.job_name, build.project, build.branch)),
    });
  }
}
