/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var editor = (function(editor) {

  /**
   *
   */
  editor.Dialog = function(width, height, title, ok_label, cancel_label) {
    let self = this;

    this.container = document.createElement("div");
    this.container.className = "DialogContainer"

    this.body = this.container.appendChild(document.createElement("div"));
    this.body.className = "DialogBody"
    this.body.setAttribute("style", `width:${width};height:${height};`);

    this.title = this.body.appendChild(document.createElement("div"));
    this.title.className = "DialogTitle"
    this.setTitle(title);

    this.content = this.body.appendChild(document.createElement("div"));
    this.content.className = "DialogContent"
    this.setContent("");

    this.btnContainer = this.body.appendChild(document.createElement("div"));
    this.btnContainer.className = "DialogBtnContainer"

    if (cancel_label) {
      this.cancel_btn = this.btnContainer.appendChild(document.createElement("div"));
      this.cancel_btn.className = "DialogButton"
      this.cancel_btn.setAttribute("tabindex", "0");
      this.setCancelLabel(cancel_label);
      this.cancel_btn.addEventListener("click", () => {
        if (self.cancelCallback) {
          self.cancelCallback();
        }
        self.close(); 
      });
      this.cancel_btn.addEventListener("keydown", (evt) => { 
        if (evt.key.toLowerCase() === "enter") {
          if (self.cancelCallback) {
            self.cancelCallback();
          }
          self.close();
        }
      });
    }

    if (ok_label) {
      this.ok_btn = this.btnContainer.appendChild(document.createElement("div"));
      this.ok_btn.className = "DialogButton"
      this.ok_btn.setAttribute("tabindex", "0");
      this.setOkLabel(ok_label);
      this.ok_btn.addEventListener("click", () => { 
        if (self.okCallback) {
          self.okCallback();
        }
        self.close(); 
      });
      this.ok_btn.addEventListener("keydown", (evt) => {
        if (evt.key.toLowerCase() === "enter") {
          if (self.okCallback) {
            self.okCallback();
          }
          self.close();
        }
      });
    }
  }

  editor.Dialog.prototype.setTitle = function(title) {
    if (title) {
      this.title.style.display = "block";
      this.title.innerHTML = title;
    }
    else {
      this.title.style.display = "none";
    }
  }
  editor.Dialog.prototype.setContent = function(content, isDOM) {
    if (isDOM) {
      this.content.appendChild(content);
    }
    else {
      this.content.innerHTML = content;
    }
  }
  editor.Dialog.prototype.setOkLabel = function(label) {
    this.ok_btn.innerHTML = label;
  }
  editor.Dialog.prototype.setCancelLabel = function(label) {
    this.cancel_btn.innerHTML = label;
  }
  editor.Dialog.prototype.setOkCallback = function(callback) {
    this.okCallback = callback;
  }
  editor.Dialog.prototype.setCancelCallback = function(callback) {
    this.cancelCallback = callback;
  }

  editor.Dialog.prototype.open = function(node) {
    this.parentNode = (node) ? node : document.body;
    this.parentNode.appendChild(this.container);
    
    if (this.ok_btn) {
      this.ok_btn.focus();
    }

    let self = this; 
    this.escHandler = (evt) => {
      if (evt.target.nodeName.toLowerCase() == "input") {
        // enter key
        if (evt.key.toLowerCase() === "enter") {
          self.ok_btn.click();
        }
      }

      // esc key
      if (evt.keyCode === 27) {
        self.close();
      }
    }

    window.onkeydown = this.escHandler;
  }
  
  editor.Dialog.prototype.close = function() {
    if (this.parentNode) {
      this.parentNode.removeChild(this.container);
    }
    window.onkeydown = () => {};
  }

  return editor;
})(editor || {});
