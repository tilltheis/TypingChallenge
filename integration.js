"use strict";

(function() {
  var problemEl = document.querySelector("#problem");
  var solutionEl = document.querySelector("#solution");
  var restartEl = document.querySelector("#restart");
  var statsEl = document.querySelector("#stats");
  var statsTemplateEl = document.querySelector("#statsTemplate");
  var statsCssEl = document.querySelector("#statsCss");
  var statsCssTemplateEl = document.querySelector("#statsCssTemplate");

  var currentChallenge = null;
  var currentGameTimeout = null;
  var currentStatsInterval = null;
  var lastWordIndex = null;

  var GameDuration = 60000;
  var WordsPerLine = 13;
  var AverageWordLength = 5;

  var startGame = function() {
    clearTimeout(currentGameTimeout);

    currentChallenge = typingChallenge.createChallenge(utils.generateDictionary());

    updateGameUi(currentChallenge);
    updateStatsUi(currentChallenge);

    solutionEl.oninput = function(firstEvent) {
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

      currentChallenge = typingChallenge.startChallenge(currentChallenge, new Date());
      solutionEl.oninput(firstEvent);
    };

    solutionEl.focus();
  };

  var layoutLines = function(words) {
    var oldInnerHtml = problemEl.innerHTML;
    problemEl.innerHTML = "<div class=\"line\" style=\"display:block;\">" + words.map(function(word, wordIndex) {
      return "<span class=\"word\" style=\"display:inline-block;\">" + word + "</span>";
    }).join(" ") + "</div>";
    var nodeLines = utils.objectValues(utils.groupBy([].slice.call(problemEl.querySelectorAll(".word")), 'offsetTop'));
    var wordLines = nodeLines.map(function(els) { return els.map(function(el) { return el.innerText; }); });
    problemEl.innerHTML = oldInnerHtml;
    return wordLines;
  };

  var updateGameUi = function(challenge) {
    var isBeforeGameStart = !challenge.isRunning && challenge.startDate === null;
    var isAfterGameEnd = !challenge.isRunning && challenge.startDate !== null;

    // create html once and mutate it afterwards to allow for fancy transitions
    if (isBeforeGameStart) {
      lastWordIndex = challenge.currentWordIndex - 1;

      var lines = layoutLines(challenge.words);
      var tmpGlobalWordIndex = 0;
      var htmlLines = lines.map(function(line) {
        return line.map(function(word) {
          var wordIndex = tmpGlobalWordIndex;
          tmpGlobalWordIndex = tmpGlobalWordIndex + 1;
          var className = "word word" + wordIndex;
          return "<span class=\"" + className + "\">" + word + "</span>";
        });
      });

      problemEl.innerHTML = htmlLines.map(function(line, lineIndex) {
        var className = "line line" + lineIndex;
        return "<div class=\"" + className + "\">" + line.join(" ") + "</div>";
      }).join("");
    }

    var lineIndexForWordIndex = function(wordIndex) {
      return parseInt(problemEl.querySelector(".word" + wordIndex).parentElement.className.match(/line(\d+)/)[1]);
    };
    var currentActiveLineIndex = lineIndexForWordIndex(challenge.currentWordIndex)
    var isNewLineReached = !isBeforeGameStart && lineIndexForWordIndex(lastWordIndex) !== currentActiveLineIndex


    // highlight words
    if (challenge.correctWordIndexes.length > 0) {
      document.querySelector(".word" + challenge.correctWordIndexes[challenge.correctWordIndexes.length - 1]).className += " correct";
    }
    if (challenge.incorrectWordIndexes.length > 0) {
      document.querySelector(".word" + challenge.incorrectWordIndexes[challenge.incorrectWordIndexes.length - 1]).className += " incorrect";
    }
    [].forEach.call(document.querySelectorAll(".active"), function(el) { el.className.replace(/\bactive\b/, ""); });
    document.querySelector(".word" + challenge.currentWordIndex).className += " active";

    // highlight lines
    if (isNewLineReached || isBeforeGameStart) {
      if (isBeforeGameStart) {
        document.querySelector(".line0").className += " nextActiveLine";
      }

      [].forEach.call(document.querySelectorAll(".currentActiveLine, .lastActiveLine, .nextActiveLine"), function(el) {
        el.className = el.className.replace(/\blastActiveLine\b/g, "").replace(/\bcurrentActiveLine\b/g, "lastActiveLine").replace(/\bnextActiveLine\b/g, "currentActiveLine");
      });
      [].forEach.call(document.querySelectorAll(".line" + (currentActiveLineIndex + 1)), function(el) { el.className += " nextActiveLine"; });
    }


    solutionEl.value = challenge.input;
    solutionEl.disabled = isAfterGameEnd;

    if (lastWordIndex !== challenge.currentWordIndex) {
      lastWordIndex = challenge.currentWordIndex;
    }
  };

  var updateStatsUi = function(challenge) {
    var timeLeft = GameDuration / 1000;
    var wpm = 0;

    if (challenge.startDate !== null) {
      timeLeft = Math.max(0, ((challenge.startDate * 1 + GameDuration) - (new Date() * 1)) / 1000);
      wpm = (challenge.correctKeyStrokeCount / AverageWordLength) * ((GameDuration / 1000) / (GameDuration / 1000 - timeLeft));
    }

    // FF and IE don't support CSS calc() within hsl(), so we have to do it here...
    var wpmHue = Math.min(120, Math.max(0, wpm - 50) / 65 * 120); // wpm<=50 is bad; wpm>=110 is good

    var context = {
      timeLeft: timeLeft,
      wpm: wpm,
      wpmHue: wpmHue,
      keyStrokeCount: challenge.correctKeyStrokeCount + challenge.incorrectKeyStrokeCount,
      correctKeyStrokeCount: challenge.correctKeyStrokeCount,
      incorrectKeyStrokeCount: challenge.incorrectKeyStrokeCount,
      correctWordCount: challenge.correctWordIndexes.length,
      incorrectWordCount: challenge.incorrectWordIndexes.length
    };
    statsEl.innerHTML = utils.fillTemplate(statsTemplate.innerHTML, context);
    statsCssEl.innerHTML = utils.fillTemplate(statsCssTemplate.innerHTML, context);
  };

  restartEl.onclick = startGame;

  startGame();
}());