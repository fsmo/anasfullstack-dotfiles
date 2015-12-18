(function() {
  var BlendModes, Color, ColorExpression, ExpressionsRegistry, MAX_PER_COMPONENT, SVGColors, blendMethod, clamp, clampInt, comma, contrast, createVariableRegExpString, cssColor, float, floatOrPercent, hexadecimal, int, intOrPercent, isInvalid, mixColors, namePrefixes, notQuote, optionalPercent, pe, percent, ps, readParam, split, strip, variables, _ref, _ref1,
    __slice = [].slice;

  cssColor = require('css-color-function');

  _ref = require('./regexes'), int = _ref.int, float = _ref.float, percent = _ref.percent, optionalPercent = _ref.optionalPercent, intOrPercent = _ref.intOrPercent, floatOrPercent = _ref.floatOrPercent, comma = _ref.comma, notQuote = _ref.notQuote, hexadecimal = _ref.hexadecimal, ps = _ref.ps, pe = _ref.pe, variables = _ref.variables, namePrefixes = _ref.namePrefixes, createVariableRegExpString = _ref.createVariableRegExpString;

  _ref1 = require('./utils'), strip = _ref1.strip, split = _ref1.split, clamp = _ref1.clamp, clampInt = _ref1.clampInt;

  ExpressionsRegistry = require('./expressions-registry');

  ColorExpression = require('./color-expression');

  SVGColors = require('./svg-colors');

  Color = require('./color');

  BlendModes = require('./blend-modes');

  MAX_PER_COMPONENT = {
    red: 255,
    green: 255,
    blue: 255,
    alpha: 1,
    hue: 360,
    saturation: 100,
    lightness: 100
  };

  mixColors = function(color1, color2, amount) {
    var color, inverse;
    if (amount == null) {
      amount = 0.5;
    }
    inverse = 1 - amount;
    color = new Color;
    color.rgba = [Math.floor(color1.red * amount) + Math.floor(color2.red * inverse), Math.floor(color1.green * amount) + Math.floor(color2.green * inverse), Math.floor(color1.blue * amount) + Math.floor(color2.blue * inverse), color1.alpha * amount + color2.alpha * inverse];
    return color;
  };

  contrast = function(base, dark, light, threshold) {
    var _ref2;
    if (dark == null) {
      dark = new Color('black');
    }
    if (light == null) {
      light = new Color('white');
    }
    if (threshold == null) {
      threshold = 0.43;
    }
    if (dark.luma > light.luma) {
      _ref2 = [dark, light], light = _ref2[0], dark = _ref2[1];
    }
    if (base.luma > threshold) {
      return dark;
    } else {
      return light;
    }
  };

  blendMethod = function(registry, name, method) {
    return registry.createExpression(name, strip("" + name + ps + " ( " + notQuote + " " + comma + " " + notQuote + " ) " + pe), function(match, expression, context) {
      var baseColor1, baseColor2, color1, color2, expr, _, _ref2, _ref3;
      _ = match[0], expr = match[1];
      _ref2 = split(expr), color1 = _ref2[0], color2 = _ref2[1];
      baseColor1 = context.readColor(color1);
      baseColor2 = context.readColor(color2);
      if (isInvalid(baseColor1) || isInvalid(baseColor2)) {
        return this.invalid = true;
      }
      return _ref3 = baseColor1.blend(baseColor2, method), this.rgba = _ref3.rgba, _ref3;
    });
  };

  readParam = function(param, block) {
    var name, re, value, _, _ref2;
    re = RegExp("\\$(\\w+):\\s*((-?" + float + ")|" + variables + ")");
    if (re.test(param)) {
      _ref2 = re.exec(param), _ = _ref2[0], name = _ref2[1], value = _ref2[2];
      return block(name, value);
    }
  };

  isInvalid = function(color) {
    return !(color != null ? color.isValid() : void 0);
  };

  module.exports = {
    getRegistry: function(context) {
      var colorRegexp, colors, paletteRegexpString, registry;
      registry = new ExpressionsRegistry(ColorExpression);
      registry.createExpression('css_hexa_8', "#(" + hexadecimal + "{8})(?![\\d\\w])", function(match, expression, context) {
        var hexa, _;
        _ = match[0], hexa = match[1];
        return this.hexRGBA = hexa;
      });
      registry.createExpression('css_hexa_6', "#(" + hexadecimal + "{6})(?![\\d\\w])", function(match, expression, context) {
        var hexa, _;
        _ = match[0], hexa = match[1];
        return this.hex = hexa;
      });
      registry.createExpression('css_hexa_4', "(" + namePrefixes + ")#(" + hexadecimal + "{4})(?![\\d\\w])", function(match, expression, context) {
        var colorAsInt, hexa, _;
        _ = match[0], _ = match[1], hexa = match[2];
        colorAsInt = context.readInt(hexa, 16);
        this.colorExpression = "#" + hexa;
        this.red = (colorAsInt >> 12 & 0xf) * 17;
        this.green = (colorAsInt >> 8 & 0xf) * 17;
        this.blue = (colorAsInt >> 4 & 0xf) * 17;
        return this.alpha = ((colorAsInt & 0xf) * 17) / 255;
      });
      registry.createExpression('css_hexa_3', "(" + namePrefixes + ")#(" + hexadecimal + "{3})(?![\\d\\w])", function(match, expression, context) {
        var colorAsInt, hexa, _;
        _ = match[0], _ = match[1], hexa = match[2];
        colorAsInt = context.readInt(hexa, 16);
        this.colorExpression = "#" + hexa;
        this.red = (colorAsInt >> 8 & 0xf) * 17;
        this.green = (colorAsInt >> 4 & 0xf) * 17;
        return this.blue = (colorAsInt & 0xf) * 17;
      });
      registry.createExpression('int_hexa_8', "0x(" + hexadecimal + "{8})(?!" + hexadecimal + ")", function(match, expression, context) {
        var hexa, _;
        _ = match[0], hexa = match[1];
        return this.hexARGB = hexa;
      });
      registry.createExpression('int_hexa_6', "0x(" + hexadecimal + "{6})(?!" + hexadecimal + ")", function(match, expression, context) {
        var hexa, _;
        _ = match[0], hexa = match[1];
        return this.hex = hexa;
      });
      registry.createExpression('css_rgb', strip("rgb" + ps + "\\s* (" + intOrPercent + "|" + variables + ") " + comma + " (" + intOrPercent + "|" + variables + ") " + comma + " (" + intOrPercent + "|" + variables + ") " + pe), function(match, expression, context) {
        var b, g, r, _;
        _ = match[0], r = match[1], _ = match[2], _ = match[3], g = match[4], _ = match[5], _ = match[6], b = match[7];
        this.red = context.readIntOrPercent(r);
        this.green = context.readIntOrPercent(g);
        this.blue = context.readIntOrPercent(b);
        return this.alpha = 1;
      });
      registry.createExpression('css_rgba', strip("rgba" + ps + "\\s* (" + intOrPercent + "|" + variables + ") " + comma + " (" + intOrPercent + "|" + variables + ") " + comma + " (" + intOrPercent + "|" + variables + ") " + comma + " (" + float + "|" + variables + ") " + pe), function(match, expression, context) {
        var a, b, g, r, _;
        _ = match[0], r = match[1], _ = match[2], _ = match[3], g = match[4], _ = match[5], _ = match[6], b = match[7], _ = match[8], _ = match[9], a = match[10];
        this.red = context.readIntOrPercent(r);
        this.green = context.readIntOrPercent(g);
        this.blue = context.readIntOrPercent(b);
        return this.alpha = context.readFloat(a);
      });
      registry.createExpression('stylus_rgba', strip("rgba" + ps + "\\s* (" + notQuote + ") " + comma + " (" + float + "|" + variables + ") " + pe), function(match, expression, context) {
        var a, baseColor, subexpr, _;
        _ = match[0], subexpr = match[1], a = match[2];
        baseColor = context.readColor(subexpr);
        if (isInvalid(baseColor)) {
          return this.invalid = true;
        }
        this.rgb = baseColor.rgb;
        return this.alpha = context.readFloat(a);
      });
      registry.createExpression('css_hsl', strip("hsl" + ps + "\\s* (" + int + "|" + variables + ") " + comma + " (" + optionalPercent + "|" + variables + ") " + comma + " (" + optionalPercent + "|" + variables + ") " + pe), function(match, expression, context) {
        var h, hsl, l, s, _;
        _ = match[0], h = match[1], _ = match[2], s = match[3], _ = match[4], l = match[5];
        hsl = [context.readInt(h), context.readFloat(s), context.readFloat(l)];
        if (hsl.some(function(v) {
          return (v == null) || isNaN(v);
        })) {
          return this.invalid = true;
        }
        this.hsl = hsl;
        return this.alpha = 1;
      });
      registry.createExpression('css_hsla', strip("hsla" + ps + "\\s* (" + int + "|" + variables + ") " + comma + " (" + optionalPercent + "|" + variables + ") " + comma + " (" + optionalPercent + "|" + variables + ") " + comma + " (" + float + "|" + variables + ") " + pe), function(match, expression, context) {
        var a, h, hsl, l, s, _;
        _ = match[0], h = match[1], _ = match[2], s = match[3], _ = match[4], l = match[5], _ = match[6], a = match[7];
        hsl = [context.readInt(h), context.readFloat(s), context.readFloat(l)];
        if (hsl.some(function(v) {
          return (v == null) || isNaN(v);
        })) {
          return this.invalid = true;
        }
        this.hsl = hsl;
        return this.alpha = context.readFloat(a);
      });
      registry.createExpression('hsv', strip("(hsv|hsb)" + ps + "\\s* (" + int + "|" + variables + ") " + comma + " (" + optionalPercent + "|" + variables + ") " + comma + " (" + optionalPercent + "|" + variables + ") " + pe), function(match, expression, context) {
        var h, hsv, s, v, _;
        _ = match[0], _ = match[1], h = match[2], _ = match[3], s = match[4], _ = match[5], v = match[6];
        hsv = [context.readInt(h), context.readFloat(s), context.readFloat(v)];
        if (hsv.some(function(v) {
          return (v == null) || isNaN(v);
        })) {
          return this.invalid = true;
        }
        this.hsv = hsv;
        return this.alpha = 1;
      });
      registry.createExpression('hsva', strip("(hsva|hsba)" + ps + "\\s* (" + int + "|" + variables + ") " + comma + " (" + optionalPercent + "|" + variables + ") " + comma + " (" + optionalPercent + "|" + variables + ") " + comma + " (" + float + "|" + variables + ") " + pe), function(match, expression, context) {
        var a, h, hsv, s, v, _;
        _ = match[0], _ = match[1], h = match[2], _ = match[3], s = match[4], _ = match[5], v = match[6], _ = match[7], a = match[8];
        hsv = [context.readInt(h), context.readFloat(s), context.readFloat(v)];
        if (hsv.some(function(v) {
          return (v == null) || isNaN(v);
        })) {
          return this.invalid = true;
        }
        this.hsv = hsv;
        return this.alpha = context.readFloat(a);
      });
      registry.createExpression('vec4', strip("vec4" + ps + "\\s* (" + float + ") " + comma + " (" + float + ") " + comma + " (" + float + ") " + comma + " (" + float + ") " + pe), function(match, expression, context) {
        var a, h, l, s, _;
        _ = match[0], h = match[1], s = match[2], l = match[3], a = match[4];
        return this.rgba = [context.readFloat(h) * 255, context.readFloat(s) * 255, context.readFloat(l) * 255, context.readFloat(a)];
      });
      registry.createExpression('hwb', strip("hwb" + ps + "\\s* (" + int + "|" + variables + ") " + comma + " (" + optionalPercent + "|" + variables + ") " + comma + " (" + optionalPercent + "|" + variables + ") (" + comma + "(" + float + "|" + variables + "))? " + pe), function(match, expression, context) {
        var a, b, h, w, _;
        _ = match[0], h = match[1], _ = match[2], w = match[3], _ = match[4], b = match[5], _ = match[6], _ = match[7], a = match[8];
        this.hwb = [context.readInt(h), context.readFloat(w), context.readFloat(b)];
        return this.alpha = a != null ? context.readFloat(a) : 1;
      });
      registry.createExpression('gray', strip("gray" + ps + "\\s* (" + optionalPercent + "|" + variables + ") (" + comma + "(" + float + "|" + variables + "))? " + pe), 1, function(match, expression, context) {
        var a, p, _;
        _ = match[0], p = match[1], _ = match[2], _ = match[3], a = match[4];
        p = context.readFloat(p) / 100 * 255;
        this.rgb = [p, p, p];
        return this.alpha = a != null ? context.readFloat(a) : 1;
      });
      colors = Object.keys(SVGColors.allCases);
      colorRegexp = "(" + namePrefixes + ")(" + (colors.join('|')) + ")(?!\\s*[-\\.:=\\(])\\b";
      registry.createExpression('named_colors', colorRegexp, function(match, expression, context) {
        var name, _;
        _ = match[0], _ = match[1], name = match[2];
        this.colorExpression = this.name = name;
        return this.hex = SVGColors.allCases[name].replace('#', '');
      });
      registry.createExpression('darken', strip("darken" + ps + " (" + notQuote + ") " + comma + " (" + optionalPercent + "|" + variables + ") " + pe), function(match, expression, context) {
        var amount, baseColor, h, l, s, subexpr, _, _ref2;
        _ = match[0], subexpr = match[1], amount = match[2];
        amount = context.readFloat(amount);
        baseColor = context.readColor(subexpr);
        if (isInvalid(baseColor)) {
          return this.invalid = true;
        }
        _ref2 = baseColor.hsl, h = _ref2[0], s = _ref2[1], l = _ref2[2];
        this.hsl = [h, s, clampInt(l - amount)];
        return this.alpha = baseColor.alpha;
      });
      registry.createExpression('lighten', strip("lighten" + ps + " (" + notQuote + ") " + comma + " (" + optionalPercent + "|" + variables + ") " + pe), function(match, expression, context) {
        var amount, baseColor, h, l, s, subexpr, _, _ref2;
        _ = match[0], subexpr = match[1], amount = match[2];
        amount = context.readFloat(amount);
        baseColor = context.readColor(subexpr);
        if (isInvalid(baseColor)) {
          return this.invalid = true;
        }
        _ref2 = baseColor.hsl, h = _ref2[0], s = _ref2[1], l = _ref2[2];
        this.hsl = [h, s, clampInt(l + amount)];
        return this.alpha = baseColor.alpha;
      });
      registry.createExpression('fade', strip("(fade|alpha)" + ps + " (" + notQuote + ") " + comma + " (" + floatOrPercent + "|" + variables + ") " + pe), function(match, expression, context) {
        var amount, baseColor, subexpr, _;
        _ = match[0], _ = match[1], subexpr = match[2], amount = match[3];
        amount = context.readFloatOrPercent(amount);
        baseColor = context.readColor(subexpr);
        if (isInvalid(baseColor)) {
          return this.invalid = true;
        }
        this.rgb = baseColor.rgb;
        return this.alpha = amount;
      });
      registry.createExpression('transparentize', strip("(transparentize|fadeout|fade-out|fade_out)" + ps + " (" + notQuote + ") " + comma + " (" + floatOrPercent + "|" + variables + ") " + pe), function(match, expression, context) {
        var amount, baseColor, subexpr, _;
        _ = match[0], _ = match[1], subexpr = match[2], amount = match[3];
        amount = context.readFloatOrPercent(amount);
        baseColor = context.readColor(subexpr);
        if (isInvalid(baseColor)) {
          return this.invalid = true;
        }
        this.rgb = baseColor.rgb;
        return this.alpha = clamp(baseColor.alpha - amount);
      });
      registry.createExpression('opacify', strip("(opacify|fadein|fade-in|fade_in)" + ps + " (" + notQuote + ") " + comma + " (" + floatOrPercent + "|" + variables + ") " + pe), function(match, expression, context) {
        var amount, baseColor, subexpr, _;
        _ = match[0], _ = match[1], subexpr = match[2], amount = match[3];
        amount = context.readFloatOrPercent(amount);
        baseColor = context.readColor(subexpr);
        if (isInvalid(baseColor)) {
          return this.invalid = true;
        }
        this.rgb = baseColor.rgb;
        return this.alpha = clamp(baseColor.alpha + amount);
      });
      registry.createExpression('stylus_component_functions', strip("(red|green|blue)" + ps + " (" + notQuote + ") " + comma + " (" + int + "|" + variables + ") " + pe), function(match, expression, context) {
        var amount, baseColor, channel, subexpr, _;
        _ = match[0], channel = match[1], subexpr = match[2], amount = match[3];
        amount = context.readInt(amount);
        baseColor = context.readColor(subexpr);
        if (isInvalid(baseColor)) {
          return this.invalid = true;
        }
        if (isNaN(amount)) {
          return this.invalid = true;
        }
        return this[channel] = amount;
      });
      registry.createExpression('transparentify', strip("transparentify" + ps + " (" + notQuote + ") " + pe), function(match, expression, context) {
        var alpha, bestAlpha, bottom, expr, processChannel, top, _, _ref2;
        _ = match[0], expr = match[1];
        _ref2 = split(expr), top = _ref2[0], bottom = _ref2[1], alpha = _ref2[2];
        top = context.readColor(top);
        bottom = context.readColor(bottom);
        alpha = context.readFloatOrPercent(alpha);
        if (isInvalid(top)) {
          return this.invalid = true;
        }
        if ((bottom != null) && isInvalid(bottom)) {
          return this.invalid = true;
        }
        if (bottom == null) {
          bottom = new Color(255, 255, 255, 1);
        }
        if (isNaN(alpha)) {
          alpha = void 0;
        }
        bestAlpha = ['red', 'green', 'blue'].map(function(channel) {
          var res;
          res = (top[channel] - bottom[channel]) / ((0 < top[channel] - bottom[channel] ? 255 : 0) - bottom[channel]);
          return res;
        }).sort(function(a, b) {
          return a < b;
        })[0];
        processChannel = function(channel) {
          if (bestAlpha === 0) {
            return bottom[channel];
          } else {
            return bottom[channel] + (top[channel] - bottom[channel]) / bestAlpha;
          }
        };
        if (alpha != null) {
          bestAlpha = alpha;
        }
        bestAlpha = Math.max(Math.min(bestAlpha, 1), 0);
        this.red = processChannel('red');
        this.green = processChannel('green');
        this.blue = processChannel('blue');
        return this.alpha = Math.round(bestAlpha * 100) / 100;
      });
      registry.createExpression('hue', strip("hue" + ps + " (" + notQuote + ") " + comma + " (" + int + "deg|" + variables + ") " + pe), function(match, expression, context) {
        var amount, baseColor, h, l, s, subexpr, _, _ref2;
        _ = match[0], subexpr = match[1], amount = match[2];
        amount = context.readFloat(amount);
        baseColor = context.readColor(subexpr);
        if (isInvalid(baseColor)) {
          return this.invalid = true;
        }
        if (isNaN(amount)) {
          return this.invalid = true;
        }
        _ref2 = baseColor.hsl, h = _ref2[0], s = _ref2[1], l = _ref2[2];
        this.hsl = [amount % 360, s, l];
        return this.alpha = baseColor.alpha;
      });
      registry.createExpression('stylus_sl_component_functions', strip("(saturation|lightness)" + ps + " (" + notQuote + ") " + comma + " (" + intOrPercent + "|" + variables + ") " + pe), function(match, expression, context) {
        var amount, baseColor, channel, subexpr, _;
        _ = match[0], channel = match[1], subexpr = match[2], amount = match[3];
        amount = context.readInt(amount);
        baseColor = context.readColor(subexpr);
        if (isInvalid(baseColor)) {
          return this.invalid = true;
        }
        if (isNaN(amount)) {
          return this.invalid = true;
        }
        baseColor[channel] = amount;
        return this.rgba = baseColor.rgba;
      });
      registry.createExpression('adjust-hue', strip("adjust-hue" + ps + " (" + notQuote + ") " + comma + " (-?" + int + "deg|" + variables + "|-?" + optionalPercent + ") " + pe), function(match, expression, context) {
        var amount, baseColor, h, l, s, subexpr, _, _ref2;
        _ = match[0], subexpr = match[1], amount = match[2];
        amount = context.readFloat(amount);
        baseColor = context.readColor(subexpr);
        if (isInvalid(baseColor)) {
          return this.invalid = true;
        }
        _ref2 = baseColor.hsl, h = _ref2[0], s = _ref2[1], l = _ref2[2];
        this.hsl = [(h + amount) % 360, s, l];
        return this.alpha = baseColor.alpha;
      });
      registry.createExpression('mix', strip("mix" + ps + " ( " + notQuote + " " + comma + " " + notQuote + " " + comma + " (" + floatOrPercent + "|" + variables + ") ) " + pe), function(match, expression, context) {
        var amount, baseColor1, baseColor2, color1, color2, expr, _, _ref2, _ref3;
        _ = match[0], expr = match[1];
        _ref2 = split(expr), color1 = _ref2[0], color2 = _ref2[1], amount = _ref2[2];
        if (amount != null) {
          amount = context.readFloatOrPercent(amount);
        } else {
          amount = 0.5;
        }
        baseColor1 = context.readColor(color1);
        baseColor2 = context.readColor(color2);
        if (isInvalid(baseColor1) || isInvalid(baseColor2)) {
          return this.invalid = true;
        }
        return _ref3 = mixColors(baseColor1, baseColor2, amount), this.rgba = _ref3.rgba, _ref3;
      });
      registry.createExpression('tint', strip("tint" + ps + " (" + notQuote + ") " + comma + " (" + floatOrPercent + "|" + variables + ") " + pe), function(match, expression, context) {
        var amount, baseColor, subexpr, white, _;
        _ = match[0], subexpr = match[1], amount = match[2];
        amount = context.readFloatOrPercent(amount);
        baseColor = context.readColor(subexpr);
        if (isInvalid(baseColor)) {
          return this.invalid = true;
        }
        white = new Color(255, 255, 255);
        return this.rgba = mixColors(white, baseColor, amount).rgba;
      });
      registry.createExpression('shade', strip("shade" + ps + " (" + notQuote + ") " + comma + " (" + floatOrPercent + "|" + variables + ") " + pe), function(match, expression, context) {
        var amount, baseColor, black, subexpr, _;
        _ = match[0], subexpr = match[1], amount = match[2];
        amount = context.readFloatOrPercent(amount);
        baseColor = context.readColor(subexpr);
        if (isInvalid(baseColor)) {
          return this.invalid = true;
        }
        black = new Color(0, 0, 0);
        return this.rgba = mixColors(black, baseColor, amount).rgba;
      });
      registry.createExpression('desaturate', "desaturate" + ps + "(" + notQuote + ")" + comma + "(" + floatOrPercent + "|" + variables + ")" + pe, function(match, expression, context) {
        var amount, baseColor, h, l, s, subexpr, _, _ref2;
        _ = match[0], subexpr = match[1], amount = match[2];
        amount = context.readFloatOrPercent(amount);
        baseColor = context.readColor(subexpr);
        if (isInvalid(baseColor)) {
          return this.invalid = true;
        }
        _ref2 = baseColor.hsl, h = _ref2[0], s = _ref2[1], l = _ref2[2];
        this.hsl = [h, clampInt(s - amount * 100), l];
        return this.alpha = baseColor.alpha;
      });
      registry.createExpression('saturate', strip("saturate" + ps + " (" + notQuote + ") " + comma + " (" + floatOrPercent + "|" + variables + ") " + pe), function(match, expression, context) {
        var amount, baseColor, h, l, s, subexpr, _, _ref2;
        _ = match[0], subexpr = match[1], amount = match[2];
        amount = context.readFloatOrPercent(amount);
        baseColor = context.readColor(subexpr);
        if (isInvalid(baseColor)) {
          return this.invalid = true;
        }
        _ref2 = baseColor.hsl, h = _ref2[0], s = _ref2[1], l = _ref2[2];
        this.hsl = [h, clampInt(s + amount * 100), l];
        return this.alpha = baseColor.alpha;
      });
      registry.createExpression('grayscale', "gr(a|e)yscale" + ps + "(" + notQuote + ")" + pe, function(match, expression, context) {
        var baseColor, h, l, s, subexpr, _, _ref2;
        _ = match[0], _ = match[1], subexpr = match[2];
        baseColor = context.readColor(subexpr);
        if (isInvalid(baseColor)) {
          return this.invalid = true;
        }
        _ref2 = baseColor.hsl, h = _ref2[0], s = _ref2[1], l = _ref2[2];
        this.hsl = [h, 0, l];
        return this.alpha = baseColor.alpha;
      });
      registry.createExpression('invert', "invert" + ps + "(" + notQuote + ")" + pe, function(match, expression, context) {
        var b, baseColor, g, r, subexpr, _, _ref2;
        _ = match[0], subexpr = match[1];
        baseColor = context.readColor(subexpr);
        if (isInvalid(baseColor)) {
          return this.invalid = true;
        }
        _ref2 = baseColor.rgb, r = _ref2[0], g = _ref2[1], b = _ref2[2];
        this.rgb = [255 - r, 255 - g, 255 - b];
        return this.alpha = baseColor.alpha;
      });
      registry.createExpression('complement', "complement" + ps + "(" + notQuote + ")" + pe, function(match, expression, context) {
        var baseColor, h, l, s, subexpr, _, _ref2;
        _ = match[0], subexpr = match[1];
        baseColor = context.readColor(subexpr);
        if (isInvalid(baseColor)) {
          return this.invalid = true;
        }
        _ref2 = baseColor.hsl, h = _ref2[0], s = _ref2[1], l = _ref2[2];
        this.hsl = [(h + 180) % 360, s, l];
        return this.alpha = baseColor.alpha;
      });
      registry.createExpression('spin', strip("spin" + ps + " (" + notQuote + ") " + comma + " (-?(" + int + ")(deg)?|" + variables + ") " + pe), function(match, expression, context) {
        var angle, baseColor, h, l, s, subexpr, _, _ref2;
        _ = match[0], subexpr = match[1], angle = match[2];
        baseColor = context.readColor(subexpr);
        angle = context.readInt(angle);
        if (isInvalid(baseColor)) {
          return this.invalid = true;
        }
        _ref2 = baseColor.hsl, h = _ref2[0], s = _ref2[1], l = _ref2[2];
        this.hsl = [(360 + h + angle) % 360, s, l];
        return this.alpha = baseColor.alpha;
      });
      registry.createExpression('contrast_n_arguments', strip("contrast" + ps + " ( " + notQuote + " " + comma + " " + notQuote + " ) " + pe), function(match, expression, context) {
        var base, baseColor, dark, expr, light, res, threshold, _, _ref2, _ref3;
        _ = match[0], expr = match[1];
        _ref2 = split(expr), base = _ref2[0], dark = _ref2[1], light = _ref2[2], threshold = _ref2[3];
        baseColor = context.readColor(base);
        dark = context.readColor(dark);
        light = context.readColor(light);
        if (threshold != null) {
          threshold = context.readPercent(threshold);
        }
        if (isInvalid(baseColor)) {
          return this.invalid = true;
        }
        if (dark != null ? dark.invalid : void 0) {
          return this.invalid = true;
        }
        if (light != null ? light.invalid : void 0) {
          return this.invalid = true;
        }
        res = contrast(baseColor, dark, light);
        if (isInvalid(res)) {
          return this.invalid = true;
        }
        return _ref3 = contrast(baseColor, dark, light, threshold), this.rgb = _ref3.rgb, _ref3;
      });
      registry.createExpression('contrast_1_argument', strip("contrast" + ps + " (" + notQuote + ") " + pe), function(match, expression, context) {
        var baseColor, subexpr, _, _ref2;
        _ = match[0], subexpr = match[1];
        baseColor = context.readColor(subexpr);
        if (isInvalid(baseColor)) {
          return this.invalid = true;
        }
        return _ref2 = contrast(baseColor), this.rgb = _ref2.rgb, _ref2;
      });
      registry.createExpression('css_color_function', "(" + namePrefixes + ")(color" + ps + "(" + notQuote + ")" + pe + ")", function(match, expression, context) {
        var e, expr, rgba, _;
        try {
          _ = match[0], _ = match[1], expr = match[2];
          rgba = cssColor.convert(expr);
          this.rgba = context.readColor(rgba).rgba;
          return this.colorExpression = expr;
        } catch (_error) {
          e = _error;
          return this.invalid = true;
        }
      });
      registry.createExpression('sass_adjust_color', "adjust-color" + ps + "(" + notQuote + ")" + pe, 1, function(match, expression, context) {
        var baseColor, param, params, subexpr, subject, _, _i, _len, _ref2;
        _ = match[0], subexpr = match[1];
        _ref2 = split(subexpr), subject = _ref2[0], params = 2 <= _ref2.length ? __slice.call(_ref2, 1) : [];
        baseColor = context.readColor(subject);
        if (isInvalid(baseColor)) {
          return this.invalid = true;
        }
        for (_i = 0, _len = params.length; _i < _len; _i++) {
          param = params[_i];
          readParam(param, function(name, value) {
            return baseColor[name] += context.readFloat(value);
          });
        }
        return this.rgba = baseColor.rgba;
      });
      registry.createExpression('sass_scale_color', "scale-color" + ps + "(" + notQuote + ")" + pe, 1, function(match, expression, context) {
        var baseColor, param, params, subexpr, subject, _, _i, _len, _ref2;
        _ = match[0], subexpr = match[1];
        _ref2 = split(subexpr), subject = _ref2[0], params = 2 <= _ref2.length ? __slice.call(_ref2, 1) : [];
        baseColor = context.readColor(subject);
        if (isInvalid(baseColor)) {
          return this.invalid = true;
        }
        for (_i = 0, _len = params.length; _i < _len; _i++) {
          param = params[_i];
          readParam(param, function(name, value) {
            var dif, result;
            value = context.readFloat(value) / 100;
            result = value > 0 ? (dif = MAX_PER_COMPONENT[name] - baseColor[name], result = baseColor[name] + dif * value) : result = baseColor[name] * (1 + value);
            return baseColor[name] = result;
          });
        }
        return this.rgba = baseColor.rgba;
      });
      registry.createExpression('sass_change_color', "change-color" + ps + "(" + notQuote + ")" + pe, 1, function(match, expression, context) {
        var baseColor, param, params, subexpr, subject, _, _i, _len, _ref2;
        _ = match[0], subexpr = match[1];
        _ref2 = split(subexpr), subject = _ref2[0], params = 2 <= _ref2.length ? __slice.call(_ref2, 1) : [];
        baseColor = context.readColor(subject);
        if (isInvalid(baseColor)) {
          return this.invalid = true;
        }
        for (_i = 0, _len = params.length; _i < _len; _i++) {
          param = params[_i];
          readParam(param, function(name, value) {
            return baseColor[name] = context.readFloat(value);
          });
        }
        return this.rgba = baseColor.rgba;
      });
      registry.createExpression('stylus_blend', strip("blend" + ps + " ( " + notQuote + " " + comma + " " + notQuote + " ) " + pe), function(match, expression, context) {
        var baseColor1, baseColor2, color1, color2, expr, _, _ref2;
        _ = match[0], expr = match[1];
        _ref2 = split(expr), color1 = _ref2[0], color2 = _ref2[1];
        baseColor1 = context.readColor(color1);
        baseColor2 = context.readColor(color2);
        if (isInvalid(baseColor1) || isInvalid(baseColor2)) {
          return this.invalid = true;
        }
        return this.rgba = [baseColor1.red * baseColor1.alpha + baseColor2.red * (1 - baseColor1.alpha), baseColor1.green * baseColor1.alpha + baseColor2.green * (1 - baseColor1.alpha), baseColor1.blue * baseColor1.alpha + baseColor2.blue * (1 - baseColor1.alpha), baseColor1.alpha + baseColor2.alpha - baseColor1.alpha * baseColor2.alpha];
      });
      blendMethod(registry, 'multiply', BlendModes.MULTIPLY);
      blendMethod(registry, 'screen', BlendModes.SCREEN);
      blendMethod(registry, 'overlay', BlendModes.OVERLAY);
      blendMethod(registry, 'softlight', BlendModes.SOFT_LIGHT);
      blendMethod(registry, 'hardlight', BlendModes.HARD_LIGHT);
      blendMethod(registry, 'difference', BlendModes.DIFFERENCE);
      blendMethod(registry, 'exclusion', BlendModes.EXCLUSION);
      blendMethod(registry, 'average', BlendModes.AVERAGE);
      blendMethod(registry, 'negation', BlendModes.NEGATION);
      if (context != null ? context.hasColorVariables() : void 0) {
        paletteRegexpString = createVariableRegExpString(context.getColorVariables());
        registry.createExpression('variables', paletteRegexpString, 1, function(match, expression, context) {
          var baseColor, name, _;
          _ = match[0], _ = match[1], name = match[2];
          baseColor = context.readColor(name);
          this.colorExpression = name;
          this.variables = baseColor != null ? baseColor.variables : void 0;
          if (isInvalid(baseColor)) {
            return this.invalid = true;
          }
          return this.rgba = baseColor.rgba;
        });
      }
      return registry;
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FuYXMvLmF0b20vcGFja2FnZXMvcGlnbWVudHMvbGliL2NvbG9yLWV4cHJlc3Npb25zLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxrV0FBQTtJQUFBLGtCQUFBOztBQUFBLEVBQUEsUUFBQSxHQUFXLE9BQUEsQ0FBUSxvQkFBUixDQUFYLENBQUE7O0FBQUEsRUFFQSxPQWVJLE9BQUEsQ0FBUSxXQUFSLENBZkosRUFDRSxXQUFBLEdBREYsRUFFRSxhQUFBLEtBRkYsRUFHRSxlQUFBLE9BSEYsRUFJRSx1QkFBQSxlQUpGLEVBS0Usb0JBQUEsWUFMRixFQU1FLHNCQUFBLGNBTkYsRUFPRSxhQUFBLEtBUEYsRUFRRSxnQkFBQSxRQVJGLEVBU0UsbUJBQUEsV0FURixFQVVFLFVBQUEsRUFWRixFQVdFLFVBQUEsRUFYRixFQVlFLGlCQUFBLFNBWkYsRUFhRSxvQkFBQSxZQWJGLEVBY0Usa0NBQUEsMEJBaEJGLENBQUE7O0FBQUEsRUFtQkEsUUFLSSxPQUFBLENBQVEsU0FBUixDQUxKLEVBQ0UsY0FBQSxLQURGLEVBRUUsY0FBQSxLQUZGLEVBR0UsY0FBQSxLQUhGLEVBSUUsaUJBQUEsUUF2QkYsQ0FBQTs7QUFBQSxFQTBCQSxtQkFBQSxHQUFzQixPQUFBLENBQVEsd0JBQVIsQ0ExQnRCLENBQUE7O0FBQUEsRUEyQkEsZUFBQSxHQUFrQixPQUFBLENBQVEsb0JBQVIsQ0EzQmxCLENBQUE7O0FBQUEsRUE0QkEsU0FBQSxHQUFZLE9BQUEsQ0FBUSxjQUFSLENBNUJaLENBQUE7O0FBQUEsRUE2QkEsS0FBQSxHQUFRLE9BQUEsQ0FBUSxTQUFSLENBN0JSLENBQUE7O0FBQUEsRUE4QkEsVUFBQSxHQUFhLE9BQUEsQ0FBUSxlQUFSLENBOUJiLENBQUE7O0FBQUEsRUFnQ0EsaUJBQUEsR0FDRTtBQUFBLElBQUEsR0FB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

//# sourceURL=/Users/anas/.atom/packages/pigments/lib/color-expressions.coffee
