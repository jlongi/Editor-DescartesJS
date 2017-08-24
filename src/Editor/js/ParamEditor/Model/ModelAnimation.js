  /**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var paramEditor = (function(paramEditor) {

  var animationTransList = ["useAnimation", "controls", "auto", "loop"];

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
      info:       ""
    }

    if (values) {
      var obj = {
        useAnimation: "true",
        delay: "40",
        controls: "true",
        auto: "true",
        loop: "false",
        init: "",
        doExpr: "",
        whileExpr: "",
        info:       ""
      }

      var value;
      for(var i=0, l=values.length; i<l; i++) {
        if ( (values[i].name) && (babel[values[i].name]) && (obj[babel[values[i].name]] !== undefined) ) {
          value = values[i].value;
          if (animationTransList.indexOf(babel[values[i].name]) >= 0) {
            value = babel[values[i].value];
          }
          obj[babel[values[i].name]] = value.replace(/\&squot;/g, "'");
        }
      }

      this.data = obj;
    }
  }

  /**
   *
   */
  paramEditor.ModelAnimation.prototype.toString = function() {
    var str = "";
    var value;
    // traverse the values to replace the defaults values of the object
    for (var propName in this.data) {
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
