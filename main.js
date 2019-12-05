/***********************************************/
// FUNCTIONS
/***********************************************/

const searchUsers = searchTerm => {
  axios.get(`${apiURL}/search/users`, {
    params: {
      q: `${searchTerm}`,
      per_page: '100'
    }
  })
    .then(response =>
      checkSearchResults(response.data.items))
    .catch(error =>
      showErrorMessage('Oops, something went wrong. Please try again!'));
}

const checkSearchResults = users => {
  if (users.length === 1) {
    getUserRepos(users[0]);
  } else if (users.length > 1) {
    showSearchResults(users);
  } else {
    showErrorMessage('No users were found. Please try again!');
  }
}

const showSearchResults = users => {
  const profileDiv = document.querySelector('.profile');
  const resultsDiv = document.querySelector('.results');
  const resultsList = document.createElement('ul');
  resultsList.classList.add('results__list');
  resultsDiv.appendChild(resultsList);

  const userElements = users.map(user => {
    return `<li class="results__user">
              <img class="results__avatar" src="${user.avatar_url}" alt="User avatar"/>
              <a class="results__username" href="#">
                ${user.login}
              </a>
            </li>`
  }).join('');

  resultsList.innerHTML = userElements;

  profileDiv.classList.add('hidden');
  resultsDiv.classList.remove('hidden');

  selectUser(users, resultsList);
}

const selectUser = (users, resultsList) => {
  resultsList.addEventListener('click', e => {
    if (!e.target.closest('li')) return;
    const selectedUser = e.target.closest('li').innerText;
    const user = users.find(user => user.login === selectedUser);
    getUserRepos(user);
  });
}

const getUserRepos = user => {
  axios.get(`${apiURL}/users/${user.login}/repos`, {
    params: {
      sort: 'updated',
      per_page: '100'
    }
  })
    .then(response =>
      showUserProfile(user, response.data))
    .catch(error =>
      showErrorMessage('Oops, something went wrong. Please try again!'));
}

const showUserProfile = (user, repos) => {
  const profileDiv = document.querySelector('.profile');
  const resultsDiv = document.querySelector('.results');
  profileDiv.classList.remove('hidden');
  resultsDiv.classList.add('hidden');

  let reposList = '';

  repos.length === 0
    ? reposList = `<h3>No public repositories.</h3>`
    : reposList = repos.map(repo => {
      return `<li class="profile__repo">
                <a class="profile__repo-link" href="${repo.html_url}"        target="_blank">
                  ${repo.name} 
                </a>
              </li>`;
    }).join('');

  const profileElements = ` <a class="profile__name" href="${user.html_url}"                           target="_blank">${user.login}</a>
                            <img class="profile__avatar" src="${user.avatar_url}" alt="User avatar"/>
                            <ul class="profile__repos">
                              ${reposList}
                             </ul>
                          `;

  profileDiv.innerHTML = profileElements;
  window.scrollTo(0, 0);
}

const showErrorMessage = message => {
  const errorDiv = document.querySelector('.error');
  const errorMessage = errorDiv.querySelector('.error__message');
  errorMessage.textContent = message;
  errorDiv.classList.remove('hidden');
}

/***********************************************/
// VARIABLES
/***********************************************/

const apiURL = 'https://api.github.com';
const btn = document.querySelector('.search__btn');
const closeBtn = document.querySelector('.error__close-btn');

/***********************************************/
// EVENT LISTENERS
/***********************************************/

btn.addEventListener('click', e => {
  const resultsDiv = document.querySelector('.results');
  resultsDiv.innerHTML = '';

  const searchTerm = document.querySelector('.search__input').value;
  if (!searchTerm) return;
  document.querySelector('.search__input').value = '';
  searchUsers(searchTerm);
});

closeBtn.addEventListener('click', e => {
  const error = document.querySelector('.error');
  error.classList.add('hidden');
});
