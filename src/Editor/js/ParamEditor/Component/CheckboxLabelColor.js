/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var paramEditor = (function(paramEditor) {

  /**
   *
   */
  paramEditor.CheckboxLabelColor = function(label, size, value, suffix_label) {
    // call the parent constructor
    paramEditor.GenericComponent.call(this, label, suffix_label, value);

    this.defaultValue = "000000";

    var rnd = parseInt(Math.random()*1000);
    this.domObj = document.createElement("div");
    this.domObj.setAttribute("class", "CheckboxLabelColor");
    this.domObj.setAttribute("style", "width:"+size+"%;");
    
    this.label = document.createElement("label");
    this.label.setAttribute("for", label+"_"+rnd);
    this.label.innerHTML = label;

    this.checkbox = document.createElement("input");
    this.checkbox.setAttribute("id", label+"_"+rnd);
    this.checkbox.setAttribute("type", "checkbox");

    this.color = document.createElement("div");
    this.color.setAttribute("id", label+"_"+rnd);
    this.color.setAttribute("class", "color_button");
    this.color.setAttribute("tabindex", "0");

    this.setValue(value);

    this.domObj.appendChild(this.label);
    this.domObj.appendChild(this.checkbox);
    this.domObj.appendChild(this.color);

    var self = this;
    this.checkbox.addEventListener("change", function(evt) {
      if (this.checked) {
        self.setValue(self.defaultValue);
        self.color.setAttribute("tabindex", "0");
      }
      else {
        self.color.style.background = "#ffffff url('css/icons/disable.svg') no-repeat center center";
        self.color.style.backgroundSize = "contain";
        self.color.removeAttribute("tabindex");
      }
      self.changeValue();
    });

    this.color.addEventListener("click", function(evt) {
      // show the color dialog only when the checkbox is checked
      if (self.checkbox.checked) {
        paramEditor.colorPanel.show(self);        
      }
    });
    this.color.addEventListener("keyup", function(evt) {
      if (evt.key == " ") {
        paramEditor.colorPanel.show(self);
      }
    });

    this.label.addEventListener("mousedown", function(evt) {
      // copy the content with the right click
      if (evt.button == 2) {
        evt.preventDefault();
        evt.stopPropagation();

        if (evt.ctrlKey) {
          self.setValue((nw.Clipboard.get()).get('text'));
        }
        else {
          nw.Clipboard.get().set(self.value, "text");
        }
      }
    });
  }

  ////////////////////////////////////////////////////////////////////////////////////
  // create an inheritance of GenericComponent
  ////////////////////////////////////////////////////////////////////////////////////
  paramEditor.extend(paramEditor.CheckboxLabelColor, paramEditor.GenericComponent);

  /**
   *
   */
  paramEditor.CheckboxLabelColor.prototype.setValue = function(value) {
    if ((value == "") || (babel[value] == "false")) {
      this.checkbox.checked = false;
      this.color.style.background = "#ffffff url('css/icons/disable.svg') no-repeat center center";
      this.color.style.backgroundSize = "contain";
      this.color.removeAttribute("tabindex");
    }
    else {
      this.checkbox.checked = true;
      this.color.setAttribute("tabindex", "0");

      if (babel[value]) {
        if (babel[value] == "net") {
          value = "rojo";
        }
        value = babel[value].substring(1);
      }

      if (value == undefined) {
        value = "000000";
      }

      this.value = value;

      if  (value.charAt(0) == "(") {
        this.color.style.background = "#000000";
      }
      else {
        if (value.length <7) {
          this.color.style.background = "#" + value;
        }
        else {
          var a = value.substring(0, 2);
          var r = value.substring(2, 4);
          var g = value.substring(4, 6);
          var b = value.substring(6, 8);
          var rgbaColor = "rgba(" + parseInt(r, 16) + "," + parseInt(g, 16) + "," + parseInt(b, 16) + "," + (1-parseInt(a, 16)/255) + ")";
          this.color.style.background = "linear-gradient(0deg, "+ rgbaColor +", "+ rgbaColor +"), url('css/images/trasparent_background.png') repeat center";
        }
      }

      this.changeValue();
    }    
  }

  /**
   *
   */  
  paramEditor.CheckboxLabelColor.prototype.getValue = function() {
    return this.checked;
  }

  /**
   *
   */
  paramEditor.CheckboxLabelColor.prototype.changeValue = function() {
    if (this.modelObj) {
      this.modelObj[this.name] = (this.checkbox.checked) ? this.value : false;
    }
    if (this.list) {
      this.list.updatePresentation();
    }
  }
  
  return paramEditor;
})(paramEditor || {});
