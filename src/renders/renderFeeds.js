export default (feeds) => {
  const feedsContainer = document.querySelector('.feeds');
  const listItems = feeds.map((feed) => `<li class="list-group-item border-0 border-end-0">
    <h3 class="h6 m-0">${feed.feedTitle}</h3>
    <p class="m-0 small text-black-50">${feed.feedDescription}</p>
  </li>`).reverse().join('');
  const feedsList = `<ul class="list-group border-0 rounded-0">${listItems}</ul>`;
  const feedsContainerContent = `<div class="card border-0">
    <div class="card-body">
      <h2 class="card-title h4">Фиды</h2>
      ${feedsList}
    </div>
  </div>`;
  feedsContainer.innerHTML = feedsContainerContent;
};
