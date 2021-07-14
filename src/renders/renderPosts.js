export default (posts) => {
  const postsContainer = document.querySelector('.posts');
  const listItems = posts.map((post) => `<li class="list-group-item d-flex justify-content-between align-items-start border-0 border-end-0">
  <a href="${post.postLink}" class="fw-bold" data-id="${post.postId}" target="_blank" rel="noopener noreferrer">${post.postTitle}</a>
  <button type="button" class="btn btn-outline-primary btn-sm" data-id="${post.postId}" data-bs-toggle="modal" data-bs-target="#modal">Просмотр</button>
  </li>`).reverse().join('');
  const postsList = `<ul class="list-group border-0 rounded-0">${listItems}</ul>`;
  const postsContainerContent = `<div class="card border-0">
  <div class="card-body">
  <h2 class="card-title h4">Посты</h2>
  ${postsList}
  </div>
</div>`;
  postsContainer.innerHTML = postsContainerContent;
};
