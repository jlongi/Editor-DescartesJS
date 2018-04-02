/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var editor = (function(editor) {

  var self; 

  /**
   *
   */
  editor.Dialog = function(width, height, title, ok_label, cancel_label) {
    var self = this;

    this.container = document.createElement("div");
    this.container.setAttribute("class", "DialogContainer");
    
    this.body = document.createElement("div");
    this.body.setAttribute("class", "DialogBody");
    this.body.setAttribute("style", "width:" + width + "; height:" + height + ";");

    this.title = document.createElement("div");
    this.title.setAttribute("class", "DialogTitle");
    this.setTitle(title);

    this.content = document.createElement("div");
    this.content.setAttribute("class", "DialogContent");
    this.setContent("");

    this.btnContainer = document.createElement("div");
    this.btnContainer.setAttribute("class", "DialogBtnContainer");

    if (cancel_label) {
      this.cancel_btn = document.createElement("div");
      this.cancel_btn.setAttribute("class", "DialogButton");
      this.setCancelLabel(cancel_label);
      this.cancel_btn.addEventListener("click", function(evt) { 
        if (self.cancelCallback) {
          self.cancelCallback();
        }
        self.close(); 
      });
      this.btnContainer.appendChild(this.cancel_btn);
    }

    if (ok_label) {
      this.ok_btn = document.createElement("div");
      this.ok_btn.setAttribute("class", "DialogButton");
      this.setOkLabel(ok_label);
      this.ok_btn.addEventListener("click", function(evt) { 
        if (self.okCallback) {
          self.okCallback();
        }
        self.close(); 
      });
      this.btnContainer.appendChild(this.ok_btn);
    }

    this.container.appendChild(this.body);
    this.body.appendChild(this.title);
    this.body.appendChild(this.content);
    this.body.appendChild(this.btnContainer);
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
    
    self = this;
    this.escHandler = function(evt) {
      // enter key (has an error in the repetition)
      // if (evt.keyCode === 13) {
      //   if (self.okCallback) {
      //     self.close();
      //     self.okCallback();
      //   }
      // }

      // esc key
      if (evt.keyCode === 27) {
        self.close();
      }
    }
    window.addEventListener("keyup", this.escHandler);
  }
  
  editor.Dialog.prototype.close = function() {
    if (this.parentNode) {
      this.parentNode.removeChild(this.container);
    }
    window.removeEventListener("keyup", this.escHandler);
  }

  return editor;
})(editor || {});
