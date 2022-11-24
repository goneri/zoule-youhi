import Route from '@ember/routing/route';


function get_active_jobs() {
  // Return the jobs from the last run, without build-ansible-collection
  return fetch('https://ansible.softwarefactory-project.io/zuul/api/buildsets?project=ansible-collections/amazon.aws&pipeline=periodic&limit=1')
    .then((response) => response.json())
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

function get_last_results(job_name) {
  return fetch(
    `https://ansible.softwarefactory-project.io/zuul/api/builds?complete=true&job_name=${job_name}&limit=10`)
    .then((data) => {
      return data.json()
    }
         )
}

export default class AmazonAwsRoute extends Route {
  model() {
    return get_active_jobs().then((active_jobs) => {
      return active_jobs.map((job_name) => {
        return {
          name: job_name, last_builds: get_last_results(job_name)
        } 
      })
    });
  }
}
