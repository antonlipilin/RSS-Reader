import axios from 'axios';
import _ from 'lodash';
import i18next from 'i18next';
import watcher from './view.js';
import rssParser from './rssParser.js';
import ru from './locales/ru.js';
import updatePosts from './updatePosts.js';
import updateValidationState from './updateValidationState.js';

const generateId = (watchedState, data) => {
  const { currentId } = watchedState.form;
  const { title, posts } = data;
  const titleWithId = { ...title, ...{ id: currentId } };
  const postsWithId = posts.map((post) => {
    const newPost = { ...post, ...{ feedId: currentId } };
    return newPost;
  });
  watchedState.form.currentId += 1;
  return { title: titleWithId, posts: postsWithId };
};

export default () => {
  const state = {
    form: {
      processState: 'filling',
      loadingErrors: [],
      validationErrors: [],
      urls: new Set(),
      feeds: [],
      posts: [],
      currentId: 1,
    },
    ui: {
      form: {
        shownElementId: null,
        visitedLinksIds: new Set(),
      },
    },
  };

  const instance = i18next.createInstance();
  instance.init({
    lng: 'ru',
    debug: true,
    resources: {
      ru,
    },
  });

  const watchedState = watcher(instance, state);
  const form = document.querySelector('.rss-form');
  const postsContainer = document.querySelector('.posts');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const inputValue = formData.get('url');
    updateValidationState(watchedState, inputValue);

    if (!_.isEmpty(watchedState.form.validationErrors)) {
      return;
    }

    watchedState.form.processState = 'sending';
    axios.get(`https://hexlet-allorigins.herokuapp.com/get?disableCache=true&url=${encodeURIComponent(`${inputValue}`)}`)
      .then((response) => {
        const { title, posts } = generateId(watchedState, rssParser(response.data.contents));

        watchedState.form.loadingErrors = [];
        watchedState.form.posts = posts.concat(watchedState.form.posts);
        watchedState.form.feeds.push(title);
        watchedState.form.urls.add(inputValue);
        watchedState.form.processState = 'success';
      })
      .then(() => updatePosts(watchedState, inputValue))
      .catch((error) => {
        console.log(error);
        if (error.message === 'Invalid RSS') {
          watchedState.form.loadingErrors = ['form.invalidRss'];
        } else {
          watchedState.form.loadingErrors = ['form.networkProblem'];
        }
        watchedState.form.processState = 'failed';
      });
  });

  postsContainer.addEventListener('click', (e) => {
    const targetEl = e.target;
    const targetElName = targetEl.tagName;
    const elemDataId = targetEl.dataset.id;
    switch (targetElName) {
      case 'A':
        watchedState.ui.form.visitedLinksIds.add(elemDataId);
        break;
      case 'BUTTON':
        watchedState.ui.form.visitedLinksIds.add(elemDataId);
        watchedState.ui.form.shownElementId = elemDataId;
        break;
      default:
        break;
    }
  });
};
