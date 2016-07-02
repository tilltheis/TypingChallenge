"use strict";

(function() {
  var problemEl = document.querySelector("#problem");
  var problemContainerEl = document.querySelector("#problemContainer");
  var solutionEl = document.querySelector("#solution");
  var restartEl = document.querySelector("#restart");
  var statsEl = document.querySelector("#stats");
  var statsTemplateEl = document.querySelector("#statsTemplate");

  var currentChallenge = null;
  var currentGameTimeout = null;
  var currentStatsInterval = null;
  var lastWordIndex = null;
  var rowHeight = null;

  var CorrectRgbColor = utils.stringToRgb("#97b57d");
  var IncorrectRgbColor = utils.stringToRgb("#c6717e");

  var GameDuration = 60000;
  var WordsPerLine = 13;

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

  var updateGameUi = function(challenge) {
    var isBeforeGameStart = !challenge.isRunning && challenge.startDate === null;
    var isAfterGameEnd = !challenge.isRunning && challenge.startDate !== null;

    // create html once and mutate it afterwards to allow for fancy transitions
    if (isBeforeGameStart) {
      lastWordIndex = null;

      var lines = utils.grouped(challenge.words, WordsPerLine);
      var htmlLines = lines.map(function(line, lineIndex) {
        return line.map(function(word, wordIndex) {
          var id = "word" + (lineIndex * WordsPerLine + wordIndex);
          return "<span id=\"" + id + "\">" + word + "</span>";
        });
      });

      problemEl.innerHTML = "<div class=\"line\">" + htmlLines.map(function(line) { return line.join(" "); }).join("</div><div class=\"line\">") + "</div>";

      rowHeight = problemEl.querySelector(".line").clientHeight; // to be able to scroll the lines
      problemContainerEl.style.height = rowHeight * 2 + "px";
      problemEl.style.marginTop = "";
    }

    // word hightlighting
    challenge.correctWordIndexes.forEach(function(index) {
      document.getElementById("word" + index).className += " correct";
    });
    challenge.incorrectWordIndexes.forEach(function(index) {
      document.getElementById("word" + index).className += " incorrect";
    });
    if (lastWordIndex !== null) {
      document.getElementById("word" + lastWordIndex).className.replace(/\bactive\b/,'');
    };
    document.getElementById("word" + challenge.currentWordIndex).className += " active";

    // new line reached?
    if (lastWordIndex !== null && lastWordIndex !== challenge.currentWordIndex && challenge.currentWordIndex % WordsPerLine === 0) {
      var currentMarginTop = problemEl.style.marginTop === "" ? 0 : parseInt(problemEl.style.marginTop);
      problemEl.style.marginTop = currentMarginTop - rowHeight + "px";
    }

    solutionEl.value = challenge.input;
    solutionEl.disabled = isAfterGameEnd;

    if (lastWordIndex !== challenge.currentWordIndex) {
      lastWordIndex = challenge.currentWordIndex;
    }
  };

  // colorize ui according to the player's performance
  var colorizeStats = function(wpm, isRunning) {

    // more colorful
    var color =
      utils.hsvToRgb(
        utils.hsvColorBetween(
          utils.rgbToHsv(CorrectRgbColor),
          utils.rgbToHsv(IncorrectRgbColor),
          1 - Math.min(1, Math.max(0, wpm - 25) / 50) // <= 25wpm is bad ; >= 75 is good
        )
      );

    // less colorful
    // var color =
    //   utils.rbgColorBetween(
    //     CorrectRgbColor,
    //     IncorrectRgbColor,
    //     1 - Math.min(1, Math.max(0, wpm - 25) / 50) // <= 25wpm is bad ; >= 75 is good
    //   );

    var colorfulStats = document.querySelectorAll("p div div, .progress-bar, .stat-value .badge");
    [].forEach.call(colorfulStats, function(el) {
      el.style.backgroundColor = "#" + color.r.toString(16) + color.g.toString(16) + color.b.toString(16);
    });

    var colorfulInputs = document.querySelectorAll("#solution, #restart"); // :focus pseudo class has no effect here
    [].forEach.call(colorfulInputs, function(el) {
      el.style.borderColor = "#" + color.r.toString(16) + color.g.toString(16) + color.b.toString(16);

      // complex because we need to handle state w/ and w/o focus manually
      if (isRunning) {
        el.onfocus = undefined;
        el.onblur = undefined;
        if (el === document.activeElement) {
          el.style.boxShadow = "inset 0 1px 1px rgba(0, 0, 0, .075), 0 0 8px rgba(" + color.r + ", " + color.g + ", " + color.b + ", .6)";
        } else {
          el.style.boxShadow = "";
        }
      } else {
        el.onfocus = function() {
          el.style.boxShadow = "inset 0 1px 1px rgba(0, 0, 0, .075), 0 0 8px rgba(" + color.r + ", " + color.g + ", " + color.b + ", .6)";
        };
        el.onblur = function() {
          el.style.boxShadow = "";
        }
      }
    });
  };

  var updateStatsUi = function(challenge) {
    var timeLeft = GameDuration / 1000;
    var wpm = 0;

    if (challenge.startDate !== null) {
      timeLeft = Math.max(0, ((challenge.startDate * 1 + GameDuration) - (new Date() * 1)) / 1000);
      wpm = challenge.correctWordIndexes.length / (GameDuration / 1000 - timeLeft) * GameDuration / 1000;
    }

    statsEl.innerHTML = utils.fillTemplate(statsTemplate.innerHTML, {
      timeLeft: timeLeft,
      wpm: wpm,
      keyStrokeCount: challenge.keyStrokeCount,
      correctWordCount: challenge.correctWordIndexes.length,
      incorrectWordCount: challenge.incorrectWordIndexes.length
    });

    colorizeStats(wpm, challenge.isRunning);
  };

  restartEl.onclick = startGame;

  startGame();
}());