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


  async fetch_log(log_base_url) {
    return fetch(`${log_base_url}/job-output.txt`)
      .then((raw_log) => raw_log.text())
      .then((log_text) => {
        return log_text.split("\n").map(line => {
          const splitted = line.split(" ");
          const text_timestamp = splitted.slice(0,2).join(" ");
          const ts = Date.parse(text_timestamp);
          return {timestamp: ts, text: splitted.slice(3).join(" ")}})
      })
  }

  async parse_logs(lines) {
    const startup_idx = 0;
    const ansible_test_startup_idx =  lines.findIndex((line) => line.text.startsWith("About to run: ansible-test"));
    const post_run_startup_idx =  lines.findIndex((line) => line.text.startsWith("POST-RUN START: "));

    return(
      {
        startup_timestamp: lines[startup_idx].timestamp,
        startup_duration: (lines[ansible_test_startup_idx].timestamp - lines[startup_idx].timestamp) / 1000,
        ansible_test_duration: (lines[post_run_startup_idx].timestamp - lines[startup_idx].timestamp) / 1000
      }
    )
  }

  async get_graph_data(job_name, project, branch) {
    const timeout = await this.get_timeout(job_name, project, branch);
    //    return this.get_timeout(job_name, project, branch)
    //      .then((new_timeout) => {
    //        timeout = new_timeout;
    return this.store.query('build', {
      job_name: job_name,
      pipeline: 'periodic',
      result: ["SUCCESS", "FAILURE", "TIMED_OUT"],
      limit: 10,
    })
               .then(async (builds) => {
                 const builds_with_duration = builds.map(async (build) => {
                   if (build.log_url === null) {
                     throw {message: `build ${build.uuid} has no log yet.`};
                   }

                   return this.fetch_log(build.log_url).then((lines) =>
                     this.parse_logs(lines)
                   )});
                 const durations = await Promise.all(builds_with_duration);

                 const column_date = ['x'].concat(
                   durations.map((d) => d.startup_timestamp
                          ));
                 const column_setup_data = ['set-up duration (seconds)'].concat(
                   durations.map((d) => d.startup_duration.toFixed(0)
                          ));
                 const column_ansible_test_data = ['test duration (seconds)'].concat(
                   durations.map((d) => d.ansible_test_duration.toFixed(0)
                          ));
                 const column_target_timeout = ['timeout + set-up duration'].concat(
                   durations.map((d) => (d.startup_duration + timeout).toFixed(0)
                          ));

                 const column_hard_timeout = ['hard timeout (1h)'].concat(
                   durations.map((d) => 3600
                          ));
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
                   columns: [
                     column_date,
                     column_setup_data,
                     column_ansible_test_data,
                     column_target_timeout,
                     //column_hard_timeout
                   ],
                   types: {
                     'set-up duration (seconds)': 'area',
                     'test duration (seconds)': 'area',
                     'timeout + set-up duration': 'line',
                     // 'hard timeout (1h)': 'line'
                   },
                 };
                 const final = {
                   data: data,
                   axis: axis,
                 };
                 return final;
               }).catch((e) => console.log(e.message));
  }

  async model(params) {
    const job_name = params.name.startsWith('integration-amazon.aws-') ? params.name : `integration-amazon.aws-target-${params.name}`;
    const last_build = await this.store.query('build', {
      job_name: job_name,
      pipeline: 'periodic',
      result: ["SUCCESS", "FAILURE", "TIMED_OUT"],
      limit: 1,
    }).then((builds) => {return builds[0]});
    return RSVP.hash({
      build: last_build,
      graph: this.get_graph_data(job_name, last_build.project, last_build.branch),
    });
  }
}
