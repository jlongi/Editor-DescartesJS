  /**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var paramEditor = (function(paramEditor) {

  let animationTransList = ["useAnimation", "controls", "auto", "loop"];

  /**
   *
   */
  paramEditor.ModelAnimation = function(values) {
    this.data = {
      useAnimation: "false",
      delay: "40",
      controls: "true",
      auto: "true",
      loop: "false",
      init: "",
      doExpr: "",
      whileExpr: "",
      info: ""
    };

    if (values) {
      this.data.useAnimation = "true";

      let value;
      for (let val_i of values) {
        if ( (val_i.name) && (babel[val_i.name]) && (this.data[babel[val_i.name]] !== undefined) ) {
          value = val_i.value;
          if (animationTransList.indexOf(babel[val_i.name]) >= 0) {
            value = babel[val_i.value];
          }
          this.data[babel[val_i.name]] = value.replace(/\&squot;/g, "'");
        }
      }
    }
  }

  /**
   *
   */
  paramEditor.ModelAnimation.prototype.toString = function() {
    let str = "";
    let value;

    // traverse the values to replace the defaults values of the object
    for (let propName in this.data) {
      // verify the own properties of the object
      if (this.data.hasOwnProperty(propName)) {
        value = this.data[propName];

        // translate the value
        if (animationTransList.indexOf(propName) >= 0) {
          value = babel.trans(value) || value;
        }

        if ((value) && (propName != "useAnimation")) {
          str+= babel.trans(propName) + "='" + value.replace(/'/g, "&squot;") + "' ";
        }
      }
    }

    return str;
  }

  return paramEditor;
})(paramEditor || {});
