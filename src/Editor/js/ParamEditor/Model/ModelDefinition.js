/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var paramEditor = (function(paramEditor) {

  let auxiliarTransList = ["type", "evaluate", "algorithm", "array", "matrix", "event", "execution", "msg_pos", "library"];

  /**
   *
   */
  paramEditor.ModelDefinition = function(values, tmpType) {
    let obj = null;

    // if the type is variable
    if (tmpType == "variable") {
      obj = {
        id: "v",
        expression: "0",
        type: "variable",
        info: ""
      };
    }
    // if the type is function
    else if (tmpType == "function") {
      obj = {
        id: "f(x)",
        algorithm: "false",
        expression: "x",
        range: "",
        local: "",
        init: "",
        doExpr: "",
        whileExpr: "",
        type: "function",
        info: ""
      };
    }
    // if the type is array
    else if (tmpType == "array") {
      obj = {
        id: "V",
        array: "true",
        evaluate: "onlyOnce",
        size: "3",
        expression: "",
        file: "",
        type: "array",
        info: ""
      };
    }
    // if the type is matrix
    else if (tmpType == "matrix") {
      obj = {
        id: "M",
        matrix: "true",
        evaluate: "onlyOnce",
        columns: "3",
        rows: "3",
        expression: "",
        file: "",
        type: "matrix",
        info: ""
      };
    }
    // if the type is library
    else if (tmpType == "library") {
      obj = {
        // id: "L",
        file: "",
        type: "library",
        doc: "",
        info: ""
      }
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

    if (tmpType === "library") {
      obj.content = { data: { definitions : [] } };

      if ((obj.file !== "") && paramEditor.model) {
        let tmpDefs = [];

        let filename = path.normalize(path.dirname(paramEditor.scene.filename) + "/" + obj.file);
        if (fs.existsSync(filename)) {
          tmpDefs = paramEditor.editor.File.open(filename).split(/\n/);
        }
        else {
          for (let descMacros_i of paramEditor.editor.descMacros) {
            if (descMacros_i.getAttribute("id") === obj.file) {
              tmpDefs = descMacros_i.innerHTML.split(/\n/);
            }
          }
        }

        for (let tmpDefs_i of tmpDefs) {
          if (tmpDefs_i) {
            tmpSplit = paramEditor.model.split(tmpDefs_i);
            tmpType = paramEditor.model.getTypeAux(tmpSplit);
            obj.content.data.definitions.push(new paramEditor.ModelDefinition(tmpSplit, tmpType));
          }
        }
      }

    }

    this.data = obj;
  }

  /**
   *
   */
  paramEditor.ModelDefinition.prototype.toString = function() {
    let str = "";
    let value;

    // traverse the values to replace the defaults values of the object
    for (let propName in this.data) {
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
