/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var paramEditor = (function(paramEditor) {

  /**
   *
   */
  paramEditor.RTFTextEditor = function() {
    let self = this;
    
    let rnd = parseInt(Math.random()*1000);

    ////////////////////////////////
    this.createMatrixDialog();
    this.createCasesDialog();
    this.createDynamicTextNodeDialog();
    ////////////////////////////////

    this.dialog = new editor.Dialog("calc(100% - 20px)", "calc(100% - 20px)", "", "", "");

    let toolbar = document.createElement("div");
    toolbar.className = "toolbar"
    toolbar.setAttribute("style", "display:flex; flex-wrap: wrap; align-items:center; justify-content:space-between; align-content:flex-start; width:calc(100% + 5px); padding:0; margin:0 0 10px 0; height:95px; font-size:16px;")

    // font family menu
    this.fontFamilySelect = document.createElement("select");
    this.fontFamilySelect.setAttribute("style", "width:10%; height:30px; margin:0 5px 5px 0; text-align-last:left;");

    let tmpOption;
    for (let option_i of ["SansSerif", "Serif", "Monospaced"]) {
      tmpOption = document.createElement("option");
      tmpOption.setAttribute("value", option_i);
      tmpOption.innerHTML = option_i;
      this.fontFamilySelect.appendChild(tmpOption);
    }

    // font size menu
    this.fontSizeSelect = document.createElement("input");
    this.fontSizeSelect.setAttribute("type", "number");
    this.fontSizeSelect.setAttribute("style", "width:5%; height:30px; margin:0 5px 5px 0; text-align-last:left;");

    // bold checkbox
    let boldDom = document.createElement("div");
    boldDom.setAttribute("style", "display:inline-block; width:6%; height:30px; margin:0 5px 5px 0; padding:2px 0 0 0; background:var(--input-background); border: 1px solid var(--input-border); white-space:nowrap;");
    let boldLabel = document.createElement("label");
    boldLabel.setAttribute("style", "position:relative; margin:0; padding:2px 12px 0 10px; top:-4px;");
    boldLabel.setAttribute("for", "bold_"+rnd);
    boldLabel.innerHTML = "<b>N</b>";
    this.boldCheckbox = document.createElement("input");
    this.boldCheckbox.setAttribute("id", "bold_"+rnd);
    this.boldCheckbox.setAttribute("type", "checkbox");
    boldDom.appendChild(boldLabel);
    boldDom.appendChild(this.boldCheckbox);

    // italic checkbox
    let italicDom = document.createElement("div");
    italicDom.setAttribute("style", "display:inline-block; width:6%; height:30px; margin:0 5px 5px 0; padding:2px 0 0 0; background:var(--input-background); border: 1px solid var(--input-border); white-space:nowrap;");
    let italicLabel = document.createElement("label");
    italicLabel.setAttribute("style", "position:relative; margin:0; padding:2px 12px 0 10px; top:-4px;");
    italicLabel.setAttribute("for", "italic_"+rnd);
    italicLabel.innerHTML = "<i>I</i>";
    this.italicCheckbox = document.createElement("input");
    this.italicCheckbox.setAttribute("id", "italic_"+rnd);
    this.italicCheckbox.setAttribute("type", "checkbox");
    italicDom.appendChild(italicLabel);
    italicDom.appendChild(this.italicCheckbox);

    // underline checkbox
    let underlineDom = document.createElement("div");
    underlineDom.setAttribute("style", "display:inline-block; width:6%; height:30px; margin:0 5px 5px 0; padding:2px 0 0 0; background:var(--input-background); border: 1px solid var(--input-border); text-decoration:underline; white-space:nowrap;");
    let underlineLabel = document.createElement("label");
    underlineLabel.setAttribute("style", "position:relative; margin:0; padding:2px 12px 0 10px; top:-4px;");
    underlineLabel.setAttribute("for", "underline_"+rnd);
    underlineLabel.innerHTML = "<span>U</span>";
    this.underlineCheckbox = document.createElement("input");
    this.underlineCheckbox.setAttribute("id", "underline_"+rnd);
    this.underlineCheckbox.setAttribute("type", "checkbox");
    underlineDom.appendChild(underlineLabel);
    underlineDom.appendChild(this.underlineCheckbox);

    // overline checkbox
    let overlineDom = document.createElement("div");
    overlineDom.setAttribute("style", "display:inline-block; width:6%; height:30px; margin:0 5px 5px 0; padding:2px 0 0 0; background:var(--input-background); border: 1px solid var(--input-border); text-decoration:overline; white-space:nowrap;");
    let overlineLabel = document.createElement("label");
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
    this.colorDom.className = "richTextEditor_button richTextEditor_color"
    this.colorDom.setAttribute("style", "height:30px; margin:0 5px 5px 0;");

    // common style
    let common_style = "width:3.5%; height:30px; margin-bottom:5px;";

    // formula button
    let formulaDom = document.createElement("div");
    formulaDom.className = "richTextEditor_button richTextEditor_formula"
    formulaDom.setAttribute("style", common_style);

    // expression button
    let expressionDom = document.createElement("div");
    expressionDom.className = "richTextEditor_button richTextEditor_expression"
    expressionDom.setAttribute("style", common_style);

    // fraction button
    let fractionDom = document.createElement("div");
    fractionDom.className = "richTextEditor_button richTextEditor_fraction"
    fractionDom.setAttribute("style", common_style);

    // super index button
    let superIndexDom = document.createElement("div");
    superIndexDom.className = "richTextEditor_button richTextEditor_superIndex"
    superIndexDom.setAttribute("style", common_style);

    // sub index button
    let subIndexDom = document.createElement("div");
    subIndexDom.className = "richTextEditor_button richTextEditor_subIndex"
    subIndexDom.setAttribute("style", common_style);

    // radical button
    let radicalDom = document.createElement("div");
    radicalDom.className = "richTextEditor_button richTextEditor_radical"
    radicalDom.setAttribute("style", common_style);

    // sum button
    let sumDom = document.createElement("div");
    sumDom.className = "richTextEditor_button richTextEditor_sum"
    sumDom.setAttribute("style", common_style);

    // integral button
    let integralDom = document.createElement("div");
    integralDom.className = "richTextEditor_button richTextEditor_integral"
    integralDom.setAttribute("style", common_style);

    // limit button
    let limitDom = document.createElement("div");
    limitDom.className = "richTextEditor_button richTextEditor_limit"
    limitDom.setAttribute("style", common_style);

    // matrix button
    let matrixDom = document.createElement("div");
    matrixDom.className = "richTextEditor_button richTextEditor_matrix"
    matrixDom.setAttribute("style", common_style);

    // cases button
    let casesDom = document.createElement("div");
    casesDom.className = "richTextEditor_button richTextEditor_cases"
    casesDom.setAttribute("style", common_style);

    // utf table button
    let utfTableDom = document.createElement("div");
    utfTableDom.className = "richTextEditor_button richTextEditor_utfTable"
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

    let mostUsedChars = "+−·×÷αβγδεζηθικλμνξοπρςστυφχψω√±½¼°²³₀₁₂₃∞∢∅∈∴∧∨≦≧≡≠⏊′″‴‛’‟”";
    this.greekLowerCase = "αβγδεζηθικλμνξοπρςστυφχψω";
    this.greekUpperCase = "ΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡ ΣΤΥΦΧΨΩ";
    this.greekLetters = [];
    let tmpChar;
    for (let i=0, l=mostUsedChars.length; i<l; i++) {
      tmpChar = toolbar.appendChild(document.createElement("div"));
      tmpChar.className = "richTextEditor_button"
      tmpChar.setAttribute("style", "font-family:DJS_serif; width:2.8%; height:30px; margin:0 5px 5px 0; text-align:center; font-size:17px; line-height:28px; font-weight:bold;");
      tmpChar.innerHTML = mostUsedChars.charAt(i);
      tmpChar.addEventListener("click", function(evt) {
        self.insertSymbol(this.innerHTML);
      });

      if ((i >= 5) && (i <= 29)) {
        this.greekLetters.push(tmpChar);
      }
    }

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    this.textArea = document.createElement("div");
    this.textArea.className = "RTFtextEditor"
    this.textArea.setAttribute("style", "width:100%; height:calc(100% - 150px); flex-grow:1; text-align:left; padding:5px; margin:0; white-space:pre-wrap; display:inline-block; overflow-y:scroll; background:white;");
    this.rtfParser = new richTextEditor.RTFParser();
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    this.textArea.addEventListener("keydown", (evt) => {
      if (evt.shiftKey) {
        for (let i=0, l=self.greekLetters.length; i<l; i++) {
          self.greekLetters[i].innerHTML = self.greekUpperCase.charAt(i);
        }
      }
    });
    this.textArea.addEventListener("keyup", () => {
      for (let i=0, l=self.greekLetters.length; i<l; i++) {
        self.greekLetters[i].innerHTML = self.greekLowerCase.charAt(i);
      }
    });

    let btn_div = document.createElement("div");
    let btn_accept = document.createElement("button");
    btn_accept.setAttribute("id", "btn_accept_code_editor");
    btn_accept.innerHTML = "ace";
    let btn_cancel = document.createElement("button");
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
      let value = parseInt(this.value);
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
    this.colorDom.addEventListener("click", () => {
      paramEditor.colorPanel.show({
        value: self.color.replace(/\#/g, ""),
        setValue: (val) => { self.changeColor(val); }, 
        getValue: () => { return self.color; }, 
        modelObj: { font: "Monospaced,PLAIN,10"} 
      });
    });
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    formulaDom.addEventListener("click", () => {
      if (self.textController) {
        self.textController.addFormula();
      }
    });
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    expressionDom.addEventListener("click", () => {
      if (self.textController) {
        self.textController.addDynamicTextNode();
      }
    });
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    fractionDom.addEventListener("click", () => {
      if (self.textController) {
        self.textController.addFraction();
      }
    });
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    superIndexDom.addEventListener("click", () => {
      if (self.textController) {
        self.textController.addSuperIndex();
      }
    });
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    subIndexDom.addEventListener("click", () => {
      if (self.textController) {
        self.textController.addSubIndexNode();
      }
    });
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    radicalDom.addEventListener("click", () => {
      if (self.textController) {
        self.textController.addRadicalNode();
      }
    });
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    sumDom.addEventListener("click", () => {
      if (self.textController) {
        self.textController.addSumNode();
      }
    });
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    integralDom.addEventListener("click", () => {
      if (self.textController) {
        self.textController.addIntegralNode();
      }
    });
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    limitDom.addEventListener("click", () => {
      if (self.textController) {
        self.textController.addLimitNode();
      }
    });
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    matrixDom.addEventListener("click", () => {
      if (self.textController) {
        self.matrixDialog.showModal();
      }
    });
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    casesDom.addEventListener("click", () => {
      if (self.textController) {
        self.casesDialog.showModal();
      }
    });
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    utfTableDom.addEventListener("click", () => {
      paramEditor.symbolTable.open(self, null);
    });    

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // add events to the buttons
    btn_accept.addEventListener("click", () => {
      if (self.component) {
        self.component.setValue(self.getValue());
        self.component.changeValue();
      }
      self.dialog.close();
    });

    btn_cancel.addEventListener("click", () => {
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
    let defaultStyle = getDefaultStyle(this.component.modelObj);

    let fsize = parseInt(defaultStyle.fontSize);
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
    this.color = descartesColorToRGB(color.value);
    this.colorDom.style.background = this.color;

    if (this.textController) {
      this.textController.changeStyle("textColor", this.color);
    }
  }

  /**
   *
   */
  paramEditor.RTFTextEditor.prototype.changeStyle = function(textStyle) {
    if ((/Times/).test(textStyle.fontType)) {
      this.fontFamilySelect.value = "Serif";
    }
    else if ((/Arial/).test(textStyle.fontType)) {
      this.fontFamilySelect.value = "SansSerif";
    }
    else if ((/Courier/).test(textStyle.fontType)) {
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
    let self = this;

    this.dynamicTextNodeDialog = document.createElement("dialog");
    this.dynamicTextNodeDialog.style.padding = "10px";
    let form_div = document.createElement("div");

    let decimals_label = document.createElement("label");
    decimals_label.id = "dtnd_label_decimals";
    decimals_label.innerHTML = "decimales";
    this.decimals_inpt = document.createElement("input");
    this.decimals_inpt.setAttribute("type", "text");

    let fixed_id = "fixed_id_" + parseInt(Math.random()*1000);
    this.dynamicTextNodeDialog.fixed_id = fixed_id;
    let fixed_label = document.createElement("label");
    fixed_label.innerHTML = "fijo";
    fixed_label.id = "label_" + fixed_id;
    fixed_label.setAttribute("for", fixed_id);
    this.fixed_inpt = document.createElement("input");
    this.fixed_inpt.setAttribute("type", "checkbox");
    this.fixed_inpt.setAttribute("style", "margin-left: 20px; margin-right: 0;");
    this.fixed_inpt.setAttribute("id", fixed_id);

    let exprValue_label = document.createElement("label");
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

    let btn_div = document.createElement("div");
    let btn_accept = document.createElement("button");
    btn_accept.setAttribute("id", "btn_accept_code_editor");
    btn_accept.innerHTML = "ace";
    let btn_cancel = document.createElement("button");
    btn_cancel.setAttribute("id", "btn_cancel_code_editor");
    btn_cancel.innerHTML = "can";
    btn_div.appendChild(btn_accept);
    btn_div.appendChild(btn_cancel);

    this.dynamicTextNodeDialog.appendChild(form_div);
    this.dynamicTextNodeDialog.appendChild(btn_div);

    document.body.appendChild(this.dynamicTextNodeDialog);

    // add events to the buttons
    btn_accept.addEventListener("click", () => {
      if (self.dynamicTextNode) {
        self.dynamicTextNode.decimals = self.decimals_inpt.value;
        self.dynamicTextNode.fixed = self.fixed_inpt.checked;
        self.dynamicTextNode.value = self.exprValue_inpt.value;
      }

      self.dynamicTextNodeDialog.close();
    });

    btn_cancel.addEventListener("click", () => {
      self.dynamicTextNodeDialog.close();
    });
  }

  /**
   *
   */
  paramEditor.RTFTextEditor.prototype.createMatrixDialog = function() {
    let self = this;

    this.matrixDialog = document.createElement("dialog");
    this.matrixDialog.style.padding = "10px";
    let form_div = document.createElement("div");

    // matrix type
    this.matrix_type = document.createElement("select");

    let option1 = this.matrix_type.appendChild(document.createElement("option"));
    option1.innerHTML = "[ ]";
    option1.value = 0;

    let option2 = this.matrix_type.appendChild(document.createElement("option"));
    option2.innerHTML = "( )";
    option2.value = 1;

    let option3 = this.matrix_type.appendChild(document.createElement("option"));
    option3.innerHTML = "{ }";
    option3.value = 2;

    let option4 = this.matrix_type.appendChild(document.createElement("option"));
    option4.innerHTML = "| |";
    option4.value = 3;

    let option5 = this.matrix_type.appendChild(document.createElement("option"));
    option5.innerHTML = "‖ ‖";
    option5.value = 4;

    let option6 = this.matrix_type.appendChild(document.createElement("option"));
    option6.innerHTML = "  ";
    option6.value = 5;

    // m
    let columns_label = document.createElement("label");
    columns_label.innerHTML = "m";
    this.columns_inpt = document.createElement("input");
    this.columns_inpt.setAttribute("type", "text");
    this.columns_inpt.setAttribute("style", "width:80px;");
    this.columns_inpt.value = 2;

    // n
    let rows_label = document.createElement("label");
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

    let btn_div = document.createElement("div");
    let btn_accept = document.createElement("button");
    btn_accept.setAttribute("id", "btn_accept_code_editor");
    btn_accept.innerHTML = "ace";
    let btn_cancel = document.createElement("button");
    btn_cancel.setAttribute("id", "btn_cancel_code_editor");
    btn_cancel.innerHTML = "can";
    btn_div.appendChild(btn_accept);
    btn_div.appendChild(btn_cancel);

    this.matrixDialog.appendChild(form_div);
    this.matrixDialog.appendChild(btn_div);

    document.body.appendChild(this.matrixDialog);

    // add events to the buttons
    btn_accept.addEventListener("click", () => {
      self.matrixDialog.close();
      self.textController.addMatrixNode(self.rows_inpt.value || 2, self.columns_inpt.value || 2, self.matrix_type.value);
    });

    btn_cancel.addEventListener("click", () => {
      self.matrixDialog.close();
    });
  }

  /**
   *
   */
  paramEditor.RTFTextEditor.prototype.createCasesDialog = function() {
    let self = this;

    this.casesDialog = document.createElement("dialog");
    this.casesDialog.style.padding = "10px";
    let form_div = document.createElement("div");

    // m
    let parts_label = document.createElement("label");
    parts_label.id = "cd_parts";
    parts_label.innerHTML = "partes";
    this.parts_inpt = document.createElement("input");
    this.parts_inpt.setAttribute("type", "text");
    this.parts_inpt.setAttribute("style", "width:80px;");
    this.parts_inpt.value = 2;
    form_div.appendChild(parts_label);
    form_div.appendChild(this.parts_inpt);

    let btn_div = document.createElement("div");
    let btn_accept = document.createElement("button");
    btn_accept.setAttribute("id", "btn_accept_code_editor");
    btn_accept.innerHTML = "ace";
    let btn_cancel = document.createElement("button");
    btn_cancel.setAttribute("id", "btn_cancel_code_editor");
    btn_cancel.innerHTML = "can";
    btn_div.appendChild(btn_accept);
    btn_div.appendChild(btn_cancel);

    this.casesDialog.appendChild(form_div);
    this.casesDialog.appendChild(btn_div);

    document.body.appendChild(this.casesDialog);

    // add events to the buttons
    btn_accept.addEventListener("click", () => {
      self.casesDialog.close();
      self.textController.addDefpartsNode(self.parts_inpt.value || 2);
    });

    btn_cancel.addEventListener("click", () => {
      self.casesDialog.close();
    });
  }  

  /**
   *
   */
  function getDefaultStyle(textObj) {
    let defaultStyle = { fontFamily:"Times New Roman", fontSize:"30px",fontStyle:"normal", fontWeight:"normal", textDecoration:"none", decimals:2, fixed:false };

    if (textObj.font_family) {
      if ((/sansserif/i).test(textObj.font_family)) {
        defaultStyle.fontFamily = "Arial";
      }
      else if ((/serif/i).test(textObj.font_family)) {
        defaultStyle.fontFamily = "Times New Roman";
      }
      else if ((/monospaced/i).test(textObj.font_family)) {
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
    let R = G = B = "00";

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

      let i = 0;
      let hexColor = parseInt(splitColor[i], 16);
      let cond = (splitColor[i] != hexColor.toString(16)) && (splitColor[i] !== "0"+hexColor.toString(16));
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
