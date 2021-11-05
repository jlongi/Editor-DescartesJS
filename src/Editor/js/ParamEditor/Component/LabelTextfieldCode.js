/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var paramEditor = (function(paramEditor) {

  /**
   *
   */
  paramEditor.LabelTextfieldCode = function(label, size, value, hideLabel, suffix_label) {
    // call the parent constructor
    paramEditor.GenericComponent.call(this, label, suffix_label, value);
    
    this.hideLabel = hideLabel;
    this.isEnable = true;

    var rnd = parseInt(Math.random()*1000);
    this.domObj = document.createElement("div");
    this.domObj.setAttribute("class", "LabelTextfieldCode");
    this.domObj.setAttribute("style", "width:"+size+"%;");
    
    this.label = document.createElement("label");
    this.label.setAttribute("for", label+"_"+rnd);
    this.label.innerHTML = label;

    this.textfield = document.createElement("input");
    this.textfield.setAttribute("id", label+"_"+rnd);
    this.textfield.setAttribute("type", "text");
    this.setValue(value);

    this.btnCode = document.createElement("div");
    this.btnCode.setAttribute("tabindex", "0");

    this.domObj.appendChild(this.label);
    this.domObj.appendChild(this.textfield);
    this.domObj.appendChild(this.btnCode);

    var self = this;
    this.textfield.addEventListener("change", function(evt) {
      // console.log("cambio en", self.name);
      // store the old value for use in some text fields like the id of spaces
      self.oldValue = self.modelObj[self.name];
      self.changeValue();
    });

    this.label.addEventListener("click", function(evt) {
      self.textfield.select();
    });

    // show the code editor when the parameter attribute gain focus
    this.btnCode.addEventListener("click", function(evt) {
      if (self.isEnable) {
        paramEditor.codeEditor.show(self);
      }
    });
    this.btnCode.addEventListener("keyup", function(evt) {
      if (evt.key == " ") {
        paramEditor.codeEditor.show(self);
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
  paramEditor.extend(paramEditor.LabelTextfieldCode, paramEditor.GenericComponent);   


  /**
   *
   */
  paramEditor.LabelTextfieldCode.prototype.setValue = function(value) {
    this.textfield.value = (value || "").toString().replace(/&squot;/g, "'");
  }

  /**
   *
   */
  paramEditor.LabelTextfieldCode.prototype.getValue = function() {
    return this.textfield.value;
  }

  /**
   *
   */
  paramEditor.LabelTextfieldCode.prototype.changeValue = function() {
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
  paramEditor.LabelTextfieldCode.prototype.enable = function() {
    this.btnCode.style.backgroundColor = "var(--input-background)";
    this.btnCode.style.cursor = "pointer";
    this.textfield.removeAttribute("disabled");
    this.isEnable = true;
  }
  /**
   *
   */  
  paramEditor.LabelTextfieldCode.prototype.disable = function() {
    this.btnCode.style.backgroundColor = "var(--disable-background)";
    this.btnCode.style.cursor = "default";
    this.textfield.setAttribute("disabled", "true");
    this.isEnable = false;
  }

  return paramEditor;
})(paramEditor || {});
