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

    ////////////////////////////////
    this.createMatrixDialog();
    this.createCasesDialog();
    this.createDynamicTextNodeDialog();
    ////////////////////////////////

    this.dialog = new editor.Dialog("calc(100% - 20px)", "calc(100% - 20px)", "", "", "");

    var toolbar = document.createElement("div");
    toolbar.setAttribute("class", "toolbar");
    toolbar.setAttribute("style", "display:flex; flex-wrap: wrap; align-items:center; justify-content:space-between; align-content:flex-start; width:calc(100% + 5px); padding:0; margin:0 0 10px 0; height:95px; font-size:16px;")

    // font family menu
    this.fontFamilySelect = document.createElement("select");
    this.fontFamilySelect.setAttribute("style", "width:10%; height:30px; margin:0 5px 5px 0; text-align-last:left;");
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
    this.fontSizeSelect.setAttribute("style", "width:5%; height:30px; margin:0 5px 5px 0; text-align-last:left;");

    // bold checkbox
    var boldDom = document.createElement("div");
    boldDom.setAttribute("style", "display:inline-block; width:6%; height:30px; margin:0 5px 5px 0; padding:2px 0 0 0; background:var(--input-background); border: 1px solid var(--input-border); white-space:nowrap;");
    var boldLabel = document.createElement("label");
    boldLabel.setAttribute("style", "position:relative; margin:0; padding:2px 12px 0 10px; top:-4px;");
    boldLabel.setAttribute("for", "bold_"+rnd);
    boldLabel.innerHTML = "<b>N</b>";
    this.boldCheckbox = document.createElement("input");
    this.boldCheckbox.setAttribute("id", "bold_"+rnd);
    this.boldCheckbox.setAttribute("type", "checkbox");
    boldDom.appendChild(boldLabel);
    boldDom.appendChild(this.boldCheckbox);

    // italic checkbox
    var italicDom = document.createElement("div");
    italicDom.setAttribute("style", "display:inline-block; width:6%; height:30px; margin:0 5px 5px 0; padding:2px 0 0 0; background:var(--input-background); border: 1px solid var(--input-border); white-space:nowrap;");
    var italicLabel = document.createElement("label");
    italicLabel.setAttribute("style", "position:relative; margin:0; padding:2px 12px 0 10px; top:-4px;");
    italicLabel.setAttribute("for", "italic_"+rnd);
    italicLabel.innerHTML = "<i>I</i>";
    this.italicCheckbox = document.createElement("input");
    this.italicCheckbox.setAttribute("id", "italic_"+rnd);
    this.italicCheckbox.setAttribute("type", "checkbox");
    italicDom.appendChild(italicLabel);
    italicDom.appendChild(this.italicCheckbox);

    // underline checkbox
    var underlineDom = document.createElement("div");
    underlineDom.setAttribute("style", "display:inline-block; width:6%; height:30px; margin:0 5px 5px 0; padding:2px 0 0 0; background:var(--input-background); border: 1px solid var(--input-border); text-decoration:underline; white-space:nowrap;");
    var underlineLabel = document.createElement("label");
    underlineLabel.setAttribute("style", "position:relative; margin:0; padding:2px 12px 0 10px; top:-4px;");
    underlineLabel.setAttribute("for", "underline_"+rnd);
    underlineLabel.innerHTML = "<span>U</span>";
    this.underlineCheckbox = document.createElement("input");
    this.underlineCheckbox.setAttribute("id", "underline_"+rnd);
    this.underlineCheckbox.setAttribute("type", "checkbox");
    underlineDom.appendChild(underlineLabel);
    underlineDom.appendChild(this.underlineCheckbox);

    // overline checkbox
    var overlineDom = document.createElement("div");
    overlineDom.setAttribute("style", "display:inline-block; width:6%; height:30px; margin:0 5px 5px 0; padding:2px 0 0 0; background:var(--input-background); border: 1px solid var(--input-border); text-decoration:overline; white-space:nowrap;");
    var overlineLabel = document.createElement("label");
    overlineLabel.setAttribute("style", "position:relative; margin:0; padding:2px 12px 0 10px; top:-4px;");
    overlineLabel.setAttribute("for", "overline_"+rnd);
    overlineLabel.innerHTML = "<span>O</span>";
    this.overlineCheckbox = document.createElement("input");
    this.overlineCheckbox.setAttribute("id", "overline_"+rnd);
    this.overlineCheckbox.setAttribute("type", "checkbox");
    overlineDom.appendChild(overlineLabel);
    overlineDom.appendChild(this.overlineCheckbox);

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

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    this.textArea = document.createElement("div");
    this.textArea.setAttribute("class", "RTFtextEditor");
    this.textArea.setAttribute("style", "width:100%; height:calc(100% - 150px); flex-grow:1; text-align:left; padding:5px; margin:0; white-space:pre-wrap; display:inline-block; overflow-y:scroll; background:white;");
    this.rtfParser = new richTextEditor.RTFParser();
    // this.txtConverter = new richTextEditor.TextConverter();
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    this.textArea.addEventListener("keydown", function(evt) {
      if (evt.shiftKey) {
        for (var i=0, l=self.greekLetters.length; i<l; i++) {
          self.greekLetters[i].innerHTML = self.greekUpperCase.charAt(i);
        }
      }
    });
    this.textArea.addEventListener("keyup", function(evt) {
      for (var i=0, l=self.greekLetters.length; i<l; i++) {
        self.greekLetters[i].innerHTML = self.greekLowerCase.charAt(i);
      }
    });

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
        self.textController.changeStyle("fontType", this.value);
      }
    });
    this.fontSizeSelect.addEventListener("change", function() {
      var value = parseInt(this.value);
      if (isNaN(value)) {
        value = 8;
      }
      this.value = Math.max(8, Math.min(value, 200));

      if (self.textController) {
        self.textController.changeStyle("fontSize", parseInt(this.value));
      }
    });
    this.boldCheckbox.addEventListener("change", function() {
      if (self.textController) {
        self.textController.changeStyle("textBold");
      }
    });
    this.italicCheckbox.addEventListener("change", function() { 
      if (self.textController) {
        self.textController.changeStyle("textItalic");
      }
    });
    this.underlineCheckbox.addEventListener("change", function() { 
      if (self.textController) {
        self.textController.changeStyle("textUnderline");
      }
    });
    this.overlineCheckbox.addEventListener("change", function() { 
      if (self.textController) {
        self.textController.changeStyle("textOverline");
      }
    });

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    this.colorDom.addEventListener("click", function(evt) {
      paramEditor.colorPanel.show({
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
      paramEditor.symbolTable.open(self, null);
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

// for testing
// this.component = { modelObj : { color:"000000"} };
// this.dialog.open();
// this.setValue("hola\\nmundo");
  }

  /**
   *
   */
  paramEditor.RTFTextEditor.prototype.translate = function() {
    this.dialog.container.querySelector("#btn_accept_code_editor").innerHTML = babel.transGUI("ok_btn");
    this.dialog.container.querySelector("#btn_cancel_code_editor").innerHTML = babel.transGUI("cancel_btn");

    this.matrixDialog.querySelector("#btn_accept_code_editor").innerHTML = babel.transGUI("ok_btn");
    this.matrixDialog.querySelector("#btn_cancel_code_editor").innerHTML = babel.transGUI("cancel_btn");

    this.casesDialog.querySelector("#btn_accept_code_editor").innerHTML = babel.transGUI("ok_btn");
    this.casesDialog.querySelector("#btn_cancel_code_editor").innerHTML = babel.transGUI("cancel_btn");
    this.casesDialog.querySelector("#cd_parts").innerHTML = babel.transGUI("parts");
  }

  /**
   *
   */
  paramEditor.RTFTextEditor.prototype.setValue = function(value) {
    var defaultStyle = getDefaultStyle(this.component.modelObj);

    var fsize = parseInt(defaultStyle.fontSize);
    if (isNaN(fsize)) {
      fsize = 8;
    }
    this.fontSizeSelect.value = Math.max(8, Math.min(fsize, 200));
    this.fontFamilySelect.value = defaultStyle.fontFamily;

    this.color = descartesColorToRGB(this.component.modelObj.color);
    this.colorDom.style.background = this.color;

    // the text editor was used at least one time
    if (this.textArea.firstChild) {
      this.textController.setNewNodes( this.rtfParser.parse(value, defaultStyle), this.color );
    }
    else {
      this.textController = new richTextEditor.TextController(this, this.textArea, this.rtfParser.parse(value, defaultStyle), defaultStyle, this.color);
    }
  }

  /**
   *
   */
  paramEditor.RTFTextEditor.prototype.getValue = function() {
    return this.textController.getTextNodes().toRTF();
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

    if (this.textController) {
      this.textController.changeStyle("textColor", this.color);
    }
  }

  /**
   *
   */
  paramEditor.RTFTextEditor.prototype.changeStyle = function(textStyle) {
    if (textStyle.fontType.match("Times")) {
      this.fontFamilySelect.value = "Serif";
    }
    else if (textStyle.fontType.match("Arial")) {
      this.fontFamilySelect.value = "SansSerif";
    }
    else if (textStyle.fontType.match("Courier")) {
      this.fontFamilySelect.value = "Monospaced";
    }

    if (textStyle.fontSize) {
      this.fontSizeSelect.value = parseInt(textStyle.fontSize);
    }
    this.boldCheckbox.checked = textStyle.textBold;
    this.italicCheckbox.checked = textStyle.textItalic;
    this.overlineCheckbox.checked = textStyle.textOverline;
    this.underlineCheckbox.checked = textStyle.textUnderline;

    this.color = textStyle.textColor || descartesColorToRGB(this.component.modelObj.color) || "#000000";
    this.colorDom.style.background = this.color;
  }

  /**
   *
   */
  paramEditor.RTFTextEditor.prototype.insertSymbol = function(symbol) {
    this.textController.insertSymbol(symbol);
  }

  /**
   *
   */
  paramEditor.RTFTextEditor.prototype.showDynamicTextNodeDialog = function(dynamicTextNode) {
    this.dynamicTextNodeDialog.querySelector("#btn_accept_code_editor").innerHTML = babel.transGUI("ok_btn");
    this.dynamicTextNodeDialog.querySelector("#btn_cancel_code_editor").innerHTML = babel.transGUI("cancel_btn");
    this.dynamicTextNodeDialog.querySelector("#dtnd_label_decimals").innerHTML = babel.transGUI("decimals");
    this.dynamicTextNodeDialog.querySelector("#label_"+this.dynamicTextNodeDialog.fixed_id).innerHTML = babel.transGUI("fixed");
    this.dynamicTextNodeDialog.querySelector("#dtnd_label_value").innerHTML = babel.transGUI("value");

    this.dynamicTextNode = dynamicTextNode;

    this.decimals_inpt.value = dynamicTextNode.decimals;
    this.fixed_inpt.checked = dynamicTextNode.fixed;
    this.exprValue_inpt.value = dynamicTextNode.value;

    this.dynamicTextNodeDialog.showModal();
  }
  /**
   *
   */
  paramEditor.RTFTextEditor.prototype.createDynamicTextNodeDialog = function() {
    var self = this;

    this.dynamicTextNodeDialog = document.createElement("dialog");
    this.dynamicTextNodeDialog.style.padding = "10px";
    var form_div = document.createElement("div");

    var decimals_label = document.createElement("label");
    decimals_label.id = "dtnd_label_decimals";
    decimals_label.innerHTML = "decimales";
    this.decimals_inpt = document.createElement("input");
    this.decimals_inpt.setAttribute("type", "text");

    var fixed_id = "fixed_id_" + parseInt(Math.random()*1000);
    this.dynamicTextNodeDialog.fixed_id = fixed_id;
    var fixed_label = document.createElement("label");
    fixed_label.innerHTML = "fijo";
    fixed_label.id = "label_" + fixed_id;
    fixed_label.setAttribute("for", fixed_id);
    this.fixed_inpt = document.createElement("input");
    this.fixed_inpt.setAttribute("type", "checkbox");
    this.fixed_inpt.setAttribute("style", "margin-left: 20px; margin-right: 0;");
    this.fixed_inpt.setAttribute("id", fixed_id);

    var exprValue_label = document.createElement("label");
    exprValue_label.id = "dtnd_label_value";
    exprValue_label.innerHTML = "valor";
    this.exprValue_inpt = document.createElement("input");
    this.exprValue_inpt.setAttribute("type", "text");
    this.exprValue_inpt.setAttribute("style", "width:80%;");
    form_div.appendChild(decimals_label);
    form_div.appendChild(this.decimals_inpt);
    form_div.appendChild(this.fixed_inpt);
    form_div.appendChild(fixed_label);
    form_div.appendChild(document.createElement("br"));
    form_div.appendChild(exprValue_label);
    form_div.appendChild(this.exprValue_inpt);

    var btn_div = document.createElement("div");
    var btn_accept = document.createElement("button");
    btn_accept.setAttribute("id", "btn_accept_code_editor");
    btn_accept.innerHTML = "ace";
    var btn_cancel = document.createElement("button");
    btn_cancel.setAttribute("id", "btn_cancel_code_editor");
    btn_cancel.innerHTML = "can";
    btn_div.appendChild(btn_accept);
    btn_div.appendChild(btn_cancel);

    this.dynamicTextNodeDialog.appendChild(form_div);
    this.dynamicTextNodeDialog.appendChild(btn_div);

    document.body.appendChild(this.dynamicTextNodeDialog);

    // add events to the buttons
    btn_accept.addEventListener("click", function(evt) {
      if (self.dynamicTextNode) {
        self.dynamicTextNode.decimals = self.decimals_inpt.value;
        self.dynamicTextNode.fixed = self.fixed_inpt.checked;
        self.dynamicTextNode.value = self.exprValue_inpt.value;
      }

      self.dynamicTextNodeDialog.close();
    });

    btn_cancel.addEventListener("click", function(evt) {
      self.dynamicTextNodeDialog.close();
    });
  }

  /**
   *
   */
  paramEditor.RTFTextEditor.prototype.createMatrixDialog = function() {
    var self = this;

    this.matrixDialog = document.createElement("dialog");
    this.matrixDialog.style.padding = "10px";
    var form_div = document.createElement("div");

    // matrix type
    this.matrix_type = document.createElement("select");
    var option1 = document.createElement("option");
    option1.innerHTML = "[ ]";
    option1.value = 0;
    var option2 = document.createElement("option");
    option2.innerHTML = "( )";
    option2.value = 1;
    var option3 = document.createElement("option");
    option3.innerHTML = "{ }";
    option3.value = 2;
    var option4 = document.createElement("option");
    option4.innerHTML = "| |";
    option4.value = 3;
    var option5 = document.createElement("option");
    option5.innerHTML = "‖ ‖";
    option5.value = 4;
    var option6 = document.createElement("option");
    option6.innerHTML = "  ";
    option6.value = 5;
    this.matrix_type.appendChild(option1);
    this.matrix_type.appendChild(option2);
    this.matrix_type.appendChild(option3);
    this.matrix_type.appendChild(option4);
    this.matrix_type.appendChild(option5);
    this.matrix_type.appendChild(option6);

    // m
    var columns_label = document.createElement("label");
    columns_label.innerHTML = "m";
    this.columns_inpt = document.createElement("input");
    this.columns_inpt.setAttribute("type", "text");
    this.columns_inpt.setAttribute("style", "width:80px;");
    this.columns_inpt.value = 2;

    // n
    var rows_label = document.createElement("label");
    rows_label.innerHTML = "n";
    this.rows_inpt = document.createElement("input");
    this.rows_inpt.setAttribute("type", "text");
    this.rows_inpt.setAttribute("style", "width:78px;");
    this.rows_inpt.value = 2;

    form_div.appendChild(this.matrix_type);
    form_div.appendChild(document.createElement("br"));
    form_div.appendChild(columns_label);
    form_div.appendChild(this.columns_inpt);
    form_div.appendChild(document.createElement("br"));
    form_div.appendChild(rows_label);
    form_div.appendChild(this.rows_inpt);

    var btn_div = document.createElement("div");
    var btn_accept = document.createElement("button");
    btn_accept.setAttribute("id", "btn_accept_code_editor");
    btn_accept.innerHTML = "ace";
    var btn_cancel = document.createElement("button");
    btn_cancel.setAttribute("id", "btn_cancel_code_editor");
    btn_cancel.innerHTML = "can";
    btn_div.appendChild(btn_accept);
    btn_div.appendChild(btn_cancel);

    this.matrixDialog.appendChild(form_div);
    this.matrixDialog.appendChild(btn_div);

    document.body.appendChild(this.matrixDialog);

    // add events to the buttons
    btn_accept.addEventListener("click", function(evt) {
      self.matrixDialog.close();

      self.textController.addMatrixNode(self.rows_inpt.value || 2, self.columns_inpt.value || 2, self.matrix_type.value);
    });

    btn_cancel.addEventListener("click", function(evt) {
      self.matrixDialog.close();
    });
  }

  /**
   *
   */
  paramEditor.RTFTextEditor.prototype.createCasesDialog = function() {
    var self = this;

    this.casesDialog = document.createElement("dialog");
    this.casesDialog.style.padding = "10px";
    var form_div = document.createElement("div");

    // m
    var parts_label = document.createElement("label");
    parts_label.id = "cd_parts";
    parts_label.innerHTML = "partes";
    this.parts_inpt = document.createElement("input");
    this.parts_inpt.setAttribute("type", "text");
    this.parts_inpt.setAttribute("style", "width:80px;");
    this.parts_inpt.value = 2;
    form_div.appendChild(parts_label);
    form_div.appendChild(this.parts_inpt);

    var btn_div = document.createElement("div");
    var btn_accept = document.createElement("button");
    btn_accept.setAttribute("id", "btn_accept_code_editor");
    btn_accept.innerHTML = "ace";
    var btn_cancel = document.createElement("button");
    btn_cancel.setAttribute("id", "btn_cancel_code_editor");
    btn_cancel.innerHTML = "can";
    btn_div.appendChild(btn_accept);
    btn_div.appendChild(btn_cancel);

    this.casesDialog.appendChild(form_div);
    this.casesDialog.appendChild(btn_div);

    document.body.appendChild(this.casesDialog);

    // add events to the buttons
    btn_accept.addEventListener("click", function(evt) {
      self.casesDialog.close();

      self.textController.addDefpartsNode(self.parts_inpt.value || 2);
    });

    btn_cancel.addEventListener("click", function(evt) {
      self.casesDialog.close();
    });
  }  

  /**
   *
   */
  function getDefaultStyle(textObj) {
    var defaultStyle = { fontFamily:"Times New Roman", fontSize:"30px",fontStyle:"normal", fontWeight:"normal", textDecoration:"none", decimals:2, fixed:false };

    if (textObj.font_family) {
      if (textObj.font_family.match(/sansserif/i)) {
        defaultStyle.fontFamily = "Arial";
      }
      else if (textObj.font_family.match(/serif/i)) {
        defaultStyle.fontFamily = "Times New Roman";
      }
      else if (textObj.font_family.match(/monospaced/i)) {
        defaultStyle.fontFamily = "Courier New";
      }
    }

    if (textObj.font_size) {
      defaultStyle.fontSize = textObj.font_size + "px";
    }

    if (textObj.bold == "true") {
      defaultStyle.fontWeight = "bold";
    }
    if (textObj.italics == "true") {
      defaultStyle.fontStyle = "italic";
    }

    if (textObj.fixed == "true") {
      defaultStyle.fixed = true;
    } 
    if (textObj.decimals) {
      defaultStyle.decimals = textObj.decimals;
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
