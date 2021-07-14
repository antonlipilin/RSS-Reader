import axios from 'axios';
import * as yup from 'yup';
import _ from 'lodash';
import watcher from './view.js';
import rssParser from './rssParser.js';

const validate = (url) => {
  const schema = yup.string().url();

  try {
    schema.validateSync(url);
    return [];
  } catch {
    return ['invalid url'];
  }
};

const updateValidationState = (watchedState, value) => {
  const errors = validate(value);
  const hasNoErrors = _.isEqual(errors, []);

  if (hasNoErrors) {
    if (watchedState.form.urls.has(value)) {
      watchedState.form.validationErrors = ['not unique url'];
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
      errors: [],
      validationErrors: [],
      urls: new Set(),
      feeds: [],
      posts: [],
      currentId: 1,
    },
  };

  const watchedState = watcher(state);

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
    axios.get(`https://api.allorigins.win/get?url=${encodeURIComponent(`${inputValue}`)}`)
      .then((response) => {
        const { title, posts } = generateId(watchedState, rssParser(response.data.contents));

        watchedState.form.feeds.push(title);
        watchedState.form.posts = watchedState.form.posts.concat(posts);
        watchedState.form.errors = [];
        watchedState.form.urls.add(inputValue);
        watchedState.form.processState = 'success';
      })
      .catch((error) => {
        if (error.message === 'Invalid RSS') {
          watchedState.form.errors = ['invalid rss'];
        } else {
          watchedState.form.errors = ['network problem'];
        }
        watchedState.form.processState = 'failed';
      });
  });
};
