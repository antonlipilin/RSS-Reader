export default (watchedState, instance, posts) => {
  const postsContainer = document.querySelector('.posts');
  const listItems = posts.map((post) => {
    const isVisitedLink = watchedState.ui.form.visitedLinksIds.has(post.postId);
    const linkClasslist = isVisitedLink ? 'fw-normal link-secondary' : 'fw-bold';
    return `<li class="list-group-item d-flex justify-content-between align-items-start border-0 border-end-0">
  <a href="${post.postLink}" class="${linkClasslist}" data-id="${post.postId}" target="_blank" rel="noopener noreferrer">${post.postTitle}</a>
  <button type="button" class="btn btn-outline-primary btn-sm" data-id="${post.postId}" data-bs-toggle="modal" data-bs-target="#modal">${instance.t('showPost')}</button></li>`;
  }).join('');
  const postsList = `<ul class="list-group border-0 rounded-0">${listItems}</ul>`;
  const postsContainerContent = `<div class="card border-0">
  <div class="card-body">
  <h2 class="card-title h4">Посты</h2>
  ${postsList}
  </div>
</div>`;
  postsContainer.innerHTML = postsContainerContent;
};
