/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var paramEditor = (function(paramEditor) {

  /**
   *
   */
  paramEditor.LabelColor = function(label, size, value, suffix_label) {
    // call the parent constructor
    paramEditor.GenericComponent.call(this, label, suffix_label, value);

    let rnd = parseInt(Math.random()*1000);
    this.domObj = document.createElement("div");
    this.domObj.className = "LabelColor"
    this.domObj.setAttribute("style", "width:"+size+"%;");

    this.label = document.createElement("label");
    this.label.setAttribute("for", label+"_"+rnd);
    this.label.innerHTML = label;

    this.color = document.createElement("div");
    this.color.setAttribute("id", label+"_"+rnd);
    this.color.className = "color_button"
    this.color.setAttribute("tabindex", "0");

    this.setValue(value);

    this.domObj.appendChild(this.label);
    this.domObj.appendChild(this.color);

    let self = this;
    this.color.addEventListener("click", () => {
      paramEditor.colorPanel.show(self);
    });
    this.color.addEventListener("keyup", (evt) => {
      if (evt.key == " ") {
        paramEditor.colorPanel.show(self);
      }
    });


    this.label.addEventListener("click", () => {
      paramEditor.colorPanel.show(self);
    });

    this.label.addEventListener("mousedown", (evt) => {
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
  paramEditor.extend(paramEditor.LabelColor, paramEditor.GenericComponent);    

  /**
   *
   */
  paramEditor.LabelColor.prototype.setValue = function(value_obj) {
    let value = (typeof(value_obj) == "object") ? value_obj.value : value_obj;

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

    else if ((/^GradL/).test(value)) {
      if (value_obj.value_css) {
        this.color.style.background = value_obj.value_css;
      }
      else if (typeof(value_obj) == "string") {
        paramEditor.colorPanel.setValue(value_obj);
        this.color.style.background = paramEditor.colorPanel.value_css;
      }
      else {
        this.color.style.background = "linear-gradient(30deg, #000 0%, #fff 100%)";
      }
    }

    else if ((/^Pattern/).test(value)) {
      this.color.style.backgroundImage = "url('css/images/color_pattern.svg')";
    }

    else if (value.length <7) {
      this.color.style.background = "#" + value;
    }

    else {
      let a = value.substring(0, 2);
      let r = value.substring(2, 4);
      let g = value.substring(4, 6);
      let b = value.substring(6, 8);
      let rgbaColor = "rgba(" + parseInt(r, 16) + "," + parseInt(g, 16) + "," + parseInt(b, 16) + "," + (1-parseInt(a, 16)/255) + ")";
      this.color.style.background = "linear-gradient(0deg, "+ rgbaColor +", "+ rgbaColor +"), url('css/images/trasparent_background.png') repeat center";
    }

    this.changeValue();
  }

  /**
   *
   */
  paramEditor.LabelColor.prototype.getValue = function() {
    return this.value;
  }

  /**
   *
   */
  paramEditor.LabelColor.prototype.changeValue = function() {
    if (this.modelObj) {
      this.modelObj[this.name] = this.value;
    }
    if (this.list) {
      this.list.updatePresentation();
    }
  }

  return paramEditor;
})(paramEditor || {});
