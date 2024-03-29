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
    paramEditor.GenericComponent.call(this, label, suffix_label, value);
    
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
    this.btnPlainTextEditor.setAttribute("tabindex", "0");
    
    this.btnRTFTextEditor = document.createElement("div");
    this.btnRTFTextEditor.setAttribute("class", "RTFTextEditor");
    this.btnRTFTextEditor.setAttribute("tabindex", "0");

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

    // show the code editor when the parameter are clicked
    this.btnPlainTextEditor.addEventListener("click", function(evt) {
      paramEditor.textEditor.show(self);
    });
    this.btnPlainTextEditor.addEventListener("keyup", function(evt) {
      if (evt.key == " ") {
        paramEditor.textEditor.show(self);
      }
    });

    this.label.addEventListener("click", function(evt) {
      self.textfield.select();
    });

    // show the code editor when the parameter attribute gain focus
    this.btnRTFTextEditor.addEventListener("click", function(evt) {
      paramEditor.richTextEditor.show(self);
    });
    this.btnRTFTextEditor.addEventListener("keyup", function(evt) {
      if (evt.key == " ") {
        paramEditor.richTextEditor.show(self);
      }
    });

    this.label.addEventListener("mousedown", function(evt) {
      // copy the content with the right click
      if (evt.button == 2) {
        evt.preventDefault();
        evt.stopPropagation();

        if (evt.ctrlKey) {
          self.setValue((nw.Clipboard.get()).get('text'));
          self.oldValue = self.modelObj[self.name];
          self.changeValue();
        }
        else {
          nw.Clipboard.get().set(self.textfield.value, "text");
        }
      }
    });
  }

  ////////////////////////////////////////////////////////////////////////////////////
  // create an inheritance of GenericComponent
  ////////////////////////////////////////////////////////////////////////////////////
  paramEditor.extend(paramEditor.LabelTextfieldTexteditor, paramEditor.GenericComponent);

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
