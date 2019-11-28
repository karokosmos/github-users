const root = 'https://api.github.com';

/***********************************************/
// GET USER DATA
/***********************************************/

const getUserRepos = username => {
  console.log('Username: ' + username);
}

/***********************************************/
// SHOW RESULTS AND SELECT USER
/***********************************************/

const selectUser = (users, resultsList) => {
  resultsList.addEventListener('click', e => {
    if (!e.target.closest('li')) return;
    const username = e.target.closest('li').innerText;
    /* const user = users.find(user => user.login === username); */
    getUserRepos(username);
  });
}

const showSearchResults = users => {
  console.log(users);

  // Create li elements for found users
  const userElements = users.map(user => {
    return `<li class="results__user">
              <img class="results__avatar" src="${user.avatar_url}" alt="User avatar"/>
              <a class="results__username" href="#">
                ${user.login}
              </a>
            </li>`
  }).join('');

  // Show found users in the DOM
  const resultsList = document.querySelector('.results__list');
  resultsList.innerHTML = userElements;

  selectUser(users, resultsList);
}

/***********************************************/
// SEARCH USERS
/***********************************************/

const searchUsers = searchTerms => {
  axios.get(`${root}/search/users`, {
    params: {
      q: `${searchTerms}`
    }
  })
    .then(response => {
      // Check if there's more than 1 hit
      if (response.data.items.length === 1) {
        showUserInfo(response.data.items);
      } else {
        showSearchResults(response.data.items);
      }
    })
    .catch(error => console.log(error));
}

// FORM

const btn = document.querySelector('.search__btn');

btn.addEventListener('click', e => {
  const searchTerms = document.querySelector('.search__input').value;
  if (!searchTerms) return;
  document.querySelector('.search__input').value = '';
  searchUsers(searchTerms);
});
