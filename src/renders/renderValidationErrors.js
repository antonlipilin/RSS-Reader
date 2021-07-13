import _ from 'lodash';

export default (errors) => {
  const validationMessages = {
    'not unique url': 'RSS уже существует',
    'invalid url': 'Ссылка должна быть валидным URL',
  };

  const feedbackContainer = document.querySelector('.feedback');
  const inputEl = document.querySelector('#url-input');

  if (_.isEmpty(errors)) {
    inputEl.classList.remove('is-invalid');
    feedbackContainer.textContent = '';
  } else {
    const error = _.first(errors);
    inputEl.classList.add('is-invalid');
    feedbackContainer.classList.replace('text-success', 'text-danger');
    feedbackContainer.textContent = validationMessages[error];
  }
}