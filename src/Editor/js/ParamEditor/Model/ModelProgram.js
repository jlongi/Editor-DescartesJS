/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var paramEditor = (function(paramEditor) {

  let auxiliarTransList = ["type", "evaluate", "algorithm", "array", "matrix", "event", "execution", "action", "msg_pos"];

  /**
   *
   */
  paramEditor.ModelProgram = function(values, tmpType) {
    let obj = null;

    // if the type is constant
    if (tmpType == "constant") {
      obj = {
        id: "c1",
        expression: "0",
        evaluate: "onlyOnce",
        constant: "true",
        type: "constant",
        info: ""
      };
    }
    // if the type is event
    else if (tmpType == "event") {
      obj = {
        id: "e1",
        "event": "true",
        condition: "",
        action: "",
        parameter: "",
        execution: "",
        type: "event",
        info: ""
      };
    }
    // if the type is algorithm
    else if (tmpType == "algorithm") {
      obj = {
        id: "A1",
        algorithm: "true",
        evaluate:  "onlyOnce",
        init: "",
        doExpr: "",
        whileExpr: "",
        type: "algorithm",
        info: ""
      };
    }

    let value;
    for (let val_i of values) {
      if ( (val_i.name) && (babel[val_i.name]) && (obj[babel[val_i.name]] !== undefined) ) {
        value = val_i.value;

        if (auxiliarTransList.indexOf(babel[val_i.name]) >= 0) {
          value = babel[val_i.value] || value;
        }
        
        obj[babel[val_i.name]] = value.replace(/\&squot;/g, "'");
      }
    }
    this.data = obj;
  }

  /**
   *
   */
  paramEditor.ModelProgram.prototype.toString = function() {
    let str = "";
    let value;

    // traverse the values to replace the defaults values of the object
    for (let propName in this.data) {
      // verify the own properties of the object
      if (this.data.hasOwnProperty(propName)) {
        value = this.data[propName];

        // translate the value
        if (auxiliarTransList.indexOf(propName) >= 0) {
          value = babel.trans(value) || value;
        }

        if ((value) && (propName != "type")) {
          str+= `${babel.trans(propName)}='${value.replace(/'/g, "&squot;")}' `;
        }
      }
    }

    return str;
  }

  return paramEditor;
})(paramEditor || {});
