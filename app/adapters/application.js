import RESTAdapter from '@ember-data/adapter/rest';

export default class ApplicationAdapter extends RESTAdapter {
  namespace = 'zuul/api';
  host = 'https://ansible.softwarefactory-project.io';
}
