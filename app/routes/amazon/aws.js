import Route from '@ember/routing/route';
import { service } from '@ember/service';
import RSVP from 'rsvp';

export default class AmazonAwsRoute extends Route {
  @service store;

  get_active_jobs() {
    // Return the jobs from the last run, without build-ansible-collection
    return this.store.query('buildset',
                            {
                              project: 'ansible-collections/amazon.aws',
                              limit: 1,
                              result: ["SUCCESS", "FAILURE"],
                              pipeline: 'periodic'})
               .then((buildsets) => {
                 const buildset_uuid = buildsets[0].uuid;
                 return fetch(`https://ansible.softwarefactory-project.io/zuul/api/buildset/${buildset_uuid}`)
                   .then((response) => response.json())
                   .then(
                     buildset => {
                       const builds = buildset.builds;
                       const job_names = builds.map((job) => job.job_name).filter(n => !["build-ansible-collection"].includes(n));
                       return job_names;
                     })
                   .catch(err => {
                     console.log('Error: ', err.message);
                   });
               }
                    )
  }

  model() {
    let active_jobs = this.get_active_jobs().then((active_jobs) => {
      return active_jobs.sort().map((job_name) => {
        return {
          name: job_name.split("target-")[1],
          last_builds: this.store.query('build', {job_name: job_name, limit: 7, result: ["SUCCESS", "FAILURE", "TIMED_OUT"]})
        }
      })
    })
    return RSVP.hash({
      active_jobs: active_jobs,
    });

  }
}
