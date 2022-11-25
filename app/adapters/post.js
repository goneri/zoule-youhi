import ApplicationAdapter from "./application";

// No need to reload again and again our static data
export default class PostAdapter extends ApplicationAdapter {
  shouldReloadRecord(store, snapshot) {
    return false;
  }

  shouldBackgroundReloadRecord(store, snapshot) {
    return false;
  }
}
