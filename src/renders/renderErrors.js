import _ from 'lodash';

export default (errors) => {
  const errorMessages = {
    'invalid rss': 'Ресурс не содержит валидный RSS',
    'network problem': 'Ошибка сети',
  };

  if (_.isEmpty(errors)) {
    return;
  }
  const feedbackContainer = document.querySelector('.feedback');
  const errorMessage = errorMessages[_.first(errors)];
  feedbackContainer.classList.replace('text-success', 'text-danger');
  feedbackContainer.textContent = errorMessage;
};
