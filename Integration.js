"use strict";

var problemEl = document.querySelector("#problem");
var solutionEl = document.querySelector("#solution");
var restartEl = document.querySelector("#restart");
var statsEl = document.querySelector("#stats");

var currentChallenge = null; // set by startGame()
var currentGameTimeout = null; // set by startGame()
var currentStatsInterval = null; // set by startGame()

var GameDuration = 60000;

var startGame = function() {
  clearTimeout(currentGameTimeout);

  currentChallenge = TypingChallenge.startChallenge(TypingChallenge.generateDictionary(), new Date());

  updateGameUi(currentChallenge);

  solutionEl.onkeyup = function(event) {
    currentChallenge = TypingChallenge.readWord(currentChallenge, event.target.value);
    updateGameUi(currentChallenge);
  };
  currentGameTimeout = setTimeout(function() {
    solutionEl.onkeyup = function() { return false; };
    clearInterval(currentStatsInterval);

    currentChallenge = TypingChallenge.stopChallenge(currentChallenge);

    updateGameUi(currentChallenge);
    updateStatsUi(currentChallenge);
  }, GameDuration);

  currentStatsInterval = setInterval(function() {
    updateStatsUi(currentChallenge);
  }, 1000 / 60);

  solutionEl.focus();
};

var updateGameUi = function(challenge) {
  var wordEls = currentChallenge.words.map(function(word, index) {
    var className = "";
    if (index === challenge.currentWordIndex) { className += " active"; }
    if (challenge.correctWordIndexes.indexOf(index) !== -1) { className += " correct"; }
    if (challenge.incorrectWordIndexes.indexOf(index) !== -1) { className += " wrong"; }
    return "<span class=\"" + className + "\">" + word + "</span>";
  });
  problemEl.innerHTML = wordEls.join(" ");

  solutionEl.value = challenge.input;
  solutionEl.disabled = !challenge.isRunning;
};

var updateStatsUi = function(challenge) {
  var wpm = 60000 / GameDuration * (challenge.correctWordIndexes.length + challenge.incorrectWordIndexes.length);
  var timeLeft = Math.max(0, ((challenge.startDate * 1 + GameDuration) - (new Date() * 1)) / 1000);
  statsEl.innerHTML  = "<br><b>Stats<b>";
  statsEl.innerHTML += "<br>WPM: " + wpm;
  statsEl.innerHTML += "<br>key strokes: " + challenge.keyStrokeCount;
  statsEl.innerHTML += "<br>correct: "  + challenge.correctWordIndexes.length;
  statsEl.innerHTML += "<br>incorrect: " + challenge.incorrectWordIndexes.length;
  statsEl.innerHTML += "<br>time left: " + timeLeft + "s";
};

restartEl.onclick = startGame;