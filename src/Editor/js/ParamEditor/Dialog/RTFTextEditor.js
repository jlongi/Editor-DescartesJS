/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var paramEditor = (function(paramEditor) {

  /**
   *
   */
  paramEditor.RTFTextEditor = function() {
    var self = this;
    
    var rnd = parseInt(Math.random()*1000);

    this.dialog = new editor.Dialog("calc(100% - 20px)", "calc(100% - 20px)", "", "", "");

    var toolbar = document.createElement("div");
    toolbar.setAttribute("class", "toolbar");
    toolbar.setAttribute("style", "display:flex; align-items:center; justify-content:space-between; align-content:flex-start; width:100%; padding:0; margin:0 0 10px 0; height:30px; font-size:16px;")

    // font family menu
    this.fontFamilySelect = document.createElement("select");
    this.fontFamilySelect.setAttribute("style", "display:inline-flex; flex-grow:1; width:15%; height:30px; margin:0 10px 0 0; text-align-last:left;");
    var tmpOption;
    var options = ["SansSerif", "Serif", "Monospaced"];
    for (var i=0, l=options.length; i<l; i++) {
      tmpOption = document.createElement("option");
      tmpOption.setAttribute("value", options[i]);
      tmpOption.innerHTML = options[i];
      this.fontFamilySelect.appendChild(tmpOption);
    }

    // font size menu
    this.fontSizeSelect = document.createElement("select");
    this.fontSizeSelect.setAttribute("style", "display:inline-flex; flex-grow:1; width:8%; height:30px; margin:0 10px 0 0; text-align-last:left;");
    var tmpOption;
    var options = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 32, 34, 36, 38, 40, 42, 44, 46, 48, 52, 56, 60, 64, 68, 72, 76, 80];
    for (var i=0, l=options.length; i<l; i++) {
      tmpOption = document.createElement("option");
      tmpOption.setAttribute("value", options[i]);
      tmpOption.innerHTML = options[i];
      this.fontSizeSelect.appendChild(tmpOption);
    }

    // bold checkbox
    var boldDom = document.createElement("div");
    boldDom.setAttribute("style", "display:flex; flex-grow:1; align-items:center; width:8%; height:30px; margin:0; padding:0; background:var(--input-background); border: 1px solid var(--input-border); margin-right:10px;");
    var boldLabel = document.createElement("label");
    boldLabel.setAttribute("style", "position:relative; margin:0px; padding:2px 12px 0 10px;")
    boldLabel.setAttribute("for", "bold_"+rnd);
    boldLabel.innerHTML = "<b>n</b>";
    this.boldCheckbox = document.createElement("input");
    this.boldCheckbox.setAttribute("id", "bold_"+rnd);
    this.boldCheckbox.setAttribute("type", "checkbox");
    boldDom.appendChild(this.boldCheckbox);
    boldDom.appendChild(boldLabel);

    // italic checkbox
    var italicDom = document.createElement("div");
    italicDom.setAttribute("style", "display:flex; flex-grow:1; align-items:center; width:8%; height:30px; margin:0; padding:0; background:var(--input-background); border: 1px solid var(--input-border); margin-right:10px;");
    var italicLabel = document.createElement("label");
    italicLabel.setAttribute("style", "position:relative; margin:0px; padding:2px 12px 0 10px;")
    italicLabel.setAttribute("for", "italic_"+rnd);
    italicLabel.innerHTML = "<i>it</i>";
    this.italicCheckbox = document.createElement("input");
    this.italicCheckbox.setAttribute("id", "italic_"+rnd);
    this.italicCheckbox.setAttribute("type", "checkbox");
    italicDom.appendChild(this.italicCheckbox);
    italicDom.appendChild(italicLabel);

    // color button
    this.colorDom = document.createElement("div");
    this.colorDom.setAttribute("class", "richTextEditor_button richTextEditor_color");

    // formula button
    var formulaDom = document.createElement("div");
    formulaDom.setAttribute("class", "richTextEditor_button richTextEditor_formula");

    // color expression
    var expressionDom = document.createElement("div");
    expressionDom.setAttribute("class", "richTextEditor_button richTextEditor_expression");

    // fraction button
    var fractionDom = document.createElement("div");
    fractionDom.setAttribute("class", "richTextEditor_button richTextEditor_fraction");

    // super index button
    var superIndexDom = document.createElement("div");
    superIndexDom.setAttribute("class", "richTextEditor_button richTextEditor_superIndex");

    // sub index button
    var subIndexDom = document.createElement("div");
    subIndexDom.setAttribute("class", "richTextEditor_button richTextEditor_subIndex");

    // radical button
    var radicalDom = document.createElement("div");
    radicalDom.setAttribute("class", "richTextEditor_button richTextEditor_radical");

    // sum button
    var sumDom = document.createElement("div");
    sumDom.setAttribute("class", "richTextEditor_button richTextEditor_sum");

    // integral button
    var integralDom = document.createElement("div");
    integralDom.setAttribute("class", "richTextEditor_button richTextEditor_integral");

    // limit button
    var limitDom = document.createElement("div");
    limitDom.setAttribute("class", "richTextEditor_button richTextEditor_limit");

    // matrix button
    var matrixDom = document.createElement("div");
    matrixDom.setAttribute("class", "richTextEditor_button richTextEditor_matrix");

    // cases button
    var casesDom = document.createElement("div");
    casesDom.setAttribute("class", "richTextEditor_button richTextEditor_cases");

    // utf table button
    var utfTableDom = document.createElement("div");
    utfTableDom.setAttribute("class", "richTextEditor_button richTextEditor_utfTable");

    toolbar.appendChild(this.fontFamilySelect);
    toolbar.appendChild(this.fontSizeSelect);
    toolbar.appendChild(boldDom);
    toolbar.appendChild(italicDom);
    toolbar.appendChild(this.colorDom);
    toolbar.appendChild(formulaDom);
    toolbar.appendChild(expressionDom);
    toolbar.appendChild(fractionDom);
    toolbar.appendChild(superIndexDom);
    toolbar.appendChild(subIndexDom);
    toolbar.appendChild(radicalDom);
    toolbar.appendChild(sumDom);
    toolbar.appendChild(integralDom);
    toolbar.appendChild(limitDom);
    toolbar.appendChild(matrixDom);
    toolbar.appendChild(casesDom);
    toolbar.appendChild(utfTableDom);

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    this.textArea = document.createElement("div");
    this.textArea.setAttribute("class", "Content textEditorTextArea");
    this.textArea.setAttribute("style", "width:100%; height:85%; flex-grow:1; text-align:left; padding:5px; margin:0; white-space:pre-wrap; display:inline-block; overflow-y:scroll; background:white;");
    this.rtfParser = new richTextEditor.RTFParser();
    this.txtConverter = new richTextEditor.TextConverter();
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    var btn_div = document.createElement("div");
    var btn_accept = document.createElement("button");
    btn_accept.setAttribute("id", "btn_accept_code_editor");
    btn_accept.innerHTML = "ace";
    var btn_cancel = document.createElement("button");
    btn_cancel.setAttribute("id", "btn_cancel_code_editor");
    btn_cancel.innerHTML = "can";
    btn_div.appendChild(btn_accept);
    btn_div.appendChild(btn_cancel);


    //
    this.dialog.body.style.background = "var(--dialog-background)";
    this.dialog.content.style.padding = "10px";
    this.dialog.content.style.height = "100%";
    this.dialog.btnContainer.style.textAlign = "center";

    //
    this.dialog.content.appendChild(toolbar);
    this.dialog.content.appendChild(this.textArea);
    this.dialog.btnContainer.appendChild(btn_div);

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    this.fontFamilySelect.addEventListener("change", function() { 
      if (self.textController) {
        self.textController.changeFontFamily(this.value);
      }
    });
    this.fontSizeSelect.addEventListener("change", function() {
      if (self.textController) {
        self.textController.changeFontSize(this.value);
      }
    });
    this.boldCheckbox.addEventListener("change", function() {
      if (self.textController) {
        self.textController.changeStyleProp({ name:"font-weight", value:"bold" });
      }
    });
    this.italicCheckbox.addEventListener("change", function() { 
      if (self.textController) {
        self.textController.changeStyleProp({ name:"font-style", value:"italic" });
      }
    });

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    this.colorDom.addEventListener("click", function(evt) {
      self.selection = window.getSelection();
      self.range = self.selection.getRangeAt(0);

      paramEditor.colorPanel.show({
        value: self.color,
        setValue: function(val) { self.changeColor(val); }, 
        getValue: function() { return self.color; }, 
        modelObj: { font: "Monospaced,PLAIN,10"} 
      });
    });
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    formulaDom.addEventListener("click", function(evt) {
      if (self.textController) {
        self.textController.addFormula();
      }
    });
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    expressionDom.addEventListener("click", function(evt) {
      if (self.textController) {
        self.textController.addDynamicTextNode();
      }
    });
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    fractionDom.addEventListener("click", function(evt) {
      if (self.textController) {
        self.textController.addFraction();
      }
    });
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    superIndexDom.addEventListener("click", function(evt) {
      if (self.textController) {
        self.textController.addSuperIndex();
      }
    });
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    subIndexDom.addEventListener("click", function(evt) {
      if (self.textController) {
        self.textController.addSubIndexNode();
      }
    });
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    radicalDom.addEventListener("click", function(evt) {
      if (self.textController) {
        self.textController.addRadicalNode();
      }
    });
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    sumDom.addEventListener("click", function(evt) {
      if (self.textController) {
        self.textController.addSumNode();
      }
    });
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    integralDom.addEventListener("click", function(evt) {
      if (self.textController) {
        self.textController.addIntegralNode();
      }
    });
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    limitDom.addEventListener("click", function(evt) {
      if (self.textController) {
        self.textController.addLimitNode();
      }
    });
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    matrixDom.addEventListener("click", function(evt) {
      if (self.textController) {
        self.textController.showMatrixDialog();
      }
    });
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    casesDom.addEventListener("click", function(evt) {
      if (self.textController) {
        self.textController.showCasesDialog();
      }
    });
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    utfTableDom.addEventListener("click", function(evt) {
      paramEditor.symbolTable.open(self.textArea, window.getSelection());
      console.log(self.utfTableWin)
    });    
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    this.textArea.addEventListener("rft_change", function(evt) {
      self.changeToolbar(evt.detail);
    });

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // add events to the buttons
    btn_accept.addEventListener("click", function(evt) {
      if (self.component) {
        self.component.setValue(self.getValue());
        self.component.changeValue();
      }
      self.dialog.close();
    });

    btn_cancel.addEventListener("click", function(evt) {
      self.dialog.close();
    });

// this.component = { modelObj : {} };
// this.dialog.open();
// this.setValue("hola");
  }

  /**
   *
   */
  paramEditor.RTFTextEditor.prototype.translate = function() {
    this.dialog.container.querySelector("#btn_accept_code_editor").innerHTML = babel.transGUI("ok_btn");
    this.dialog.container.querySelector("#btn_cancel_code_editor").innerHTML = babel.transGUI("cancel_btn");
  }

  /**
   *
   */
  paramEditor.RTFTextEditor.prototype.setValue = function(value) {
    this.font = getFontObject( this.component.modelObj.font || "SansSerif,PLAIN,18" );
    this.color = this.component.modelObj.color || "000000";
    this.textArea.style.color = descartesColorToRGB(this.color);
    var defaultStyle = getDefaultStyle(this.font, this.color);

    this.fontSizeSelect.value = this.font.fontSize;
    this.fontFamilySelect.value = this.font.fontFamily;

    var oldTextBlock = this.textArea.querySelector(".TextBlock");
    if (oldTextBlock) {
      oldTextBlock.parentNode.removeChild(oldTextBlock);
    }

    this.textArea.appendChild((this.rtfParser.parse(value, defaultStyle)).toHTML());
    this.textController = new richTextEditor.TextController(this, defaultStyle, this.color);
  }

  /**
   *
   */
  paramEditor.RTFTextEditor.prototype.getValue = function() {
    return this.txtConverter.toRTF(this.textArea);
  }

  /**
   *
   */
  paramEditor.RTFTextEditor.prototype.show = function(component) {
    this.component = component;
    this.dialog.open();
    this.setValue(component.getValue());
  }

  /**
   *
   */
  paramEditor.RTFTextEditor.prototype.changeColor = function(color) {
    this.color = descartesColorToRGB(color);
    this.colorDom.style.background = this.color;

    // restore the previous selected range
    this.selection = window.getSelection();
    this.selection.removeAllRanges();
    this.selection.addRange(this.range);

    if (this.textController) {
      this.textController.changeStyleProp({ name:"color", value:this.color });
    }
  }

  /**
   *
   */
  paramEditor.RTFTextEditor.prototype.changeToolbar = function(textStyle) {
    if (textStyle["font-family"].match("Times")) {
      this.fontFamilySelect.value = "Serif";
    }
    else if (textStyle["font-family"].match("Arial")) {
      this.fontFamilySelect.value = "SansSerif";
    }
    else if (textStyle["font-family"].match("Courier")) {
      this.fontFamilySelect.value = "Monospaced";
    }

    if (textStyle["font-size"]) {
      this.fontSizeSelect.value = parseInt(textStyle["font-size"]);
    }

    this.boldCheckbox.checked = (textStyle["font-weight"] === "bold");
    
    this.italicCheckbox.checked = (textStyle["font-style"] === "italic");

    if (textStyle["color"]) {
// console.log(textStyle["color"])
    }
  }

  /**
   *
   */
  function getFontObject(fontStr) {
    if (fontStr == "") {
      return fontStr;
    }

    var fontTokens = fontStr.split(",");
    var fontObj = {};

    // bold text
    if (fontTokens[1].toLowerCase() == "bold") {
      fontObj.fontStyle = "BOLD";
    } 
    // italic text
    else if ( (fontTokens[1].toLowerCase() == "italic") || (fontTokens[1].toLowerCase() == "italics")) {
      fontObj.fontStyle = "ITALIC";
    }
    // bold and italic text
    else if (fontTokens[1].toLowerCase() == "bold+italic") {
      fontObj.fontStyle = "BOLD+ITALIC";
    }
    else {
      fontObj.fontStyle = "PLAIN";
    }

    var fontFamily = ((fontTokens[0].split(" "))[0]).toLowerCase();
    
    // the font size
    fontObj.fontSize = fontTokens[2];

    // serif font
    if ((fontFamily === "serif") || (fontFamily === "times new roman") || (fontFamily === "timesroman") || (fontFamily === "times")) {
      fontObj.fontFamily = "Serif";
    }
    // sans serif font
    else if ((fontFamily === "sansserif") || (fontFamily === "arial") || (fontFamily === "helvetica")) {
      fontObj.fontFamily = "SansSerif";
    }
    // monospace font
    else {
      fontObj.fontFamily = "Monospaced";
    }

    return fontObj;
  }

  /**
   *
   */
  function getFontString(fontObj) {
    var fontStr = "";

    // get the font name
    fontStr = fontObj.fontFamily + ",";

    // get the style
    fontStr += fontObj.fontStyle + ",";

    // get the font size
    fontStr += fontObj.fontSize;

    return fontStr;
  }

  /**
   *
   */
  function getDefaultStyle(fontObj, color) {
    var defaultStyle = { fontFamily:"Times New Roman", fontSize:"30px", lineHeight:"30px", fontStyle:"normal", fontWeight:"normal", textDecoration:"none"/*, color:"#000000"*/ };

    if (fontObj.fontFamily === "Serif") {
      defaultStyle.fontFamily = "Times New Roman";
    }
    if (fontObj.fontFamily === "SansSerif") {
      defaultStyle.fontFamily = "Arial";
    }
    if (fontObj.fontFamily === "Monospaced") {
      defaultStyle.fontFamily = "Courier New";
    }

    if (fontObj.fontSize) {
      defaultStyle.fontSize = fontObj.fontSize + "px";
      defaultStyle.lineHeight = fontObj.fontSize + "px";
    }

    if (fontObj.fontStyle === "PLAIN") {
      defaultStyle.fontStyle = "normal";
      defaultStyle.fontWeight = "normal";
    }
    if (fontObj.fontStyle === "BOLD") {
      defaultStyle.fontStyle = "normal";
      defaultStyle.fontWeight = "bold";
    }
    if (fontObj.fontStyle === "ITALIC") {
      defaultStyle.fontStyle = "italic";
      defaultStyle.fontWeight = "normal";
    }
    if (fontObj.fontStyle === "BOLD+ITALIC") {
      defaultStyle.fontStyle = "italic";
      defaultStyle.fontWeight = "bold";
    }

    if (color) {
      // defaultStyle.color = "#" + color;
    }

    return defaultStyle;
  }

  /**
   *
   */
  function descartesColorToRGB(color) {
    var R = G = B = "00";

    // the color is a color name
    if (babel[color]) {
      if (babel[color] === "net") {
        color = "rojo";
      }
      color = babel[color];

      R = color.substring(1,3);
      G = color.substring(3,5);
      B = color.substring(5,7);
    }
    // the color is six hexadecimals digits RRGGBB
    else if (color.length === 6) {
      R = color.substring(0,2);
      G = color.substring(2,4);
      B = color.substring(4,6);
    }
    // the color is eight hexadecimals digits #RRGGBBAA
    else if (color.length === 8) {
      R = color.substring(2,4);
      G = color.substring(4,6);
      B = color.substring(6,8);
    }
    // the color is a Descartes expression (exprR, exprG, exprB, exprA)
    else if (color[0] === "(") {
      tmpColor = [];
      splitColor = paramEditor.splitComa(color.substring(1, color.length-1));

      var i = 0;
      var hexColor = parseInt(splitColor[i], 16);
      var cond = (splitColor[i] != hexColor.toString(16)) && (splitColor[i] !== "0"+hexColor.toString(16));
      R = (cond) ? "00" : splitColor[i];

      i++;
      hexColor = parseInt(splitColor[i], 16);
      cond = (splitColor[i] != hexColor.toString(16)) && (splitColor[i] !== "0"+hexColor.toString(16));
      G = (cond) ? "00" : splitColor[i];

      i++;
      hexColor = parseInt(splitColor[i], 16);
      cond = (splitColor[i] != hexColor.toString(16)) && (splitColor[i] !== "0"+hexColor.toString(16));
      B = (cond) ? "00" : splitColor[i];
    }

    return "#" + R + G + B;
  }

  return paramEditor;
})(paramEditor || {});
