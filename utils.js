"use strict";

var utils = (function() {
  var allWords = ["second", "low", "whole", "hard", "police", "break", "listen", "full", "local", "value", "explain", "movie", "difference", "effort", "because", "need", "situation", "share", "simply", "open", "save", "guess", "election", "certain", "available", "current", "list", "fire", "author", "note", "nearly", "top", "worker", "race", "poor", "enjoy", "defense", "century", "animal", "mile", "compare", "sister", "thus", "candidate", "somebody", "meeting", "imagine", "disease", "apply", "rise", "set", "method", "shit", "interview", "blue", "environment", "river", "bit", "absolutely", "trouble", "seat", "necessary", "democratic", "address", "management", "tomorrow", "stick", "discover", "user", "inside", "nor", "through", "mouth", "travel", "photograph", "touch", "suffer", "heat", "judge", "fall", "internet", "element", "wind", "just", "interested", "researcher", "capital", "hill", "basic", "engage", "smile", "contract", "apple", "sales", "lake", "gain", "location", "otherwise", "highly", "cry", "associate", "connection", "smart", "ride", "presence", "crowd", "border", "website", "relation", "volume", "extra", "hire", "forest", "focus", "advice", "enemy", "female", "glad", "kick", "actor", "topic", "session", "wine", "youth", "extend", "surprise", "slightly", "lift", "excuse", "desire", "anywhere", "grand", "angry", "struggle", "neck", "generate", "literature", "capture", "studio", "circle", "colleague", "works", "comfortable", "teaching", "live", "zone", "minority", "gender", "domestic", "percentage", "request", "fee", "tooth", "self", "chapter", "shift", "convention", "scream", "extent", "accuse", "farmer", "contribution", "question", "era", "expose", "guide", "escape", "eliminate", "pretty", "muscle", "far", "cycle", "judgment", "lie", "hand", "fast", "basketball", "quote", "immigration", "separate", "flow", "technical", "mark", "soil", "selection", "resolution", "dude", "slow", "essentially", "offense", "fairly", "pregnant", "deficit", "philosophy", "prosecutor", "knife", "housing", "pop", "publication", "beneath", "pepper", "accomplish", "consist", "engineering", "jail", "brief", "shout", "avenue", "scholar", "illness", "awesome", "designer", "retire", "incredible", "rarely", "giant", "stream", "twitter", "accurate", "pay", "another", "potentially", "slide", "rather", "reputation", "giant", "fishing", "stranger", "rape", "negotiation", "sequence", "weigh", "electronic", "impression", "visible", "restore", "sauce", "detect", "apologize", "airline", "cent", "grandmother", "manufacturer", "roll", "terrorist", "violate", "unlikely", "idiot", "stadium", "mix", "incorporate", "taste", "possess", "stake", "developer", "tiger", "administrator", "publisher", "variation", "tomato", "contest", "load", "narrator", "surprise", "purchase", "fate", "surprising", "adapt", "random", "smell", "tourist", "stable", "update", "friendship", "humor", "chemical", "silly", "lifestyle", "crap", "imagination", "drawing", "guide", "segment", "slight", "can", "sue", "notice", "canadian", "pill", "terrorist", "decrease", "dumb", "furthermore", "tactic", "nerve", "aircraft", "duke", "furniture", "garage", "allegation", "fake", "grant", "patient", "whoever", "membership", "makeup", "mall", "courage", "mainstream", "delay", "communist", "palestinian", "till", "function", "soccer", "uncomfortable", "gospel", "fabric", "admire", "hunter", "virtual", "athletic", "sword", "dose", "grave", "absorb", "nominee", "nail", "resign", "hardware", "snake", "depict", "gradually", "starting", "rescue", "praise", "van", "counsel", "motive", "chronic", "cave", "driving", "tag", "precious", "agricultural", "rape", "powder", "govern", "butt", "nonetheless", "speed", "civilian", "compound", "upstairs", "tune", "jeans", "ranch", "pitcher", "behavioral", "advertisement", "blow", "bitter", "treasury", "walking", "greek", "estimated", "frame", "republican", "consent", "banking", "apology", "inspector", "convey", "eating", "custody", "horn", "liability", "considering", "retrieve", "goodness", "repair", "slavery", "seal", "entrepreneur", "unity", "treasure", "exploration", "upcoming", "cruise", "electrical", "attraction", "needle", "magnitude", "senior", "chase", "credibility", "pursuit", "broadcast", "repair", "alright"];

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