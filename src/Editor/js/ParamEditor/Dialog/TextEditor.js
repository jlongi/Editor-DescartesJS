/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var paramEditor = (function(paramEditor) {

  /**
   *
   */
  paramEditor.TextEditor = function() {
    var self = this;
    
    var rnd = parseInt(Math.random()*1000);

    this.dialog = new editor.Dialog("calc(100% - 20px)", "calc(100% - 20px)", "", "", "");

    var toolbar = document.createElement("div");
    toolbar.setAttribute("class", "toolbar");
    toolbar.setAttribute("style", "display:flex; align-items:center; justify-content:space-between; align-content:flex-start; width:100%; padding:0; margin:0 0 10px 0; height:30px; font-size:16px;")

    // font family menu
    this.fontFamilySelect = document.createElement("select");
    this.fontFamilySelect.setAttribute("style", "display:inline-flex; flex-grow:1; width:40%; height:30px; margin:0 10px 0 0; text-align-last:left;");
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
    this.fontSizeSelect.setAttribute("style", "display:inline-flex; flex-grow:1; width:30%; height:30px; margin:0 10px 0 0; text-align-last:left;");
    var tmpOption;
    var options = [6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 26, 28, 30, 32, 34, 36, 38, 40, 42, 44, 46, 48, 52, 56, 60, 64, 68, 72, 76, 80];
    for (var i=0, l=options.length; i<l; i++) {
      tmpOption = document.createElement("option");
      tmpOption.setAttribute("value", options[i]);
      tmpOption.innerHTML = options[i];
      this.fontSizeSelect.appendChild(tmpOption);
    }

    // bold checkbox
    var boldDom = document.createElement("div");
    boldDom.setAttribute("style", "display:flex; flex-grow:1; align-items:center; width:16%; height:30px; padding:0; background:var(--input-background); border:1px solid var(--input-border); margin:0 10px 0 0;");
    var boldLabel = document.createElement("label");
    boldLabel.setAttribute("id", "bold_label_text");
    boldLabel.setAttribute("style", "position:relative; margin:0px; padding:2px 12px 0 10px;")
    boldLabel.setAttribute("for", "bold_"+rnd);
    boldLabel.innerHTML = "Negrita";
    this.boldCheckbox = document.createElement("input");
    this.boldCheckbox.setAttribute("id", "bold_"+rnd);
    this.boldCheckbox.setAttribute("type", "checkbox");
    boldDom.appendChild(this.boldCheckbox);
    boldDom.appendChild(boldLabel);

    // italic checkbox
    var italicDom = document.createElement("div");
    italicDom.setAttribute("style", "display:flex; flex-grow:1; align-items:center; width:14%; height:30px; padding:0; background:var(--input-background); border:1px solid var(--input-border); margin:0 10px 0 0;");
    var italicLabel = document.createElement("label");
    italicLabel.setAttribute("id", "italic_label_text");
    italicLabel.setAttribute("style", "position:relative; margin:0px; padding:2px 12px 0 10px;")
    italicLabel.setAttribute("for", "italic_"+rnd);
    italicLabel.innerHTML = "Italica";
    this.italicCheckbox = document.createElement("input");
    this.italicCheckbox.setAttribute("id", "italic_"+rnd);
    this.italicCheckbox.setAttribute("type", "checkbox");
    italicDom.appendChild(this.italicCheckbox);
    italicDom.appendChild(italicLabel);

    // utf table button
    var utfTableDom = document.createElement("div");
    utfTableDom.setAttribute("class", "richTextEditor_button richTextEditor_utfTable");    

    toolbar.appendChild(this.fontFamilySelect);
    toolbar.appendChild(this.fontSizeSelect);
    toolbar.appendChild(boldDom);
    toolbar.appendChild(italicDom);
    toolbar.appendChild(utfTableDom);

    this.textArea = document.createElement("div");
    this.textArea.setAttribute("class", "textEditorTextArea");
    this.textArea.setAttribute("contenteditable", "true");
    this.textArea.setAttribute("style", "width:100%; height:calc(100% - 85px); flex-grow:1; text-align:left; padding:5px; margin:0; white-space:pre-wrap; display:inline-block; overflow-y:scroll;");

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

    //
    this.fontFamilySelect.addEventListener("change", function() { self.changeStyle();});
    this.boldCheckbox.addEventListener("change", function() { self.changeStyle();});
    this.italicCheckbox.addEventListener("change", function() { self.changeStyle();});
    this.fontSizeSelect.addEventListener("change", function() { self.changeStyle();});
    utfTableDom.addEventListener("click", function(evt) {
      paramEditor.symbolTable.open(self.textArea, window.getSelection());
    });

    // event listeners
    // prevent to paste bad formed text
    this.textArea.addEventListener("paste", function(evt) {
      // cancel paste
      evt.preventDefault();

      // get text representation of clipboard
      var text = evt.clipboardData.getData("text/plain");

      // insert text manually
      document.execCommand("insertHTML", false, text);
    });

    // this.textArea.addEventListener("keydown", function(evt) {
    //   if (evt.keyCode === 13) {
    //     document.execCommand("formatBlock", false, "div");

        // evt.stopPropagation();
        // evt.preventDefault();
// console.log(self.textArea.innerHTML)

        // document.execCommand('insertHTML', false, '<br>');
        // return false;
    //   }
    // });

    // add events to the buttons
    btn_accept.addEventListener("click", function(evt) {
      if (self.component) {
        self.changeFontModel();

        self.component.setValue(self.getValue());
        self.component.changeValue();
        
        if (self.font.size != "") {
          self.component.list.editPanel.components.font_size.setValue(self.font.size);
          self.component.list.editPanel.components.font_size.changeValue();
        }
        self.component.list.editPanel.components.font_family.setValue(self.font.family);
        self.component.list.editPanel.components.font_family.changeValue();
        self.component.list.editPanel.components.bold.setValue(self.font.bold);
        self.component.list.editPanel.components.bold.changeValue();
        self.component.list.editPanel.components.italics.setValue(self.font.italics);
        self.component.list.editPanel.components.italics.changeValue();
      }
      self.dialog.close();
    });

    btn_cancel.addEventListener("click", function(evt) {
      self.dialog.close();
    });

  }

  /**
   *
   */
  paramEditor.TextEditor.prototype.translate = function() {
    this.dialog.container.querySelector("#btn_accept_code_editor").innerHTML = babel.transGUI("ok_btn");
    this.dialog.container.querySelector("#btn_cancel_code_editor").innerHTML = babel.transGUI("cancel_btn");

    this.dialog.container.querySelector("#bold_label_text").innerHTML = babel.transGUI("bold");
    this.dialog.container.querySelector("#italic_label_text").innerHTML = babel.transGUI("italics");
  }

  /**
   *
   */
  paramEditor.TextEditor.prototype.setValue = function(value) {
    this.textArea.innerHTML = value.replace(/&/g, "&amp;")
                                   .replace(/</g, "&lt;")
                                   .replace(/>/g, "&gt;")
                                   .replace(/"/g, "&quot;");

    // prevent adding breaklines when show an rtf text
    if (!value.match(/{\\rtf1\\uc0{/)) {
      this.textArea.innerHTML = this.textArea.innerHTML.replace(/\\n/g, "\n");
    }

    this.font = {
      family: this.component.modelObj.font_family,
      size  : this.component.modelObj.font_size,
      bold  : this.component.modelObj.bold,
      italics: this.component.modelObj.italics
    }
    // this.font = getFontObject( this.component.modelObj.font || "SansSerif,PLAIN,18" );
    this.setFontValues();
    this.changeStyle();
  }

  /**
   *
   */
  paramEditor.TextEditor.prototype.getValue = function() {
    if (this.textArea.innerHTML[this.textArea.innerHTML.length-1] == "\n") {
      this.textArea.innerHTML = this.textArea.innerHTML.substring(0, this.textArea.innerHTML.length-1);
    }
    return this.textArea.innerHTML.replace(/&amp;/g, "&")
                                  .replace(/&lt;/g, "<")
                                  .replace(/&gt;/g, ">")
                                  .replace(/&quot;/g, '"')
                                  .replace(/\n/g, "\\n");
  }

  /**
   *
   */
  paramEditor.TextEditor.prototype.show = function(component) {
    this.component = component;
    this.setValue(component.getValue());
    this.dialog.open();
    this.textArea.focus();
  }

  /**
   *
   */
  paramEditor.TextEditor.prototype.setFontValues = function() {
    this.boldCheckbox.checked = (this.font.bold === "true");
    this.italicCheckbox.checked = (this.font.italics === "true");
    this.fontFamilySelect.value = this.font.family;
    this.fontSizeSelect.value = this.font.size;
  }

  /** 
   *
   */
  paramEditor.TextEditor.prototype.changeStyle = function() {
    this.font.family = this.fontFamilySelect.value;
    this.font.size   = this.fontSizeSelect.value;
    this.font.bold   = this.boldCheckbox.checked;
    this.font.italics = this.italicCheckbox.checked;

    // set the style
    if (this.font.family == "SansSerif") {
      this.textArea.style.fontFamily = "Arial,Helvetica,sans-serif"
    }
    else if (this.font.family == "Serif") {
      this.textArea.style.fontFamily = "'Times New Roman',Times,serif";
    }
    else {
      this.textArea.style.fontFamily = "'Courier New',Courier,monospace";
    }
    
    this.textArea.style.fontSize = (this.font.size || 23) +"px";
    this.textArea.style.lineHeight = "normal";

    this.textArea.style.fontWeight = "normal";
    this.textArea.style.fontStyle = "normal";
    if (this.font.bold) {
      this.textArea.style.fontWeight = "bold";
    }
    if (this.font.italics) {
      this.textArea.style.fontStyle = "italic";
    }
  }

  /**
   *
   */
  paramEditor.TextEditor.prototype.changeFontModel = function() {
    this.component.modelObj.font_family = this.font.family;
    this.component.modelObj.bold = this.font.bold;
    this.component.modelObj.italics = this.font.italics;

    if (this.font.size != "") {
      this.component.modelObj.font_size = this.font.size;
    }
  }

  return paramEditor;
})(paramEditor || {});
