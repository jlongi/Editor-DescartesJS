/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var paramEditor = (function(paramEditor) {

  /**
   *
   */
  paramEditor.LabelCheckbox = function(label, size, value, suffix_label) {
    // call the parent constructor
    paramEditor.GenericComponet.call(this, label, suffix_label, value);

    this.modelObj = null;

    var rnd = parseInt(Math.random()*1000);
    this.domObj = document.createElement("div");
    this.domObj.setAttribute("class", "LabelCheckbox");
    this.domObj.setAttribute("style", "width:"+size+"%;");
    
    this.label = document.createElement("label");
    this.label.setAttribute("for", label+"_"+rnd);
    this.label.innerHTML = label;

    this.checkbox = document.createElement("input");
    this.checkbox.setAttribute("id", label+"_"+rnd);
    this.checkbox.setAttribute("type", "checkbox");
    this.setValue(value);

    this.domObj.appendChild(this.checkbox);
    this.domObj.appendChild(this.label);

    var self = this;
    this.checkbox.addEventListener("change", function(evt) {
      // console.log("cambio en", self.name);
      self.changeValue();
    });
  }

  ////////////////////////////////////////////////////////////////////////////////////
  // create an inheritance of GenericComponet
  ////////////////////////////////////////////////////////////////////////////////////
  paramEditor.extend(paramEditor.LabelCheckbox, paramEditor.GenericComponet);  

  /**
   *
   */
  paramEditor.LabelCheckbox.prototype.setValue = function(value) {
    this.checkbox.checked = ((value == "true") || (value == true));
  }
  /**
   *
   */  
  paramEditor.LabelCheckbox.prototype.getValue = function() {
    return this.checked;
  }

  /**
   *
   */
  paramEditor.LabelCheckbox.prototype.changeValue = function() {
    if (this.modelObj) {
      this.modelObj[this.name] = (this.checkbox.checked) ? "true" : "false";
      // console.log(this.modelObj)
    }
    if (this.list) {
      this.list.updatePresentation();
    }
  }

  /**
   *
   */
  paramEditor.LabelCheckbox.prototype.enable = function() {
    this.checkbox.removeAttribute("disabled");
  }
  paramEditor.LabelCheckbox.prototype.disable = function() {
    this.checkbox.setAttribute("disabled", "true");
  }
  
  return paramEditor;
})(paramEditor || {});
