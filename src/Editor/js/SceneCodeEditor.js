/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var editor = (function(editor) {
  let self; 

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
    self.codeEditorContainer.className = "SceneCodeEditorContainer"
    self.codeEditorContainer.setAttribute("style", "cursor:text; line-height:1.5em; width:calc(100% - 10px); height:calc(100% - 75px); flex-grow:1; text-align:left; padding:5px; margin:0; white-space:pre-wrap; display:inline-block; overflow-y:scroll; font-family:editorDescartesJS_monospace;");

    self.codeArea = document.createElement("ol");
    self.codeArea.setAttribute("contenteditable", "true");
    self.codeArea.className = "SceneCodeEditorCounter"
    self.codeArea.setAttribute("style", "cursor:text; line-height:1.5em; width:calc(100% - 10px); height:calc(100% - 75px); flex-grow:1; text-align:left; padding:5px; margin:0; white-space:pre-wrap; display:inline-block; overflow-y:scroll; font-family:editorDescartesJS_monospace;");
    self.codeArea.innerHTML = "<li><br></li><li><br></li><li><br></li><li><br></li><li><br></li>";

    /**
     *
     */
    self.codeArea.addEventListener("copy", (evt) => {
      evt.preventDefault();
      let docFra = window.getSelection().getRangeAt(0).cloneContents();

      // prepare the copy values
      let childNodes = domNodesToArray(docFra.childNodes);
      let tmpDiv = document.createElement("div");
      for (let childNodes_i of childNodes) {
        if (childNodes_i.innerHTML !== "") {
          tmpDiv.appendChild(childNodes_i);
        }
      }
      evt.clipboardData.setData("text/plain", tmpDiv.textContent.replace(/></g, ">\n<"));
    });
    /**
     *
     */
    self.codeArea.addEventListener("cut", (evt) => {
      evt.preventDefault();
      let selection = window.getSelection();
      let range = selection.getRangeAt(0);
      let startContainer = range.startContainer;
      let startOffset = range.startOffset;
      let endContainer = range.endContainer;
      let endOffset = range.endOffset;

      let docFra = range.cloneContents();

      // prepare the copy values
      let childNodes = domNodesToArray(docFra.childNodes);
      let tmpDiv = document.createElement("div");
      for (let childNodes_i of childNodes) {
        if (childNodes_i.innerHTML !== "") {
          tmpDiv.appendChild(childNodes_i);
        }
      }
      evt.clipboardData.setData("text/plain", tmpDiv.textContent.replace(/></g, ">\n<"));

      // replace the content in the text area for the appropiate content
      let code = self.codeArea.textContent.replace(/></g, ">\n<").split("\n");
      let newCode = [];
      let indexStart = indexEnd = 0;
      let liElements = domNodesToArray(self.codeArea.childNodes);
      for (let i=0, l=liElements.length; i<l; i++) {
        if ((startContainer == liElements[i]) || (startContainer == liElements[i].firstChild)) {
          indexStart = i;
        }
        if ((endContainer == liElements[i]) || (endContainer == liElements[i].firstChild)) {
          indexEnd = i;
        }
      }

      let tmpContent;
      for (let i=0, l=code.length; i<l; i++) {
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
      let data = evt.clipboardData.getData("text/plain").split(/\n/g);

      let selection = window.getSelection();
      let range = selection.getRangeAt(0);
      let startContainer = range.startContainer;
      let startOffset = range.startOffset;
      
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
        range.insertNode(document.createTextNode(data[0]));
        range.collapse(false);
      }
      // multiple lines in the copied text
      else if (data.length > 1) {
        let liContainer = startContainer;
        if (startContainer.nodeType == 3) {
          liContainer = startContainer.parentNode;
        }

        let restStr = liContainer.textContent.substring(startOffset);
        let tmpLi;
        let lastOffset = 0;
        if (restStr != "") {
          liContainer.textContent = liContainer.textContent.substring(0, startOffset) + data[0];
          data[data.length-1] += restStr;
        }
        else {
          range.insertNode( document.createTextNode(data[0]) );
        }

        for (let i=1, l=data.length; i<l; i++) {
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

      // clean empty li to prevent numbers overlapping
      self.codeArea.normalize();
      let liElements = domNodesToArray(self.codeArea.childNodes);
      liElements.forEach(li => {
        if (li.innerHTML == "") {
          li.parentNode.removeChild(li);
        }
      });
    });
    
    let btn_div = document.createElement("div");
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
    self.btn_accept_code_editor.addEventListener("click", function() {
      self.scene.applet.innerHTML = self.codeArea.innerText;

      // get the size parameter to change the scene dimension
      let allParams = self.scene.applet.querySelectorAll("param");
      for (let i=0, l=allParams.length; i<l; i++) {
        if (babel[allParams[i].getAttribute("name")] == "size") {
          let [w, h] = allParams[i].getAttribute("value").split("x");
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

    self.btn_cancel_code_editor.addEventListener("click", () => {
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
  }

  /**
   * 
   */
  editor.SceneCodeEditor.prototype.setCode = function(code, scene) {
    this.scene = scene;

    code = code.replace(/></g, ">\n<").split("\n");

    let tmpLi;
    this.codeArea.innerHTML = "";

    for (let code_i of code) {
      if (code_i != "") {
        tmpLi = this.codeArea.appendChild(document.createElement("li"));
        tmpLi.innerText = code_i;
      }
    }

    if ((code.length == 1) && (code[0] == "")) {
      tmpLi = this.codeArea.appendChild(document.createElement("li"));
      tmpLi.innerHTML = " ";
    }
  }

  return editor;
})(editor || {});
