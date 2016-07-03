"use strict";

var typingChallenge = (function() {
  var createChallenge = function(words) {
    return {
      words: words,
      correctWordIndexes: [],
      incorrectWordIndexes: [],
      currentWordIndex: 0,
      startDate: null,
      correctKeyStrokeCount: 0,
      incorrectKeyStrokeCount: 0,
      input: "",
      isRunning: false
    };
  };

  var startChallenge = function(challenge, startDate) {
    return setProperties(challenge, { startDate: startDate, isRunning: true });
  };

  var stopChallenge = function(challenge) {
    return setProperties(challenge, { isRunning: false });
  };

  var Object_assign = (function() {
    var assign = Object.assign;

    // from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign#Polyfill
    if (typeof assign != 'function') {
      assign = function(target) {
        'use strict';
        if (target == null) {
          throw new TypeError('Cannot convert undefined or null to object');
        }

        target = Object(target);
        for (var index = 1; index < arguments.length; index++) {
          var source = arguments[index];
          if (source != null) {
            for (var key in source) {
              if (Object.prototype.hasOwnProperty.call(source, key)) {
                target[key] = source[key];
              }
            }
          }
        }
        return target;
      };
    }

    return assign;
  }());

  var setProperties = function(oldChallenge, newProperties) {
    return Object_assign({}, oldChallenge, newProperties);
  };

  var readWord = function(oldChallenge, input) {
    var newChallenge = null;

    if (input !== "" && input.charAt(input.length - 1) === " ") {
      var isCorrect = input.substring(0, input.length - 1) === oldChallenge.words[oldChallenge.currentWordIndex];

      var tmpChallenge = setProperties(oldChallenge, {
        currentWordIndex: oldChallenge.currentWordIndex + 1,
        input: ""
      });

      if (isCorrect) {
        newChallenge = setProperties(tmpChallenge, {
          correctWordIndexes: oldChallenge.correctWordIndexes.concat([oldChallenge.currentWordIndex]),
          correctKeyStrokeCount: oldChallenge.correctKeyStrokeCount + input.length
        });
      } else {
        newChallenge = setProperties(tmpChallenge, {
          incorrectWordIndexes: oldChallenge.incorrectWordIndexes.concat([oldChallenge.currentWordIndex]),
          incorrectKeyStrokeCount: oldChallenge.incorrectKeyStrokeCount + input.length
        });
      }
    } else {
      newChallenge = setProperties(oldChallenge, {
        keyStrokeCount: oldChallenge.keyStrokeCount + 1,
        input: input
      });
    }

    return newChallenge;
  };

  return {
    createChallenge: createChallenge,
    startChallenge: startChallenge,
    stopChallenge: stopChallenge,
    readWord: readWord
  };
})();