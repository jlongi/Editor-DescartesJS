/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var regExpImage = /[\w-//]*(\.png|\.jpg|\.gif|\.svg|\.webp)/gi;
var image_not_found = "css/images/image_not_found.svg";


var paramEditor = (function(paramEditor) {

  /**
   *
   */
  paramEditor.ColorDialog = function() {
    this.copy = "000000";
    this.value = "000000";

    var self = this;

    this.dialog = document.createElement("dialog");
    this.dialog.setAttribute("style", "width:850px; height:450px; position:relative;")

    //
    var tabs = document.createElement("div");
    tabs.setAttribute("style", "position:absolute; top:0; left:0; right:0; height:30px; margin:0; padding:0; border-bottom: 1px solid rgba(0,0,0,0.2); background-color:rgba(0,0,0,0.4);");
    
    this.tab_rgb = document.createElement("button");
    this.tab_rgb.innerHTML = "RGB";
    this.tab_rgb.setAttribute("style", "position:absolute; left:0; top:0; width:120px; box-shadow:none; border-bottom:none; background-color:var(--dialog-background); border-radius: 3px 3px 0 0;");
    this.tab_rgb.addEventListener("click", () => { this.showEditColorPanel("rgb"); });

    this.tab_grad = document.createElement("button");
    this.tab_grad.innerHTML = "Gradiente";
    this.tab_grad.setAttribute("style", "position:absolute; left:130px; top:0;  width:120px; box-shadow:none; border-bottom:none; background-color:rgba(0,0,0,0); border-radius: 3px 3px 0 0;");
    this.tab_grad.addEventListener("click", () => { this.showEditColorPanel("linearGradient"); });

    this.tab_pat = document.createElement("button");
    this.tab_pat.innerHTML = "Patrón";
    this.tab_pat.setAttribute("style", "position:absolute; left:260px; top:0;  width:120px; box-shadow:none; border-bottom:none; background-color:rgba(0,0,0,0); border-radius: 3px 3px 0 0;");
    this.tab_pat.addEventListener("click", () => { this.showEditColorPanel("pattern"); });

    tabs.appendChild(this.tab_rgb);
    tabs.appendChild(this.tab_grad);
    tabs.appendChild(this.tab_pat);

    //////////////////////////////////////////////////////////////////////
    // copy and paste buttons
    var btn_copy_paste_div = document.createElement("div");
    btn_copy_paste_div.setAttribute("style", "position:absolute; left:0; right:0; top:55px; text-align:center; margin:0; padding:0;");
    var btn_copy = document.createElement("button");
    btn_copy.setAttribute("id", "btn_copy_color");
    var btn_paste = document.createElement("button");
    btn_paste.setAttribute("id", "btn_paste_color");
    btn_copy_paste_div.appendChild(btn_copy);
    btn_copy_paste_div.appendChild(btn_paste);

    //////////////////////////////////////////////////////////////////////
    // color configuration
    this.rgbContainer = document.createElement("div");
    this.rgbContainer.setAttribute("style", "position:absolute; left:10px; right:10px; top:90px; bottom:65px; border:1px solid rgba(0,0,0,0.3); border-radius:3px;");

    //
    this.color_menu = document.createElement("select");
    this.color_menu.setAttribute("style", "width:180px; display:block; margin:10px auto 20px auto;");
    var options = ["", "000000", "ff00ff", "0000ff", "00ffff", "00ff00", "ffff00", "ffc800", "ff0000", "ffafaf", "404040", "808080", "c0c0c0", "ffffff"];
    var tmpOption;
    for (var i=0, l=options.length; i<l; i++) {
      tmpOption = document.createElement("option");
      tmpOption.setAttribute("value", options[i]);
      tmpOption.innerHTML = options[i];
      this.color_menu.appendChild(tmpOption);
    }
    this.rgbContainer.appendChild(this.color_menu);

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

    // color
    var previewContainer = document.createElement("div");
    previewContainer.setAttribute("style", "display: inline-block; width: 120px; text-aling:center; vertical-align: -75px;");
    this.div_color = document.createElement("div");
    this.div_color.setAttribute("class", "color_preview");

    this.preview_hex = document.createElement("input");
    this.preview_hex.setAttribute("type", "text");
    this.preview_hex.setAttribute("style", "width: 100%; margin-top:5px; text-align: center;")

    previewContainer.appendChild(this.div_color);
    previewContainer.appendChild(this.preview_hex);

    this.rgbContainer.appendChild(colorControlContainer);
    this.rgbContainer.appendChild(previewContainer);

    //////////////////////////////////////////////////////////////////////
    // pattern configuration
    this.patternContainer = document.createElement("div");
    this.patternContainer.setAttribute("style", "position:absolute; left:10px; right:10px; top:90px; bottom:65px; border:1px solid rgba(0,0,0,0.3); border-radius:3px; overflow:hidden;");

    this.patternImgLabel = document.createElement("label");
    this.patternImgLabel.setAttribute("for", "input_pattern");
    this.patternImgLabel.innerHTML = "Imagen";
    this.patternImgInput = document.createElement("input");
    this.patternImgInput.setAttribute("id", "input_pattern");
    this.patternImgInput.setAttribute("style", "width:70%;");
    this.patternImgInput.value = image_not_found;
    this.imagePreview = document.createElement("img");
    this.imagePreview.setAttribute("style", "border:1px solid black; display:block; margin:10px auto; height:215px;");

    this.patternImgInput.addEventListener("change", (evt) => {
      this.changeImagePreview();
    });
    this.imagePreview.addEventListener("error", (evt) => {
      this.imagePreview.src = image_not_found;
    });

    this.patternContainer.appendChild(this.patternImgLabel);
    this.patternContainer.appendChild(this.patternImgInput);
    this.patternContainer.appendChild(this.imagePreview);

    //////////////////////////////////////////////////////////////////////
    // linear gradient configuration
    this.linearGradientContainer = document.createElement("div");
    this.linearGradientContainer.setAttribute("style", "position:absolute; left:10px; right:10px; top:90px; bottom:65px; border:1px solid rgba(0,0,0,0.3); border-radius:3px;");

    this.grad_preview = document.createElement("div");
    this.grad_preview.setAttribute("style", "width:80%; height:20px; border:1px solid black; display:inline-block;");
    this.pos_div = document.createElement("div")
    this.pos_div.setAttribute("style", "position:absolute; top:40px; left:20px; right:20px; height:30px;");

    this.pos_x1 = document.createElement("input");
    this.pos_x1.setAttribute("id", "gradient_x1");
    this.pos_x1.setAttribute("style", "width:100px;");
    var pos_x1_label = document.createElement("label");
    pos_x1_label.setAttribute("for", "gradient_x1");
    pos_x1_label.setAttribute("style", "padding-top:0;");
    pos_x1_label.innerHTML = "x<sub>1</sub>";

    this.pos_y1 = document.createElement("input");
    this.pos_y1.setAttribute("id", "gradient_y1");
    this.pos_y1.setAttribute("style", "width:100px;");
    var pos_y1_label = document.createElement("label");
    pos_y1_label.setAttribute("for", "gradient_y1");
    pos_y1_label.setAttribute("style", "padding-top:0; margin-left:40px;");
    pos_y1_label.innerHTML = "y<sub>1</sub>";

    this.pos_x2 = document.createElement("input");
    this.pos_x2.setAttribute("id", "gradient_x2");
    this.pos_x2.setAttribute("style", "width:100px;");
    var pos_x2_label = document.createElement("label");
    pos_x2_label.setAttribute("for", "gradient_x2");
    pos_x2_label.setAttribute("style", "padding-top:0; margin-left:40px;");
    pos_x2_label.innerHTML = "x<sub>2</sub>";

    this.pos_y2 = document.createElement("input");
    this.pos_y2.setAttribute("id", "gradient_y2");
    this.pos_y2.setAttribute("style", "width:100px;");
    var pos_y2_label = document.createElement("label");
    pos_y2_label.setAttribute("for", "gradient_y2");
    pos_y2_label.setAttribute("style", "padding-top:0; margin-left:40px;");
    pos_y2_label.innerHTML = "y<sub>2</sub>";

    this.pos_div.appendChild(pos_x1_label);
    this.pos_div.appendChild(this.pos_x1);
    this.pos_div.appendChild(pos_y1_label);
    this.pos_div.appendChild(this.pos_y1);
    this.pos_div.appendChild(pos_x2_label);
    this.pos_div.appendChild(this.pos_x2);
    this.pos_div.appendChild(pos_y2_label);
    this.pos_div.appendChild(this.pos_y2);

    this.pos_x1.addEventListener("change", (evt) => {
      this.changeLinearGradientPreview();
    });
    this.pos_y1.addEventListener("change", (evt) => {
      this.changeLinearGradientPreview();
    });
    this.pos_x2.addEventListener("change", (evt) => {
      this.changeLinearGradientPreview();
    });
    this.pos_y2.addEventListener("change", (evt) => {
      this.changeLinearGradientPreview();
    });

    this.stops_container = document.createElement("div");
    this.stops_container.setAttribute("style", "position:absolute; left:0; right:0; top:85px; bottom:0px; background-color:rgba(0,0,0,0.1); padding:10px; overflow:auto;")
    this.add_stop_btn = document.createElement("button");
    // this.add_stop.setAttribute("id", "add_stop_btn");
    this.add_stop_btn.innerHTML = "+";
    this.stops_container.appendChild(this.add_stop_btn);

    this.add_stop_btn.addEventListener("click", () => this.addGradientStop());

    this.linearGradientContainer.appendChild(this.grad_preview);
    this.linearGradientContainer.appendChild(this.pos_div);
    this.linearGradientContainer.appendChild(this.stops_container);

    //////////////////////////////////////////////////////////////////////
    // bottom buttons (accept and cancel)
    var btn_div = document.createElement("div");
    btn_div.setAttribute("style", "position:absolute; left:0; right:0; bottom:15px;");
    var btn_accept = document.createElement("button");
    btn_accept.setAttribute("id", "btn_accept_color");
    btn_accept.innerHTML = "ace";
    var btn_cancel = document.createElement("button");
    btn_cancel.setAttribute("id", "btn_cancel_color");
    btn_cancel.innerHTML = "can";
    btn_div.appendChild(btn_accept);
    btn_div.appendChild(btn_cancel);

    // build the structure
    this.dialog.appendChild(tabs);
    this.dialog.appendChild(btn_copy_paste_div);
    this.dialog.appendChild(this.rgbContainer);
    this.dialog.appendChild(this.patternContainer);
    this.dialog.appendChild(this.linearGradientContainer);
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

    this.color_menu.addEventListener("change", function(evt) {
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
        self.component.setValue({ 
          value: self.value,
          value_css: self.value_css
        });
      }
    });

    btn_cancel.addEventListener("click", function(evt) {
      self.dialog.close();
    });

// test
// color = {value: "ff0000"};
// color = {value: "Pattern(D:/Escritorio/desarrollo/DescartesJS/DescartesJS_test_nuevo/mozilla.png)"};
// color = {value: "GradL(10,20,30,40,stop|0|ff0000,stop|0.4|00ff00,stop|0.6|00ff00,stop|1|0000ff)"};
// this.show(color);
  }

  /**
   * 
   */
  paramEditor.ColorDialog.prototype.showEditColorPanel = function(tab_idx) {
    this.tab_rgb.style.backgroundColor  = "rgba(0,0,0,0.4)";
    this.tab_grad.style.backgroundColor = "rgba(0,0,0,0.4)";
    this.tab_pat.style.backgroundColor  = "rgba(0,0,0,0.4)";
    
    this.rgbContainer.style.display = "none";
    this.patternContainer.style.display = "none";
    this.linearGradientContainer.style.display = "none";

    this.type_color = tab_idx;

    if (tab_idx == "rgb") {
      this.tab_rgb.style.backgroundColor  = "var(--dialog-background)";
      this.rgbContainer.style.display = "block";
    }
    else if (tab_idx == "linearGradient") {
      this.tab_grad.style.backgroundColor = "var(--dialog-background)";
      this.linearGradientContainer.style.display = "block";
    }
    else if (tab_idx == "pattern") {
      this.tab_pat.style.backgroundColor  = "var(--dialog-background)";
      this.patternContainer.style.display = "block";
    }
    this.changeColor();
  }

  /**
   *
   */
  paramEditor.ColorDialog.prototype.changeColor = function() {
    // rgb
    if (this.type_color == "rgb") {
      var a = ((this.a_range.value < 16) ? "0" : "") + parseInt(this.a_range.value).toString(16);
      var r = ((this.r_range.value < 16) ? "0" : "") + parseInt(this.r_range.value).toString(16);
      var g = ((this.g_range.value < 16) ? "0" : "") + parseInt(this.g_range.value).toString(16);
      var b = ((this.b_range.value < 16) ? "0" : "") + parseInt(this.b_range.value).toString(16);

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
        this.color_menu.value = this.value;
      }
      else {
        this.color_menu.value = "";
      }
    }
    
    // pattern
    else if (this.type_color == "pattern") {
      this.changeImagePreview();
      // this.value = `Pattern(${this.patternImgInput.value})`;
    }

    // linearGradient
    else if (this.type_color == "linearGradient") {
      this.changeLinearGradientPreview();
    }
  }

  /**
   * 
   */
  paramEditor.ColorDialog.prototype.changeImagePreview = function() {
    if (this.patternImgInput.value.match(regExpImage)) {
      if (path.isAbsolute(this.patternImgInput.value || "")) {
        this.imagePreview.src = this.patternImgInput.value;
      }
      else {
        this.imagePreview.src = path.join(this.dirname, this.patternImgInput.value);
      }
    }
    else {
      this.imagePreview.src = image_not_found;
    }

    this.value = `Pattern(${this.patternImgInput.value})`;
    this.value_css = "url('css/images/color_pattern.svg')";
  }

  /**
   * 
   */
  paramEditor.ColorDialog.prototype.changeLinearGradientPreview = function() {
    let val = "";
    let comma = "";
    let str = "linear-gradient(90deg,";

    let stops = this.stops_container.querySelectorAll(".div_gradient_stop");
    let pos;
    let pos_float;
    let col;
    let has_expr = false;

    let css_stops = [];

    for (let i=0; i<stops.length; i++) {
      pos = stops[i].querySelector(".pos_input").value;
      pos_float = parseFloat(pos);
      has_expr = has_expr || isNaN(pos_float);
      col = stops[i].querySelector(".col_input").value;
      comma = (i == stops.length-1) ? "" : ",";
      val += `stop|${pos}|${col.substring(1)}${comma}`;
      css_stops.push({ position: pos_float, color: col });
    }

    // sort the stops for the CSS preview
    if (!has_expr) {
      css_stops = css_stops.sort(function(a,b) {
        if (a.position < b.position) { return -1; }
        else if (a.position > b.position) { return 1; }
        return 0;
      });
      for (let i=0; i<css_stops.length; i++) {
        comma = (i == css_stops.length-1) ? "" : ",";
        str += `${css_stops[i].color} ${css_stops[i].position * 100}%${comma}`;
      }
    }

    str += ")";

    this.grad_preview.style.background = (has_expr) ? "black" : str;
    this.value_css = (has_expr) ? null : str;

    this.value = `GradL(${this.pos_x1.value},${this.pos_y1.value},${this.pos_x2.value},${this.pos_y2.value},${val})`;
  }
  
  /**
   * 
   */
  paramEditor.ColorDialog.prototype.addGradientStop = function(stop_values) {
    let div_stop = document.createElement("div");
    div_stop.setAttribute("class", "div_gradient_stop");
    div_stop.setAttribute("style", "margin-bottom:20px;");
    let pos_label = document.createElement("label");
    pos_label.setAttribute("class", "pos_label");
    pos_label.innerHTML = babel.transGUI("stop");
    let pos = document.createElement("input");
    pos.setAttribute("class", "pos_input");
    pos.setAttribute("style", "width:100px; height:30px;");
    pos.value = (stop_values) ? stop_values.pos : 0;
    let col = document.createElement("input");
    col.setAttribute("class", "col_input");
    col.setAttribute("type", "color");
    col.setAttribute("style", "margin-left:10px; height:30px; position:relative; top:5px;");
    col.value = (stop_values) ? "#"+stop_values.col : "#000000";
    let del_btn = document.createElement("button");
    del_btn.setAttribute("style", "margin-left:10px;");
    del_btn.innerHTML = "−";

    pos.addEventListener("change", (evt) => {
      this.changeLinearGradientPreview();
    });

    col.addEventListener("change", (evt) => {
      this.changeLinearGradientPreview();
    });

    del_btn.addEventListener("click", (evt) => {
      div_stop.parentNode.removeChild(div_stop);
      this.changeLinearGradientPreview();
    });

    div_stop.appendChild(pos_label);
    div_stop.appendChild(pos);
    div_stop.appendChild(col);
    div_stop.appendChild(del_btn);

    this.stops_container.insertBefore(div_stop, this.add_stop_btn);
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
    let filename = (paramEditor && paramEditor.scene && paramEditor.scene.filename) || "";
    this.dirname = path.dirname(filename);
    this.component = component;
    this.clearTextFields();
    this.setValue(component.value);
    this.dialog.showModal();
  }
  paramEditor.ColorDialog.prototype.copyColor = function() {
    paramEditor.scene.setColor(this.getValue());
  }
  paramEditor.ColorDialog.prototype.pasteColor = function() {
    this.setValue(paramEditor.scene.getColor());
  }
  /**
   * 
   */
  paramEditor.ColorDialog.prototype.clearTextFields = function() {
    this.a_textfield.value = this.r_textfield.value = this.g_textfield.value = this.b_textfield.value = "00";
    this.preview_hex.value = this.patternImgInput.value = "";
    this.a_range.value = this.r_range.value = this.g_range.value = this.b_range.value = 0;
    this.pos_x1.value = this.pos_y1.value = this.pos_x2.value = this.pos_y2.value = 0;
    this.clearGradientStops();
  }
  /**
   * 
   */
  paramEditor.ColorDialog.prototype.clearGradientStops = function() {
    let div_stops = this.stops_container.querySelectorAll(".div_gradient_stop");
    for (let i=0; i<div_stops.length; i++) {
      div_stops[i].parentNode.removeChild(div_stops[i]);
    }
  }

  /**
   * 
   */
  paramEditor.ColorDialog.prototype.setValue = function(color) {
    this.type_color = "rgb";

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

    // linear linearGradient
    else if (color.match(/^GradL/)) {
      this.type_color = "linearGradient";
      let split = paramEditor.splitComa(color.substring(6, color.length-1));
      this.pos_x1.value = split[0];
      this.pos_y1.value = split[1];
      this.pos_x2.value = split[2];
      this.pos_y2.value = split[3];
      
      this.clearGradientStops();
      let stop;

      for (let i=4; i<split.length; i++) {
        stop = split[i].split("|");
        this.addGradientStop({pos: stop[1], col: stop[2]});
      }
      this.changeLinearGradientPreview();
    }

    // pattern
    else if (color.match(/^Pattern/)) {
      this.type_color = "pattern";
      this.patternImgInput.value = color.substring(8,color.length-1);
      this.changeImagePreview();
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

    this.showEditColorPanel(this.type_color);
    this.changeColor();
  }
  paramEditor.ColorDialog.prototype.getValue = function() {
    return this.value;
  }

  paramEditor.ColorDialog.prototype.transOptions = function() {
    var domOptions = this.color_menu.querySelectorAll("option");

    for (var i=0, l=domOptions.length; i<l; i++) {
      domOptions[i].innerHTML = babel.transGUI(domOptions[i].getAttribute("value"));
    }

    this.dialog.querySelector("#btn_copy_color").innerHTML = babel.transGUI("copy_btn");
    this.dialog.querySelector("#btn_paste_color").innerHTML = babel.transGUI("paste_btn");
    this.dialog.querySelector("#btn_accept_color").innerHTML = babel.transGUI("ok_btn");
    this.dialog.querySelector("#btn_cancel_color").innerHTML = babel.transGUI("cancel_btn");

    this.patternImgLabel.innerHTML = babel.transGUI("image");
    this.tab_pat.innerHTML = babel.transGUI("pattern");
    this.tab_grad.innerHTML = babel.transGUI("gradient");

    var pos_labels = this.stops_container.querySelectorAll(".pos_label");
    for (let i=0; i<pos_labels.length; i++) {
      pos_labels[i].innerHTML = babel.transGUI("stop");
    }
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
