"use strict";

(function() {
  var problemEl = document.querySelector("#problem");
  var solutionEl = document.querySelector("#solution");
  var restartEl = document.querySelector("#restart");
  var statsEl = document.querySelector("#stats");

  var currentChallenge = null; // set by startGame()
  var currentGameTimeout = null; // set by startGame()
  var currentStatsInterval = null; // set by startGame()

  var GameDuration = 60000;
  var WordsPerLine = 13;

  var startGame = function() {
    clearTimeout(currentGameTimeout);

    currentChallenge = typingChallenge.startChallenge(utils.generateDictionary(), new Date());

    updateGameUi(currentChallenge);

    solutionEl.oninput = function(event) {
      currentChallenge = typingChallenge.readWord(currentChallenge, solutionEl.value);
      updateGameUi(currentChallenge);
    };
    currentGameTimeout = setTimeout(function() {
      solutionEl.oninput = function() { return false; };
      clearInterval(currentStatsInterval);

      currentChallenge = typingChallenge.stopChallenge(currentChallenge);

      updateGameUi(currentChallenge);
      updateStatsUi(currentChallenge);
    }, GameDuration);

    currentStatsInterval = setInterval(function() {
      updateStatsUi(currentChallenge);
    }, 1000 / 60);

    solutionEl.focus();
  };

  var updateGameUi = function(challenge) {
    var allLines = utils.grouped(challenge.words, WordsPerLine);
    var activeLineIndex = Math.trunc(challenge.currentWordIndex / WordsPerLine);
    var visibleLines = allLines.slice(activeLineIndex, activeLineIndex + 2);

    var htmlLines =  visibleLines.map(function(line, lineIndex) {
      return line.map(function(word, wordIndex) {
        var globalIndex = (activeLineIndex + lineIndex) * WordsPerLine + wordIndex;
        var className = "";
        if (globalIndex === challenge.currentWordIndex) { className += " active"; }
        if (challenge.correctWordIndexes.indexOf(globalIndex) !== -1) { className += " correct"; }
        if (challenge.incorrectWordIndexes.indexOf(globalIndex) !== -1) { className += " wrong"; }
        return "<span class=\"" + className + "\">" + word + "</span>";
      });
    });

    problemEl.innerHTML = htmlLines.map(function(line) { return line.join(" "); }).join("<br>");

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
}());