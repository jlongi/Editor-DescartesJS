/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var editor = (function(editor) {
  var rnd = 123456;

  /**
   *
   */
  editor.ArquimedesToolbar = function() {
    var self = this;

    this.toolbarContainer = document.getElementById("toolbar");
    this.toolbarContainer.setAttribute("style", "margin:20px 20px 0 20px; padding:10px 10px 5px 10px; min-width:995px; background:var(--parameter-background); color:var(--parameter-text); border:1px solid rgba(255,255,255,0.25); display:none;");

    var toolbar = document.createElement("div");
    toolbar.setAttribute("class", "toolbar");
    toolbar.setAttribute("style", "display:flex; flex-wrap: wrap; align-items:center; justify-content:space-between; align-content:flex-start; width:calc(100% + 5px); padding:0; margin:0 0 10px 0; height:95px; font-size:16px;")

    // font family menu
    this.fontFamilySelect = document.createElement("select");
    this.fontFamilySelect.setAttribute("style", "font-size: 14px; display:inline-flex; flex-grow:1; width:10%; height:30px; margin:0 5px 5px 0; text-align-last:left;");
    var tmpOption;
    var options = ["SansSerif", "Serif", "Monospaced"];
    for (var i=0, l=options.length; i<l; i++) {
      tmpOption = document.createElement("option");
      tmpOption.setAttribute("value", options[i]);
      tmpOption.innerHTML = options[i];
      this.fontFamilySelect.appendChild(tmpOption);
    }

    // font size menu
    this.fontSizeSelect = document.createElement("input");
    this.fontSizeSelect.setAttribute("type", "number");
    this.fontSizeSelect.setAttribute("style", "display:inline-flex; flex-grow:1; width:5%; height:30px; margin:0 5px 5px 0; text-align-last:left;");

    // bold checkbox
    var boldDom = document.createElement("div");
    boldDom.setAttribute("style", "display:flex; flex-grow:1; align-items:center; width:6%; height:30px; margin:0 5px 5px 0; padding:0; background:var(--input-background); border: 1px solid var(--input-border);");
    var boldLabel = document.createElement("label");
    boldLabel.setAttribute("style", "position:relative; margin:0; padding:2px 12px 0 10px;")
    boldLabel.setAttribute("for", "bold_"+rnd);
    boldLabel.innerHTML = "<b>N</b>";
    this.boldCheckbox = document.createElement("input");
    this.boldCheckbox.setAttribute("id", "bold_"+rnd);
    this.boldCheckbox.setAttribute("type", "checkbox");
    boldDom.appendChild(this.boldCheckbox);
    boldDom.appendChild(boldLabel);

    // italic checkbox
    var italicDom = document.createElement("div");
    italicDom.setAttribute("style", "display:flex; flex-grow:1; align-items:center; width:6%; height:30px; margin:0 5px 5px 0; padding:0; background:var(--input-background); border: 1px solid var(--input-border); font-family:serif; font-size:120%;");
    var italicLabel = document.createElement("label");
    italicLabel.setAttribute("style", "position:relative; margin:0; padding:2px 12px 0 10px;")
    italicLabel.setAttribute("for", "italic_"+rnd);
    italicLabel.innerHTML = "<i>I</i>";
    this.italicCheckbox = document.createElement("input");
    this.italicCheckbox.setAttribute("id", "italic_"+rnd);
    this.italicCheckbox.setAttribute("type", "checkbox");
    italicDom.appendChild(this.italicCheckbox);
    italicDom.appendChild(italicLabel);

    // underline checkbox
    var underlineDom = document.createElement("div");
    underlineDom.setAttribute("style", "display:flex; flex-grow:1; align-items:center; width:6%; height:30px; margin:0 5px 5px 0; padding:0; background:var(--input-background); border: 1px solid var(--input-border); text-decoration:underline;");
    var underlineLabel = document.createElement("label");
    underlineLabel.setAttribute("style", "position:relative; margin:0; padding:2px 12px 0 10px;")
    underlineLabel.setAttribute("for", "underline_"+rnd);
    underlineLabel.innerHTML = "<span>U</span>";
    this.underlineCheckbox = document.createElement("input");
    this.underlineCheckbox.setAttribute("id", "underline_"+rnd);
    this.underlineCheckbox.setAttribute("type", "checkbox");
    underlineDom.appendChild(this.underlineCheckbox);
    underlineDom.appendChild(underlineLabel);

    // overline checkbox
    var overlineDom = document.createElement("div");
    overlineDom.setAttribute("style", "display:flex; flex-grow:1; align-items:center; width:6%; height:30px; margin:0 5px 5px 0; padding:0; background:var(--input-background); border: 1px solid var(--input-border); text-decoration:overline;");
    var overlineLabel = document.createElement("label");
    overlineLabel.setAttribute("style", "position:relative; margin:0; padding:2px 12px 0 10px;")
    overlineLabel.setAttribute("for", "overline_"+rnd);
    overlineLabel.innerHTML = "<span>O</span>";
    this.overlineCheckbox = document.createElement("input");
    this.overlineCheckbox.setAttribute("id", "overline_"+rnd);
    this.overlineCheckbox.setAttribute("type", "checkbox");
    overlineDom.appendChild(this.overlineCheckbox);
    overlineDom.appendChild(overlineLabel);

    // color button
    this.colorDom = document.createElement("div");
    this.colorDom.setAttribute("class", "richTextEditor_button richTextEditor_color");
    this.colorDom.setAttribute("style", "height:30px; margin:0 5px 5px 0;");

    // formula button
    var formulaDom = document.createElement("div");
    formulaDom.setAttribute("class", "richTextEditor_button richTextEditor_formula");
    formulaDom.setAttribute("style", "width:3.5%; height:30px; margin-bottom:5px;");

    // expression button
    var expressionDom = document.createElement("div");
    expressionDom.setAttribute("class", "richTextEditor_button richTextEditor_expression");
    expressionDom.setAttribute("style", "width:3.5%; height:30px; margin-bottom:5px;");

    // fraction button
    var fractionDom = document.createElement("div");
    fractionDom.setAttribute("class", "richTextEditor_button richTextEditor_fraction");
    fractionDom.setAttribute("style", "width:3.5%; height:30px; margin-bottom:5px;");

    // super index button
    var superIndexDom = document.createElement("div");
    superIndexDom.setAttribute("class", "richTextEditor_button richTextEditor_superIndex");
    superIndexDom.setAttribute("style", "width:3.5%; height:30px; margin-bottom:5px;");

    // sub index button
    var subIndexDom = document.createElement("div");
    subIndexDom.setAttribute("class", "richTextEditor_button richTextEditor_subIndex");
    subIndexDom.setAttribute("style", "width:3.5%; height:30px; margin-bottom:5px;");

    // radical button
    var radicalDom = document.createElement("div");
    radicalDom.setAttribute("class", "richTextEditor_button richTextEditor_radical");
    radicalDom.setAttribute("style", "width:3.5%; height:30px; margin-bottom:5px;");

    // sum button
    var sumDom = document.createElement("div");
    sumDom.setAttribute("class", "richTextEditor_button richTextEditor_sum");
    sumDom.setAttribute("style", "width:3.5%; height:30px; margin-bottom:5px;");

    // integral button
    var integralDom = document.createElement("div");
    integralDom.setAttribute("class", "richTextEditor_button richTextEditor_integral");
    integralDom.setAttribute("style", "width:3.5%; height:30px; margin-bottom:5px;");

    // limit button
    var limitDom = document.createElement("div");
    limitDom.setAttribute("class", "richTextEditor_button richTextEditor_limit");
    limitDom.setAttribute("style", "width:3.5%; height:30px; margin-bottom:5px;");

    // matrix button
    var matrixDom = document.createElement("div");
    matrixDom.setAttribute("class", "richTextEditor_button richTextEditor_matrix");
    matrixDom.setAttribute("style", "width:3.5%; height:30px; margin-bottom:5px;");

    // cases button
    var casesDom = document.createElement("div");
    casesDom.setAttribute("class", "richTextEditor_button richTextEditor_cases");
    casesDom.setAttribute("style", "width:3.5%; height:30px; margin-bottom:5px;");

    // utf table button
    var utfTableDom = document.createElement("div");
    utfTableDom.setAttribute("class", "richTextEditor_button richTextEditor_utfTable");
    utfTableDom.setAttribute("style", "width:8%; height:30px; margin-right:5px; margin-bottom:5px;");

    toolbar.appendChild(this.fontFamilySelect);
    toolbar.appendChild(this.fontSizeSelect);
    toolbar.appendChild(boldDom);
    toolbar.appendChild(italicDom);
    toolbar.appendChild(underlineDom);
    toolbar.appendChild(overlineDom);
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
    toolbar.appendChild(document.createElement("br"));

    var mostUsedChars = "+−·×÷αβγδεζηθικλμνξοπρςστυφχψω√±½¼°²³₀₁₂₃∞∢∅∈∴∧∨≦≧≡≠⏊′″‴‛’‟”";
    this.greekLowerCase = "αβγδεζηθικλμνξοπρςστυφχψω";
    this.greekUpperCase = "ΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡ ΣΤΥΦΧΨΩ";
    this.greekLetters = [];
    var tmpChar;
    for (var i=0, l=mostUsedChars.length; i<l; i++) {
      tmpChar = document.createElement("div");
      tmpChar.setAttribute("class", "richTextEditor_button");
      tmpChar.setAttribute("style", "font-family:DJS_serif; width:2.8%; height:30px; margin:0 5px 5px 0; text-align:center; font-size:17px; line-height:28px; font-weight:bold;");
      tmpChar.innerHTML = mostUsedChars.charAt(i);
      tmpChar.addEventListener("click", function(evt) {
        self.insertSymbol(this.innerHTML);
      });
      toolbar.appendChild(tmpChar);
      
      if ((i >= 5) && (i <= 29)) {
        this.greekLetters.push(tmpChar);
      }
    }

    window.addEventListener("keydown", function(evt) {
      if (evt.shiftKey) {
        for (var i=0, l=self.greekLetters.length; i<l; i++) {
          self.greekLetters[i].innerHTML = self.greekUpperCase.charAt(i);
        }
      }
    });
    window.addEventListener("keyup", function(evt) {
      for (var i=0, l=self.greekLetters.length; i<l; i++) {
        self.greekLetters[i].innerHTML = self.greekLowerCase.charAt(i);
      }
    });


    
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    this.fontFamilySelect.addEventListener("change", function() { 
      if (self.textController) {
        self.textController.changeStyle("family", this.value);
      }
    });
    this.fontSizeSelect.addEventListener("change", function() {
      var value = parseInt(this.value);
      if (isNaN(value)) {
        value = 8;
      }
      this.value = Math.max(8, Math.min(value, 200));

      if (self.textController) {
        self.textController.changeStyle("size", parseInt(this.value));
      }
    });
    this.boldCheckbox.addEventListener("change", function() {
      if (self.textController) {
        self.textController.changeStyle("bold");
      }
    });
    this.italicCheckbox.addEventListener("change", function() { 
      if (self.textController) {
        self.textController.changeStyle("italic");
      }
    });
    this.underlineCheckbox.addEventListener("change", function() { 
      if (self.textController) {
        self.textController.changeStyle("underline");
      }
    });
    this.overlineCheckbox.addEventListener("change", function() { 
      if (self.textController) {
        self.textController.changeStyle("overline");
      }
    });

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    this.colorDom.addEventListener("click", function(evt) {
      editor.colorPanel.show({
        value: self.color.replace(/\#/g, ""),
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
        self.matrixDialog.showModal();
      }
    });
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    casesDom.addEventListener("click", function(evt) {
      if (self.textController) {
        self.casesDialog.showModal();
      }
    });
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    utfTableDom.addEventListener("click", function(evt) {
      editor.symbolTable.open(self, null);
    });    



    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    this.toolbarContainer.appendChild(toolbar);
    this.toolbar = toolbar;
  }

  /**
   *
   */
  editor.ArquimedesToolbar.prototype.insertSymbol = function(symbol) {
    if (this.textController) {
      this.textController.insertSymbol(symbol);
    }
  }

  /**
   *
   */
  editor.ArquimedesToolbar.prototype.translate = function() {
    editor.colorPanel.transOptions();
  }

  /**
   *
   */
  editor.ArquimedesToolbar.prototype.changeColor = function(color) {
    this.color = descartesColorToRGB(color);
    this.colorDom.style.background = this.color;

    if (this.textController) {
      this.textController.changeStyle("color", this.color);
    }
  }  

  /**
   *
   */
  editor.ArquimedesToolbar.prototype.changeStyle = function(textStyle) {
    if (textStyle.family.match("Times")) {
      this.fontFamilySelect.value = "Serif";
    }
    else if (textStyle.family.match("Arial")) {
      this.fontFamilySelect.value = "SansSerif";
    }
    else if (textStyle.family.match("Courier")) {
      this.fontFamilySelect.value = "Monospaced";
    }

    if (textStyle.size) {
      this.fontSizeSelect.value = parseInt(textStyle.size);
    }
    this.boldCheckbox.checked = textStyle.bold;
    this.italicCheckbox.checked = textStyle.italic;
    this.overlineCheckbox.checked = textStyle.overline;
    this.underlineCheckbox.checked = textStyle.underline;

    this.color = textStyle.color || "#000000";
    this.colorDom.style.background = this.color;
  }

  /**
   *
   */
  editor.ArquimedesToolbar.prototype.setVisibility = function(isArquimedes) {
    this.toolbarContainer.style.display = (isArquimedes) ? "block" : "none";
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

  return editor;
})(editor || {});
