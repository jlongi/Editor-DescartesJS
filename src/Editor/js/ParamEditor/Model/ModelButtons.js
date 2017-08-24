/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var paramEditor = (function(paramEditor) {

  /**
   *
   */
  paramEditor.ModelButtons = function(values) {
    this.data = {
      about: "true",
      config: "true",
      init: "true",
      clear: "true",
      rowsNorth: "0",
      rowsSouth: "0",
      widthWest: "150",
      widthEast: "150",
      heightRows: "23"
    }

    if (values) {
      var babel_name;
      var babel_value;

      for (var i=0, l=values.length; i<l; i++) {
        babel_name  = babel[values[i].name]  || values[i].name;
        babel_value = babel[values[i].value] || values[i].value;
        if (babel_name == "height") {
          babel_name = "heightRows";
        }

        this.data[babel_name] = babel_value;
      }
    }
  }

  /**
   *
   */
  paramEditor.ModelButtons.prototype.toString = function() {
    var tmpStr = "";
    var attr = ["about", "config", "init", "clear"];
    for (var i=0, l=attr.length; i<l; i++) {
      tmpStr+= babel.trans(attr[i]) + "=" + babel.trans(this.data[attr[i]]) + " ";
    }
    attr = ["rowsNorth", "rowsSouth", "widthEast", "widthWest", "heightRows"];
    for (var i=0, l=attr.length; i<l; i++) {
      tmpStr+= babel.trans(attr[i]) + "=" + parseInt(this.data[attr[i]] || 0) + " ";
    }

    return tmpStr;
  }

  return paramEditor;
})(paramEditor || {});
