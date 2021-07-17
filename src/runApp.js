import axios from 'axios';
import * as yup from 'yup';
import _ from 'lodash';
import i18next from 'i18next';
import watcher from './view.js';
import rssParser from './rssParser.js';
import ru from './locales/ru.js';

const validate = (url) => {
  const schema = yup.string().url();

  try {
    schema.validateSync(url);
    return [];
  } catch {
    return ['form.invalidUrl'];
  }
};

const updateValidationState = (watchedState, value) => {
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

        watchedState.form.feeds.push(title);
        watchedState.form.posts = posts.concat(watchedState.form.posts);
        watchedState.form.loadingErrors = [];
        watchedState.form.urls.add(inputValue);
        watchedState.form.processState = 'success';
      })
      .catch((error) => {
        if (error.message === 'Invalid RSS') {
          watchedState.form.loadingErrors = ['form.invalidRss'];
        } else {
          watchedState.form.loadingErrors = ['form.networkProblem'];
        }
        watchedState.form.processState = 'failed';
      });
  });
};
