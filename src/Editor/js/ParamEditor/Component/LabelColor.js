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
    paramEditor.GenericComponet.call(this, label, suffix_label, value);

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
    this.setValue(value);

    this.domObj.appendChild(this.label);
    this.domObj.appendChild(this.color);

    var self = this;
    this.color.addEventListener("click", function(evt) {
      paramEditor.colorPanel.show(self);
    });

    this.label.addEventListener("click", function(evt) {
      paramEditor.colorPanel.show(self);
    });

  }

  ////////////////////////////////////////////////////////////////////////////////////
  // create an inheritance of GenericComponet
  ////////////////////////////////////////////////////////////////////////////////////
  paramEditor.extend(paramEditor.LabelColor, paramEditor.GenericComponet);    

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
