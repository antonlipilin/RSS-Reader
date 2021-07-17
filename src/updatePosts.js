import axios from 'axios';
import _ from 'lodash';
import rssParser from './rssParser.js';

const updatePosts = (watchedState, url) => {
  setTimeout(() => axios.get(`https://hexlet-allorigins.herokuapp.com/get?disableCache=true&url=${encodeURIComponent(`${url}`)}`)
    .then((response) => {
      const { posts } = rssParser(response.data.contents);
      const newPosts = _.differenceBy(posts, [...watchedState.form.posts], 'postId');
      watchedState.form.posts = newPosts.concat(watchedState.form.posts);
    })
    .catch((e) => {
      console.log(e);
    })
    .finally(() => {
      updatePosts(watchedState, url);
    }), 5000);
};

export default updatePosts;
