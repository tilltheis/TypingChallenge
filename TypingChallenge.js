"use strict";

var typingChallenge = (function() {
  var startChallenge = function(words, startDate) {
    return {
      words: words,
      correctWordIndexes: [],
      incorrectWordIndexes: [],
      currentWordIndex: 0,
      startDate: startDate,
      keyStrokeCount: 0,
      input: "",
      isRunning: true
    };
  };

  var stopChallenge = function(challenge) {
    return setProperties(challenge, { isRunning: false });
  }

  var setProperties = function(oldChallenge, newProperties) {
    return Object.assign({}, oldChallenge, newProperties);
  };

  var readWord = function(oldChallenge, input) {
    var newChallenge = null;

    if (input !== "" && input.charAt(input.length - 1) === " ") {
      var op = oldChallenge;
      var isCorrect = input.substring(0, input.length - 1) === op.words[op.currentWordIndex];
      var newCorrectWordIndexes = isCorrect ? op.correctWordIndexes.concat([op.currentWordIndex]) : op.correctWordIndexes;
      var newincorrectWordIndexes = !isCorrect ? op.incorrectWordIndexes.concat([op.currentWordIndex]) : op.incorrectWordIndexes;

      newChallenge = setProperties(oldChallenge, {
        correctWordIndexes: newCorrectWordIndexes,
        incorrectWordIndexes: newincorrectWordIndexes,
        currentWordIndex: oldChallenge.currentWordIndex + 1,
        keyStrokeCount: oldChallenge.keyStrokeCount + 1,
        input: ""
      });
    } else {
      newChallenge = setProperties(oldChallenge, {
        keyStrokeCount: oldChallenge.keyStrokeCount + 1,
        input: input
      });
    }

    return newChallenge;
  };

  return {
    startChallenge: startChallenge,
    stopChallenge: stopChallenge,
    readWord: readWord
  };
})();