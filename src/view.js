import onChange from 'on-change';
import renderValidationErrors from './renders/renderValidationErrors.js';
import renderErrors from './renders/renderErrors.js';
import renderFeeds from './renders/renderFeeds.js';
import renderPosts from './renders/renderPosts.js';

const elements = {
  submitButton: document.querySelector('[aria-label="add"]'),
  feedbackContainer: document.querySelector('.feedback'),
  form: document.querySelector('.rss-form'),
  urlInput: document.querySelector('#url-input'),
};

const processStateHandler = (instance, processState) => {
  switch (processState) {
    case 'filling':
      elements.urlInput.focus();
      elements.submitButton.disabled = false;
      break;
    case 'sending':
      elements.submitButton.disabled = true;
      elements.feedbackContainer.textContent = '';
      break;
    case 'success':
      elements.submitButton.disabled = false;
      elements.form.reset();
      elements.feedbackContainer.classList.replace('text-danger', 'text-success');
      elements.feedbackContainer.textContent = instance.t('form.success');
      elements.urlInput.focus();
      break;
    case 'failed':
      elements.submitButton.disabled = false;
      break;
    default:
      throw new Error(`Unknown state: ${processState}`);
  }
};

const visitedLinksIdsHandler = (visitedLinksIds) => {
  visitedLinksIds.forEach((link) => {
    const visitedLink = document.querySelector(`[data-id="${link}"]`);
    visitedLink.classList.remove('fw-bold');
    visitedLink.classList.add('fw-normal', 'link-secondary');
  });
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
        renderPosts(watchedState, instance, value);
        break;
      case 'form.feeds':
        renderFeeds(value);
        break;
      case 'ui.form.visitedLinksIds':
        visitedLinksIdsHandler(value);
        break;
      default:
        break;
    }
  });
  return watchedState;
};
