/*
 * FSCSS support for Acode (CodeMirror 6 + legacy Ace fallback)
 */
(function () {
  "use strict";

  var PLUGIN_ID = "dev.figsh.fscss";
  var MODE_NAME = "fscss";
  var EXTENSIONS = ["fscss", "xfscss"];
  var CAPTION = "FSCSS";

  var LISTS = {
    special: new Set([
      "_init", "if", "el-if", "el", "return", "_log", "_warn", "_info",
      "_error", "from", "as", "to", "default", "export"
    ]),
    builtins: new Set([
      "cos", "cin", "inline", "exec", "find", "pick", "length", "count",
      "copy", "str", "re", "store", "join", "prefix", "surround", "unit",
      "block", "num", "rpt", "mx", "mxs", "linear-gradient", "radial-gradient",
      "repeating-linear-gradient", "repeating-radial-gradient",
      "conic-gradient", "repeating-conic-gradient", "var", "calc", "min",
      "max", "clamp", "rgb", "rgba", "hsl", "hsla", "hwb", "lch", "lab",
      "color-mix", "color", "url", "attr", "counter", "counters", "element",
      "image-set", "fit-content", "minmax", "repeat", "steps", "cubic-bezier",
      "matrix", "translate", "translateX", "translateY", "translateZ",
      "scale", "scaleX", "scaleY", "scaleZ", "rotate", "rotateX", "rotateY",
      "rotateZ", "skew", "skewX", "skewY", "perspective"
    ]),
    methods: new Set([
      "length", "last", "reverse", "first", "list", "indices", "randint",
      "segment", "map", "sum", "unique", "sort", "shuffle", "min", "max",
      "obj", "xfscss"
    ]),
    colors: new Set([
      "aliceblue", "antiquewhite", "aqua", "aquamarine", "azure", "beige",
      "bisque", "black", "blanchedalmond", "blue", "blueviolet", "brown",
      "burlywood", "cadetblue", "chartreuse", "chocolate", "coral",
      "cornflowerblue", "cornsilk", "crimson", "cyan", "darkblue", "darkcyan",
      "darkgoldenrod", "darkgray", "darkgreen", "darkgrey", "darkkhaki",
      "darkmagenta", "darkolivegreen", "darkorange", "darkorchid", "darkred",
      "darksalmon", "darkseagreen", "darkslateblue", "darkslategray",
      "darkslategrey", "darkturquoise", "darkviolet", "deeppink", "deepskyblue",
      "dimgray", "dimgrey", "dodgerblue", "firebrick", "floralwhite",
      "forestgreen", "fuchsia", "gainsboro", "ghostwhite", "gold", "goldenrod",
      "gray", "green", "greenyellow", "grey", "honeydew", "hotpink",
      "indianred", "indigo", "ivory", "khaki", "lavender", "lavenderblush",
      "lawngreen", "lemonchiffon", "lightblue", "lightcoral", "lightcyan",
      "lightgoldenrodyellow", "lightgray", "lightgreen", "lightgrey",
      "lightpink", "lightsalmon", "lightseagreen", "lightskyblue",
      "lightslategray", "lightslategrey", "lightsteelblue", "lightyellow",
      "lime", "limegreen", "linen", "magenta", "maroon", "mediumaquamarine",
      "mediumblue", "mediumorchid", "mediumpurple", "mediumseagreen",
      "mediumslateblue", "mediumspringgreen", "mediumturquoise",
      "mediumvioletred", "midnightblue", "mintcream", "mistyrose",
      "moccasin", "navajowhite", "navy", "oldlace", "olive", "olivedrab",
      "orange", "orangered", "orchid", "palegoldenrod", "palegreen",
      "paleturquoise", "palevioletred", "papayawhip", "peachpuff", "peru",
      "pink", "plum", "powderblue", "purple", "rebeccapurple", "red",
      "rosybrown", "royalblue", "saddlebrown", "salmon", "sandybrown",
      "seagreen", "seashell", "sienna", "silver", "skyblue", "slateblue",
      "slategray", "slategrey", "snow", "springgreen", "steelblue", "tan",
      "teal", "thistle", "tomato", "turquoise", "violet", "wheat", "white",
      "whitesmoke", "yellow", "yellowgreen", "transparent", "currentColor"
    ]),
    values: new Set([
      "auto", "initial", "inherit", "unset", "revert", "revert-layer", "none",
      "normal", "bold", "bolder", "lighter", "italic", "oblique", "underline",
      "overline", "line-through", "solid", "dashed", "dotted", "double",
      "groove", "ridge", "inset", "outset", "hidden", "visible", "collapse",
      "separate", "scroll", "fixed", "local", "no-repeat", "repeat",
      "repeat-x", "repeat-y", "round", "space", "cover", "contain",
      "border-box", "padding-box", "content-box", "ellipsis", "break-word",
      "keep-all", "loose", "strict", "inline", "block", "inline-block",
      "flex", "inline-flex", "grid", "inline-grid", "table", "inline-table",
      "list-item", "contents", "flow", "flow-root", "start", "end", "left",
      "right", "center", "justify", "match-parent", "baseline",
      "first-baseline", "last-baseline", "safe", "unsafe", "stretch",
      "flex-start", "flex-end", "self-start", "self-end", "space-between",
      "space-around", "space-evenly", "row", "row-reverse", "column",
      "column-reverse", "wrap", "nowrap", "wrap-reverse", "fill",
      "max-content", "min-content", "fit-content", "available", "static",
      "relative", "absolute", "sticky", "clip", "overlay", "subgrid", "dense",
      "minmax", "auto-fill", "auto-fit", "fr", "ease", "linear", "ease-in",
      "ease-out", "ease-in-out", "step-start", "step-end", "forwards",
      "backwards", "both", "alternate", "alternate-reverse", "infinite",
      "paused", "running"
    ])
  };

  var UNITS_RE = /^(?:px|em|rem|ex|ch|pt|pc|vw|vh|vmin|vmax|deg|rad|grad|turn|s|ms|Hz|kHz|dpi|dpcm|dppx|fr|%)\b/;
  var FILE_RE = /\.(fscss|xfscss)$/i;

  /* ------------------------------------------------------------------ */
  /* CodeMirror 6 StreamLanguage Parser (Modern Acode)                   */
  /* ------------------------------------------------------------------ */
  function createFscssStreamParser() {
    return {
      name: MODE_NAME,
      startState: function () {
        return { inComment: false, stringQuote: null };
      },
      token: function (stream, state) {
        // Multi-line block comments /* ... */
        if (state.inComment) {
          if (stream.match(/^.*?\*\//)) {
            state.inComment = false;
          } else {
            stream.skipToEnd();
          }
          return "comment";
        }

        // Strings ("...", '...', `...`)
        if (state.stringQuote) {
          var q = state.stringQuote;
          while (!stream.eol()) {
            var ch = stream.next();
            if (ch === "\\") {
              stream.next();
            } else if (ch === q) {
              state.stringQuote = null;
              break;
            }
          }
          return "string";
        }

        if (stream.eatSpace()) return null;

        // Comment start
        if (stream.match("/*")) {
          state.inComment = true;
          return "comment";
        }

        // Line comment fallback
        if (stream.match("//")) {
          stream.skipToEnd();
          return "comment";
        }

        // Quote start
        var peek = stream.peek();
        if (peek === '"' || peek === "'" || peek === "`") {
          state.stringQuote = stream.next();
          return "string";
        }

        // FSCSS Variables: $name, $/name, $name!
        if (stream.match(/^\$\/?[a-zA-Z_][a-zA-Z0-9_-]*!?/)) {
          return "variableName";
        }

        // CSS Custom Properties: --var-name
        if (stream.match(/^--[a-zA-Z_][a-zA-Z0-9_-]*/)) {
          return "variableName";
        }

        // At-rules & directives: @define, @arr, @fun, @import, @media, @custom()
        if (stream.match(/^@[a-zA-Z_][a-zA-Z0-9_-]*/)) {
          return "keyword";
        }

        // Hex colors: #fff, #ffffff, #ffffffff
        if (stream.match(/^#[0-9a-fA-F]{3,8}\b/)) {
          return "number";
        }

        // Shorthand %2(...)
        if (stream.match(/^%[0-9]+(?=\s*\()/)) {
          return "number";
        }

        // Numbers + optional units
        if (stream.match(/^-?\d+(?:\.\d+)?/)) {
          stream.match(UNITS_RE);
          return "number";
        }

        // Method helpers: .length, .randint, .xfscss
        if (stream.match(/^\.([a-zA-Z_][a-zA-Z0-9_-]*)/)) {
          var method = stream.current().slice(1);
          if (LISTS.methods.has(method)) return "function(variableName)";
          return "className";
        }

        // Pseudo-classes / pseudo-elements
        if (stream.match(/^::?[a-zA-Z-]+/)) {
          return "attributeName";
        }

        // !important
        if (stream.match(/^!important\b/)) {
          return "keyword";
        }

        // Identifiers, properties, builtins, keywords
        if (stream.match(/^[a-zA-Z_][a-zA-Z0-9_-]*/)) {
          var word = stream.current();
          if (LISTS.special.has(word) || word === "pattern") return "keyword";
          if (stream.match(/^\s*(?=\()/, false) && LISTS.builtins.has(word)) {
            return "function(variableName)";
          }
          if (stream.match(/^\s*:(?![^;{}]*\{)/, false)) {
            return "propertyName";
          }
          if (LISTS.colors.has(word) || LISTS.values.has(word)) {
            return "atom";
          }
          return "variableName";
        }

        // Operators & punctuation
        if (stream.match(/^\|\||^[!:=+\-*/<>]+/)) {
          return "operator";
        }

        stream.next();
        return null;
      },
      languageData: {
        commentTokens: { block: { open: "/*", close: "*/" } }
      }
    };
  }

  function registerCodeMirror() {
    try {
      var editorLanguages = acode.require("editorLanguages");
      var cmLang = acode.require("@codemirror/language");

      if (!editorLanguages || !cmLang || !cmLang.StreamLanguage) {
        return false;
      }

      var streamParser = createFscssStreamParser();

      editorLanguages.register(
        MODE_NAME,
        EXTENSIONS,
        CAPTION,
        function () {
          var lang = cmLang.StreamLanguage.define(streamParser);
          return new cmLang.LanguageSupport(lang);
        }
      );

      var applyToFile = function (file) {
        if (!file) return;
        var name = file.filename || file.name || "";
        if (FILE_RE.test(name) && typeof file.setMode === "function") {
          file.setMode(MODE_NAME);
        }
      };

      if (window.editorManager) {
        (editorManager.files || []).forEach(applyToFile);
        editorManager.on("switch-file", applyToFile);
        editorManager.on("new-file", applyToFile);
      }

      return true;
    } catch (e) {
      console.error("[FSCSS] editorLanguages registration failed:", e);
      return false;
    }
  }

  /* ------------------------------------------------------------------ */
  /* Legacy Ace Fallback (Older Acode versions)                          */
  /* ------------------------------------------------------------------ */
  function registerLegacyAce() {
    if (typeof window.ace === "undefined" || typeof window.ace.define !== "function") {
      return false;
    }

    ace.define(
      "ace/mode/fscss_highlight_rules",
      ["require", "exports", "module", "ace/lib/oop", "ace/mode/text_highlight_rules"],
      function (require, exports) {
        var oop = require("../lib/oop");
        var TextHighlightRules = require("./text_highlight_rules").TextHighlightRules;

        var FscssHighlightRules = function () {
          this.$rules = {
            start: [
              { token: "comment", regex: "\\/\\*", push: "comment" },
              { token: "variable", regex: "\\$\\/?[a-zA-Z_][a-zA-Z0-9_-]*!?" },
              { token: "keyword", regex: "@[a-zA-Z_][a-zA-Z0-9_-]*" },
              { token: "support.type", regex: "[-a-zA-Z_][-a-zA-Z0-9_]*(?=\\s*:)" },
              { token: "constant.numeric", regex: "#[0-9a-fA-F]{3,8}\\b|\\b-?\\d+(?:\\.\\d+)?[a-zA-Z%]*\\b" },
              { token: "string", regex: '"', push: "qqstring" },
              { token: "string", regex: "'", push: "qstring" }
            ],
            comment: [
              { token: "comment", regex: "\\*\\/", next: "pop" },
              { defaultToken: "comment" }
            ],
            qqstring: [
              { token: "string", regex: '"', next: "pop" },
              { defaultToken: "string" }
            ],
            qstring: [
              { token: "string", regex: "'", next: "pop" },
              { defaultToken: "string" }
            ]
          };
          this.normalizeRules();
        };

        oop.inherits(FscssHighlightRules, TextHighlightRules);
        exports.FscssHighlightRules = FscssHighlightRules;
      }
    );

    ace.define(
      "ace/mode/fscss",
      ["require", "exports", "module", "ace/lib/oop", "ace/mode/text", "ace/mode/fscss_highlight_rules"],
      function (require, exports) {
        var oop = require("../lib/oop");
        var TextMode = require("./text").Mode;
        var FscssHighlightRules = require("./fscss_highlight_rules").FscssHighlightRules;

        var Mode = function () {
          this.HighlightRules = FscssHighlightRules;
          this.$id = "ace/mode/fscss";
        };
        oop.inherits(Mode, TextMode);
        exports.Mode = Mode;
      }
    );

    var aceModes = acode.require("aceModes");
    if (aceModes && typeof aceModes.addMode === "function") {
      aceModes.addMode(MODE_NAME, EXTENSIONS.join("|"), CAPTION);
    }
    return true;
  }

  /* ------------------------------------------------------------------ */
  /* Plugin Lifecycle                                                    */
  /* ------------------------------------------------------------------ */
    if (window.acode) {
    acode.setPluginInit(PLUGIN_ID, function () {
      if (!registerCodeMirror()) {
        registerLegacyAce();
      }
    });

    acode.setPluginUnmount(PLUGIN_ID, function () {
      try {
        var editorLanguages = acode.require("editorLanguages");
        if (editorLanguages && typeof editorLanguages.unregister === "function") {
          editorLanguages.unregister(MODE_NAME);
        }
      } catch (e) {}

      if (typeof window.ace !== "undefined") {
        try {
          var aceModes = acode.require("aceModes");
          if (aceModes && aceModes.removeMode) aceModes.removeMode(MODE_NAME);
        } catch (e) {}
      }
    });
  }

})();
