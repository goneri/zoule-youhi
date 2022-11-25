// See: https://guides.emberjs.com/v4.8.0/models/customizing-adapters/#toc_pluralization-customization
import Inflector from 'ember-inflector';

export function initialize(/* application */) {
  const inflector = Inflector.inflector;

  inflector.uncountable('build');
  inflector.uncountable('buildset');
}

export default {
  name: 'custom-inflector-rules',
  initialize
};
