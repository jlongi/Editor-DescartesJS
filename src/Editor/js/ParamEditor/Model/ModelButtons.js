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
      let babel_name;
      let babel_value;

      for (let val_i of values) {
        babel_name  = babel[val_i.name]  || val_i.name;
        babel_value = babel[val_i.value] || val_i.value;
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
    let tmpStr = "";

    for (let attr_i of ["about", "config", "init", "clear"]) {
      tmpStr += `${babel.trans(attr_i)}=${babel.trans(this.data[attr_i])} `;
    }
    for (let attr_i of ["rowsNorth", "rowsSouth", "widthEast", "widthWest", "heightRows"]) {
      tmpStr += `${babel.trans(attr_i)}=${parseInt(this.data[attr_i] || 0)} `;
    }

    return tmpStr;
  }

  return paramEditor;
})(paramEditor || {});
