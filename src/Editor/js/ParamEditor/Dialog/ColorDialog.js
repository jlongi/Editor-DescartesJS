/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var paramEditor = (function(paramEditor) {

  /**
   *
   */
  paramEditor.ColorDialog = function() {
    this.copy = "000000";
    this.value = "000000";

    var self = this;

    this.dialog = document.createElement("dialog");
    this.dialog.setAttribute("style", "width:850px; height:450px;")

    //
    var topContainer = document.createElement("div");
    topContainer.setAttribute("style", "display: inline-block; height: auto;")

    this.menu = document.createElement("select");
    this.menu.setAttribute("style", "width:180px;")
    var options = ["", "000000", "ff00ff", "0000ff", "00ffff", "00ff00", "ffff00", "ffc800", "ff0000", "ffafaf", "404040", "808080", "c0c0c0", "ffffff"];
    var tmpOption;
    for (var i=0, l=options.length; i<l; i++) {
      tmpOption = document.createElement("option");
      tmpOption.setAttribute("value", options[i]);
      tmpOption.innerHTML = options[i];
      this.menu.appendChild(tmpOption);
    }

    //
    var btn_copy_paste_div = document.createElement("div");
    btn_copy_paste_div.setAttribute("style", "display:inline-block;");
    var btn_copy = document.createElement("button");
    btn_copy.setAttribute("id", "btn_copy_color");
    var btn_paste = document.createElement("button");
    btn_paste.setAttribute("id", "btn_paste_color");
    btn_copy_paste_div.appendChild(btn_copy);
    btn_copy_paste_div.appendChild(btn_paste);

    topContainer.appendChild(this.menu);
    topContainer.appendChild(btn_copy_paste_div)

    //
    var colorControlContainer = document.createElement("div");
    colorControlContainer.setAttribute("class", "color_ctr_container");

    // transp
    var transp_div = document.createElement("div");
    var transp_label = document.createElement("div");
    transp_label.setAttribute("class", "color_tag");
    transp_label.innerHTML = "A";
    this.a_textfield = document.createElement("input");
    this.a_textfield.setAttribute("type", "text");
    this.a_textfield.setAttribute("class", "color_tf");
    this.a_range = document.createElement("input");
    this.a_range.setAttribute("id", "color_A");
    this.a_range.setAttribute("type", "range");
    this.a_range.setAttribute("min", 0);
    this.a_range.setAttribute("max", 255);
    this.a_range.setAttribute("step", 1);
    this.a_range.setAttribute("value", 0);
    this.a_textfield.range = this.a_range;
    this.a_range.textfield = this.a_textfield;
    transp_div.appendChild(transp_label);
    transp_div.appendChild(this.a_textfield);
    transp_div.appendChild(this.a_range);
    colorControlContainer.appendChild(transp_div);

    // R
    var r_div = document.createElement("div");
    var r_label = document.createElement("div");
    r_label.setAttribute("class", "color_tag");
    r_label.innerHTML = "R";
    // r_label.setAttribute("style", "background:#f00;")
    this.r_textfield = document.createElement("input");
    this.r_textfield.setAttribute("type", "text");
    this.r_textfield.setAttribute("class", "color_tf");
    this.r_range = document.createElement("input");
    this.r_range.setAttribute("id", "color_R");
    this.r_range.setAttribute("type", "range");
    this.r_range.setAttribute("min", 0);
    this.r_range.setAttribute("max", 255);
    this.r_range.setAttribute("step", 1);
    this.r_range.setAttribute("value", 0);
    this.r_textfield.range = this.r_range;
    this.r_range.textfield = this.r_textfield;
    r_div.appendChild(r_label);
    r_div.appendChild(this.r_textfield);
    r_div.appendChild(this.r_range);
    colorControlContainer.appendChild(r_div);

    // G
    var g_div = document.createElement("div");
    var g_label = document.createElement("div");
    g_label.setAttribute("class", "color_tag");
    g_label.innerHTML = "G";    
    // g_label.setAttribute("style", "background:#0f0;")
    this.g_textfield = document.createElement("input");
    this.g_textfield.setAttribute("type", "text");
    this.g_textfield.setAttribute("class", "color_tf");
    this.g_range = document.createElement("input");
    this.g_range.setAttribute("id", "color_G");
    this.g_range.setAttribute("type", "range");
    this.g_range.setAttribute("min", 0);
    this.g_range.setAttribute("max", 255);
    this.g_range.setAttribute("step", 1);
    this.g_range.setAttribute("value", 0);
    this.g_textfield.range = this.g_range;
    this.g_range.textfield = this.g_textfield;
    g_div.appendChild(g_label);
    g_div.appendChild(this.g_textfield);
    g_div.appendChild(this.g_range);
    colorControlContainer.appendChild(g_div);

    // B
    var b_div = document.createElement("div");
    var b_label = document.createElement("div");
    b_label.setAttribute("class", "color_tag");
    b_label.innerHTML = "B";
    // b_label.setAttribute("style", "background:#00f;")
    this.b_textfield = document.createElement("input");
    this.b_textfield.setAttribute("type", "text");
    this.b_textfield.setAttribute("class", "color_tf");
    this.b_range = document.createElement("input");
    this.b_range.setAttribute("id", "color_B");
    this.b_range.setAttribute("type", "range");
    this.b_range.setAttribute("min", 0);
    this.b_range.setAttribute("max", 255);
    this.b_range.setAttribute("step", 1);
    this.b_range.setAttribute("value", 0);
    this.b_textfield.range = this.b_range;
    this.b_range.textfield = this.b_textfield;
    b_div.appendChild(b_label);
    b_div.appendChild(this.b_textfield);
    b_div.appendChild(this.b_range);
    colorControlContainer.appendChild(b_div);

    // color block
    var previewContainer = document.createElement("div");
    previewContainer.setAttribute("style", "display: inline-block; width: 120px; text-aling:center; vertical-align: -75px;");
    this.div_color = document.createElement("div");
    this.div_color.setAttribute("class", "color_preview");

    this.preview_hex = document.createElement("input");
    this.preview_hex.setAttribute("type", "text");
    this.preview_hex.setAttribute("style", "width: 100%; margin-top:5px; text-align: center;")

    previewContainer.appendChild(this.div_color);
    previewContainer.appendChild(this.preview_hex);

    var btn_div = document.createElement("div");
    var btn_accept = document.createElement("button");
    btn_accept.setAttribute("id", "btn_accept_color");
    btn_accept.innerHTML = "ace";
    var btn_cancel = document.createElement("button");
    btn_cancel.setAttribute("id", "btn_cancel_color");
    btn_cancel.innerHTML = "can";
    btn_div.appendChild(btn_accept);
    btn_div.appendChild(btn_cancel);

    // build the structure
    this.dialog.appendChild(topContainer);
    this.dialog.appendChild(colorControlContainer);
    this.dialog.appendChild(previewContainer);
    this.dialog.appendChild(btn_div);

    document.body.appendChild(this.dialog);

    function changeTF(evt) {
      if ((this.value.length <= 2) && (this.value.indexOf(".") == -1)) {
        var val_dec = Math.min( Math.max(parseInt(this.value, 16), 0), 255 );
        val_dec = (isNaN(val_dec)) ? 0 : val_dec;
        this.range.value = val_dec;
        this.value = ((val_dec < 16) ? "0" : "") + parseInt(val_dec).toString(16);
      }
      else {
        this.range.value = 0;
      }
      self.changeColor();
    }

    function moveRange(evt) {
      evt.stopPropagation();
      this.textfield.value = ((this.value < 16) ? "0" : "") + parseInt(this.value).toString(16);
      self.changeColor();
    }

    this.a_textfield.addEventListener("change", changeTF);
    this.a_range.addEventListener("input", moveRange);

    this.r_textfield.addEventListener("change", changeTF);
    this.r_range.addEventListener("input", moveRange);

    this.g_textfield.addEventListener("change", changeTF);
    this.g_range.addEventListener("input", moveRange);

    this.b_textfield.addEventListener("change", changeTF);
    this.b_range.addEventListener("input", moveRange);

    this.preview_hex.addEventListener("change", function(evt) {
      self.changePreviewHex();
    });

    this.menu.addEventListener("change", function(evt) {
      self.setValue(this.value);
    });

    btn_copy.addEventListener("click", function(evt) {
      self.copyColor();
    });

    btn_paste.addEventListener("click", function(evt) {
      self.pasteColor();
    })

    btn_accept.addEventListener("click", function(evt) {
      self.dialog.close();
      if (self.component) {
        self.component.setValue(self.value);
      }
    });

    btn_cancel.addEventListener("click", function(evt) {
      self.dialog.close();
    });

    // this.show(color);
  }

  /**
   *
   */
  paramEditor.ColorDialog.prototype.changeColor = function() {
    var a = ((this.a_range.value < 16) ? "0" : "") + parseInt(this.a_range.value).toString(16);
    var r = ((this.r_range.value < 16) ? "0" : "") + parseInt(this.r_range.value).toString(16);
    var g = ((this.g_range.value < 16) ? "0" : "") + parseInt(this.g_range.value).toString(16);
    var b = ((this.b_range.value < 16) ? "0" : "") + parseInt(this.b_range.value).toString(16);
    // this.div_color.style.backgroundColor = "#" + r + g + b;

    var rgbaColor = "rgba(" + parseInt(r, 16) + "," + parseInt(g, 16) + "," + parseInt(b, 16) + "," + (1-parseInt(a, 16)/255) + ")";
    this.div_color.setAttribute("style", "background: linear-gradient(0deg, "+ rgbaColor +", "+ rgbaColor +"), url('css/images/trasparent_background.png') repeat center;")

    this.preview_hex.value = r+g+b+a;

    var a_txt = this.a_textfield.value;
    var r_txt = this.r_textfield.value;
    var g_txt = this.g_textfield.value;
    var b_txt = this.b_textfield.value;

    var tmp_a = parseInt(a_txt, 16);
    tmp_a = (((tmp_a < 16) ? "0" : "")+tmp_a.toString(16));
    var tmp_r = parseInt(r_txt, 16);
    tmp_r = (((tmp_r < 16) ? "0" : "")+tmp_r.toString(16));
    var tmp_g = parseInt(g_txt, 16);
    tmp_g = (((tmp_g < 16) ? "0" : "")+tmp_g.toString(16));
    var tmp_b = parseInt(b_txt, 16);
    tmp_b = (((tmp_b < 16) ? "0" : "")+tmp_b.toString(16));

    if ( (a_txt != tmp_a) || (r_txt != tmp_r) || (g_txt != tmp_g) || (b_txt != tmp_b)) {
      this.value = "(" + r_txt + "," + g_txt + "," + b_txt + "," + a_txt +")";
    }
    else {
      this.value = ((a == "00") ? "" : a) + r + g + b;
    }

    // change the menu to show the name of the color
    if (babel["#" +this.value]) {
      this.menu.value = this.value;
    }
    else {
      this.menu.value = "";
    }
  }

  /**
   *
   */
  paramEditor.ColorDialog.prototype.changePreviewHex = function() {
    var newColor = this.preview_hex.value.toLowerCase();

    // remove the number sign if the color have it
    if (newColor.charAt(0) === "#") {
      newColor = newColor.substring(1);
    }

    // add the alpha value
    if (newColor.length === 6) {
      newColor += "00";
    }

    // if is a valid color, then extracts the values for every entry
    if (newColor.length === 8) {
      var r = newColor.substring(0, 2);
      var g = newColor.substring(2, 4);
      var b = newColor.substring(4, 6);
      var a = newColor.substring(6, 8);

      var intR = parseInt(r, 16);
      var intG = parseInt(g, 16);
      var intB = parseInt(b, 16);
      var intA = parseInt(a, 16);

      if ( !isNaN(intR) && !isNaN(intG) && !isNaN(intB) && !isNaN(intA) && (intR >= 0) && (intR <=255) && (intG >= 0) && (intG <=255) && (intB >= 0) && (intB <=255) && (intA >= 0) && (intA <=255) ) {
        this.r_range.value = intR;
        this.g_range.value = intG;
        this.b_range.value = intB;
        this.a_range.value = intA;

        this.r_textfield.value = r;
        this.g_textfield.value = g;
        this.b_textfield.value = b;
        this.a_textfield.value = a;
      }
    }

    this.changeColor();
  }

  /**
   *
   */
  paramEditor.ColorDialog.prototype.show = function(component) {
    this.component = component;
    this.setValue(component.value);
    this.dialog.showModal();
  }
  paramEditor.ColorDialog.prototype.copyColor = function() {
    paramEditor.scene.setColor(this.getValue());
  }
  paramEditor.ColorDialog.prototype.pasteColor = function() {
    this.setValue(paramEditor.scene.getColor());
  }
  paramEditor.ColorDialog.prototype.setValue = function(color) {
    // the color is a color name
    if (babel[color]) {
      if (babel[color] === "net") {
        color = "rojo";
      }
      color = babel[color];

      this.a_textfield.value = "00";
      this.r_textfield.value = color.substring(1,3);
      this.g_textfield.value = color.substring(3,5);
      this.b_textfield.value = color.substring(5,7);

      this.a_range.value = 0
      this.r_range.value = parseInt(color.substring(1,3), 16);
      this.g_range.value = parseInt(color.substring(3,5), 16);
      this.b_range.value = parseInt(color.substring(5,7), 16);
    }
    // the color is six hexadecimals digits RRGGBB
    else if (color.length === 6) {
      this.a_textfield.value = "00";
      this.r_textfield.value = color.substring(0,2);
      this.g_textfield.value = color.substring(2,4);
      this.b_textfield.value = color.substring(4,6);

      this.a_range.value = 0
      this.r_range.value = parseInt("0x"+color.substring(0,2), 16);
      this.g_range.value = parseInt("0x"+color.substring(2,4), 16);
      this.b_range.value = parseInt("0x"+color.substring(4,6), 16);
    }
    // the color is eight hexadecimals digits #RRGGBBAA
    else if (color.length === 8) {
      this.a_range.value = parseInt("0x"+color.substring(0,2), 16);
      this.r_range.value = parseInt("0x"+color.substring(2,4), 16);
      this.g_range.value = parseInt("0x"+color.substring(4,6), 16);
      this.b_range.value = parseInt("0x"+color.substring(6,8), 16);

      this.a_textfield.value = color.substring(0,2);
      this.r_textfield.value = color.substring(2,4);
      this.g_textfield.value = color.substring(4,6);
      this.b_textfield.value = color.substring(6,8);
    }
    // the color is a Descartes expression (exprR, exprG, exprB, exprA)
    else if (color[0] === "(") {
      tmpColor = [];
      splitColor = paramEditor.splitComa(color.substring(1, color.length-1));

      var i = 0;
      var hexColor = parseInt(splitColor[i], 16);
      var cond = (splitColor[i] != hexColor.toString(16)) && (splitColor[i] !== "0"+hexColor.toString(16));
      this.r_range.value = (cond) ? 0 : hexColor;
      this.r_textfield.value = splitColor[i];

      i++;
      hexColor = parseInt(splitColor[i], 16);
      cond = (splitColor[i] != hexColor.toString(16)) && (splitColor[i] !== "0"+hexColor.toString(16));
      this.g_range.value = (cond) ? 0 : hexColor;
      this.g_textfield.value = splitColor[i];

      i++;
      hexColor = parseInt(splitColor[i], 16);
      cond = (splitColor[i] != hexColor.toString(16)) && (splitColor[i] !== "0"+hexColor.toString(16));
      this.b_range.value = (cond) ? 0 : hexColor;
      this.b_textfield.value = splitColor[i];

      i++;
      hexColor = parseInt(splitColor[i], 16);
      cond = (splitColor[i] != hexColor.toString(16)) && (splitColor[i] !== "0"+hexColor.toString(16));
      this.a_range.value = (cond) ? 0 : hexColor;
      this.a_textfield.value = splitColor[i];
    }

    this.changeColor();
  }
  paramEditor.ColorDialog.prototype.getValue = function() {
    return this.value;
  }

  paramEditor.ColorDialog.prototype.transOptions = function() {
    var domOptions = this.menu.querySelectorAll("option");

    for (var i=0, l=domOptions.length; i<l; i++) {
      domOptions[i].innerHTML = babel.transGUI(domOptions[i].getAttribute("value"));
    }

    this.dialog.querySelector("#btn_copy_color").innerHTML = babel.transGUI("copy_btn");
    this.dialog.querySelector("#btn_paste_color").innerHTML = babel.transGUI("paste_btn");
    this.dialog.querySelector("#btn_accept_color").innerHTML = babel.transGUI("ok_btn");
    this.dialog.querySelector("#btn_cancel_color").innerHTML = babel.transGUI("cancel_btn");
  }

  /**
   * Split a string using a coma delimiter
   * @param {String} string the string to split
   * @return {Array<String>} return an array of the spliting string using a coma delimiter
   */
  paramEditor.splitComa = function(string) {
    splitString = [];
    
    numParentheses = 0;
    numSquareParenteses = 0;

    lastSplitIndex = 0;

    for (var i=0, l=string.length; i<l; i++) {
      charAt = string.charAt(i);
    
      if (charAt === "(") {
        numParentheses++;
      }
      else if (charAt === ")") {
        numParentheses--;
      }
      else if (charAt === "[") {
        numSquareParenteses++;
      }
      else if (charAt === "]") {
        numSquareParenteses--;
      }
      else if ((charAt === ",") && (numParentheses === 0) && (numSquareParenteses === 0)) {
        splitString.push(string.substring(lastSplitIndex, i));
        lastSplitIndex = i+1;
      }
    }
    
    splitString.push(string.substring(lastSplitIndex));
    
    return splitString;
  }

  return paramEditor;
})(paramEditor || {});
