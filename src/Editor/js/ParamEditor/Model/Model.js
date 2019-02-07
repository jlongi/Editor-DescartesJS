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

    var children = ((applet) ? applet.querySelectorAll("param") : []);
    var children_name;
    var children_value;
    var babel_name;
    var babel_value;
    var buttoms_params;
    var tmpSplit;
    var tmpType;

// console.log(children)
    for (var i=0, l=children.length; i<l; i++) {
      children_name = children[i].name;
      children_value = children[i].value;
      babel_name = babel[children_name];

      // space definitions
      if (children_name.match(/^E/)) {
        this.data.spaces.push( new paramEditor.ModelSpace(this.split(children_value)) );
      }
      // control definitions
      else if (children_name.match(/^C_/)) {
        this.data.controls.push( new paramEditor.ModelControl(this.split(children_value)) );
      }
      // auxiliar definitions
      else if (children_name.match(/^A_/)) {
        tmpSplit = this.split(children_value);
        tmpType = this.getTypeAux(tmpSplit);

        if ( (tmpType == "constant") || (tmpType == "event") || (tmpType == "algorithm")) {
          this.data.programs.push( new paramEditor.ModelProgram(tmpSplit, tmpType) );
        }
        else {
          this.data.definitions.push( new paramEditor.ModelDefinition(tmpSplit, tmpType) );
        }
      }
      // graphics definitions
      else if (children_name.match(/^G_/)) {
        this.data.graphics.push( new paramEditor.ModelGraphic(this.split(children_value)) );
      }
      // 3d graphics definitions
      else if (children_name.match(/^S_/)) {
        this.data.graphics3D.push( new paramEditor.ModelGraphic3D(this.split(children_value)) );
      }
      // animation definition
      else if (children_name.match(/^Anima/)) {
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
    for (var i=0, l=this.data.definitions.length; i<l; i++) {
      this.data.definitions[i].data.content = { data: { definitions : [] } };

      if ((this.data.definitions[i].data.type === "library") && (this.data.definitions[i].data.file !== "")) {
        var tmpDefs = [];

        var filename = path.normalize(path.dirname(scene.filename) + "/" + this.data.definitions[i].data.file);
        if (fs.existsSync(filename)) {
          tmpDefs = paramEditor.editor.File.open(filename).split(/\n/);
        }
        else {
          for (var mI=0, mL=paramEditor.editor.descMacros.length; mI<mL; mI++) {
            if (paramEditor.editor.descMacros[mI].getAttribute("id") === this.data.definitions[i].data.file) {
              tmpDefs = paramEditor.editor.descMacros[mI].innerHTML.split(/\n/);
            }
          }
        }

        for (var j=0, k=tmpDefs.length; j<k; j++) {
          if (tmpDefs[j]) {
            tmpSplit = this.split(tmpDefs[j]);
            tmpType = this.getTypeAux(tmpSplit);
            this.data.definitions[i].data.content.data.definitions.push(new paramEditor.ModelDefinition(tmpSplit, tmpType));
          }
        }
      }
    }
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  }


  /**
   *
   */
  paramEditor.Model.prototype.getMacro = function() {
    var data;
    // var macroTxt = "tipo_de_macro=R2\r\nIdioma=español\r\n";
    var macroTxt = "";

    data = this.data.definitions;
    for (var i=0, l=data.length; i<l; i++) {
      macroTxt += data[i].toString() + "\r\n";
    }

    data = this.data.programs;
    for (var i=0, l=data.length; i<l; i++) {
      macroTxt += data[i].toString() + "\r\n";
    }

    data = this.data.graphics;
    for (var i=0, l=data.length; i<l; i++) {
      macroTxt += data[i].toString() + "\r\n";
    }

    data = this.data.graphics3D;
    for (var i=0, l=data.length; i<l; i++) {
      macroTxt += data[i].toString() + "\r\n";
    }

    return macroTxt;
  }


  /**
   *
   */
  paramEditor.Model.prototype.getLibrary = function() {
    var data;
    var libraryTxt = "";

    data = this.data.definitions;
    for (var i=0, l=data.length; i<l; i++) {
      libraryTxt += data[i].toString() + "\r\n";
    }

    return libraryTxt;
  }

  /**
   *
   */
  paramEditor.Model.prototype.getApplet = function() {
    var ajs = document.createElement("ajs");
    var data = this.data.attributes;

    //
    var lang = data.language || "español";
    if (lang == "español") {
      lang = "esp";
    }
    else if (lang == "english") {
      lang = "ing";
    }
    var tmpLANG = babel.LANG;
    babel.setLanguage(lang);

    // ajs tag attributes
    ajs.setAttribute("width", parseInt(data.width) || 800);
    ajs.setAttribute("height", parseInt(data.height) || 600);

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////
    // ajs attributes
    // size
    ajs.appendChild(
      newParam(
        babel.trans("size"),
        (parseInt(data.width) || 800) + "x" + (parseInt(data.height) || 600)
      )
    );

    // the decimal symbol attribute
    ajs.appendChild(
      newParam(
        babel.trans("decimal_symbol"),
        data["decimal_symbol"] || "."
      )
    );

    // atributes with value not translatable
    var attr = ["image_loader", "expand", "name", "version", "pleca"];
    for (var i=0, l=attr.length; i<l; i++) {
      ajs.appendChild(
        newParam(
          babel.trans(attr[i]),
          data[attr[i]] || ""
        )
      );
    }

    // atributes with value translatable
    attr = ["antialias", "undo", "editable", "CreativeCommonsLicense"];
    for (var i=0, l=attr.length; i<l; i++) {
      ajs.appendChild(
        newParam(
          babel.trans(attr[i]),
          babel.trans(data[attr[i]] || "false")
        )
      );
    }

    // language
    ajs.appendChild(
      newParam(
        babel.trans("language"),
        data.language || "espa\u00F1ol"
      )
    );

    // buttons
    ajs.appendChild(
      newParam(
        babel.trans("buttons"),
        data.buttons.toString()
      )
    );

    // arquimedes
    if (paramEditor.scene.applet.getAttribute("code") === "Arquimedes") {
      // atributes with value not translatable
      var attr = ["pleca", "rtf", "rtf_height"];
      for (var i=0, l=attr.length; i<l; i++) {
        if (data[attr[i]] != undefined) {
          ajs.appendChild(
            newParam(
              babel.trans(attr[i]),
              data[attr[i]] || ""
            )
          );
        }
      }
    }


    ///////////////////////////////////////////////////////////////////////////////////////////////////////////
    // ajs space children
    data = this.data.spaces;

    for (var i=0, l=data.length; i<l; i++) {
      ajs.appendChild(
        newParam(
          "E_" + ((i<9)?'0':'') + (i+1) ,
          data[i].toString()
        )
      );
    }

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////
    // ajs control children
    data = this.data.controls;

    for (var i=0, l=data.length; i<l; i++) {
      ajs.appendChild(
        newParam(
          "C_" + ((i<9)?'0':'') + (i+1) ,
          data[i].toString()
        )
      );
    }

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////
    // ajs definitions children
    data = this.data.definitions;

    for (var i=0, l=data.length; i<l; i++) {
      ajs.appendChild(
        newParam(
          "A_" + ((i<9)?'0':'') + (i+1) ,
          data[i].toString()
        )
      );

      //////////////////////////////////////////////////////////////////////////
      // add the modifications of the library
      //////////////////////////////////////////////////////////////////////////
      if (data[i].data.type === "library") {
        var libContent = "";
        var defs = data[i].data.content.data.definitions

        for (var j=0, k=defs.length; j<k; j++) {
          libContent += "\r\n" + defs[j].toString() + "\r\n";
        }

        var descMacros_index = null;

        for (var j=0, k=paramEditor.editor.descMacros.length; j<k; j++) {
          if (paramEditor.editor.descMacros[j].getAttribute("id") === data[i].data.file) {
            descMacros_index = j;
            break;
          }
        }

        // the library content is embeded
        if (descMacros_index !== null) {
          paramEditor.editor.descMacros[descMacros_index].innerHTML = libContent;
          paramEditor.editor.descMacrosText[descMacros_index] = (paramEditor.editor.descMacros[descMacros_index].outerHTML).replace(/(\n)+/g, "\r\n");
        }
        // the library content is not embeded
        else {
          var newLib = document.createElement("script");
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
    // ajs programs children
    data = this.data.programs;
    var lastA = l;

    for (var i=0, l=data.length; i<l; i++) {
      ajs.appendChild(
        newParam(
          "A_" + (((i+lastA)<9)?'0':'') + (i+lastA+1) ,
          data[i].toString()
        )
      );
    }

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////
    // ajs graphics children
    data = this.data.graphics;

    for (var i=0, l=data.length; i<l; i++) {
      ajs.appendChild(
        newParam(
          "G_" + ((i<9)?'0':'') + (i+1) ,
          data[i].toString()
        )
      );
    }

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////
    // ajs graphics3D children
    data = this.data.graphics3D;

    for (var i=0, l=data.length; i<l; i++) {
      ajs.appendChild(
        newParam(
          "S_" + ((i<9)?'0':'') + (i+1) ,
          data[i].toString()
        )
      );
    }

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////
    // ajs animation children
    data = this.data.animation;
    if ((data.data.useAnimation == "true") || (data.data.useAnimation == true)) {
      ajs.appendChild(
        newParam(
          babel.trans("Animation"),
          data.toString()
        )
      );
    }

    babel.setLanguage(tmpLANG);

    return ajs;
  }
  /**
   *
   */
  function newParam(name, value) {
    var param = document.createElement("param");
    param.setAttribute("name", name);
    param.setAttribute("value", value);
    return param;
  }

  /**
   *
   */
  paramEditor.Model.prototype.getTypeAux = function(values) {
    var obj = {};
    for (var i=0,l=values.length; i<l; i++) {
      obj[babel[values[i].name]] = babel[values[i].value] || values[i].value;
    }

    // sequence
    if (obj.sequence) {
      return "sequence";
    }
    // library
    else if ((obj.type) && (obj.type === "library")) {
      return "library";
    }
    // jsfun
    else if ((obj.type) && (obj.type === "jsfun")) {
      return "jsfun";
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

    splitValues = [];
    pos = 0;
    i = 0;
    initToken = false;
    initPosToken = 0;
    endPosToken = 0;
    stringToken = false;
    valueToken = false;

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

    var newSplitValues = [];
    for (var i=0, l=splitValues.length; i<l; i++) {
      newSplitValues.push( { name:splitValues[i][0], value:splitValues[i][1] } );
    }

    return newSplitValues;
  }

  return paramEditor;
})(paramEditor || {});
