/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var paramEditor = (function(paramEditor) {

  /**
   *
   */
  paramEditor.GenericComponent = function(label, suffix_label, value) {
    this.panelName = paramEditor.panelName;
    this.name = label;
    this.suffix_label = suffix_label || "";
    this.value = value;
    this.hideLabel = false;
  }

  /**
   *
   */
  paramEditor.GenericComponent.prototype.transLabel = function() {
    if (this.btnCode) {
      this.btnCode.setAttribute("title", tooltip[paramEditor.lang].Extra.expand);
    }
    if (this.btnPlainTextEditor) {
      this.btnPlainTextEditor.setAttribute("title", tooltip[paramEditor.lang].Extra.simple_text_editor);
    }
    if (this.btnPlainTextEditor) {
      this.btnRTFTextEditor.setAttribute("title", tooltip[paramEditor.lang].Extra.rich_text_editor);
    }

    if (this.hideLabel) {
      this.label.innerHTML = "";
      this.label.style.padding = "5px 4px";
      this.domObj.setAttribute("title", this.getTooltip());
    }
    else {
      // special cases
      if (this.modelObj && (this.modelObj.gui === "button") && (this.name === "color")) {
        this.label.innerHTML = babel.transGUI(this.name + this.suffix_label + "_BTN");
      }
      else if ((this.panelName === "Graphics") && this.modelObj && (this.modelObj.type === "text") && (this.name === "width")) {
        this.label.innerHTML = babel.transGUI(this.name + "_TEXT");
      }
      else if ((this.panelName === "Graphics") && this.modelObj && (this.modelObj.type === "image") && (this.name === "inirot")) {
        this.label.innerHTML = babel.transGUI(this.name + "_IMG");
      }
      else if ((this.panelName === "Graphics") && this.modelObj && (this.modelObj.type === "macro") && (this.name === "inirot")) {
        this.label.innerHTML = babel.transGUI(this.name + "_MACRO");
      }
      else if ((this.panelName === "Graphics") && this.modelObj && (this.modelObj.type === "macro") && (this.name === "inipos")) {
        this.label.innerHTML = babel.transGUI(this.name + "_MACRO");
      }
      else if ((this.panelName === "Graphics") && this.modelObj && (this.modelObj.type === "macro") && (this.name === "expression")) {
        this.label.innerHTML = babel.transGUI(this.name + "_MACRO");
      }
      else if ((this.panelName === "Graphics3D") && this.modelObj && (this.modelObj.type === "text") && (this.name === "width")) {
        this.label.innerHTML = babel.transGUI(this.name + "_TEXT");
      }
      else if ((this.panelName === "Buttons") && ((this.name === "about") || (this.name === "config") || (this.name === "init") || (this.name === "clear"))) {
        this.label.innerHTML = babel.transGUI(this.name + "_SCENE");
      }
      else {
        this.label.innerHTML = babel.transGUI(this.name + this.suffix_label);
      }

      this.label.setAttribute("title", this.getTooltip());
    }
  }

  /**
   *
   */
  paramEditor.GenericComponent.prototype.setLabel = function(label) {
    this.label.innerHTML = label;
  }

  /**
   *
   */
  paramEditor.GenericComponent.prototype.getTooltip = function() {
    var tooltipStr = "tooltip:\n   panelName: " + this.panelName + "\n   parameterName: " + this.name;
    var name = this.name;

    if ( (tooltip[paramEditor.lang]) && (tooltip[paramEditor.lang][this.panelName]) && (tooltip[paramEditor.lang][this.panelName][this.name]) ) {

      // 
      if ((this.panelName == "Spaces") && (this.name == "fixed")) {
        if ((this.modelObj) && (this.modelObj.type)) {
          name += "_" + this.modelObj.type;
        }
      }

      //
      if ((this.panelName == "Controls") && (this.name == "text")) {
        if ((this.modelObj) && (this.modelObj.type == "text")) {
          name += "_CTRTEXT";
        }
      }

      //
      if (this.panelName == "Graphics") {
        if ((this.name == "color") && (this.modelObj) && (this.modelObj.type == "arrow")) {
          name += "_ARROW";
        }

        if ((this.name == "drawif") && (this.modelObj) && (this.modelObj.type == "equation")) {
          name += "_EQUATION";
        }

        if ((this.name == "expression") && (this.modelObj)) {
          name += "_" + this.modelObj.type.toUpperCase();
        }

        if ((this.name == "size") && (this.modelObj)) {
          name += "_" + this.modelObj.type.toUpperCase();
        }

        if ((this.name == "width") && (this.modelObj)) {
          name += "_" + this.modelObj.type.toUpperCase();
        }
      }

      //
      if (this.panelName == "Graphics3D") {
        if ((this.name == "expression") && (this.modelObj)) {
          name += "_" + this.modelObj.type.toUpperCase();
        }

        if ((this.name == "width") && (this.modelObj)) {
          name += "_" + this.modelObj.type.toUpperCase();
        }

        if ((this.name == "length") && (this.modelObj)) {
          name += "_" + this.modelObj.type.toUpperCase();
        }
      }

      // for graphic control differentiation
      if ((this.panelName == "Controls") && (this.modelObj) && (this.modelObj.type == "graphic")) {
        if ((name == "color") || (name == "colorInt") || (name == "image") || (name == "expression")) {
          name += "_CTRGRAPHIC";
        }
      }

      tooltipStr = tooltip[paramEditor.lang][this.panelName][name];
    }

    return tooltipStr; 
  }  

  /**
   *
   */
  paramEditor.GenericComponent.prototype.setModelObj = function(obj, list) {
    this.modelObj = obj;
    this.list = list;
    this.setValue( obj[this.name] );
    this.transLabel();
  }  

  return paramEditor;
})(paramEditor || {});
