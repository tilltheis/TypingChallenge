"use strict";

var TypingChallenge = (function() {
  var allWords = ["allein", "alles", "also", "am", "auch", "auf", "aus", "bald", "dann", "darauf", "dass", "dem", "den", "denn", "deren", "die", "diese", "dieser", "doch", "einem", "eines", "einen", "einmal", "einer", "er", "sie", "es", "wir", "ihr", "sie", "ganz", "ganze", "gar", "gut", "Hand", "gemacht", "hätte", "hätten", "trotzdem", "hier", "ihn", "ihr", "ihrem", "im", "ist", "ja", "nein", "Jahre", "jetzt", "keine", "können", "lange", "Leben", "Liebe", "mehr", "meiner", "Menschen", "nur", "oder", "recht", "schon", "sehen", "sehr", "sein", "seiner", "sind", "sollte", "um", "vielleicht", "vom", "waren", "weiter", "welche", "welcher", "welches", "werde", "werden", "worden", "wohl", "zwar", "zwischen", "hatte", "war", "ersten", "Herr", "Welt", "damit", "sagen", "unter", "diesen", "dieses", "heute", "gegeben", "Seite", "Weise", "gewesen", "einzelnen", "nun", "ihm", "mir", "kommen", "während", "seinen", "seinem", "deinen", "schlecht"];

  // from http://stackoverflow.com/a/6274381
  var shuffleInPlace = function(a) {
    var j, x, i;
    for (i = a.length; i; i -= 1) {
      j = Math.floor(Math.random() * i);
      x = a[i - 1];
      a[i - 1] = a[j];
      a[j] = x;
    }
  };

  var generateDictionary = function() {
    var words = allWords.slice();
    shuffleInPlace(words)
    return words;
  };

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
    readWord: readWord,
    generateDictionary: generateDictionary
  };
})();