import onChange from 'on-change';
import renderValidationErrors from './renders/renderValidationErrors.js';
import renderErrors from './renders/renderErrors.js';
import renderFeeds from './renders/renderFeeds.js';
import renderPosts from './renders/renderPosts.js';

const processStateHandler = (instance, processState) => {
  const submitButton = document.querySelector('[aria-label="add"]');
  const feedbackContainer = document.querySelector('.feedback');
  const form = document.querySelector('.rss-form');
  const urlInput = document.querySelector('#url-input');
  switch (processState) {
    case 'filling':
      urlInput.focus();
      submitButton.disabled = false;
      break;
    case 'sending':
      submitButton.disabled = true;
      feedbackContainer.textContent = '';
      break;
    case 'success':
      submitButton.disabled = false;
      form.reset();
      feedbackContainer.classList.replace('text-danger', 'text-success');
      feedbackContainer.textContent = instance.t('form.success');
      urlInput.focus();
      break;
    case 'failed':
      submitButton.disabled = false;
      break;
    default:
      throw new Error(`Unknown state: ${processState}`);
  }
};

export default (instance, state) => {
  const watchedState = onChange(state, (path, value, previousValue) => {
    console.log('PATH IS  !!!!', path);
    console.log('VALUE IS  !!!', value);
    console.log('PREVIOUS VALUE IS', previousValue);
    switch (path) {
      case 'form.validationErrors':
        renderValidationErrors(instance, value);
        break;
      case 'form.processState':
        processStateHandler(instance, value);
        break;
      case 'form.loadingErrors':
        renderErrors(instance, value);
        break;
      case 'form.posts':
        renderPosts(value);
        break;
      case 'form.feeds':
        renderFeeds(value);
        break;
      default:
        break;
    }
  });
  return watchedState;
};
