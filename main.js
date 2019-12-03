const root = 'https://api.github.com';

/***********************************************/
// USER PROFILE
/***********************************************/

showUserProfile = (user, repos) => {
  const profileDiv = document.querySelector('.profile');
  const resultsDiv = document.querySelector('.results');
  profileDiv.classList.remove('hidden');
  resultsDiv.classList.add('hidden');

  console.log(repos);

  let reposList = '';

  repos.length === 0
    ? reposList = `<h3>No public repositories.</h3>`
    : reposList = repos.map(repo => {
      return `<a class="profile__repo-link" href="${repo.html_url}"         target="_blank">
      <li class="profile__repo">${repo.name}</li>
    </a>`;
    }).join('');

  const profileElements = `
              
                            <h2 class="profile__name">${user.name}</h2>
                            <img class="profile__avatar" src="${user.avatar}" alt="User avatar"/>
                        
                        
                          <ul class="profile__repos">
                            ${reposList}
                          </ul>
                          `;

  profileDiv.innerHTML = profileElements;
}

const getUserRepos = user => {
  axios.get(`${root}/users/${user.name}/repos`)
    .then(response => showUserProfile(user, response.data))
    .catch(error => console.log(error));
}

/***********************************************/
// SEARCH RESULTS
/***********************************************/

const selectUser = (users, resultsList) => {
  resultsList.addEventListener('click', e => {
    if (!e.target.closest('li')) return;
    const selectedUser = e.target.closest('li').innerText;
    const user = users.find(user => user.name === selectedUser);
    getUserRepos(user);
  });
}

const showSearchResults = users => {
  const profileDiv = document.querySelector('.profile');
  const resultsDiv = document.querySelector('.results');
  const resultsList = document.createElement('ul');

  resultsList.classList.add('results__list');
  resultsDiv.appendChild(resultsList);

  const userElements = users.map(user => {
    return `<li class="results__user">
              <img class="results__avatar" src="${user.avatar}" alt="User avatar"/>
              <a class="results__username" href="#">
                ${user.name}
              </a>
            </li>`
  }).join('');

  profileDiv.classList.add('hidden');
  resultsDiv.classList.remove('hidden');

  resultsList.innerHTML = userElements;

  selectUser(users, resultsList);
}

/***********************************************/
// SEARCH
/***********************************************/

const searchUsers = searchTerm => {
  axios.get(`${root}/search/users`, {
    params: {
      q: `${searchTerm}`,
      per_page: '100'
    }
  })
    .then(response => {
      const users = response.data.items.map(user => {
        return {
          name: user.login,
          avatar: user.avatar_url
        }
      });

      if (users.length === 1) {
        getUserRepos(users[0]);
      } else if (users.length > 1) {
        showSearchResults(users);
      } else {
        showErrorMessage();
      }
    })
    .catch(error => console.log(error));
}

const btn = document.querySelector('.search__btn');

btn.addEventListener('click', e => {
  const resultsDiv = document.querySelector('.results');
  resultsDiv.innerHTML = '';

  const searchTerm = document.querySelector('.search__input').value;
  if (!searchTerm) return;
  document.querySelector('.search__input').value = '';
  searchUsers(searchTerm);
});
