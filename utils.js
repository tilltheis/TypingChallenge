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

  // from http://stackoverflow.com/a/17243070
  /* accepts parameters
  * h  Object = {h:x, s:y, v:z}
  * OR
  * h, s, v
  */
  function hsvToRgb(h, s, v) {
      var r, g, b, i, f, p, q, t;
      if (arguments.length === 1) {
          s = h.s, v = h.v, h = h.h;
      }
      i = Math.floor(h * 6);
      f = h * 6 - i;
      p = v * (1 - s);
      q = v * (1 - f * s);
      t = v * (1 - (1 - f) * s);
      switch (i % 6) {
          case 0: r = v, g = t, b = p; break;
          case 1: r = q, g = v, b = p; break;
          case 2: r = p, g = v, b = t; break;
          case 3: r = p, g = q, b = v; break;
          case 4: r = t, g = p, b = v; break;
          case 5: r = v, g = p, b = q; break;
      }
      return {
          r: Math.round(r * 255),
          g: Math.round(g * 255),
          b: Math.round(b * 255)
      };
  }

  // from http://stackoverflow.com/a/17243070
  /* accepts parameters
   * r  Object = {r:x, g:y, b:z}
   * OR
   * r, g, b
  */
  function rgbToHsv(r, g, b) {
      if (arguments.length === 1) {
          g = r.g, b = r.b, r = r.r;
      }
      var max = Math.max(r, g, b), min = Math.min(r, g, b),
          d = max - min,
          h,
          s = (max === 0 ? 0 : d / max),
          v = max / 255;

      switch (max) {
          case min: h = 0; break;
          case r: h = (g - b) + d * (g < b ? 6: 0); h /= 6 * d; break;
          case g: h = (b - r) + d * 2; h /= 6 * d; break;
          case b: h = (r - g) + d * 4; h /= 6 * d; break;
      }

      return {
          h: h,
          s: s,
          v: v
      };
  }

  var rbgColorBetween = function(color1, color2, percent) {
    return {
      r: Math.round(color1.r - (color1.r - color2.r) * percent),
      g: Math.round(color1.g - (color1.g - color2.g) * percent),
      b: Math.round(color1.b - (color1.b - color2.b) * percent)
    };
  };

  var hsvColorBetween = function(color1, color2, percent) {
    return {
      h: color1.h - (color1.h - color2.h) * percent,
      s: color1.s - (color1.s - color2.s) * percent,
      v: color1.v - (color1.v - color2.v) * percent
    };
  };

  var stringToRgb = function(rgbString) {
    var normalizedString = rgbString.charAt(0) === "#" ? rgbString.slice(1) : rgbString;
    if (normalizedString.length === 6) {
      var rgbArray = normalizedString.match(/.{1,2}/g);
      return {
        r: parseInt(rgbArray[0], 16),
        g: parseInt(rgbArray[1], 16),
        b: parseInt(rgbArray[2], 16)
      };
    } else {
      console.error("utils.hsvColorFromRgbString(" + normalizedString + "): can only work w/ rgb strings of length 6")
      return undefined;
    }
  };

  return {
    generateDictionary: generateDictionary,
    grouped: grouped,
    fillTemplate: fillTemplate,
    hsvColorBetween: hsvColorBetween,
    rbgColorBetween: rbgColorBetween,
    stringToRgb: stringToRgb,
    hsvToRgb: hsvToRgb,
    rgbToHsv: rgbToHsv
  };
}());