"use strict";

var utils = (function() {
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

  var grouped = function(array, groupSize) {
    var groups = [];
    for (var i = 0; i < array.length; i += groupSize) {
      var group = [];
      for (var j = 0; j < groupSize && i + j < array.length; j++) {
        group.push(array[i + j]);
      }
      groups.push(group);
    }
    return groups;
  };

  var fillTemplate = function(template, context) {
    return template.replace(/\{\{([a-z0-9_]+)\}\}/gi, function(match, key) {
      return context[key];
    });
  };

  return {
    generateDictionary: generateDictionary,
    grouped: grouped,
    fillTemplate: fillTemplate
  };
}());