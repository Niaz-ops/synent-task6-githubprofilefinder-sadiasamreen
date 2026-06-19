const searchBtn = document.getElementById("searchBtn");
const usernameInput = document.getElementById("username");
const profileBox = document.getElementById("profile");
const errorBox = document.getElementById("error");
const loading = document.getElementById("loading");

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

  loading.style.display = "block";
  searchBtn.disabled = true;
  searchBtn.innerText = "Searching...";

  try {

    const response = await fetch(`https://api.github.com/users/${username}`);

    if (!response.ok) {
      throw new Error("User not found");
    }

    const user = await response.json();

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

