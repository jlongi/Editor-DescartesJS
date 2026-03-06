/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var paramEditor = (function(paramEditor) {

  /**
   *
   */
  paramEditor.Model = function(applet, scene) {
    this.data = {
      attributes: {
        titleTag: applet.titleTag,
        width: ((applet) ? applet.getAttribute("width") : 970) || 970,
        height: ((applet) ? applet.getAttribute("height") : 550) || 550,
        size: "970x550",
        editable: true,
        expand: "",
        image_loader: "",
        buttons: new paramEditor.ModelButtons()
      },
      spaces: [],
      controls: [],
      definitions: [],
      programs: [],
      graphics: [],
      graphics3D: [],
      animation: new paramEditor.ModelAnimation()
    };

    let children = ((applet) ? applet.querySelectorAll("param") : []);
    let children_name;
    let children_value;
    let babel_name;
    let babel_value;
    let tmpSplit;
    let tmpType;

    for (let children_i of children) {
      children_name = children_i.name;
      children_value = children_i.value;
      babel_name = babel[children_name];

      // space definitions
      if ((/^E/).test(children_name)) {
        this.data.spaces.push( new paramEditor.ModelSpace(this.split(children_value)) );
      }
      // control definitions
      else if ((/^C_/).test(children_name)) {
        this.data.controls.push( new paramEditor.ModelControl(this.split(children_value)) );
      }
      // auxiliar definitions
      else if ((/^A_/).test(children_name)) {
        tmpSplit = this.split(children_value);
        tmpType = this.getTypeAux(tmpSplit);

        if ((/constant|event|algorithm/).test(tmpType)) {
          this.data.programs.push( new paramEditor.ModelProgram(tmpSplit, tmpType) );
        }
        else {
          this.data.definitions.push( new paramEditor.ModelDefinition(tmpSplit, tmpType) );
        }
      }
      // graphics definitions
      else if ((/^G_/).test(children_name)) {
        this.data.graphics.push( new paramEditor.ModelGraphic(this.split(children_value)) );
      }
      // 3d graphics definitions
      else if ((/^S_/).test(children_name)) {
        this.data.graphics3D.push( new paramEditor.ModelGraphic3D(this.split(children_value)) );
      }
      // animation definition
      else if ((/^Anima/).test(children_name)) {
        this.data.animation = new paramEditor.ModelAnimation(this.split(children_value)); 
      }
      // scene params
      else {
        if (babel_name) {
          if (babel_name == "Buttons") {
            this.data.attributes.buttons = new paramEditor.ModelButtons(this.split(children_value));
          }
          else {
            babel_value = babel[children_value] || children_value;

            if (babel_value) {
              this.data.attributes[babel_name] = babel_value;
            }
          }
        }
        else {
          console.log("no se encontro |", children_name, "|");
        }
      }
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // get definitions
    for (let def_i of this.data.definitions) {
      def_i.data.content = { data: { definitions : [] } };

      if ((def_i.data.type === "library") && (def_i.data.file !== "")) {
        let tmpDefs = [];

        let filename = path.normalize(path.dirname(scene.filename) + "/" + def_i.data.file);
        if (fs.existsSync(filename)) {
          tmpDefs = paramEditor.editor.File.open(filename).split(/\n/);
        }
        else {
          for (let descMacros_i of paramEditor.editor.descMacros) {
            if (descMacros_i.getAttribute("id") === def_i.data.file) {
              tmpDefs = descMacros_i.innerHTML.split(/\n/);
            }
          }
        }

        for (let tmpDefs_j of tmpDefs) {
          if (tmpDefs_j) {
            tmpSplit = this.split(tmpDefs_j);
            tmpType = this.getTypeAux(tmpSplit);
            def_i.data.content.data.definitions.push(new paramEditor.ModelDefinition(tmpSplit, tmpType));
          }
        }
      }
    }
  }


  /**
   *
   */
  paramEditor.Model.prototype.getMacro = function() {
    let macroTxt = "";

    // definitions
    for (let data_i of this.data.definitions) {
      macroTxt += data_i.toString() + "\r\n";
    }

    // programs
    for (let data_i of this.data.programs) {
      macroTxt += data_i.toString() + "\r\n";
    }

    // graphics
    for (let data_i of this.data.graphics) {
      macroTxt += data_i.toString() + "\r\n";
    }

    // graphics3D
    for (let data_i of this.data.graphics3D) {
      macroTxt += data_i.toString() + "\r\n";
    }

    return macroTxt;
  }


  /**
   *
   */
  paramEditor.Model.prototype.getLibrary = function() {
    let data;
    let libraryTxt = "";

    for (let data_i of this.data.definitions) {
      libraryTxt += data_i.toString() + "\r\n";
    }

    return libraryTxt;
  }

  /**
   *
   */
  paramEditor.Model.prototype.getApplet = function() {
    let ajs = document.createElement("ajs");
    let data = this.data.attributes;

    // title tag
    ajs.titleTag = data.titleTag;

    //
    let lang = data.language || "español";
    if (lang == "español") {
      lang = "esp";
    }
    else if (lang == "english") {
      lang = "ing";
    }
    let tmpLANG = babel.LANG;
    babel.setLanguage(lang);

    // ajs tag attributes
    ajs.setAttribute("width", parseInt(data.width) || 800);
    ajs.setAttribute("height", parseInt(data.height) || 600);

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////
    // ajs attributes
    // size
    ajs.appendChild( newParam( babel.trans("size"), (parseInt(data.width) || 800) + "x" + (parseInt(data.height) || 600) ) );

    // the decimal symbol attribute
    ajs.appendChild( newParam( babel.trans("decimal_symbol"), data["decimal_symbol"] || "." ) );

    // attributes with value not translatable
    let attr;

    attr = "CreativeCommonsLicense";
    if (data[attr] && (babel[data[attr]] === "true")) {
      ajs.appendChild( newParam( babel.trans(attr), babel.trans(data[attr] || "false") ) );
    }

    attr = "pleca";
    if (data[attr] && (data[attr] !== "")) {
      ajs.appendChild( newParam( babel.trans(attr), data[attr] ) );
    }

    for (let attr_i of ["image_loader", "expand", "name", "version"]) {
      if (data[attr_i] !== "") {
        ajs.appendChild( newParam( babel.trans(attr_i), data[attr_i] || "" ) );
      }
    }

    attr = "editable";
    ajs.appendChild( newParam( babel.trans(attr), babel.trans(data[attr] || "false") ) );

    // language
    ajs.appendChild( newParam( babel.trans("language"), data.language || "español" ) );

    // buttons
    ajs.appendChild( newParam( babel.trans("buttons"), data.buttons.toString() ) );

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////
    // ajs space children
    this.data.spaces.forEach((data_i, i) => {
      ajs.appendChild( newParam( "E_" + ((i<9)?'0':'') + (i+1) , data_i.toString() ) );
    });

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////
    // ajs control children
    this.data.controls.forEach((data_i, i) => {
      ajs.appendChild( newParam( "C_" + ((i<9)?'0':'') + (i+1) , data_i.toString() ) );
    });

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////
    // ajs programs children
    this.data.programs.forEach((data_i, i) => {
      ajs.appendChild( newParam( "A_" + ((i<9)?'0':'') + (i+1) , data_i.toString() ) );
    });

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////
    // ajs definitions children
    data = this.data.definitions;
    let lastA = this.data.programs.length;

    for (let i=0, l=data.length; i<l; i++) {
      ajs.appendChild( newParam( "A_" + (((i+lastA)<9)?'0':'') + (i+lastA+1) , data[i].toString() ) );

      //////////////////////////////////////////////////////////////////////////
      // add the modifications of the library
      //////////////////////////////////////////////////////////////////////////
      if (data[i].data.type === "library") {
        let libContent = "";
        let defs = data[i].data.content.data.definitions

        for (let defs_j of defs) {
          libContent += "\r\n" + defs_j.toString() + "\r\n";
        }

        let descMacros_index = null;

        for (let j=0, k=paramEditor.editor.descMacros.length; j<k; j++) {
          if (paramEditor.editor.descMacros[j].getAttribute("id") === data[i].data.file) {
            descMacros_index = j;
            break;
          }
        }

        // the library content is embedded
        if (descMacros_index !== null) {
          paramEditor.editor.descMacros[descMacros_index].innerHTML = libContent;
          paramEditor.editor.descMacrosText[descMacros_index] = (paramEditor.editor.descMacros[descMacros_index].outerHTML).replace(/(\n)+/g, "\r\n");
        }
        // the library content is not embedded
        else {
          let newLib = document.createElement("script");
          newLib.setAttribute("type", "descartes/library");
          newLib.setAttribute("id", data[i].data.file);
          newLib.innerHTML = libContent;

          paramEditor.editor.descMacros.push(newLib);
          paramEditor.editor.descMacrosText.push( (newLib.outerHTML).replace(/(\n)+/g, "\r\n") );
        }
      }
      //////////////////////////////////////////////////////////////////////////
    }

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////
    // ajs graphics children
    this.data.graphics.forEach((data_i, i) => {
      ajs.appendChild( newParam( "G_" + ((i<9)?'0':'') + (i+1) , data_i.toString() ) );
    });

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////
    // ajs graphics3D children
    this.data.graphics3D.forEach((data_i, i) => {
      ajs.appendChild( newParam( "S_" + ((i<9)?'0':'') + (i+1) , data_i.toString() ) );
    });

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////
    // ajs animation children
    data = this.data.animation;
    if ((data.data.useAnimation == "true") || (data.data.useAnimation == true)) {
      ajs.appendChild( newParam( babel.trans("Animation"), data.toString() ) );
    }

    babel.setLanguage(tmpLANG);

    return ajs;
  }
  /**
   *
   */
  function newParam(name, value) {
    let param = document.createElement("param");
    param.setAttribute("name", name);
    param.setAttribute("value", value);
    return param;
  }

  /**
   *
   */
  paramEditor.Model.prototype.getTypeAux = function(values) {
    let obj = {};
    for (let val_i of values) {
      obj[babel[val_i.name]] = babel[val_i.value] || val_i.value;
    }

    // sequence
    if (obj.sequence) {
      return "sequence";
    }
    // library
    else if ((obj.type) && (obj.type === "library")) {
      return "library";
    }
    // constant
    else if (obj.constant) {
      return "constant";
    }
    // algorithm
    else if ((obj.algorithm) && (obj.evaluate)) {
      return "algorithm";
    }
    // vector
    else if ((obj.array) && (!obj.matrix) && (obj.id.charAt(obj.id.length-1) != ")")) {
      return "array";
    }
    // matrix
    else if ((obj.matrix) && (obj.id.charAt(obj.id.length-1) != ")")) {
      return "matrix";
    }
    // event
    else if ((obj.event) && (obj.id.charAt(obj.id.length-1) != ")")) {
      return "event";
    }
    else {
      // function
      if (obj.id.charAt(obj.id.length-1) === ")") {
        return "function";
      }
      // variable
      else {
        return "variable";
      }
    }
  }

  /**
   * Removes single quotes in the value and divided into an array of parameters name and value pairs
   * @param {String} values the string to divided
   * @return {Array<Array<String>>} return the array of name and value pairs
   */
  paramEditor.Model.prototype.split = function(values) {
    if (typeof(values) != "string") {
      return [];
    }

    values = values || "";
    values = values.replace(/\\'/g, "’");

    let splitValues = [];
    pos = i = initPosToken = endPosToken = 0;
    initToken = stringToken = valueToken = false;

    // traverse the string to split
    while (pos < values.length) {
      // ignoring the blank spaces if not started the identification of a token
      if ((values.charAt(pos) === " ") && (!initToken)) {
        pos++;
      }

      // find a character which is different from a blank space
      if ((values.charAt(pos) !== " ") && (!initToken)) {
        initToken = true;
        initPosToken = pos;
      }

      // values ​​are specified as a string
      if ((values.charAt(pos) === "=") && (values.charAt(pos+1) === "'") && (!stringToken)) {
        stringToken = true;

        splitValues[i] = [values.substring(initPosToken, pos)]

        initPosToken = pos+2;

        pos+=2;
      }

      if ((stringToken) && (values.charAt(pos) === "'")) {
        stringToken = false;

        initToken = false;

        splitValues[i].push(values.substring(initPosToken, pos));

        i++;
      }

      // values ​​are specified as a word sequence
      if ((values.charAt(pos) === "=") && (values.charAt(pos+1) !== "'") && (!stringToken)) {
        splitValues[i] = [values.substring(initPosToken, pos)]

        initPosToken = pos+1;

        pos++;

        // find the next space and equal sign
        tmpIndexEqual = (values.substring(pos)).indexOf("=");

        if (tmpIndexEqual === -1) {
          tmpIndexEqual = values.length;
          tmpIndexSpace = values.length;
        }
        else {
          tmpIndexEqual += pos;

          tmpIndexSpace = values.substring(pos, tmpIndexEqual).lastIndexOf(" ");
          if (tmpIndexSpace === -1) {
            tmpIndexSpace = values.length;
          }
          else {
            tmpIndexSpace += pos;
          }
        }

        splitValues[i].push(values.substring(initPosToken, tmpIndexSpace));
        i++;
        initToken = false;

        pos = tmpIndexSpace;
      }

      pos++;
    }

    let newSplitValues = [];
    for (let i=0, l=splitValues.length; i<l; i++) {
      newSplitValues.push( {
        name:splitValues[i][0],
        value:splitValues[i][1]
      } );
    }

    return newSplitValues;
  }

  return paramEditor;
})(paramEditor || {});
