import _ from 'lodash';

export default (instance, errors) => {
  const feedbackContainer = document.querySelector('.feedback');
  const inputEl = document.querySelector('#url-input');

  if (_.isEmpty(errors)) {
    inputEl.classList.remove('is-invalid');
    feedbackContainer.textContent = '';
  } else {
    const error = _.first(errors);
    inputEl.classList.add('is-invalid');
    feedbackContainer.classList.replace('text-success', 'text-danger');
    feedbackContainer.textContent = instance.t(error);
  }
};
