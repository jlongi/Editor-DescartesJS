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

    var rnd = parseInt(Math.random()*1000);
    this.domObj = document.createElement("div");
    this.domObj.setAttribute("class", "LabelColor");
    this.domObj.setAttribute("style", "width:"+size+"%;");

    this.label = document.createElement("label");
    this.label.setAttribute("for", label+"_"+rnd);
    this.label.innerHTML = label;

    this.color = document.createElement("div");
    this.color.setAttribute("id", label+"_"+rnd);
    this.color.setAttribute("class", "color_button");
    this.color.setAttribute("tabindex", "0");

    this.setValue(value);

    this.domObj.appendChild(this.label);
    this.domObj.appendChild(this.color);

    var self = this;
    this.color.addEventListener("click", function(evt) {
      paramEditor.colorPanel.show(self);
    });
    this.color.addEventListener("keyup", function(evt) {
      if (evt.key == " ") {
        paramEditor.colorPanel.show(self);
      }
    });


    this.label.addEventListener("click", function(evt) {
      paramEditor.colorPanel.show(self);
    });
    let input_copy;

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
  paramEditor.extend(paramEditor.LabelColor, paramEditor.GenericComponent);    

  /**
   *
   */
  paramEditor.LabelColor.prototype.setValue = function(value) {
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
      // console.log(this.modelObj)
    }
    if (this.list) {
      this.list.updatePresentation();
    }
  }

  return paramEditor;
})(paramEditor || {});
