/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var richTextEditor = (function(richTextEditor) {

  let regExpSpace = new RegExp(String.fromCharCode(65279), "g");

  let INTRO_KEY = 13;

  let DELETE_KEY = 46;
  let BACKSPACE_KEY = 8;

  let PAGE_UP_KEY = 33;
  let PAGE_DOWN_KEY = 34;

  let END_KEY = 35;
  let INIT_KEY = 36;

  let LEFT_KEY = 37;
  let UP_KEY = 38;
  let RIGHT_KEY = 39;
  let DOWN_KEY = 40;

  let PLUS_KEY = 187;
  let MINUS_KEY = 189;

  /**
   *
   */
  richTextEditor.TextController = function(parent, container, textNodes, defaultStyle, externalColor) {
    let self = this;
    this.parent = parent;
    this.container = container;
    this.defaultStyle = defaultStyle;
    this.externalColor = externalColor;
    this.textNodes = textNodes;

    this.allTextNodes = null;

    this.textfieldContainer = container.appendChild(document.createElement("div"));
    this.textfieldContainer.setAttribute("style", "position:absolute;overflow:hidden;width:1px;height:1px;");

    this.textfield = this.textfieldContainer.appendChild(document.createElement("input"));
    this.textfield.setAttribute("type", "text");
    this.textfield.setAttribute("style", "outline:none;border:none;caret-color:transparent;");
    this.textfield.textContent = "";
    
    this.range = new richTextEditor.Range(container);

    this.canvas = container.appendChild(document.createElement("canvas"));
    this.canvas.className = "textEditorCanvas"
    this.canvas.setAttribute("width", "256");
    this.canvas.setAttribute("height", "256");
    this.ctx = this.canvas.getContext("2d");

    textNodes.update(this.ctx, externalColor);
    this.range.updateSize(this.canvas.width, this.canvas.height);

    // position and style the caret in the first text node
    this.caret = new richTextEditor.Caret(container, externalColor, true);
    this.caret.set(textNodes.getFirstTextNode(), 0);

    this.startCaret = new richTextEditor.Caret(container, externalColor);
    this.startCaret.set(this.caret.node, this.caret.offset);
    this.startCaret.hide();

    this.updateTextfield();

    this.undoRedoManager = new richTextEditor.UndoRedoManager(textNodes, self.caret, self.startCaret);

    // control the keyboard
    self.textfield.addEventListener("keydown", function(evt) {
      let key = evt.keyCode;
      let char = String.fromCharCode(key || evt.charCode);

      self.control = false;

      let ctrlKey = (evt.ctrlKey || evt.metaKey);
      let shiftKey = evt.shiftKey;

      self.undoRedoManager.storeCaretPositions(self.caret, self.startCaret);

      ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      if (key === END_KEY) {
        evt.preventDefault();

        let last = getLine(self.caret.node).getLastTextNode();
        self.caret.set(last, last.value.length);

        manageSelection(shiftKey);
      }

      ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      else if (key === INIT_KEY) {
        evt.preventDefault();

        self.caret.set(getLine(self.caret.node).getFirstTextNode(), 0);

        manageSelection(shiftKey);
      }

      ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      else if (key === LEFT_KEY) {
        evt.preventDefault();

        self.caret.stopBlink();

        // the caret can't go backward, maybe first character in the text node
        if (!self.caret.goBackward()) {
          let line = getLine(self.caret.node);

          if (line) {
            let texts = line.querySelectorAll("text");
            let current;

            for (let i=0, l=texts.length; i<l; i++) {
              if (texts[i] === self.caret.node) {
                current = i;
                break;
              }
            }

            let prev = (current-1 >= 0) ? texts[current-1] : null;

            // a previous text node in the line
            if (prev) {
              // if the current node and the previous node has the same parent, then move to the last element minus one of the previous node
              if (self.caret.node.parent === prev.parent) {
                self.caret.set(prev, prev.value.length -1);
              }
              // if the current node and the next node has a different parent, then move to the end of the next node
              else {
                if (!shiftKey) {
                  self.caret.set(prev, prev.value.length);
                }
                else {
                  let prevNode = self.caret.node.prevSibling();
                  if (prevNode) {
                    prevNode = prevNode.prevSibling();
                    self.caret.set(prevNode, prevNode.value.length);
                  }
                }
              }
            }
            // no previous text node in the line, possibly start of line, check the previous line
            else {
              let prevLine = line.prevSibling();
              if (prevLine) {
                prev = prevLine.getLastTextNode();
                self.caret.set(prev, prev.value.length);
              }
            }
          }
        }

        manageSelection(shiftKey, "LEFT");

        self.caret.startBlink();
      }
      ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      else if (key === RIGHT_KEY) {
        evt.preventDefault();

        self.caret.stopBlink();

        if (!self.caret.goForward()) {
          let line = getLine(self.caret.node);

          if (line) {
            let texts = line.querySelectorAll("text");
            let current;

            for (let i=0, l=texts.length; i<l; i++) {
              if (texts[i] === self.caret.node) {
                current = i;
                break;
              }
            }

            let next = (current+1 < texts.length) ? texts[current+1] : null;

            // a next text node in the line
            if (next) {
              // if the current node and the next node has the same parent, then move to the first element of the next node
              if (self.caret.node.parent === next.parent) {
                self.caret.set(next, 1);
              }
              // if the current node and the next node has a different parent, then move to the init of the next node
              else {
                if (!shiftKey) {
                  self.caret.set(next, 0);
                }
                else {
                  let nextNode = self.caret.node.nextSibling();
                  if (nextNode) {
                    nextNode = nextNode.nextSibling();
                    self.caret.set(nextNode, 0);
                  }
                }
              }
            }
            // no next text node in the line, possibly end of line, check the next line
            else {
              let nextLine = line.nextSibling();
              if (nextLine) {
                self.caret.set(nextLine.getFirstTextNode(), 0);
              }
            }
          }
        }

        manageSelection(shiftKey, "RIGHT");

        self.caret.startBlink();
      }
      ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      else if (!ctrlKey && (key === UP_KEY)) {
        evt.preventDefault();

        self.caret.stopBlink();

        let line = getLine(self.caret.node);
        if (line) {
          let texts = line.querySelectorAll("text");
          let caretNodeX = self.caret.node.metrics.x;
          let caretNodeY = self.caret.node.metrics.y - self.caret.node.metrics.ascent;
          let caretNodeW = self.caret.node.metrics.w;
          let caretNodeH = self.caret.node.metrics.h;
          let x, y, w, h;
          let cond1, cond2, cond3, cond4;
          let overNodes = [];

          for (let i=0, l=texts.length; i<l; i++) {
            x = texts[i].metrics.x;
            y = texts[i].metrics.y +texts[i].metrics.descent;
            w = texts[i].metrics.w;
            h = texts[i].metrics.h;

            // check only the texts that are over the caret node
            if (y < caretNodeY) {
              // is inside the caret node
              cond1 = (caretNodeX <= x) && (x <= caretNodeX+caretNodeW);              // left side of text node 
              cond2 = (caretNodeX <= x+w) && (x+w <= caretNodeX+caretNodeW);          // right side of text node
              cond3 = (x <= caretNodeX) && (caretNodeX <= x+w);                       // left side of caret node
              cond4 = (x <= caretNodeX+caretNodeW) && (caretNodeX+caretNodeW <= x+w); // right side of caret node

              if (cond1 || cond2 || cond3 || cond4) {
                overNodes.push(texts[i]);
              }
            }
          }

          // if a texts node exist in the same line over the caret node, then move to one of them
          if (overNodes.length > 0) {
            if (!shiftKey) {
              positionCaretAux(self.caret.getX(), caretNodeY, overNodes);
            }
          }
          // try to move to the previous line
          else {
            let prevLine = line.prevSibling();
            if (prevLine) {
              positionCaretAux(self.caret.getX(), prevLine.metrics.y+prevLine.metrics.h, prevLine.querySelectorAll("text"));
            }
          }
        }

        manageSelection(shiftKey);

        self.caret.startBlink();
      }
      ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      else if (!ctrlKey && (key === DOWN_KEY)) {
        evt.preventDefault();

        self.caret.stopBlink();
        
        let line = getLine(self.caret.node);
        if (line) {
          let texts = line.querySelectorAll("text");
          let caretNodeX = self.caret.node.metrics.x;
          let caretNodeY = self.caret.node.metrics.y + self.caret.node.metrics.descent;
          let caretNodeW = self.caret.node.metrics.w;
          let caretNodeH = self.caret.node.metrics.h;
          let x, y, w, h;
          let cond1, cond2, cond3, cond4;
          let underNodes = [];

          for (let i=0, l=texts.length; i<l; i++) {
            x = texts[i].metrics.x;
            y = texts[i].metrics.y - texts[i].metrics.ascent;
            w = texts[i].metrics.w;
            h = texts[i].metrics.h;

            // check only the texts that are over the caret node
            if (caretNodeY < y) {
              // is inside the caret node
              cond1 = (caretNodeX <= x) && (x <= caretNodeX+caretNodeW);              // left side of text node
              cond2 = (caretNodeX <= x+w) && (x+w <= caretNodeX+caretNodeW);          // right side of text node
              cond3 = (x <= caretNodeX) && (caretNodeX <= x+w);                       // left side of caret node
              cond4 = (x <= caretNodeX+caretNodeW) && (caretNodeX+caretNodeW <= x+w); // right side of caret node

              if (cond1 || cond2 || cond3 || cond4) {
                underNodes.push(texts[i]);
              }
            }
          }

          // if a texts node exist in the same line under the caret node, then move to one of them
          if (underNodes.length > 0) {
            if (!shiftKey) {
              positionCaretAux(self.caret.getX(), caretNodeY, underNodes);
            }
          }
          // try to move to the next line
          else {
            let nextLine = line.nextSibling();
            if (nextLine) {
              positionCaretAux(self.caret.getX(), nextLine.metrics.y, nextLine.querySelectorAll("text"));
            }
          }
        }

        manageSelection(shiftKey);

        self.caret.startBlink();
      }
      ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      else if (key === DELETE_KEY) {
        evt.preventDefault();

        self.caret.stopBlink();

        // the selection is empty
        if ( (self.caret.node === self.startCaret.node) && (self.caret.offset === self.startCaret.offset)) {
          let node = self.caret.node;
          let offset = self.caret.offset;

          // the caret is at the end of the text
          if (offset === node.value.length) {
            let next = node.nextSibling();

            if (next) {
              if (next.nodeType === "text") {
                next.value = next.value.substring(1);
                self.caret.set(next, 0);
                self.startCaret.set(next, 0);

                // if the node is empty then remove the node
                if (node.value === "") {
                  node.parent.removeChild(node);
                }
              }
              // if next.nodeType !== "text" then remove the next node
              else {
                next.parent.removeChild(next);
              }
            }
            // if the node don't have next, check if is at the end of a line
            else {
              let line = node.parent;
              if (line.nodeType === "textLineBlock") {
                let nextLine = node.parent.nextSibling();

                // then join the two lines
                if (nextLine !== null) {
                  for (let c_i of nextLine.children) {
                    line.addChild(c_i);
                  }
                  nextLine.parent.removeChild(nextLine);
                }
              }
            }
          }
          // are at least one character to the right of the offset position
          else {
            node.value = node.value.substring(0, offset) + node.value.substring(offset+1);
          }

          // update the nodes metrics
          textNodes.update(self.ctx, externalColor);
          self.range.updateSize(self.canvas.width, self.canvas.height);

          // necessary to position the cursor correctly when delete text from fraction
          self.caret.set(self.caret.node, self.caret.offset);
          self.startCaret.set(self.caret.node, self.caret.offset);
        }

        // the selection is not empty
        else {
          self.removeSelection();
        }

        self.caret.startBlink();

        self.undoRedoManager.put(self.textNodes, self.caret, self.startCaret);
      }
      ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      else if (key === BACKSPACE_KEY) {
        evt.preventDefault();

        self.caret.stopBlink();

        // the selection is empty
        if ( (self.caret.node === self.startCaret.node) && (self.caret.offset === self.startCaret.offset)) {
          let node = self.caret.node;
          let offset = self.caret.offset;
          
          // the caret is at the start of the text
          if (offset === 0) {
            let prev = node.prevSibling();

            if (prev) {
              if (prev.nodeType === "text") {
                prev.value = prev.value.substring(0, prev.value.length-1);
                self.caret.set(prev, prev.value.length);
                self.startCaret.set(prev, prev.value.length);

                // if the node is empty then remove the node
                if (node.value === "") {
                  node.parent.removeChild(node);
                }
              }
              // if prev.nodeType !== "text" then remove the prev node
              else {
                prev.parent.removeChild(prev);
              }
            }
            // if the node don't have previous, check if is at the start of a line
            else {
              let line = node.parent;
              if (line.nodeType === "textLineBlock") {
                let prevLine = node.parent.prevSibling();
                
                // then join the two lines
                if (prevLine !== null) {
                  for (let c_i of line.children) {
                    prevLine.addChild(c_i);
                  }
                  line.parent.removeChild(line);
                }
              }
            }
          }
          // are at least one character to the left of the offset position
          else {
            node.value = node.value.substring(0, offset-1) + node.value.substring(offset);
            self.caret.offset = offset-1;
          }
          
          // update the nodes metrics
          textNodes.update(self.ctx, externalColor);
          self.range.updateSize(self.canvas.width, self.canvas.height);

          // necessary to position the cursor correctly when delete text from fraction
          self.caret.set(self.caret.node, self.caret.offset);
          self.startCaret.set(self.caret.node, self.caret.offset);
        }

        // the selection is not empty
        else {
          self.removeSelection();
        }
        
        self.caret.startBlink();

        self.undoRedoManager.put(self.textNodes, self.caret, self.startCaret);
      }
      
      ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      else if (key === INTRO_KEY) {
        evt.preventDefault();

        self.caret.stopBlink();

        self.removeSelection();

        // check if the current node is outside a formula and get the container line
        let node = self.caret.node;
        let offset = self.caret.offset;
        let line = node.parent;
        if (line.nodeType === "textLineBlock") {
          let splitRight = new richTextEditor.TextNode(node.value.substring(offset), "text", node.style);

          node.value = node.value.substring(0, offset);

          let newLine = new richTextEditor.TextNode("", "textLineBlock", line.style);
          newLine.parent = line.parent;
          newLine.addChild(splitRight);

          let tmpNext;
          let next = node.nextSibling();
          while (next) {
            tmpNext = next.nextSibling();

            next.parent.removeChild(next);
            newLine.addChild(next);

            next = tmpNext;
          }

          let newLinesArray = [];
          for (let c_i of line.parent.children) {
            newLinesArray.push(c_i);
            if (c_i === line) {
              newLinesArray.push(newLine);
            }
          }
          line.parent.children = newLinesArray;

          // update the nodes metrics
          textNodes.update(self.ctx, externalColor);
          self.range.updateSize(self.canvas.width, self.canvas.height);

          self.caret.set(splitRight, 0);
        }

        self.startCaret.set(self.caret.node, self.caret.offset);

        self.caret.startBlink();
      }
      ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      else if (key === PAGE_UP_KEY) {
        evt.preventDefault();

        self.caret.stopBlink();

        let x = self.caret.getX();
        let y = self.caret.getY() - self.container.offsetHeight + self.caret.getH();
        let texts = caretLineAux(x, y, textNodes.querySelectorAll("textLineBlock"));
        positionCaretAux(x, y, texts);

        manageSelection(shiftKey);

        self.caret.startBlink();
      }
      ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      else if (key === PAGE_DOWN_KEY) {
        evt.preventDefault();

        self.caret.stopBlink();

        let x = self.caret.getX();
        let y = self.caret.getY() + self.container.offsetHeight;
        let texts = caretLineAux(x, y, textNodes.querySelectorAll("textLineBlock"));
        positionCaretAux(x, y, texts);

        manageSelection(shiftKey);

        self.caret.startBlink();
      }

      ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      // undo
      else if (ctrlKey && (char === "Z")) {
        let state = self.undoRedoManager.undo();

        self.caret.startBlink();

        if (state) {
          self.textNodes.children = [];
          for (let c_i of state.nodes.children) {
            self.textNodes.addChild(c_i);
          }
          // update the nodes metrics
          textNodes.update(self.ctx, externalColor);
          self.range.updateSize(self.canvas.width, self.canvas.height);

          positionCaretAux(state.caretX, state.caretY, caretLineAux(x, y, textNodes.querySelectorAll("textLineBlock")));
          self.startCaret.set(self.caret.node, self.caret.offset);

          self.updateTextfield();
        }

        self.caret.stopBlink();
      }

      ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      // redo
      else if (ctrlKey && (char === "Y")) {
        let state = self.undoRedoManager.redo();

        self.caret.startBlink();

        if (state) {
          self.textNodes.children = [];
          for (let c_i of state.nodes.children) {
            self.textNodes.addChild(c_i);
          }
          // update the nodes metrics
          textNodes.update(self.ctx, externalColor);
          self.range.updateSize(self.canvas.width, self.canvas.height);

          positionCaretAux(state.caretX, state.caretY, caretLineAux(x, y, textNodes.querySelectorAll("textLineBlock")));
          self.startCaret.set(self.caret.node, self.caret.offset);

          self.updateTextfield();
        }

        self.caret.stopBlink();
      }

      ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      // bold
      else if (ctrlKey && (char === "B")) {
        evt.preventDefault();

        self.caret.stopBlink();

        self.changeStyle("textBold");

        self.caret.startBlink();
      }

      
      ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      // italic
      else if (ctrlKey && (char === "I")) {
        evt.preventDefault();

        self.caret.stopBlink();

        self.changeStyle("textItalic");

        self.caret.startBlink();
      }

      
      ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      // underline
      else if (ctrlKey && (char === "U")) {
        evt.preventDefault();

        self.caret.stopBlink();

        self.changeStyle("textUnderline");

        self.caret.startBlink();
      }

      ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      // add formula
      else if (ctrlKey && (char === "F")) {
        evt.preventDefault();

        self.caret.stopBlink();

        self.addNode("formula", true);

        self.caret.startBlink();
      }

      ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      // add fraction
      else if (ctrlKey && (char === "7")) {
        evt.preventDefault();

        self.caret.stopBlink();

        self.addNode("fraction");

        self.caret.startBlink();
      }

      ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      // add super index
      else if (ctrlKey && (key === UP_KEY)) {
        evt.preventDefault();

        self.caret.stopBlink();

        self.addNode("superIndex");

        self.caret.startBlink();
      }

      ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      // add sub index
      else if (ctrlKey && (key === DOWN_KEY)) {
        evt.preventDefault();

        self.caret.stopBlink();

        self.addNode("subIndex");

        self.caret.startBlink();
      }

      ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      // add radical
      else if (ctrlKey && (char === "R")) {
        evt.preventDefault();

        self.caret.stopBlink();

        self.addNode("radical");

        self.caret.startBlink();
      }      

      ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      // add sum
      else if (ctrlKey && (char === "S")) {
        evt.preventDefault();

        self.caret.stopBlink();

        self.addNode("sum");

        self.caret.startBlink();
      }      

      ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      // add integral
      else if (ctrlKey && (char === "I")) {
        evt.preventDefault();

        self.caret.stopBlink();

        self.addNode("integral");

        self.caret.startBlink();
      }

      ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      // add limit
      else if (ctrlKey && (char === "L")) {
        evt.preventDefault();

        self.caret.stopBlink();

        self.addNode("limit");

        self.caret.startBlink();
      }

      ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      else if (ctrlKey && (char === "K")) {
        evt.preventDefault();
      }
      
      ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      else if (key === -1) {
        evt.preventDefault();

        self.caret.stopBlink();

        self.caret.startBlink();
      }

      if ( (key === PAGE_UP_KEY) || (key === PAGE_DOWN_KEY) || (key === END_KEY) || (key === INIT_KEY) || (key === LEFT_KEY) || (key === UP_KEY) || (key === RIGHT_KEY) || (key === DOWN_KEY) || (key === INTRO_KEY) || (key === BACKSPACE_KEY) || (key === DELETE_KEY) ) {
        self.updateTextfield();
      }

      // send change style event
      self.notifyParentStyle();
    });

    /**
     *
     */
    container.addEventListener("copy", function(evt) {
      evt.preventDefault();
      copyAux(evt);
    });

    /**
     *
     */
    container.addEventListener("cut", function(evt) {
      evt.preventDefault();
      copyAux(evt);
      self.removeSelection();

      self.textNodes.removeEmptyText();
      self.textNodes.normalize();

      let allTextNodes = textNodes.querySelectorAll("textLineBlock");
      let x = self.caret.getX();
      let y = self.caret.getY();
      let texts = caretLineAux(x, y, allTextNodes);
      positionCaretAux(x, y, texts);
      self.startCaret.set(self.caret.node, self.caret.offset);

      self.updateTextfield();
    });

    /**
     *
     */
    container.addEventListener("paste", function(evt) {
      evt.preventDefault();

      self.removeSelection();

      let data = evt.clipboardData.getData("text/richText");

      if (data) {
        let nodes = richTextEditor.JSONtoTextNodes(JSON.parse(data));

        if (nodes.nodeType === "text") {
          // if the text node has the same style only paste the content
          if (self.caret.node.style.equals(nodes.style)) {
            let firstPart = self.caret.node.value.substring(0, self.caret.offset) + nodes.value;
            self.caret.node.value = firstPart + self.caret.node.value.substring(self.caret.offset);

            newCaretNode = self.caret.node;
            newCaretOffset = firstPart.length;
          }
          // if the text node has not the same style, then split the caret node and insert the new text node
          else {
            let leftText = self.caret.node.value.substring(0, self.caret.offset);
            let rightText = self.caret.node.value.substring(self.caret.offset);
        
            self.caret.node.value = leftText;
        
            let rightNode = new richTextEditor.TextNode(rightText, "text", self.caret.node.style.clone());

            if (rightText !== "") {
              self.caret.node.parent.insertAfter(self.caret.node, rightNode);
            }

            self.caret.node.parent.insertAfter(self.caret.node, nodes);

            if (leftText === "") {
              self.caret.node.parent.removeChild(self.caret.node);
            }

            newCaretNode = nodes;
            newCaretOffset = nodes.value.length;
          }
        }
        // nodes.nodeType === "CONTAINER"
        else {
          // multiple lines
          if (nodes.querySelectorAll("textLineBlock").length > 0) {
            let leftText = self.caret.node.value.substring(0, self.caret.offset);
            let rightText = self.caret.node.value.substring(self.caret.offset);
        
            self.caret.node.value = leftText;
        
            let rightNode = new richTextEditor.TextNode(rightText, "text", self.caret.node.style.clone());

            self.caret.node.parent.insertAfter(self.caret.node, rightNode);

            let caretParent = self.caret.node.parent;
            let tmpParent = new richTextEditor.TextNode("", caretParent.nodeType, caretParent.style.clone());

            // get all the nodes to the right in the parent
            let next = self.caret.node.nextSibling();
            let tmpNext;
            while (next) {
              tmpNext = next.nextSibling();
              next.parent.removeChild(next);

              tmpParent.addChild(next);
              next = tmpNext;
            }

            let currentParent = caretParent;
            // the caret is outside a formula
            if (caretParent.nodeType === "textLineBlock") {
              for (let i=0, l=nodes.children.length; i<l-1; i++) {
                if (nodes.children[i].nodeType !== "textLineBlock") {
                  currentParent.addChild(nodes.children[i]);
                }
                else {
                  currentParent.parent.insertAfter(currentParent, nodes.children[i]);
                  currentParent = nodes.children[i];
                }
              }

              currentParent.parent.insertAfter(currentParent, nodes.children[nodes.children.length-1]);

              for (let i=0, l=tmpParent.children.length; i<l; i++) {
                nodes.children[nodes.children.length-1].addChild(tmpParent.children[i]);
              }

              newCaretNode = rightNode;
              newCaretOffset = 0;
            }
            // the caret is inside a formula
            else {
              for (let i=0, l=nodes.children.length; i<l; i++) {
                if (nodes.children[i].nodeType !== "textLineBlock") {
                  // if has a formula child then add the children of the formula
                  if (nodes.children[i].nodeType === "formula") {
                    for (let ij=0, lk=nodes.children[i].children.length; ij<lk; ij++) {
                      currentParent.addChild(nodes.children[i].children[ij]);
                    }
                  }
                  // the children are text nodes or formula elements like fraction or sum or integral, etc
                  else {
                    currentParent.addChild(nodes.children[i]);
                  }
                 }
                else {
                  for (let j=0, k=nodes.children[i].children.length; j<k; j++) {
                    // if has a formula child then add the children of the formula
                    if (nodes.children[i].children[j].nodeType === "formula") {
                      for (let ij=0, lk=nodes.children[i].children[j].children.length; ij<lk; ij++) {
                        currentParent.addChild(nodes.children[i].children[j].children[ij]);
                      }
                    }
                    // the children are text nodes or formula elements like fraction or sum or integral, etc
                    else {
                      currentParent.addChild(nodes.children[i].children[j]);
                    }
                  }
                }
              }

              for (let i=0, l=tmpParent.children.length; i<l; i++) {
                  // if has a formula child then add the children of the formula
                  if (tmpParent.children[i].nodeType === "formula") {
                    for (let ij=0, lk=tmpParent.children[i].children.length; ij<lk; ij++) {
                      currentParent.addChild(tmpParent.children[i].children[ij]);
                    }
                  }
                  // the children are text nodes or formula elements like fraction or sum or integral, etc
                  else {
                    currentParent.addChild(tmpParent.children[i]);
                  }
              }

              newCaretNode = rightNode;
              newCaretOffset = 0;
            }
          } 
          // various nodes in a single line
          else {
            let leftText = self.caret.node.value.substring(0, self.caret.offset);
            let rightText = self.caret.node.value.substring(self.caret.offset);
        
            self.caret.node.value = leftText;
        
            let rightNode = new richTextEditor.TextNode(rightText, "text", self.caret.node.style.clone());

            self.caret.node.parent.insertAfter(self.caret.node, rightNode);

            if ((nodes.insideFormula) && (!inFormula(self.caret.node)))  {
              let tmpFormula = new richTextEditor.TextNode("", "formula", self.caret.node.style.clone());
              self.caret.node.parent.insertBefore(rightNode, tmpFormula);

              for (let i=0, l=nodes.children.length; i<l; i++) {
                tmpFormula.addChild(nodes.children[i]);
              }
            }
            else {
              for (let i=0, l=nodes.children.length; i<l; i++) {
                self.caret.node.parent.insertBefore(rightNode, nodes.children[i]);
              }
            }

            if (rightText === "") {
              self.caret.node.parent.removeChild(rightNode);
            }

            if (leftText === "") {
              self.caret.node.parent.removeChild(self.caret.node);
            }

            newCaretNode = nodes.children[nodes.children.length-1].getLastTextNode();
            newCaretOffset = newCaretNode.value.length;
          }
        }
      }
      // is plain text 
      else {
        data = evt.clipboardData.getData("text/plain");

        if (data) {
          let firstPart = self.caret.node.value.substring(0, self.caret.offset) + data;
          self.caret.node.value = firstPart + self.caret.node.value.substring(self.caret.offset);

          newCaretNode = self.caret.node;
          newCaretOffset = firstPart.length;
        }
      }

      textNodes.adjustFontSize();
      // update the nodes metrics
      textNodes.update(self.ctx, externalColor);
      self.range.updateSize(self.canvas.width, self.canvas.height);

      self.caret.set(newCaretNode, newCaretOffset);
      self.startCaret.set(newCaretNode, newCaretOffset);


      ////////////////////////////////////
      self.textNodes.removeEmptyText();
      self.textNodes.normalize();

      let allTextNodes = textNodes.querySelectorAll("textLineBlock");
      let x = self.caret.getX();
      let y = self.caret.getY();
      let texts = caretLineAux(x, y, allTextNodes);
      positionCaretAux(x, y, texts);
      self.startCaret.set(self.caret.node, self.caret.offset);
      ////////////////////////////////////

      self.updateTextfield();
    });

    /**
     * 
     */
    function copyAux(evt) {
      // the selection is in the same node
      if (self.startCaret.node === self.caret.node) {
        let startOffset = (self.caret.offset < self.startCaret.offset) ? self.caret.offset : self.startCaret.offset;
        let endOffset = (self.caret.offset > self.startCaret.offset) ? self.caret.offset : self.startCaret.offset;

        let textSelected = self.caret.node.value.substring(startOffset, endOffset);
        let newNode = new richTextEditor.TextNode(textSelected, "text" , self.caret.node.style.clone());

        evt.clipboardData.setData("text/plain", textSelected);
        evt.clipboardData.setData("text/richText", newNode.stringify());
      }
      // the selection is in different nodes
      else {
        self.allTextNodes = textNodes.querySelectorAll("text");

        let startCaret = self.startCaret;
        let endCaret = self.caret;
        let startIndex = self.allTextNodes.indexOf(self.startCaret.node);
        let endIndex = self.allTextNodes.indexOf(self.caret.node);

        if (startIndex > endIndex) {
          [startIndex, endIndex] = [endIndex, startIndex];
          [startCaret, endCaret] = [endCaret, startCaret];
        }

        let rightTextStartCaret = startCaret.node.value.substring(startCaret.offset);
        let rightTextNode = new richTextEditor.TextNode(rightTextStartCaret, "text", startCaret.node.style.clone());
        
        let leftTextEndCaret = endCaret.node.value.substring(0,  endCaret.offset);
        let leftTextNode = new richTextEditor.TextNode(leftTextEndCaret, "text", endCaret.node.style.clone());

        let newNode = new richTextEditor.TextNode("", "CONTAINER", "");
        newNode.insideFormula = inFormula(startCaret.node);

        newNode.addChild(rightTextNode);

        let lastLine = newNode;

        let parentStart = startCaret.node.parent;
        let nextLine = parentStart.nextSibling();
        let next;

        next = startCaret.node.nextSibling();
        while (next !== endCaret.node) {
          // the next node is in the same parent
          if (next) {
            lastLine.addChild(next.clone());
            next = next.nextSibling();
          }
          else {
            if (nextLine) {
              next = nextLine.children[0];
              if (nextLine) {
                lastLine = new richTextEditor.TextNode("", nextLine.nodeType, nextLine.style.clone());
                newNode.addChild(lastLine);
              }
              nextLine = nextLine.nextSibling();
            }
            else {
              console.log("ERROR");
            }
          }
        }

        lastLine.addChild(leftTextNode);

        evt.clipboardData.setData("text/plain", newNode.toStr());
        evt.clipboardData.setData("text/richText", newNode.stringify());
      }
    }

    // the textfield change his content
    self.textfield.addEventListener("input", function(evt) {
      self.undoRedoManager.storeCaretPositions(self.caret, self.startCaret);

      let tmpStartCaretNode = self.startCaret.node;
      let tmpStartCaretOffset = self.startCaret.offset;

      let tmpEndCaretNode = self.caret.node;
      let tmpEndCaretOffset = self.caret.offset;

      self.caret.node.value = self.textfield.value.replace(regExpSpace, "");
      textNodes.update(self.ctx, externalColor);
      self.range.updateSize(self.canvas.width, self.canvas.height);
      self.caret.set(self.caret.node, self.textfield.selectionStart);
      self.startCaret.set(self.caret.node, self.caret.offset);

      self.textfieldContainer.style.left = (self.caret.getX() + self.caret.offsetLeft) + "px";
      self.textfieldContainer.style.top  = (self.caret.getY() + self.caret.offsetTop +self.caret.getH()/2) + "px";

      self.range.clear();

      if ( (tmpStartCaretNode !== tmpEndCaretNode) || (tmpStartCaretOffset !== tmpEndCaretOffset)) {
        self.allTextNodes = textNodes.querySelectorAll("text");
        let startIndex = self.allTextNodes.indexOf(tmpStartCaretNode);
        let endIndex = self.allTextNodes.indexOf(tmpEndCaretNode);

        if (startIndex === endIndex) {
          if (tmpStartCaretOffset < tmpEndCaretOffset) {
            self.startCaret.set(tmpStartCaretNode, tmpStartCaretOffset);
            self.caret.set(tmpEndCaretNode, tmpEndCaretOffset);
          }
          else {
            self.startCaret.set(tmpStartCaretNode, tmpStartCaretOffset+1);
            self.caret.set(tmpEndCaretNode, tmpEndCaretOffset+1);
          }
        }
        else if (startIndex <= endIndex) {
          self.startCaret.set(tmpStartCaretNode, tmpStartCaretOffset);
          self.caret.set(tmpEndCaretNode, tmpEndCaretOffset);
        }
        else {
          self.startCaret.set(tmpStartCaretNode, tmpStartCaretOffset);
          self.caret.set(tmpEndCaretNode, tmpEndCaretOffset+1);          
        }

        self.removeSelection();

        // move the caret to the correct position
        if ( (startIndex === endIndex) && (tmpStartCaretOffset < tmpEndCaretOffset) ) {
          self.caret.set(self.caret.node, self.caret.offset+1);
          self.startCaret.set(self.caret.node, self.caret.offset);
        }
        if (startIndex < endIndex) {
          let next = self.caret.node.nextSibling();
          next = (next) ? next.getFirstTextNode() : null;
          if (next) {
            self.caret.set(next, 1);
            self.startCaret.set(self.caret.node, self.caret.offset);
          }
        }

        self.updateTextfield();
      }

      self.undoRedoManager.put(self.textNodes, self.caret, self.startCaret);
    });

    /**
     * 
     */
    function manageSelection(shiftKey) {
      // set the selection
      if (!shiftKey) {
        self.startCaret.set(self.caret.node, self.caret.offset);
        self.range.clear();
      }
      else {
        self.allTextNodes = self.textNodes.querySelectorAll("text");
        self.currentIndex = self.allTextNodes.indexOf(self.startCaret.node);
        mouseMoveAux(self.caret.getX(), self.caret.getY());
      }
    }

    /**
     * 
     */
    container.addEventListener("dblclick", function(evt) {
      evt.stopPropagation();
      evt.preventDefault();

      // check if the double click was in a dynamic text node
      let dynText = self.textNodes.querySelectorAll("dynamicText");
      if (dynText.length > 0) {
        let rect = self.canvas.getBoundingClientRect();
        let x = evt.clientX - rect.left;
        let y = evt.clientY - rect.top;
        let texts_i;
        let theDynTextNode = null;

        for (let i=0, l=dynText.length; i<l; i++) {
          texts_i = dynText[i];

          xMetric = texts_i.metrics.x;
          yMetric = texts_i.metrics.y - texts_i.metrics.ascent;
          wMetric = texts_i.metrics.w;
          hMetric = texts_i.metrics.h;

          if ((xMetric <= x) && (x <= xMetric + wMetric) && (yMetric <= y) && (y <= yMetric + hMetric)) {
            theDynTextNode = texts_i;
            break;
          }
        }

        if ((self.parent) && (theDynTextNode !== null)) {
          self.parent.showDynamicTextNodeDialog(theDynTextNode);
          return;
        }
      }

      // not the left button pressed
      if (evt.button !== 0) {
        return;
      }

      let text = self.caret.node.value;
      let mouseChar = text.charAt(Math.min(self.caret.offset, text.length-1));
      let startIndex = 0;
      let endIndex = text.length;

      // if the character under the mouse position is an space, then try to select all the spaces connected to the character
      if (mouseChar === " ") {
        for (let i=self.caret.offset-1; i>=0; i--) {
          if ((/\S/).test(text.charAt(i))) {
            startIndex = i+1;
            break;
          }
        }
        
        for (let i=self.caret.offset+1, l=text.length; i<l; i++) {
          if ((/\S/).test(text.charAt(i))) {
            endIndex = i;
            break;
          }
        }
      }
      // single separator chars
      else if ((/[^A-Za-z0-9_]/).test(mouseChar)) {
        startIndex = self.caret.offset;
        endIndex = self.caret.offset+1;
      }
      // words
      else {
        for (let i=self.caret.offset-1; i>=0; i--) {
          if ((/[^A-Za-z0-9_]/).test(text.charAt(i))) {
            startIndex = i+1;
            break;
          }
        }

        for (let i=self.caret.offset+1, l=text.length; i<l; i++) {
          if ((/[^A-Za-z0-9_]/).test(text.charAt(i))) {
            endIndex = i;
            break;
          }
        }
      }

      self.startCaret.set(self.startCaret.node, startIndex);
      self.caret.set(self.caret.node, endIndex);
      self.range.draw(self.allTextNodes, self.startCaret, self.caret, self.currentIndex, self.currentIndex);

      // send change style event
      self.notifyParentStyle();
    });


    let mouseMove_rect;
    let mouseMove_x;
    let mouseMove_y;
    let mouseMove_parentStartNode;
    let mouseMove_commonAncestor;
    let mouseMove_sibling;
    let mouseMove_now;
    let mouseMove_indexCaret;
    let mouseMove_indexSibling;
    let mouseMove_newNode;
    let mouseMove_lineStartCaret;
    let mouseMove_lineCaret;
    let mouseMove_indexStartCaret;
    /**
     * 
     */
    function mouseMove(evt) {
      // not the left button pressed
      if (evt.button !== 0) {
        return;
      }

      mouseMove_now = (new Date).getTime();
  
      // 250 milliseconds
      if (mouseMove_now - self.lastTime > 50) {
        self.caret.stopBlink();

        mouseMove_rect = self.canvas.getBoundingClientRect();
        mouseMove_x = evt.clientX - mouseMove_rect.left;
        mouseMove_y = evt.clientY - mouseMove_rect.top;

        self.lastTime = mouseMove_now;

        positionCaretAux(mouseMove_x, mouseMove_y, caretLineAux(mouseMove_x, mouseMove_y, textNodes.querySelectorAll("textLineBlock")));

        mouseMoveAux(mouseMove_x, mouseMove_y);
      }
    }
    /**
     * 
     */
    function mouseMoveAux(mouseMove_x, mouseMove_y) {
      // text blocks in the same parent i.e. siblings or text blocks in different lines
      if ((self.startCaret.node.parent === self.caret.node.parent) || ((self.startCaret.node.parent.nodeType === "textLineBlock") && (self.caret.node.parent.nodeType === "textLineBlock"))) {
        self.range.draw(self.allTextNodes, self.startCaret, self.caret, self.currentIndex, self.allTextNodes.indexOf(self.caret.node));
      }
      else {
        mouseMove_parentStartNode = self.startCaret.node.parent;
        mouseMove_commonAncestor = self.caret.node.parent;
        mouseMove_sibling = null;
        mouseMove_siblingChild = null;

        while (mouseMove_commonAncestor && (mouseMove_commonAncestor.nodeType !== "textBlock") && (mouseMove_parentStartNode !== mouseMove_commonAncestor)) {
          mouseMove_siblingChild = mouseMove_sibling;
          mouseMove_sibling = mouseMove_commonAncestor;
          mouseMove_commonAncestor = mouseMove_commonAncestor.parent;
        }

        if (mouseMove_commonAncestor.nodeType !== "textBlock") {
          mouseMove_indexCaret = mouseMove_parentStartNode.children.indexOf(self.startCaret.node);
          mouseMove_indexSibling = mouseMove_parentStartNode.children.indexOf(mouseMove_sibling);

          mouseMove_newNode = (mouseMove_indexCaret < mouseMove_indexSibling) ? mouseMove_sibling.nextSibling() : mouseMove_sibling.prevSibling();

          positionCaretAux(mouseMove_x, mouseMove_y, mouseMove_newNode.querySelectorAll("text"));
          self.range.draw(self.allTextNodes, self.startCaret, self.caret, self.currentIndex, self.allTextNodes.indexOf(self.caret.node));
        }
        else {
          if (mouseMove_parentStartNode.nodeType === "textLineBlock") {
            mouseMove_lineStartCaret = getLine(self.startCaret.node);
            mouseMove_lineCaret = self.caret.node;

            while (mouseMove_lineCaret.nodeType !== "textLineBlock") {
              mouseMove_sibling = mouseMove_lineCaret;
              mouseMove_lineCaret = mouseMove_lineCaret.parent;
            }

            mouseMove_indexStartCaret = mouseMove_commonAncestor.children.indexOf(mouseMove_lineStartCaret);
            mouseMove_indexCaret = mouseMove_commonAncestor.children.indexOf(mouseMove_lineCaret);

            mouseMove_newNode = (mouseMove_indexStartCaret < mouseMove_indexCaret) ? mouseMove_sibling.nextSibling() : mouseMove_sibling.prevSibling();
          
            positionCaretAux(mouseMove_x, mouseMove_y, mouseMove_newNode.querySelectorAll("text"));
            self.range.draw(self.allTextNodes, self.startCaret, self.caret, self.currentIndex, self.allTextNodes.indexOf(self.caret.node));
          }
          else {
            positionCaretAux(mouseMove_x, mouseMove_y, mouseMove_parentStartNode.querySelectorAll("text"));
            self.range.draw(self.allTextNodes, self.startCaret, self.caret, self.currentIndex, self.allTextNodes.indexOf(self.caret.node));
          }
        }
      }
    }

    /**
     * 
     */
    container.addEventListener("mouseup", function(evt) {
      // not the left button pressed
      if (evt.button !== 0) {
        return;
      }

      self.textfield.focus();

      container.removeEventListener("mousemove", mouseMove);
      container.mouseMoveAdded = false;
      
      self.allTextNodes = null;

      self.caret.startBlink();

      self.updateTextfield();

      self.undoRedoManager.storeCaretPositions(self.caret, self.startCaret);

      // send change style event
      self.notifyParentStyle();
    });

    /**
     * 
     */
    container.addEventListener("mousedown", function(evt) {
      // not the left button pressed
      if (evt.button !== 0) {
        return;
      }

      self.textfield.focus();

      let rect = self.canvas.getBoundingClientRect();
      let x = evt.clientX - rect.left;
      let y = evt.clientY - rect.top;

      positionCaretAux(x, y, caretLineAux(x, y, textNodes.querySelectorAll("textLineBlock")));

      self.startCaret.set(self.caret.node, self.caret.offset);
      self.allTextNodes = textNodes.querySelectorAll("text");
      self.currentIndex = self.allTextNodes.indexOf(self.caret.node);
      self.range.clear();
      
      self.lastTime = (new Date).getTime();
      if (!container.mouseMoveAdded) {
        container.addEventListener("mousemove", mouseMove);
        container.mouseMoveAdded = true;
      }

      self.textfieldContainer.style.left = (self.caret.getX() + self.caret.offsetLeft) + "px";
      self.textfieldContainer.style.top  = (self.caret.getY() + self.caret.offsetTop +self.caret.getH()/2) + "px";

      // select the line
      if (evt.detail === 3) {
        evt.preventDefault();

        let line = getLine(self.caret.node);
        let startNode = line.getFirstTextNode();
        let endNode = line.getLastTextNode();

        self.startCaret.set(startNode, 0);
        self.caret.set(endNode, endNode.value.length);
        self.range.draw(self.allTextNodes, self.startCaret, self.caret, self.allTextNodes.indexOf(self.startCaret.node), self.allTextNodes.indexOf(self.caret.node));
      }

      // send change style event
      self.notifyParentStyle();
    });

    /**
     * 
     */
    function caretLineAux(x, y, lines) {
      let line = null;

      for (let i=0, l=lines.length; i<l; i++) {
        if (lines[i].metrics.y <= y) {
          line = lines[i];
        }
        else {
          break;
        }
      }

      if (line === null) {
        if (y <= lines[0].metrics.y) {
          line = lines[0];
        }
        else {
          line = lines[lines.length-1];
        }
      }

      return line.querySelectorAll("text");
    }

    /**
     * 
     */
    function positionCaretAux(x, y, texts) {
      let texts_i;
      let xMetric;
      let yMetric;
      let wMetric;
      let hMetric;
      let hDist;
      let vDist;

      let nodeNear = null;
      let minDist = Infinity;
      let nodeContains = null;

      for (let i=0, l=texts.length; i<l; i++) {
        texts_i = texts[i];

        // top position of the node
        xMetric = texts_i.metrics.x;
        yMetric = texts_i.metrics.y - texts_i.metrics.ascent;
        wMetric = texts_i.metrics.w;
        hMetric = texts_i.metrics.h;

        hDist = ( (xMetric <= x) && (x <= xMetric + wMetric) ) ? 0 : Math.min( Math.abs(x - xMetric), Math.abs(x - xMetric - wMetric) );
        vDist = ( (yMetric <= y) && (y <= yMetric + hMetric) ) ? 0 : Math.min( Math.abs(y - yMetric), Math.abs(y - yMetric - hMetric) );

        // check if the mouse position is inside a node
        if ((hDist === 0) && (vDist === 0)) {
          nodeContains = texts_i;
          break;
        }

        if ((hDist+vDist) < minDist) {
          nodeNear = texts_i;
          minDist = hDist + vDist;
        }
      }

      let textNode = nodeContains || nodeNear;
      let offset = textNode.value.length;
      let mouseWidth = x - textNode.metrics.x;
      let charWidth;
      let textWidth = 0;
      richTextEditor.auxCtx.font = textNode.styleString; // set the style of the canvas context only one time, to check te width of the text

      // iterate over all characters in the string of the node to get the offset
      for (let i=0, l=textNode.value.length; i<l; i++) {
        // get the width of a single character
        charWidth = parseInt(0.5 + richTextEditor.auxCtx.measureText(textNode.value.substring(i, i+1)).width);

        // check the position of the mouse against the current text width plus the half of the current char
        if ( mouseWidth <= (textWidth+charWidth/2) ) {
          offset = i;
          break;
        }

        // update the text width
        textWidth += charWidth;        
      }

      self.caret.set(textNode, offset);
    }

    /**
     * 
     */
    self.textfield.addEventListener("blur", function(evt) {
      if (!container.mouseMoveAdded) {
        self.caret.hide();
      }
    });
    self.textfield.addEventListener("focus", function(evt) {
      if (container.mouseMoveAdded) {
        container.removeEventListener("mousemove", mouseMove);
        container.mouseMoveAdded = false;
      }
      self.caret.startBlink();
      self.caret.show();

      // send change style event
      self.notifyParentStyle();
    });

    // set the focus
    self.textfield.focus();
  }

  /**
   * 
   */
  richTextEditor.TextController.prototype.changeStyle = function(prop, value) {
    let self = this;
    let textNodes = self.textNodes;
    let externalColor = self.externalColor;

    // the selection is in the same node
    if (self.startCaret.node === self.caret.node) {
      // prevent the change in font size inside a formula
      if (inFormula(self.caret.node) && (prop === "fontSize")) {
        let formulaNode = self.caret.node;

        while (formulaNode) {
          if (formulaNode.nodeType === "formula") {
            break;
          }
          formulaNode = formulaNode.parent;
        }

        formulaNode.style[prop] = value;
        formulaNode.adjustFontSize();

        // update the nodes metrics
        textNodes.update(self.ctx, externalColor);

        // necessary to position the cursor correctly when delete text from fraction
        self.caret.set(self.caret.node, self.caret.offset);
        self.startCaret.set(self.startCaret.node, self.startCaret.offset);
        self.updateTextfield();
      }
      // change the property freely
      else {
        let startOffset = (self.caret.offset < self.startCaret.offset) ? self.caret.offset : self.startCaret.offset;
        let endOffset = (self.caret.offset > self.startCaret.offset) ? self.caret.offset : self.startCaret.offset;

        let newStyle = self.caret.node.style.clone();
        if (value === undefined) {
          newStyle[prop] = !newStyle[prop];
        }
        else {
          newStyle[prop] = value;
        }

        let newNode = new richTextEditor.TextNode(self.caret.node.value.substring(startOffset, endOffset), "text" , newStyle);

        let leftText = self.caret.node.value.substring(0, startOffset);
        let rightText = self.caret.node.value.substring(endOffset);

        self.caret.node.value = leftText;

        let rightNode = new richTextEditor.TextNode(rightText, "text", self.caret.node.style.clone());

        let parent = self.caret.node.parent;
        let tmpChildren = parent.children;
        parent.children = [];
        for (let c_i of tmpChildren) {
          // if the current child to add is the caret node
          if (c_i === self.caret.node) {
            // add the current children if has content
            if (leftText !== "") {
              parent.addChild(c_i);
            }

            parent.addChild(newNode);

            // add the right part if has content
            if (rightText !== "") {
              parent.addChild(rightNode);
            }
          }
          // add all children different to the caret node
          else {
            parent.addChild(c_i);
          }
        }

        // update the nodes metrics
        textNodes.update(self.ctx, externalColor);

        // necessary to position the cursor correctly when delete text from fraction
        startOffset = (self.caret.offset < self.startCaret.offset) ? newNode.value.length : 0 ;
        endOffset = (self.caret.offset < self.startCaret.offset) ? 0 : newNode.value.length;
        self.caret.set(newNode, endOffset);
        self.startCaret.set(newNode, startOffset);
        self.updateTextfield();
      }
    }

    // the selection is in different nodes
    else {
      let propValue = (value === undefined) ? !self.caret.node.style[prop] : value;

      self.allTextNodes = textNodes.querySelectorAll("text");

      let startCaret = self.startCaret;
      let endCaret = self.caret;
      let startIndex = self.allTextNodes.indexOf(self.startCaret.node);
      let endIndex = self.allTextNodes.indexOf(self.caret.node);

      let originalStartIndex = startIndex;
      let originalEndIndex = endIndex;

      if (startIndex > endIndex) {
        [startIndex, endIndex] = [endIndex, startIndex];
        [startCaret, endCaret] = [endCaret, startCaret];
      }

      let leftTextStartCaret = startCaret.node.value.substring(0, startCaret.offset);
      let rightTextStartCaret = startCaret.node.value.substring(startCaret.offset);

      let leftTextEndCaret = endCaret.node.value.substring(0,  endCaret.offset);
      let rightTextEndCaret = endCaret.node.value.substring(endCaret.offset);

      startCaret.node.value = leftTextStartCaret;
      let startCaretRightNode = new richTextEditor.TextNode(rightTextStartCaret, "text", startCaret.node.style.clone());

      endCaret.node.value = rightTextEndCaret;
      let endCaretLeftNode = new richTextEditor.TextNode(leftTextEndCaret, "text", endCaret.node.style.clone());

      startCaret.node.parent.insertAfter(startCaret.node, startCaretRightNode);

      endCaret.node.parent.insertBefore(endCaret.node, endCaretLeftNode);

      let parentStart = startCaret.node.parent;
      let nextLine = parentStart.nextSibling();
      let next;

      next = startCaret.node.nextSibling();
      while (next !== endCaret.node) {
        // the next node is in the same parent
        if (next) {
          next.propagateStyle(prop, propValue);
          next = next.nextSibling();
        }
        else {
          if (nextLine) {
            next = nextLine.children[0];
            nextLine = nextLine.nextSibling();
          }
          else {
            console.log("ERROR");
          }
        }
      }

      if (leftTextStartCaret === "") {
        startCaret.node.parent.removeChild(startCaret.node);
      }
      if (rightTextEndCaret === "") {
        endCaret.node.parent.removeChild(endCaret.node);
      }

      // update the nodes metrics
      textNodes.update(self.ctx, externalColor);
      self.range.updateSize(self.canvas.width, self.canvas.height);

      if (originalStartIndex < originalEndIndex) {
        self.startCaret.set(startCaretRightNode, 0);
        self.caret.set(endCaretLeftNode, endCaretLeftNode.value.length);
      }
      else {
        self.startCaret.set(endCaretLeftNode, endCaretLeftNode.value.length);
        self.caret.set(startCaretRightNode, 0);
      }
      self.updateTextfield();

      self.allTextNodes = textNodes.querySelectorAll("text");
      self.range.draw(self.allTextNodes, self.startCaret, self.caret, self.allTextNodes.indexOf(self.startCaret.node), self.allTextNodes.indexOf(self.caret.node));
    }

    textNodes.update(self.ctx, externalColor);
    self.range.updateSize(self.canvas.width, self.canvas.height);

    self.allTextNodes = textNodes.querySelectorAll("text");
    self.range.draw(self.allTextNodes, self.startCaret, self.caret, self.allTextNodes.indexOf(self.startCaret.node), self.allTextNodes.indexOf(self.caret.node));

    self.textfield.focus();
  }

  /**
   * 
   */
  richTextEditor.TextController.prototype.addNode = function(type, extra) {
    let self = this;
    let textNodes = self.textNodes;
    let externalColor = self.externalColor;

    self.removeSelection();

    // if the caret is inside a formula and the node to add is a formula, do nothing
    if ((type === "formula") && (inFormula(self.caret.node))) {
      return;
    }

    let offset = self.caret.offset;

    let newNode;

    // all new formulas init with italics
    let tmpStyle = self.caret.node.style.clone();
    if ( (!inFormula(self.caret.node)) && (type !== "formula") && (type !== "text")) {
      tmpStyle = self.caret.node.style.clone();
      tmpStyle.textItalic = true;
    }

    if (type === "formula") {
      if (extra) {
        tmpStyle.textItalic = true;
        newNode = new richTextEditor.TextNode("", type, tmpStyle);
      }
      else {
        newNode = new richTextEditor.TextNode("", type, tmpStyle);
      }
    }

    else if ((/text|superIndex|subIndex/).test(type)) {
      newNode = new richTextEditor.TextNode("", type, tmpStyle);
    }

    else if (type === "dynamicText") {
      newNode = new richTextEditor.TextNode("", type, tmpStyle);
      newNode.decimals = "2";
      newNode.fixed = false;
    }

    else if (type === "fraction") {
      newNode = new richTextEditor.TextNode("", type, tmpStyle);

      let numNode = new richTextEditor.TextNode("", "numerator", tmpStyle);
      let denNode = new richTextEditor.TextNode("", "denominator", tmpStyle);

      newNode.addChild(numNode);
      newNode.addChild(denNode);
    }

    else if (type === "radical") {
      newNode = new richTextEditor.TextNode("", type, tmpStyle);

      let indexNode = new richTextEditor.TextNode("", "index", tmpStyle);
      let radicandNode = new richTextEditor.TextNode("", "radicand", tmpStyle);

      newNode.addChild(indexNode);
      newNode.addChild(radicandNode);
    }

    else if ((/sum|integral|limit/).test(type)) {
      newNode = new richTextEditor.TextNode("", type, tmpStyle);

      let fromNode = new richTextEditor.TextNode("", "from", tmpStyle);
      let toNode = new richTextEditor.TextNode("", "to", tmpStyle);
      let whatNode = new richTextEditor.TextNode("", "what", tmpStyle);

      newNode.addChild(fromNode);
      newNode.addChild(toNode);
      newNode.addChild(whatNode);
    }

    else if (type === "matrix") {
      newNode = new richTextEditor.TextNode("", type, tmpStyle);

      newNode.matrix_type = parseInt(extra.matrix_type || 0);

      newNode.rows = parseInt(extra.rows);
      if (isNaN(newNode.rows)) {
        newNode.rows = 2;
      }
      newNode.columns = parseInt(extra.cols);
      if (isNaN(newNode.columns)) {
        newNode.columns = 2;
      }

      for (let i=0, l=newNode.rows*newNode.columns; i<l; i++) {
        let elementNode = new richTextEditor.TextNode("", "element", tmpStyle);
        newNode.addChild(elementNode);
      }
    }

    else if (type === "defparts") {
      newNode = new richTextEditor.TextNode("", type, tmpStyle);

      newNode.parts = parseInt(extra.parts);
      if (isNaN(newNode.parts)) {
        newNode.parts = 2;
      }

      for (let i=0, l=newNode.parts; i<l; i++) {
        let elementNode = new richTextEditor.TextNode("", "element", tmpStyle);
        newNode.addChild(elementNode);
      }
    }
    

    // if the new node is not in a formula, create a new formula node
    if ( (!inFormula(self.caret.node)) && (type !== "formula") && (type !== "text")) {
      let formulaNode = new richTextEditor.TextNode("", "formula" , tmpStyle);

      formulaNode.addChild(newNode);
      newNode = formulaNode;
    }

    let leftText = self.caret.node.value.substring(0, offset);
    let rightText = self.caret.node.value.substring(offset);

    self.caret.node.value = leftText;

    let rightNode = new richTextEditor.TextNode(rightText, "text", self.caret.node.style.clone());

    let parent = self.caret.node.parent;
    let tmpChildren = parent.children;
    parent.children = [];
    for (let i=0, l=tmpChildren.length; i<l; i++) {
      // if the current child to add is the caret node
      if (tmpChildren[i] === self.caret.node) {
        // add the current children if has content
        if (leftText !== "") {
          parent.addChild(tmpChildren[i]);
        }

        parent.addChild(newNode);

        // add the right part if has content
        if (rightText !== "") {
          parent.addChild(rightNode);
        }
      }
      // add all children different to the caret node
      else {
        parent.addChild(tmpChildren[i]);
      }
    }

    parent.normalize();
    newNode.parent.adjustFontSize();

    // update the nodes metrics
    textNodes.update(self.ctx, externalColor);

    let newCaret = newNode.getFirstTextNode();
    self.caret.set(newCaret, 0);
    self.startCaret.set(newCaret, 0);
    self.updateTextfield();
  }

  /**
   * 
   */
  richTextEditor.TextController.prototype.removeSelection = function() {
    let self = this;
    let textNodes = self.textNodes;
    let externalColor = self.externalColor;

    // the selection is in the same node
    if (self.startCaret.node === self.caret.node) {
      let node = self.startCaret.node;
      let startOffset = self.startCaret.offset;
      let endOffset = self.caret.offset;

      if (self.startCaret.offset > self.caret.offset) {
        startOffset = self.caret.offset;
        endOffset = self.startCaret.offset;
      }

      node.value = node.value.substring(0, startOffset) + node.value.substring(endOffset);

      // update the nodes metrics
      textNodes.update(self.ctx, externalColor);
      self.range.updateSize(self.canvas.width, self.canvas.height);

      self.startCaret.set(node, startOffset);
      self.caret.set(node, startOffset);
    }
    // the selection is in different nodes
    else {
      self.allTextNodes = textNodes.querySelectorAll("text");

      let startCaret = self.startCaret;
      let endCaret = self.caret;
      let startIndex = self.allTextNodes.indexOf(self.startCaret.node);
      let endIndex = self.allTextNodes.indexOf(self.caret.node);

      if (startIndex > endIndex) {
        [startIndex, endIndex] = [endIndex, startIndex];
        [startCaret, endCaret] = [endCaret, startCaret];
      }

      // remove the text selected in the start caret
      startCaret.node.value = startCaret.node.value.substring(0, startCaret.offset);

      // remove the text selected in the end caret
      endCaret.node.value = endCaret.node.value.substring(endCaret.offset);

      let parentStart = startCaret.node.parent;
      let parentEnd = endCaret.node.parent;
      let nextLine = parentStart.nextSibling();
      let next;
      let tmpNext;

      next = startCaret.node.nextSibling();

      while(next !== endCaret.node) {
        // the next node is in the same parent
        if (next) {
          tmpNext = next.nextSibling();
          next.parent.removeChild(next);
          next = tmpNext;
        }
        else {
          if (nextLine) {
            next = nextLine.children[0];
            nextLine = nextLine.nextSibling();
          }
          else {
            console.log("ERROR");
          }
        }
      }           

      // remove empty lines
      nextLine = parentStart.nextSibling();
      while ((nextLine) && (nextLine !== parentEnd)) {
        tmpNext = nextLine.nextSibling();

        if (nextLine.children.length === 0) {
          nextLine.parent.removeChild(nextLine);
        }

        nextLine = tmpNext;
      }

      // move the content of the last line to the first line
      if (parentStart !== parentEnd) {
        parentEnd.parent.removeChild(parentEnd);

        for (let i=0, l=parentEnd.children.length; i<l; i++) {
          parentStart.addChild(parentEnd.children[i]);
        }
      }

      if (startCaret.node.value === "") {
        if (endCaret.node.value === "") {
          endCaret.node.parent.removeChild(endCaret.node);
        }
        else {
          startCaret.node.parent.removeChild(startCaret.node);
          startCaret = endCaret;
        }
      }

      // update the nodes metrics
      textNodes.update(self.ctx, externalColor);
      self.range.updateSize(self.canvas.width, self.canvas.height);

      self.startCaret.set(startCaret.node, startCaret.offset);
      self.caret.set(startCaret.node, startCaret.offset);
    }

    self.undoRedoManager.storeCaretPositions(self.caret, self.startCaret);
  }

  /**
   * 
   */
  richTextEditor.TextController.prototype.updateTextfield = function() {
    let self = this;

    self.textfield.value = self.caret.node.value || String.fromCharCode(65279);
    self.textfield.setSelectionRange(self.caret.offset, self.caret.offset);

    self.textfieldContainer.style.left = (self.caret.getX() + self.caret.offsetLeft) + "px";
    self.textfieldContainer.style.top = (self.caret.getY() + self.caret.offsetTop +self.caret.getH()/2) + "px";
  }

  /**
   * 
   */
  function getLine(node) {
    while (node) {
      if (node.nodeType === "textLineBlock") {
        return node;
      }
      node = node.parent;
    }

    return null;
  }

  /**
   * 
   */
  function inFormula(node) {
    while (node) {
      if (node.nodeType === "formula") {
        return true;
      }
      node = node.parent;
    }

    return false;
  }


  /**
   * 
   */
  richTextEditor.TextController.prototype.getTextNodes = function() {
    return this.textNodes;
  }

  richTextEditor.TextController.prototype.setNewNodes = function(nodes, color) {
    this.externalColor = color;

    for (let i=this.textNodes.children.length-1; i>=0; i--) {
      this.textNodes.removeChild(this.textNodes.children[i]);
    }
    for (let i=0, l=nodes.children.length; i<l; i++) {
      this.textNodes.addChild(nodes.children[i]);
    }

    // update the nodes metrics
    this.textNodes.update(this.ctx, this.externalColor);
    this.range.updateSize(this.canvas.width, this.canvas.height);

    let tmpInitNode = this.textNodes.getFirstTextNode();
    this.caret.set(tmpInitNode, 0);
    this.startCaret.set(tmpInitNode, 0);

    this.textfield.focus();
  }

  richTextEditor.TextController.prototype.notifyParentStyle = function() {
    if ((this.parent) && (this.parent.changeStyle)) {
      this.parent.changeStyle(this.caret.node.style);
    }
  }

  richTextEditor.TextController.prototype.insertSymbol = function(symbol) {
    this.removeSelection();
    this.caret.node.value = this.caret.node.value.substring(0, this.caret.offset) + symbol + this.caret.node.value.substring(this.caret.offset);

    // update the nodes metrics
    this.textNodes.update(this.ctx, this.externalColor);
    this.range.updateSize(this.canvas.width, this.canvas.height);

    this.caret.set(this.caret.node, this.caret.offset+1);
    this.startCaret.set(this.caret.node, this.caret.offset);

    this.updateTextfield();

    this.textfield.focus();
  }

  richTextEditor.TextController.prototype.addFormula = function() {
    this.addNode("formula", true);
    this.textfield.focus();
  }

  richTextEditor.TextController.prototype.addDynamicTextNode = function() {
    this.addNode("dynamicText");
    this.textfield.focus();
  }

  richTextEditor.TextController.prototype.addFraction = function() {
    this.addNode("fraction");
    this.textfield.focus();
  }

  richTextEditor.TextController.prototype.addSuperIndex = function() {
    this.addNode("superIndex");
    this.textfield.focus();
  }

  richTextEditor.TextController.prototype.addSubIndexNode = function() {
    this.addNode("subIndex");
    this.textfield.focus();
  }

  richTextEditor.TextController.prototype.addRadicalNode = function() {
    this.addNode("radical");
    this.textfield.focus();
  }

  richTextEditor.TextController.prototype.addSumNode = function() {
    this.addNode("sum");
    this.textfield.focus();
  }

  richTextEditor.TextController.prototype.addIntegralNode = function() {
    this.addNode("integral");
    this.textfield.focus();
  }

  richTextEditor.TextController.prototype.addLimitNode = function() {
    this.addNode("limit");
    this.textfield.focus();
  }

  richTextEditor.TextController.prototype.addMatrixNode = function(rows, cols, type) {
    this.addNode("matrix", {rows: rows, cols: cols, matrix_type: type});
    this.textfield.focus();
  }

  richTextEditor.TextController.prototype.addDefpartsNode = function(parts) {
    this.addNode("defparts", {parts: parts});
    this.textfield.focus();
  }

  return richTextEditor;
})(richTextEditor || {});
