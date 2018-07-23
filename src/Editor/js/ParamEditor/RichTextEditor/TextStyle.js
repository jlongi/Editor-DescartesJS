/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var richTextEditor = (function(richTextEditor) {

  /**
   * Font style for rtf text
   * @param {Number} fontsize the size of the font
   * @param {String} fontType the font family name
   * @param {String} textItalic the flag if the text is italic
   * @param {String} textBold the flag if the text is bold
   * @param {Boolean} textUnderline the flag if the text is undelined
   * @param {Boolean} textOverline the flag if the text is overlined
   * @param {String} textColor the color of the text
   * @constuctor
   */
  richTextEditor.TextStyle = function(style) {
    // default values
    this.fontSize = 20;
    this.fontType = "Arimo";
    this.textItalic = false;
    this.textBold = false;
    this.textUnderline = false;
    this.textOverline = false;
    this.textColor = null;

    // if the style is null or undefined then pass an empty object
    style = style || {};

    this.set(style);
  }

  /**
   * Clone a font style
   * @return {TextStyle} return a clone font style
   */
  richTextEditor.TextStyle.prototype.clone = function() {
    var style = {};
    for (var property in this) {
      if (this.hasOwnProperty(property)) {
        style[property] = this[property];
      }
    }

    return new richTextEditor.TextStyle(style);
  }

  /**
   * 
   */
  richTextEditor.TextStyle.prototype.set = function(style) {
    for (var property in style) {
      if (style.hasOwnProperty(property)) {
        this[property] = style[property];
      }
    }
  }

  /**
   * 
   */
  richTextEditor.TextStyle.prototype.equals = function(otherStyle) {
    var eq = true;
    for (var property in this) {
      if (this.hasOwnProperty(property)) {
        eq = eq && (this[property] === otherStyle[property]);
      }
    }
    return eq;
  }

  /**
   * Convert the font style to a string representation
   * @return {String} return the string representation of the style
   */
  richTextEditor.TextStyle.prototype.toString = function() {
    if ((/arial/i).test(this.fontType) || (/sansserif/i).test(this.fontType)) {
      this.fontType = "DJS_sansserif,Arial,Helvetica,Sans-serif";
    }
    else if ((/times/i).test(this.fontType) || (/serif/i).test(this.fontType)) {
      this.fontType = "DJS_serif,'Times New Roman',Times,serif";
    }
    else if ((/courier/i).test(this.fontType) || (/monospaced/i).test(this.fontType)) {
      this.fontType = "DJS_monospace,'Courier New',Courier,Monospace";
    }

    return ((this.textBold ? 'bold' : '') + " " + (this.textItalic ? 'italic' : '') + " " + this.fontSize + "px " + this.fontType).trim();
  }

  return richTextEditor;
})(richTextEditor || {});
