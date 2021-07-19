import * as yup from 'yup';
import _ from 'lodash';

const validate = (url) => {
  const schema = yup.string().url();

  try {
    schema.validateSync(url);
    return [];
  } catch {
    return ['form.invalidUrl'];
  }
};

export default (watchedState, value) => {
  const errors = validate(value);
  const hasNoErrors = _.isEqual(errors, []);

  if (hasNoErrors) {
    if (watchedState.form.urls.has(value)) {
      watchedState.form.validationErrors = ['form.notUniqueUrl'];
    } else {
      watchedState.form.validationErrors = [];
    }
  } else {
    watchedState.form.validationErrors = errors;
  }
};
