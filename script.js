const searchBtn = document.getElementById("searchBtn");
const usernameInput = document.getElementById("username");
const profileBox = document.getElementById("profile");
const errorBox = document.getElementById("error");
const loading = document.getElementById("loading");

searchBtn.addEventListener("click", async function () {
  const username = usernameInput.value.trim();

  errorBox.innerHTML = "";
  profileBox.innerHTML = "";

  if (username === "") {
    errorBox.innerHTML = "Please enter a GitHub username.";
    return;
  }

  loading.style.display = "block";

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
      <p><b>Public Repos:</b> ${user.public_repos}</p>
      <a href="${user.html_url}" target="_blank" rel="noopener noreferrer">View GitHub Profile</a>
    `;
  } catch (error) {
    errorBox.innerHTML = "GitHub user not found.";
  } finally {
    loading.style.display = "none";
  }
});