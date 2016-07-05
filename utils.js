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
    var fewWords = allWords.slice()
    var manyWords = fewWords.concat(fewWords, fewWords, fewWords, fewWords, fewWords);
    shuffleInPlace(manyWords)
    return manyWords;
  };

  // fills templates like `foo {{foo:bar.baz}} bar` where everything after the `:` is an optional path to a function, like `Math.trunc`.
  var fillTemplate = function(template, context) {
    return template.replace(/\{\{([a-z0-9_]+):?([a-z0-9_.]+)?\}\}/gi, function(match, key, formatterPath) {
      var formatter = function(x) { return x; };
      if (formatterPath !== undefined) {
        formatter = formatterPath.split(".").reduce(function(path, segment) {
          return path[segment];
        }, window);
        if (typeof formatter !== 'function') {
          formatter = function(x) { return x + ":" + formatterPath; };
        }
      }
      return formatter(context[key]);
    });
  };

  // from http://stackoverflow.com/a/34890276
  var groupBy = function(xs, key) {
    return xs.reduce(function(rv, x) {
      (rv[x[key]] = rv[x[key]] || []).push(x);
      return rv;
    }, {});
  };

  var objectValues = function(object) {
    var values = [];
    for (var key in object) {
      if (object.hasOwnProperty(key)) {
        values.push(object[key]);
      }
    }
    return values;
  };


  return {
    generateDictionary: generateDictionary,
    groupBy: groupBy,
    objectValues: objectValues,
    fillTemplate: fillTemplate
  };
}());