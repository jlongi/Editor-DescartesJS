/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var paramEditor = (function(paramEditor) {

  var auxiliarTransList = ["type", "evaluate", "algorithm", "array", "matrix", "event", "execution", "msg_pos", "library"];

  /**
   *
   */
  paramEditor.ModelDefinition = function(values, tmpType) {
    var obj = null;

    // if the type is variable
    if (tmpType == "variable") {
      obj = {
        id:        "v",
        expression: "0",
        type:      "variable",
        info:       ""
      };
    }
    // if the type is function
    else if (tmpType == "function") {
      obj = {
        id:        "f(x)",
        algorithm: "false",
        expression: "x",
        range:     "",
        local:     "",
        init:      "",
        doExpr:    "",
        whileExpr: "",
        type:      "function",
        info:       ""
      };
    }
    // if the type is array
    else if (tmpType == "array") {
      obj = {
        id:        "V",
        array:     "true",
        evaluate:  "onlyOnce",
        size:      "3",
        expression: "",
        file:      "",
        type:      "array",
        info:       ""
      };
    }
    // if the type is matrix
    else if (tmpType == "matrix") {
      obj = {
        id:        "M",
        matrix:    "true",
        evaluate:  "onlyOnce",
        columns:   "3",
        rows:      "3",
        expression: "",
        type:      "matrix",
        info:       ""
      };
    }
    // if the type is library
    else if (tmpType == "library") {
      obj = {
        // id:   "L",
        file: "",
        type: "library",
        doc:  "",
        info: ""
      }
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

    if (tmpType === "library") {
      obj.content = { data: { definitions : [] } };
    }

    this.data = obj;
  }

  /**
   *
   */
  paramEditor.ModelDefinition.prototype.toString = function() {
    var str = "";
    var value;
    // traverse the values to replace the defaults values of the object
    for (var propName in this.data) {
      // verify the own properties of the object
      if ( (this.data.hasOwnProperty(propName)) && (propName !== "content") ) {
        value = this.data[propName];

        // translate the value
        if (auxiliarTransList.indexOf(propName) >= 0) {
          value = babel.trans(value) || value;
        }

        if (value) {
          str+= babel.trans(propName) + "='" + value.replace(/'/g, "&squot;") + "' ";
        }
      }
    }

    return str;
  }

  return paramEditor;
})(paramEditor || {});
