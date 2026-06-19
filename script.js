const searchBtn = document.getElementById("searchBtn");
const usernameInput = document.getElementById("username");
const profileBox = document.getElementById("profile");
const errorBox = document.getElementById("error");
const loading = document.getElementById("loading");
const themeBtn = document.getElementById("themeBtn");
const repositoriesBox = document.getElementById("repositories");

searchBtn.addEventListener("click", function(){
  const username = usernameInput.value.trim();
  if(username === ""){
    errorBox.innerHTML = "Please enter a GitHub username.";
    return;
  }
  searchGithubUser(username);
});

async function searchGithubUser(username) {

  errorBox.innerHTML = "";
  profileBox.innerHTML = "";
  repositoriesBox.innerHTML = "";

  loading.style.display = "block";
  searchBtn.disabled = true;
  searchBtn.innerText = "Searching...";

  try {
    const response = await fetch(`https://api.github.com/users/${username}`);
    if (!response.ok) {
      throw new Error("User not found");
    }else{
    let repos = [];
  }
    const user = await response.json();
    profileBox.innerHTML = `...`;
    // Fetch repositories
    const repoResponse = await fetch(
   `https://api.github.com/users/${username}/repos?sort=updated&per_page=5`
);
    let repos = [];

    if(repoResponse.ok){
    repos = await repoResponse.json();
  }

    profileBox.innerHTML = `
      <img src="${user.avatar_url}" width="120" alt="Profile Picture">
      <h2>${user.name || user.login}</h2>
      <p><b>Username:</b> ${user.login}</p>
      <p><b>Bio:</b> ${user.bio || "No bio available"}</p>
      <p><b>Location:</b> ${user.location || "Not available"}</p>
      <p><b>Company:</b> ${user.company || "Not available"}</p>
      <p><b>Account Created:</b> ${new Date(user.created_at).toLocaleDateString()}</p>
      <p><b>Followers:</b> ${user.followers}</p>
      <p><b>Following:</b> ${user.following}</p>
      <p><b>Public Repos:</b> <a href="${user.html_url}?tab=repositories" target="_blank">${user.public_repos}</a></p>
      <p><b>Website:</b> ${user.blog ? `<a href="${user.blog}" target="_blank" rel="noopener noreferrer">${user.blog}</a>` : "Not available"}</p>
      <a href="${user.html_url}" target="_blank" rel="noopener noreferrer">View GitHub Profile</a>`;

      if(repos.length === 0){
  repositoriesBox.innerHTML = `
    <h2>Latest Repositories</h2>
    <p>No public repositories available.</p>
  `;
}
else{

  repositoriesBox.innerHTML = `
    <h2>Latest Repositories</h2>
    <div class="repo-container">${repos.map(repo => `
    <div class="repo-card"><h3>${repo.name}</h3>
    <p>${repo.description || "No description available"}</p>
    <p>⭐ Stars: ${repo.stargazers_count}</p>
    <p>💻 Language: ${repo.language || "Not specified"}</p>
    <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer"> View Repository</a>
    </div>
`).join("")}
  </div>
  `;
}
      // Clear input after successful search
      usernameInput.value = "";
  }
catch (error) {
  if(error.message === "User not found"){
    errorBox.innerHTML = `User "${username}" does not exist.`;
  }
  else{
    errorBox.innerHTML = "Something went wrong. Check your internet connection.";
  }
} finally {
    loading.style.display = "none";
    searchBtn.disabled = false;
    searchBtn.innerText = "Search";
  }
}

// Search GitHub profile by pressing Enter key
usernameInput.addEventListener("keydown", function(event) {
  if(event.key === "Enter") {
    const username = usernameInput.value.trim();
    if(username !== ""){
      searchGithubUser(username);
    }
  }
});

usernameInput.focus();

themeBtn.addEventListener("click", function () {
  document.body.classList.toggle("light-theme");
  if(document.body.classList.contains("light-theme")){
    themeBtn.innerHTML = "🌙 Switch to Dark";
  }
  else{
    themeBtn.innerHTML = "☀️ Switch to Light";
  }
});