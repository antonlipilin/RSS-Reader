export default (html) => {
  const parser = new DOMParser();
  const data = parser.parseFromString(html, 'text/xml');
  const firstEl = data.firstElementChild;
  const elemHasRss = firstEl.tagName === 'rss';
  if (elemHasRss) {
    const htmlObject = {
      title: {},
      posts: [],
    };
    const chanel = firstEl.firstElementChild;

    const titleEl = chanel.querySelector('title');
    const descriptionEl = chanel.querySelector('description');
    const feedTitle = titleEl.textContent;
    const feedDescription = descriptionEl.textContent;
    htmlObject.title = { feedTitle, feedDescription };

    const items = chanel.querySelectorAll('item');
    items.forEach((item) => {
      const itemTitle = item.querySelector('title');
      const itemLink = item.querySelector('link');
      const itemDescription = item.querySelector('description');
      const guid = item.querySelector('guid');

      const postTitle = itemTitle.textContent;
      const postLink = itemLink.textContent;
      const postDescription = itemDescription.textContent.trim();
      const postId = guid.textContent;
      const post = {
        postTitle, postLink, postDescription, postId,
      };
      htmlObject.posts.push(post);
    });
    return htmlObject;
  }

  throw new Error('Invalid RSS');
};
