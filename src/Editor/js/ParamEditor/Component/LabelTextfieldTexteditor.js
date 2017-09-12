/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var paramEditor = (function(paramEditor) {

  /**
   *
   */
  paramEditor.LabelTextfieldTexteditor = function(label, size, value, hideLabel, suffix_label) {
    // call the parent constructor
    paramEditor.GenericComponet.call(this, label, suffix_label, value);
    
    this.hideLabel = hideLabel;

    var rnd = parseInt(Math.random()*1000);
    this.domObj = document.createElement("div");
    this.domObj.setAttribute("class", "LabelTextfieldTexteditor");
    this.domObj.setAttribute("style", "width:"+size+"%;");

    this.label = document.createElement("label");
    this.label.setAttribute("for", label+"_"+rnd);
    this.label.innerHTML = label;

    this.textfield = document.createElement("input");
    this.textfield.setAttribute("id", label+"_"+rnd);
    this.textfield.setAttribute("type", "text");
    this.setValue(value);

    this.btnPlainTextEditor = document.createElement("div");
    this.btnPlainTextEditor.setAttribute("class", "PlainTextEditor");

    this.btnRTFTextEditor = document.createElement("div");
    this.btnRTFTextEditor.setAttribute("class", "RTFTextEditor");

    this.domObj.appendChild(this.label);
    this.domObj.appendChild(this.textfield);
    this.domObj.appendChild(this.btnPlainTextEditor);
    this.domObj.appendChild(this.btnRTFTextEditor);

    var self = this;
    this.textfield.addEventListener("change", function(evt) {
      // store the old value for use in some text fields like the id of spaces
      self.oldValue = self.modelObj[self.name];
      self.changeValue();
    });

    // show the code editor when the parameter attribute gain focus
    this.btnPlainTextEditor.addEventListener("click", function(evt) {
      paramEditor.textEditor.show(self);
    });

    this.label.addEventListener("click", function(evt) {
      self.textfield.select();
    });

    // show the code editor when the parameter attribute gain focus
    this.btnRTFTextEditor.addEventListener("click", function(evt) {
      paramEditor.richTextEditor.show(self);
    });
  }

  ////////////////////////////////////////////////////////////////////////////////////
  // create an inheritance of GenericComponet
  ////////////////////////////////////////////////////////////////////////////////////
  paramEditor.extend(paramEditor.LabelTextfieldTexteditor, paramEditor.GenericComponet);

  /**
   *
   */  
  paramEditor.LabelTextfieldTexteditor.prototype.setValue = function(value) {
    this.textfield.value = (value || "").toString().replace(/&squot;/g, "'");
  }

  /**
   *
   */
  paramEditor.LabelTextfieldTexteditor.prototype.getValue = function() {
    return this.textfield.value;
  }

  /**
   *
   */
  paramEditor.LabelTextfieldTexteditor.prototype.changeValue = function() {
    if (this.modelObj) {
      this.modelObj[this.name] = (this.textfield.value || "").toString().replace(/'/g, "&squot;");
    }
    if (this.list) {
      this.list.updatePresentation();
    }
  }

  /**
   *
   */
  paramEditor.LabelTextfieldTexteditor.prototype.enable = function() {
    this.textfield.removeAttribute("disabled");
  }
  /**
   *
   */
  paramEditor.LabelTextfieldTexteditor.prototype.disable = function() {
    this.textfield.setAttribute("disabled", "true");
  }

  return paramEditor;
})(paramEditor || {});
