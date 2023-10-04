document.addEventListener("DOMContentLoaded", function () {
  const pageTitle = document.getElementById("pageTitle");
  const playButton = document.getElementById("playButton");
  const vote = document.getElementById("vote");
  const settingsButton = document.getElementById("settingsButton");
  const languageSelector = document.getElementById("languageSelector");
  const scoreboard = document.getElementById("scoreboard");
  const disconnectButton = document.getElementById("disconnectButton");
  const logout = document.getElementById("logout");
  const gameOptions = document.getElementById("gameOptions");
  const sound = document.getElementById("sound");
  const music = document.getElementById("music");
  const easy = document.getElementById("easy");
  const medium = document.getElementById("medium");
  const hard = document.getElementById("hard");
  const difficultyText = document.getElementById("difficultyText");
  const waitingPlayer = document.getElementById("waitingPlayer");
  const skipVotesText = document.getElementById("skipVotesText");
  const stayVotesText = document.getElementById("stayVotesText");
  const voteSkip = document.getElementById("voteSkip");
  const voteStay = document.getElementById("voteStay");
  const languageSelectorText = document.getElementById("languageSelectorText");

  let userLanguage; // Declare userLanguage variable outside of the fetch callback

  console.log("Script loaded."); // Check if the script is loaded

  function loadLanguage(language) {
    console.log(`Loading language: ${language}`);
    fetch(`src/server/languages/${language}.json`)
      .then((response) => response.json())
      .then((data) => {
        console.log("JSON data loaded:", data);
        pageTitle.textContent = data.pageTitle;
        playButton.textContent = data.playButton;
        vote.textContent = data.vote;
        settingsButton.textContent = data.settingsButton;
        scoreboard.textContent = data.scoreboard;
        disconnectButton.textContent = data.disconnectButton;
        logout.textContent = data.logout;
        gameOptions.textContent = data.gameOptions;
        sound.textContent = data.sound;
        music.textContent = data.music;
        easy.textContent = data.easy;
        medium.textContent = data.medium;
        hard.textContent = data.hard;
        difficultyText.textContent = data.difficultyText;
        waitingPlayer.textContent = data.waitingPlayer;
        skipVotesText.textContent = data.skipVotesText;
        stayVotesText.textContent = data.stayVotesText;
        voteSkip.textContent = data.voteSkip;
        voteStay.textContent = data.voteStay;
        languageSelectorText.textContent = data.languageSelectorText;
      })
      .catch((error) =>
        console.error(`Error loading /language/${language}: ${error}`)
      );
  }

  // Event listener for language selector change
  languageSelector.addEventListener("change", function () {
    const selectedLanguage = languageSelector.value;
    console.log(`Selected language: ${selectedLanguage}`);
    loadLanguage(selectedLanguage);
  });

  // Load the user's selected language when the page loads
  fetch('/language/get-language')
    .then((response) => response.json())
    .then((data) => {
      userLanguage = data.language; // Assign the selected language to userLanguage
      if (userLanguage) {
        languageSelector.value = userLanguage;
        console.log('User Language:', userLanguage);
        // Load the initial language set by user
        loadLanguage(userLanguage || 'nl');
      }
    });

  // Save the selected language when the user changes it
  languageSelector.addEventListener('change', () => {
    const selectedLanguage = languageSelector.value;
    fetch('/language/save-language', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ language: selectedLanguage }),
    });
  });
});
