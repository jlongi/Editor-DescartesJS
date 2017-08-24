/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var paramEditor = (function(paramEditor) {

  /**
   *
   */
  paramEditor.LabelTextarea = function(label, width, height, value, hideLabel, suffix_label) {
    // call the parent constructor
    paramEditor.GenericComponet.call(this, label, suffix_label, value);

    this.adjust = 0;
    this.hideLabel = hideLabel;
    this.width = width;
    this.height = height;

    var rnd = parseInt(Math.random()*1000);
    this.domObj = document.createElement("div");
    this.domObj.setAttribute("class", "LabelTextarea");
    this.domObj.setAttribute("style", "width:"+width+"%;");
    
    this.label = document.createElement("label");
    this.label.setAttribute("for", label+"_"+rnd);
    this.label.innerHTML = label;

    this.textarea = document.createElement("textarea");
    this.textarea.setAttribute("id", label+"_"+rnd);
    this.textarea.setAttribute("style", "height:"+height+"px; overflow:"+ ((height < 30) ? "hidden" : "scroll") + ";");

    this.setValue(value);

    this.domObj.appendChild(this.label);
    this.domObj.appendChild(this.textarea);

    var self = this;
    this.textarea.addEventListener("change", function(evt) {
      // console.log("cambio en", self.name);
      self.changeValue();
    });
    this.textarea.addEventListener("keydown", function(evt) {
      if (evt.which == 13 || evt.keyCode == 13) {

        if ( (self.name != "doc") && 
               ( 
                 ((self.name != "doExpr") && (self.name != "expression")) ||
                 ((self.name == "expression") && ((self.modelObj.type != "matrix") && (self.modelObj.type != "array")))
               ) 
           ) {
          evt.stopPropagation();  
          evt.preventDefault();
          return false;
        }
      }
      return true;
    });

    this.label.addEventListener("click", function(evt) {
      self.textarea.select();
    });

  }

  ////////////////////////////////////////////////////////////////////////////////////
  // create an inheritance of GenericComponet
  ////////////////////////////////////////////////////////////////////////////////////
  paramEditor.extend(paramEditor.LabelTextarea, paramEditor.GenericComponet);

  /**
   *
   */
  paramEditor.LabelTextarea.prototype.transLabel = function() {
    if (this.hideLabel) {
      this.label.innerHTML = "";
      this.label.style.display = "none";
      this.textarea.style.marginLeft = "10px";
      this.domObj.setAttribute("title", this.getTooltip());
    }
    else {
      this.label.innerHTML = babel.transGUI(this.name + this.suffix_label);
      this.label.setAttribute("title", this.getTooltip());
    }
  }

  /**
   *
   */  
  paramEditor.LabelTextarea.prototype.setValue = function(value) {
    value = (value || "").toString().replace(/&squot;/g, "'");
    if ( (this.name == "doc") || (this.name == "doExpr") || ((this.modelObj) && (this.name == "expression") && ((this.modelObj.type == "matrix") || (this.modelObj.type == "array"))) ) {
      value = paramEditor.replaceSeparators(value);
    }

    this.textarea.value = value;
  }

  /**
   *
   */
  paramEditor.LabelTextarea.prototype.getValue = function() {
    return this.textarea.value;
  }

  /**
   *
   */
  paramEditor.LabelTextarea.prototype.changeValue = function() {
    if (this.modelObj) {
      this.modelObj[this.name] = (this.textarea.value || "").toString().replace(/'/g, "&squot;").replace(/\n/g, ";");
    }
    if (this.list) {
      this.list.updatePresentation();
    }
  }

  /**
   *
   */
  paramEditor.LabelTextarea.prototype.adjustHeight = function(adjust) {
    this.adjust = adjust;
    if (this.height > 30) {
      this.textarea.style.height = (this.height + adjust) + "px";
    }
  }

  /**
   *
   */
  paramEditor.LabelTextarea.prototype.enable = function() {
    this.textarea.removeAttribute("disabled");
  }
  /**
   *
   */
  paramEditor.LabelTextarea.prototype.disable = function() {
    this.textarea.setAttribute("disabled", "true");
  }

  /**
   *
   */
  paramEditor.LabelTextarea.prototype.setModelObj = function(obj, list) {
    // make breakable some texts
    if ( (self.name != "doc") && 
               ( 
                 ((self.name != "doExpr") && (self.name != "expression")) ||
                 ((self.name == "expression") && ((self.modelObj.type != "matrix") && (self.modelObj.type != "array")))
               ) 
           ) {
      this.textarea.style.whiteSpace = "pre";
      this.textarea.style.wordWrap = "break-word";
    }
    else {
      this.textarea.style.whiteSpace = "pre";
      this.textarea.style.wordWrap = "normal";
    }

    // exceptions for the expression parameter :(
    if (this.name == "expression") {
      if ((obj.type == "variable") || (obj.type == "function") || (obj.type == "constant")) {
        this.height = 28;
        this.textarea.setAttribute("style", "overflow:hidden; height:28px;");
      }
      else {
        this.height = 348;
        this.textarea.setAttribute("style", "overflow:scroll; height:"+ (this.height + this.adjust) +"px;");
      }
    }

    this.modelObj = obj;
    this.list = list;
    this.setValue( obj[this.name] );
    this.transLabel();
  }

  return paramEditor;
})(paramEditor || {});
