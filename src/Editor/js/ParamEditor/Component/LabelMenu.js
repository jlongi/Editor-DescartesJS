/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var paramEditor = (function(paramEditor) {

  /**
   *
   */
  paramEditor.LabelMenu = function(label, size, options, value, suffix_label) {
    // call the parent constructor
    paramEditor.GenericComponent.call(this, label, suffix_label, value);
    this.options = options;

    var rnd = parseInt(Math.random()*1000);
    this.domObj = document.createElement("div");
    this.domObj.setAttribute("class", "LabelMenu");
    this.domObj.setAttribute("style", "width:"+size+"%;");
    
    this.label = document.createElement("label");
    this.label.setAttribute("for", label+"_"+rnd);
    this.label.innerHTML = label;

    this.menu = document.createElement("select");
    this.menu.setAttribute("id", label+"_"+rnd);
    this.setValue(value);

    this.makeOptions(options)

    this.domObj.appendChild(this.label);
    this.domObj.appendChild(this.menu);

    var self = this;
    this.menu.addEventListener("change", function(evt) {
      // console.log("cambio en", self.name);
      self.changeValue();
    });

  }

  ////////////////////////////////////////////////////////////////////////////////////
  // create an inheritance of GenericComponent
  ////////////////////////////////////////////////////////////////////////////////////
  paramEditor.extend(paramEditor.LabelMenu, paramEditor.GenericComponent);

  /**
   *
   */
  paramEditor.LabelMenu.prototype.makeOptions = function(options) {
    // remove all previous children
    while (this.menu.firstChild) {
      this.menu.removeChild(this.menu.firstChild);
    }

    // add the new children
    var tmpOption;
    for (var i=0, l=options.length; i<l; i++) {
      tmpOption = document.createElement("option");
      tmpOption.setAttribute("value", options[i]);
      tmpOption.innerHTML = options[i];
      this.menu.appendChild(tmpOption);
    }
  }
  
  /**
   *
   */
  paramEditor.LabelMenu.prototype.transOptions = function() {
    var domOptions = this.menu.querySelectorAll("option");

    for (var i=0, l=domOptions.length; i<l; i++) {
      domOptions[i].innerHTML = babel.transGUI(domOptions[i].getAttribute("value"));
    }
  }

  /**
   *
   */
  paramEditor.LabelMenu.prototype.setValue = function(value) {
// console.log(value)
    this.menu.value = value;
    if ((this.menu.selectedIndex == -1) && (this.menu.length > 0)) {
      this.menu.selectedIndex = 0;
      this.changeValue();
    }
  }

  /**
   *
   */
  paramEditor.LabelMenu.prototype.getValue = function() {
    return this.menu.value;
  }

  /**
   *
   */
  paramEditor.LabelMenu.prototype.changeValue = function() {
    if (this.modelObj) {
      this.modelObj[this.name] = this.menu.value;
    }
    if (this.list) {
      this.list.updatePresentation();
    }
  }

  /**
   *
   */
  paramEditor.LabelMenu.prototype.enable = function() {
    this.menu.removeAttribute("disabled");
  }
  /**
   *
   */
  paramEditor.LabelMenu.prototype.disable = function() {
    this.menu.setAttribute("disabled", "true");
  }

  paramEditor.LabelMenu.prototype.setModelObj = function(obj, list) {
    this.modelObj = obj;
    this.list = list;
    this.value = obj[this.name];
    this.setValue( obj[this.name] );
    this.transLabel();
    this.transOptions();
  }

  return paramEditor;
})(paramEditor || {});