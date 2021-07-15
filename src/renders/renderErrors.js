import _ from 'lodash';

export default (instance, errors) => {
  if (_.isEmpty(errors)) {
    return;
  }
  const feedbackContainer = document.querySelector('.feedback');
  const error = _.first(errors);
  feedbackContainer.classList.replace('text-success', 'text-danger');
  feedbackContainer.textContent = instance.t(error);
};
