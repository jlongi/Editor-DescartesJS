/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var paramEditor = (function(paramEditor) {

  /**
   *
   */
  paramEditor.CodeEditor = function() {
    var self = this;
    
    this.dialog = document.createElement("dialog");
    this.dialog.setAttribute("style", "width:100%; height:100%; background:rgba(0,0,0,0);");

    var container = document.createElement("div");
    container.setAttribute("class", "codeContainer");

    this.textArea = document.createElement("textarea");
    this.textArea.setAttribute("style", "width:100%; height:80%; flex-grow:1; font-family:editorDescartesJS_monospace,monospace; font-size:16px; resize:none; padding:5px; white-space: pre; word-wrap: normal;");

    var btn_div = document.createElement("div");
    var btn_accept = document.createElement("button");
    btn_accept.setAttribute("id", "btn_accept_code_editor");
    btn_accept.innerHTML = "ace";
    var btn_cancel = document.createElement("button");
    btn_cancel.setAttribute("id", "btn_cancel_code_editor");
    btn_cancel.innerHTML = "can";
    btn_div.appendChild(btn_accept);
    btn_div.appendChild(btn_cancel);

    this.dialog.appendChild(container);
    container.appendChild(this.textArea);
    container.appendChild(btn_div);

    document.body.appendChild(this.dialog);

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

  }

  /**
   *
   */
  paramEditor.CodeEditor.prototype.translate = function() {
    this.dialog.querySelector("#btn_accept_code_editor").innerHTML = babel.transGUI("ok_btn");
    this.dialog.querySelector("#btn_cancel_code_editor").innerHTML = babel.transGUI("cancel_btn");
  }

  /**
   *
   */
  paramEditor.CodeEditor.prototype.setValue = function(value) {
    this.textArea.value = paramEditor.replaceSeparators(value);
  }

  /**
   *
   */
  paramEditor.CodeEditor.prototype.getValue = function() {
    return this.textArea.value.replace(/\n/g, ";");
  }

  /**
   *
   */
  paramEditor.CodeEditor.prototype.show = function(component) {
    this.component = component;
    this.setValue(component.getValue());
    this.dialog.showModal();
  }

  return paramEditor;
})(paramEditor || {});
