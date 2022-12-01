import RESTAdapter from '@ember-data/adapter/rest';

export default class ApplicationAdapter extends RESTAdapter {
  namespace = 'zuul/api';
  host = 'https://ansible.softwarefactory-project.io';

  urlForQuery(query, modelName) {
    return super.urlForQuery(...arguments) + 's';
  }

  urlForFindAll(query, modelName) {
    return super.urlForFindAll(...arguments) + 's';
  }

  query(store, type, query) {
    let url = this.buildURL(type.modelName, null, null, 'query', query);

    // If we want to pass multiple result keys, Ember generates
    // result[]=foo&result[]=bar, Zuul actually expects result=foo&result=bar.
    if ("result" in query) {
      url += "?";
      url += query["result"].map(result => {return `result=${result}`}).join("&");
      delete query["result"];
    }

    return this.ajax(url, 'GET', { data: query });
  }
}
