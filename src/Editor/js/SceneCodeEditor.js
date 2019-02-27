/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var editor = (function(editor) {

  var self; 
  
  /**
   *
  */
  editor.SceneCodeEditor = function() {
    // call the parent constructor
    editor.Dialog.call(this, "calc(100% - 20px)", "calc(100% - 20px)", "", "", "");

    self = this;
    
    self.content.style.padding = "10px";
    self.content.style.height = "100%";

    self.codeEditorContainer = document.createElement("div");
    self.codeEditorContainer.setAttribute("class", "SceneCodeEditorContainer");
    self.codeEditorContainer.setAttribute("style", "cursor:text; line-height:1.5em; width:calc(100% - 10px); height:calc(100% - 75px); flex-grow:1; text-align:left; padding:5px; margin:0; white-space:pre-wrap; display:inline-block; overflow-y:scroll; font-family:editorDescartesJS_monospace;");

    self.codeArea = document.createElement("ol");
    self.codeArea.setAttribute("contenteditable", "true");
    self.codeArea.setAttribute("class", "SceneCodeEditorCounter");
    self.codeArea.setAttribute("style", "cursor:text; line-height:1.5em; width:calc(100% - 10px); height:calc(100% - 75px); flex-grow:1; text-align:left; padding:5px; margin:0; white-space:pre-wrap; display:inline-block; overflow-y:scroll; font-family:editorDescartesJS_monospace;");
    self.codeArea.innerHTML = "<li><br></li><li><br></li><li><br></li><li><br></li><li><br></li>";

    /**
     *
     */
    self.codeArea.addEventListener("copy", function(evt) {
      evt.preventDefault();
      var selection = window.getSelection();
      var range = selection.getRangeAt(0);
      var docFra = range.cloneContents();

      // prepare the copy values
      var childNodes = domNodesToArray(docFra.childNodes);
      var tmpDiv = document.createElement("div");
      for (var i=0, l=childNodes.length; i<l; i++) {
        if (childNodes[i].innerHTML !== "") {
          tmpDiv.appendChild(childNodes[i]);
        }
      }

      evt.clipboardData.setData("text/plain", tmpDiv.textContent.replace(/></g, ">\n<"));
    });
    /**
     *
     */
    self.codeArea.addEventListener("cut", function(evt) {
      evt.preventDefault();
      var selection = window.getSelection();
      var range = selection.getRangeAt(0);
      var startContainer = range.startContainer;
      var startOffset = range.startOffset;
      var endContainer = range.endContainer;
      var endOffset = range.endOffset;

      var docFra = range.cloneContents();

      // prepare the copy values
      var childNodes = domNodesToArray(docFra.childNodes);
      var tmpDiv = document.createElement("div");
      for (var i=0, l=childNodes.length; i<l; i++) {
        if (childNodes[i].innerHTML !== "") {
          tmpDiv.appendChild(childNodes[i]);
        }
      }

      evt.clipboardData.setData("text/plain", tmpDiv.textContent.replace(/></g, ">\n<"));

      // replace the content in the text area for the appropiate content
      var code = self.codeArea.textContent.replace(/></g, ">\n<").split("\n");
      var newCode = [];
      var indexStart = indexEnd = 0;
      var liElements = domNodesToArray(self.codeArea.childNodes);
      for (var i=0, l=liElements.length; i<l; i++) {
        if ((startContainer == liElements[i]) || (startContainer == liElements[i].firstChild)) {
          indexStart = i;
        }
        if ((endContainer == liElements[i]) || (endContainer == liElements[i].firstChild)) {
          indexEnd = i;
        }
      }

      var tmpContent;
      for (var i=0, l=code.length; i<l; i++) {
        if ((i < indexStart) || (i > indexEnd)) {
          newCode.push(code[i]);
        }
        else if ((i == indexStart) && (i == indexEnd)){
          tmpContent = code[i].substring(0, startOffset) + code[i].substring(endOffset);
          if (tmpContent != "") {
            newCode.push(tmpContent);
          }
        }
        else if (i == indexStart) {
          newCode.push(code[i].substring(0, startOffset));
        }
        else if (i == indexEnd) {
          newCode[newCode.length-1] += code[i].substring(endOffset);
        }
      }

      self.setCode(newCode.join("\n"), self.scene);

      // set the new selection and range
      liElements = domNodesToArray(self.codeArea.childNodes);
      range.setStart(liElements[indexStart].firstChild, startOffset);
      range.setEnd(liElements[indexStart].firstChild, startOffset);
      selection.removeAllRanges();
      selection.addRange(range);
    });
    /**
     *
     */
    self.codeArea.addEventListener("paste", function(evt) {
      evt.preventDefault();
      var data = evt.clipboardData.getData("text/plain").split(/\n/g);

      var selection = window.getSelection();
      var range = selection.getRangeAt(0);
      var startContainer = range.startContainer;
      var startOffset = range.startOffset;
      
      // has a selection before paste
      if (!selection.isCollapsed) {
        range.deleteContents();

        range.setStart(startContainer, startOffset);
        range.setEnd(startContainer, startOffset);
        selection.removeAllRanges();
        selection.addRange(range);
      }

      // single line of text
      if (data.length == 1) {
        range.insertNode( document.createTextNode(data[0]) );
        range.collapse(false);
      }
      // multiple lines in the copied text
      else if (data.length > 1) {
        var liContainer = startContainer;
        if (startContainer.nodeType == 3) {
          liContainer = startContainer.parentNode;
        }

        var restStr = liContainer.textContent.substring(startOffset);
        var tmpLi;
        var lastOffset = 0;
        if (restStr != "") {
          liContainer.textContent = liContainer.textContent.substring(0, startOffset) + data[0];
          data[data.length-1] += restStr;
        }
        else {
          range.insertNode( document.createTextNode(data[0]) );
        }

        for (var i=1, l=data.length; i<l; i++) {
          tmpLi = document.createElement("li");
          tmpLi.innerText = data[i];
          // empty line
          if (data[i] == "") {
            tmpLi.innerHTML = "<br>";
          }
          lastOffset = data[i].length - restStr.length;

          liContainer.parentNode.insertBefore(tmpLi, liContainer.nextSibling);
          liContainer = tmpLi;
        }

        range.setStart(liContainer.firstChild, lastOffset);
        range.collapse(false);
        selection.removeAllRanges();
        selection.addRange(range);
      }

      // clean empty li to prevent numbers overlaping
      self.codeArea.normalize();
      var liElements = domNodesToArray(self.codeArea.childNodes);
      for (var i=0, l=liElements.length; i<l; i++) {
        if (liElements[i].innerHTML == "") {
          liElements[i].parentNode.removeChild(liElements[i]);
        }
      }
    });

    
    var btn_div = document.createElement("div");
    btn_div.setAttribute("style", "text-align:center;")
    self.btn_accept_code_editor = document.createElement("button");
    self.btn_accept_code_editor.setAttribute("id", "self.btn_accept_code_editor");
    self.btn_accept_code_editor.innerHTML = "Aceptar";
    self.btn_cancel_code_editor = document.createElement("button");
    self.btn_cancel_code_editor.setAttribute("id", "self.btn_cancel_code_editor");
    self.btn_cancel_code_editor.innerHTML = "Cancelar";
    btn_div.appendChild(self.btn_accept_code_editor);
    btn_div.appendChild(self.btn_cancel_code_editor);

    self.content.appendChild(self.codeArea);
    self.btnContainer.appendChild(btn_div);

    // add events to the buttons
    self.btn_accept_code_editor.addEventListener("click", function(evt) {
      self.scene.applet.innerHTML = self.codeArea.innerText;

      // get the size parameter to change the scene dimension
      var allParams = self.scene.applet.querySelectorAll("param");
      for (var i=0, l=allParams.length; i<l; i++) {
        if (babel[allParams[i].getAttribute("name")] == "size") {
          var [w, h] = allParams[i].getAttribute("value").split("x");
          if (w && h) {
            self.scene.applet.setAttribute("width", Math.abs(parseInt(w)));
            self.scene.applet.setAttribute("height", Math.abs(parseInt(h)));
          }
          i = l;
        }
      }

      // modify the content of the applet
      self.scene.okAction(self.scene.applet);
      // modify the model of the paramEditor object
      self.scene.closeAction();
      
      // close the dialog
      self.close();
    });

    self.btn_cancel_code_editor.addEventListener("click", function(evt) {
      self.close();
    });
  }  

  ////////////////////////////////////////////////////////////////////////////////////
  // create an inheritance of Dialog
  ////////////////////////////////////////////////////////////////////////////////////
  editor.extend(editor.SceneCodeEditor, editor.Dialog);

  /**
   *
   */
  function domNodesToArray(nodes) {
    return [...nodes];
    // return Array.prototype.slice.call(nodes);
  }

  /**
   * 
   */
  editor.SceneCodeEditor.prototype.setCode = function(code, scene) {
    this.scene = scene;

    code = code.replace(/></g, ">\n<").split("\n");

    var tmpLi;
    this.codeArea.innerHTML = "";
    for (var i=0, cl=code.length; i<cl; i++) {
      if (code[i] != "") {
        tmpLi = document.createElement("li");
        tmpLi.innerText = code[i];
        this.codeArea.appendChild(tmpLi);
      }
    }

    if ((code.length == 1) && (code[0] == "")) {
      tmpLi = document.createElement("li");
      tmpLi.innerHTML = " ";
      this.codeArea.appendChild(tmpLi);
    }
  }

  return editor;
})(editor || {});
