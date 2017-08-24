/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var paramEditor = (function(paramEditor) {

  var auxiliarTransList = ["type", "evaluate", "algorithm", "array", "matrix", "event", "execution", "action", "msg_pos"];

  /**
   *
   */
  paramEditor.ModelProgram = function(values, tmpType) {
    var obj = null;

    // if the type is constant
    if (tmpType == "constant") {
      obj = {
        id:        "c1",
        expression: "0",
        evaluate:  "onlyOnce",
        constant:  "true",
        type:      "constant",
        info:       ""
      };
    }
    // if the type is event
    else if (tmpType == "event") {
      obj = {
        id:        "e1",
        "event":   "true",
        condition: "",
        action:    "",
        parameter: "",
        execution: "",
        type:      "event",
        info:       ""
      };
    }
    // if the type is algorithm
    else if (tmpType == "algorithm") {
      obj = {
        id:        "A1",
        algorithm: "true",
        evaluate:  "onlyOnce",
        init:      "",
        doExpr:    "",
        whileExpr: "",
        type:      "algorithm",
        info:       ""
      };
    }

    var value;
    for(var i=0, l=values.length; i<l; i++) {
      if ( (values[i].name) && (babel[values[i].name]) && (obj[babel[values[i].name]] !== undefined) ) {
        value = values[i].value;

        if (auxiliarTransList.indexOf(babel[values[i].name]) >= 0) {
          value = babel[values[i].value] || value;
        }
        
        obj[babel[values[i].name]] = value.replace(/\&squot;/g, "'");
      }
    }
    this.data = obj;
  }

  /**
   *
   */
  paramEditor.ModelProgram.prototype.toString = function() {
    var str = "";
    var value;
    // traverse the values to replace the defaults values of the object
    for (var propName in this.data) {
      // verify the own properties of the object
      if (this.data.hasOwnProperty(propName)) {
        value = this.data[propName];

        // translate the value
        if (auxiliarTransList.indexOf(propName) >= 0) {
          value = babel.trans(value) || value;
        }

        if ((value) && (propName != "type")) {
          str+= babel.trans(propName) + "='" + value.replace(/'/g, "&squot;") + "' ";
        }
      }
    }

    return str;
  }

  return paramEditor;
})(paramEditor || {});
