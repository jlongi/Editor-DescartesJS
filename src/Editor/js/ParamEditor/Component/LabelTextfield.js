/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var paramEditor = (function(paramEditor) {

  /**
   *
   */
  paramEditor.LabelTextfield = function(label, size, value, hideLabel, suffix_label) {
    // call the parent constructor
    paramEditor.GenericComponent.call(this, label, suffix_label, value);
    
    this.hideLabel = hideLabel;

    var rnd = parseInt(Math.random()*1000);
    this.domObj = document.createElement("div");
    this.domObj.setAttribute("class", "LabelTextfield");
    this.domObj.setAttribute("style", "width:"+size+"%;");

    this.label = document.createElement("label");
    this.label.setAttribute("for", label+"_"+rnd);
    this.label.innerHTML = label;

    this.textfield = document.createElement("input");
    this.textfield.setAttribute("id", label+"_"+rnd);
    this.textfield.setAttribute("type", "text");
    this.setValue(value);

    this.domObj.appendChild(this.label);
    this.domObj.appendChild(this.textfield);

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

  }

  ////////////////////////////////////////////////////////////////////////////////////
  // create an inheritance of GenericComponent
  ////////////////////////////////////////////////////////////////////////////////////
  paramEditor.extend(paramEditor.LabelTextfield, paramEditor.GenericComponent); 

  /**
   *
   */
  paramEditor.LabelTextfield.prototype.setValue = function(value) {
    this.textfield.value = (value || "").toString().replace(/&squot;/g, "'");
  }
  /**
   *
   */
  paramEditor.LabelTextfield.prototype.getValue = function() {
    return this.textfield.value;
  }
  /**
   *
   */
  paramEditor.LabelTextfield.prototype.changeValue = function() {
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
  paramEditor.LabelTextfield.prototype.enable = function() {
    this.textfield.removeAttribute("disabled");
  }
  /**
   *
   */
  paramEditor.LabelTextfield.prototype.disable = function() {
    this.textfield.setAttribute("disabled", "true");
  }

  return paramEditor;
})(paramEditor || {});
