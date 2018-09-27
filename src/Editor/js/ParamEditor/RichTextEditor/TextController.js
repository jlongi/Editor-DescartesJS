/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var richTextEditor = (function(richTextEditor) {

  var regExpSpace = new RegExp(String.fromCharCode(65279), "g");

  var INTRO_KEY = 13;

  var DELETE_KEY = 46;
  var BACKSPACE_KEY = 8;

  var PAGE_UP_KEY = 33;
  var PAGE_DOWN_KEY = 34;

  var END_KEY = 35;
  var INIT_KEY = 36;

  var LEFT_KEY = 37;
  var UP_KEY = 38;
  var RIGHT_KEY = 39;
  var DOWN_KEY = 40;

  var PLUS_KEY = 187;
  var MINUS_KEY = 189;

  /**
   *
   */
  richTextEditor.TextController = function(parent, container, textNodes, defaultStyle, externalColor) {
    var self = this;
    this.parent = parent;
    this.container = container;
    this.defaultStyle = defaultStyle;
    this.externalColor = externalColor;
    this.textNodes = textNodes;

    this.allTextNodes = null;

    this.textfieldContainer = document.createElement("div");
    // this.textfieldContainer.setAttribute("style", "position:absolute; width:100px; height:10px;");
    this.textfieldContainer.setAttribute("style", "position:absolute; overflow:hidden; width:1px; height:1px;");
    // this.textfield = document.createElement("div");
    // this.textfield.setAttribute("contenteditable", "true");
    this.textfield = document.createElement("input");
    this.textfield.setAttribute("type", "text");
    this.textfield.setAttribute("style", "outline:none; border:none; caret-color:transparent;");
    this.textfield.textContent = "";
    this.textfieldContainer.appendChild(this.textfield);
    container.appendChild(this.textfieldContainer);

    this.range = new richTextEditor.Range(container);

    this.canvas = document.createElement("canvas");
    this.canvas.setAttribute("class", "textEditorCanvas");
    this.canvas.setAttribute("width", "256");
    this.canvas.setAttribute("height", "256");

    this.ctx = this.canvas.getContext("2d");
    container.appendChild(this.canvas);

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


    ////////////////////////
    // this.contextMenuMatrix = new nw.Menu();

    // this.contextMenuMatrix.append(new nw.MenuItem({
    //   label: "Cut",
    //   click: function() {
    //   }
    // }));
    
    // this.contextMenuMatrix.append(new nw.MenuItem({
    //   label: "Copy",
    //   click: function() {
    //   }
    // }));
    
    // this.contextMenuMatrix.append(new nw.MenuItem({
    //   label: "Paste",
    //   click: function() {
    //   }
    // }));
    ////////////////////////
    
// console.log(textNodes)

    // control the keyboard
    // container.addEventListener("keydown", function(evt) {
    self.textfield.addEventListener("keydown", function(evt) {
      var key = evt.keyCode;
      var char = String.fromCharCode(evt.keyCode || evt.charCode);
// console.log(evt.key, evt.which)
      self.control = false;

      var ctrlkey = (evt.ctrlKey || evt.metaKey);
      var shiftKey = evt.shiftKey;
      // evt.preventDefault();

      self.undoRedoManager.storeCaretPositions(self.caret, self.startCaret);

      ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      if (key === END_KEY) {
        evt.preventDefault();

        var line = getLine(self.caret.node);
        var last = line.getLastTextNode();
        self.caret.set(last, last.value.length);

        manageSelection(shiftKey);
      }

      ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      else if (key === INIT_KEY) {
        evt.preventDefault();

        var line = getLine(self.caret.node);
        var first = line.getFirstTextNode();
        self.caret.set(first, 0);

        manageSelection(shiftKey);
      }

      ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      else if (key === LEFT_KEY) {
        evt.preventDefault();

        self.caret.stopBlink();

        // the caret can't go backward, maybe first character in the text node
        if (!self.caret.goBackward()) {
          var line = getLine(self.caret.node);

          if (line) {
            var texts = line.querySelectorAll("text");
            var current;

            for (var i=0, l=texts.length; i<l; i++) {
              if (texts[i] === self.caret.node) {
                current = i;
                break;
              }
            }

            var prev = (current-1 >= 0) ? texts[current-1] : null;

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
                  var prevNode = self.caret.node.prevSibling();
                  if (prevNode) {
                    prevNode = prevNode.prevSibling();
                    self.caret.set(prevNode, prevNode.value.length);
                  }
                }

              }
            }
            // no previous text node in the line, posibly start of line, check the previous line
            else {
              var prevLine = line.prevSibling();
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
          var line = getLine(self.caret.node);

          if (line) {
            var texts = line.querySelectorAll("text");
            var current;

            for (var i=0, l=texts.length; i<l; i++) {
              if (texts[i] === self.caret.node) {
                current = i;
                break;
              }
            }

            var next = (current+1 < l) ? texts[current+1] : null;

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
                  var nextNode = self.caret.node.nextSibling();
                  if (nextNode) {
                    nextNode = nextNode.nextSibling();
                    self.caret.set(nextNode, 0);
                  }
                }
              }
            }
            // no next text node in the line, posibly end of line, check the next line
            else {
              var nextLine = line.nextSibling();
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
      else if (!ctrlkey && (key === UP_KEY)) {
        evt.preventDefault();

        self.caret.stopBlink();

        var line = getLine(self.caret.node);
        if (line) {
          var texts = line.querySelectorAll("text");
          var caretNodeX = self.caret.node.metrics.x;
          var caretNodeY = self.caret.node.metrics.y - self.caret.node.metrics.ascent;
          var caretNodeW = self.caret.node.metrics.w;
          var caretNodeH = self.caret.node.metrics.h;
          var x, y, w, h;
          var cond1, cond2, cond3, cond4;
          var overNodes = [];

          for (var i=0, l=texts.length; i<l; i++) {
            x = texts[i].metrics.x;
            y = texts[i].metrics.y +texts[i].metrics.descent;
            w = texts[i].metrics.w;
            h = texts[i].metrics.h;

            // check only the texts that are over the caret node
            if (y < caretNodeY) {
              cond1 = (caretNodeX <= x) && (x <= caretNodeX+caretNodeW);              // left side of text node is inside the caret node
              cond2 = (caretNodeX <= x+w) && (x+w <= caretNodeX+caretNodeW);          // right side of text node is inside the caret node
              cond3 = (x <= caretNodeX) && (caretNodeX <= x+w);                       // left side of caret node is inside the text node
              cond4 = (x <= caretNodeX+caretNodeW) && (caretNodeX+caretNodeW <= x+w); // right side of caret node is inside the text node

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
            var prevLine = line.prevSibling();
            if (prevLine) {
              positionCaretAux(self.caret.getX(), prevLine.metrics.y+prevLine.metrics.h, prevLine.querySelectorAll("text"));
            }
          }
        }

        manageSelection(shiftKey);

        self.caret.startBlink();
      }
      ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      else if (!ctrlkey && (key === DOWN_KEY)) {
        evt.preventDefault();

        self.caret.stopBlink();
        
        var line = getLine(self.caret.node);
        if (line) {
          var texts = line.querySelectorAll("text");
          var caretNodeX = self.caret.node.metrics.x;
          var caretNodeY = self.caret.node.metrics.y + self.caret.node.metrics.descent;
          var caretNodeW = self.caret.node.metrics.w;
          var caretNodeH = self.caret.node.metrics.h;
          var x, y, w, h;
          var cond1, cond2, cond3, cond4;
          var underNodes = [];

          for (var i=0, l=texts.length; i<l; i++) {
            x = texts[i].metrics.x;
            y = texts[i].metrics.y - texts[i].metrics.ascent;
            w = texts[i].metrics.w;
            h = texts[i].metrics.h;

            // check only the texts that are over the caret node
            if (caretNodeY < y) {
              cond1 = (caretNodeX <= x) && (x <= caretNodeX+caretNodeW);              // left side of text node is inside the caret node
              cond2 = (caretNodeX <= x+w) && (x+w <= caretNodeX+caretNodeW);          // right side of text node is inside the caret node
              cond3 = (x <= caretNodeX) && (caretNodeX <= x+w);                       // left side of caret node is inside the text node
              cond4 = (x <= caretNodeX+caretNodeW) && (caretNodeX+caretNodeW <= x+w); // right side of caret node is inside the text node

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
            var nextLine = line.nextSibling();
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
          var node = self.caret.node;
          var offset = self.caret.offset;

          // the caret is at the end of the text
          if (offset === node.value.length) {
            var next = node.nextSibling();

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
              var line = node.parent;
              if (line.nodeType === "textLineBlock") {
                var nextLine = node.parent.nextSibling();

                // then join the two lines
                if (nextLine !== null) {
                  for (var i=0, l=nextLine.children.length; i<l; i++) {
                    line.addChild(nextLine.children[i]);
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
          var node = self.caret.node;
          var offset = self.caret.offset;
          
          // the caret is at the start of the text
          if (offset === 0) {
            var prev = node.prevSibling();

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
              var line = node.parent;
              if (line.nodeType === "textLineBlock") {
                var prevLine = node.parent.prevSibling();
                
                // then join the two lines
                if (prevLine !== null) {
                  for (var i=0, l=line.children.length; i<l; i++) {
                    prevLine.addChild(line.children[i]);
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
        var node = self.caret.node;
        var offset = self.caret.offset;
        var line = node.parent;
        if (line.nodeType === "textLineBlock") {
          var splitRight = new richTextEditor.TextNode(node.value.substring(offset), "text", node.style);

          node.value = node.value.substring(0, offset);

          var newLine = new richTextEditor.TextNode("", "textLineBlock", line.style);
          newLine.parent = line.parent;
          newLine.addChild(splitRight);

          var tmpNext;
          var next = node.nextSibling();
          while (next) {
            tmpNext = next.nextSibling();

            next.parent.removeChild(next);
            newLine.addChild(next);

            next = tmpNext;
          }

          var newLinesArray = [];
          for (var i=0, l=line.parent.children.length; i<l; i++) {
            newLinesArray.push(line.parent.children[i]);
            if (line.parent.children[i] === line) {
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

        var x = self.caret.getX();
        var y = self.caret.getY() - self.container.offsetHeight + self.caret.getH();
        var texts = caretLineAux(x, y, textNodes.querySelectorAll("textLineBlock"));
        positionCaretAux(x, y, texts);

        manageSelection(shiftKey);

        self.caret.startBlink();
      }
      ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      else if (key === PAGE_DOWN_KEY) {
        evt.preventDefault();

        self.caret.stopBlink();

        var x = self.caret.getX();
        var y = self.caret.getY() + self.container.offsetHeight;
        var texts = caretLineAux(x, y, textNodes.querySelectorAll("textLineBlock"));
        positionCaretAux(x, y, texts);

        manageSelection(shiftKey);

        self.caret.startBlink();
      }

      ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      // undo
      else if (ctrlkey && (char === "Z")) {
        var state = self.undoRedoManager.undo();

        self.caret.startBlink();

        if (state) {
          self.textNodes.children = [];
          for (var i=0, l=state.nodes.children.length; i<l; i++) {
            self.textNodes.addChild(state.nodes.children[i]);
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
      else if (ctrlkey && (char === "Y")) {
        var state = self.undoRedoManager.redo();

        self.caret.startBlink();

        if (state) {
          self.textNodes.children = [];
          for (var i=0, l=state.nodes.children.length; i<l; i++) {
            self.textNodes.addChild(state.nodes.children[i]);
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
      else if (ctrlkey && (char === "B")) {
        evt.preventDefault();

        self.caret.stopBlink();

        self.changeStyle("textBold");

        self.caret.startBlink();
      }

      
      ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      // italic
      else if (ctrlkey && (char === "I")) {
        evt.preventDefault();

        self.caret.stopBlink();

        self.changeStyle("textItalic");

        self.caret.startBlink();
      }

      
      ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      // undeline
      else if (ctrlkey && (char === "U")) {
        evt.preventDefault();

        self.caret.stopBlink();

        self.changeStyle("textUnderline");

        self.caret.startBlink();
      }

      ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      // add formula
      else if (ctrlkey && (char === "F")) {
        evt.preventDefault();

        self.caret.stopBlink();

        self.addNode("formula", true);

        self.caret.startBlink();
      }

      ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      // add fraction
      else if (ctrlkey && (char === "7")) {
        evt.preventDefault();

        self.caret.stopBlink();

        self.addNode("fraction");

        self.caret.startBlink();
      }

      ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      // add super index
      else if (ctrlkey && (key === UP_KEY)) {
        evt.preventDefault();

        self.caret.stopBlink();

        self.addNode("superIndex");

        self.caret.startBlink();
      }

      ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      // add sub index
      else if (ctrlkey && (key === DOWN_KEY)) {
        evt.preventDefault();

        self.caret.stopBlink();

        self.addNode("subIndex");

        self.caret.startBlink();
      }

      ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      // add radical
      else if (ctrlkey && (char === "R")) {
        evt.preventDefault();

        self.caret.stopBlink();

        self.addNode("radical");

        self.caret.startBlink();
      }      

      ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      // add sum
      else if (ctrlkey && (char === "S")) {
        evt.preventDefault();

        self.caret.stopBlink();

        self.addNode("sum");

        self.caret.startBlink();
      }      

      // ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      // // add integral
      // else if (ctrlkey && (char === "I")) {
      //   evt.preventDefault();

      //   self.caret.stopBlink();

      //   self.addNode("integral");

      //   self.caret.startBlink();
      // }

      ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      // add limit
      else if (ctrlkey && (char === "L")) {
        evt.preventDefault();

        self.caret.stopBlink();

        self.addNode("limit");

        self.caret.startBlink();
      }

      ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      else if (ctrlkey && (char === "K")) {
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
    // container.addEventListener("contextmenu", function(evt) {
    //   evt.preventDefault();

    //   self.contextMenuMatrix.popup(evt.x, evt.y);
    // });

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

      var allTextNodes = textNodes.querySelectorAll("textLineBlock");
      var x = self.caret.getX();
      var y = self.caret.getY();
      var texts = caretLineAux(x, y, allTextNodes);
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

      var data = evt.clipboardData.getData("text/richText");

      if (data) {
        var nodes = richTextEditor.JSONtoTextNodes(JSON.parse(data));

        if (nodes.nodeType === "text") {
          // if the text node has the same style only paste the content
          if (self.caret.node.style.equals(nodes.style)) {

            var firstPart = self.caret.node.value.substring(0, self.caret.offset) + nodes.value;
            self.caret.node.value = firstPart + self.caret.node.value.substring(self.caret.offset);

            newCaretNode = self.caret.node;
            newCaretOffset = firstPart.length;
          }
          // if the text node has not the same style, then split the caret node and insert the new text node
          else {
            var leftText = self.caret.node.value.substring(0, self.caret.offset);
            var rightText = self.caret.node.value.substring(self.caret.offset);
        
            self.caret.node.value = leftText;
        
            var rightNode = new richTextEditor.TextNode(rightText, "text", self.caret.node.style.clone());

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
            var leftText = self.caret.node.value.substring(0, self.caret.offset);
            var rightText = self.caret.node.value.substring(self.caret.offset);
        
            self.caret.node.value = leftText;
        
            var rightNode = new richTextEditor.TextNode(rightText, "text", self.caret.node.style.clone());

            self.caret.node.parent.insertAfter(self.caret.node, rightNode);

            var caretParent = self.caret.node.parent;
            var tmpParent = new richTextEditor.TextNode("", caretParent.nodeType, caretParent.style.clone());

            // get all the nodes to the right in the parent
            var next = self.caret.node.nextSibling();
            var tmpNext;
            while (next) {
              tmpNext = next.nextSibling();
              next.parent.removeChild(next);

              tmpParent.addChild(next);
              next = tmpNext;
            }

            var currentParent = caretParent;
            // the caret is outside a formula
            if (caretParent.nodeType === "textLineBlock") {
              for (var i=0, l=nodes.children.length; i<l-1; i++) {
                if (nodes.children[i].nodeType !== "textLineBlock") {
                  currentParent.addChild(nodes.children[i]);
                }
                else {
                  currentParent.parent.insertAfter(currentParent, nodes.children[i]);
                  currentParent = nodes.children[i];
                }
              }

              currentParent.parent.insertAfter(currentParent, nodes.children[nodes.children.length-1]);

              for (var i=0, l=tmpParent.children.length; i<l; i++) {
                nodes.children[nodes.children.length-1].addChild(tmpParent.children[i]);
              }

              newCaretNode = rightNode;
              newCaretOffset = 0;
            }
            // the caret is inside a formula
            else {
              for (var i=0, l=nodes.children.length; i<l; i++) {
                if (nodes.children[i].nodeType !== "textLineBlock") {
                  // if has a formula child then add the children of the formula
                  if (nodes.children[i].nodeType === "formula") {
                    for (var ij=0, lk=nodes.children[i].children.length; ij<lk; ij++) {
                      currentParent.addChild(nodes.children[i].children[ij]);
                    }
                  }
                  // the children are text nodes or formula elements like fraction or sum or integral, etc
                  else {
                    currentParent.addChild(nodes.children[i]);
                  }
                 }
                else {
                  for (var j=0, k=nodes.children[i].children.length; j<k; j++) {
                    // if has a formula child then add the children of the formula
                    if (nodes.children[i].children[j].nodeType === "formula") {
                      for (var ij=0, lk=nodes.children[i].children[j].children.length; ij<lk; ij++) {
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

              for (var i=0, l=tmpParent.children.length; i<l; i++) {
                  // if has a formula child then add the children of the formula
                  if (tmpParent.children[i].nodeType === "formula") {
                    for (var ij=0, lk=tmpParent.children[i].children.length; ij<lk; ij++) {
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
            var leftText = self.caret.node.value.substring(0, self.caret.offset);
            var rightText = self.caret.node.value.substring(self.caret.offset);
        
            self.caret.node.value = leftText;
        
            var rightNode = new richTextEditor.TextNode(rightText, "text", self.caret.node.style.clone());

            self.caret.node.parent.insertAfter(self.caret.node, rightNode);

            if ((nodes.insideFormula) && (!inFormula(self.caret.node)))  {
              var tmpFormula = new richTextEditor.TextNode("", "formula", self.caret.node.style.clone());
              self.caret.node.parent.insertBefore(rightNode, tmpFormula);

              for (var i=0, l=nodes.children.length; i<l; i++) {
                tmpFormula.addChild(nodes.children[i]);
              }
            }
            else {
              for (var i=0, l=nodes.children.length; i<l; i++) {
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
          var firstPart = self.caret.node.value.substring(0, self.caret.offset) + data;
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

      var allTextNodes = textNodes.querySelectorAll("textLineBlock");
      var x = self.caret.getX();
      var y = self.caret.getY();
      var texts = caretLineAux(x, y, allTextNodes);
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
        var startOffset = (self.caret.offset < self.startCaret.offset) ? self.caret.offset : self.startCaret.offset;
        var endOffset = (self.caret.offset > self.startCaret.offset) ? self.caret.offset : self.startCaret.offset;

        var textSelected = self.caret.node.value.substring(startOffset, endOffset);
        var newNode = new richTextEditor.TextNode(textSelected, "text" , self.caret.node.style.clone());

        evt.clipboardData.setData("text/plain", textSelected);
        evt.clipboardData.setData("text/richText", newNode.stringify());
        // evt.clipboardData.setData("text/richText", JSON.stringify(newNode, richTextEditor.stringifyAux));
      }

      // the selection is in differents nodes
      else {
        self.allTextNodes = textNodes.querySelectorAll("text");

        var startCaret = self.startCaret;
        var endCaret = self.caret;
        var startIndex = self.allTextNodes.indexOf(self.startCaret.node);
        var endIndex = self.allTextNodes.indexOf(self.caret.node);
  
        var originalStartIndex = startIndex;
        var originalEndIndex = endIndex;
  
        if (startIndex > endIndex) {
          var tmp = startIndex;
          startIndex = endIndex;
          endIndex = tmp;
    
          tmp = startCaret;
          startCaret = endCaret;
          endCaret = tmp;
        }

        var rightTextStartCaret = startCaret.node.value.substring(startCaret.offset);
        var rightTextNode = new richTextEditor.TextNode(rightTextStartCaret, "text", startCaret.node.style.clone());
        
        var leftTextEndCaret = endCaret.node.value.substring(0,  endCaret.offset);
        var leftTextNode = new richTextEditor.TextNode(leftTextEndCaret, "text", endCaret.node.style.clone());

        var newNode = new richTextEditor.TextNode("", "CONTAINER", "");
        newNode.insideFormula = inFormula(startCaret.node);

        newNode.addChild(rightTextNode);

        var lastLine = newNode;

        var parentStart = startCaret.node.parent;
        var parentEnd = endCaret.node.parent;
        var nextLine = parentStart.nextSibling();
        var next;
        var tmpNext;
  
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

      var tmpStartCaretNode = self.startCaret.node;
      var tmpStartCaretOffset = self.startCaret.offset;
      var tmpStartCaretValue = self.startCaret.node.value;

      var tmpEndCaretNode = self.caret.node;
      var tmpEndCaretOffset = self.caret.offset;
      var tmpEndCaretValue = self.caret.node.value;

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
        var startIndex = self.allTextNodes.indexOf(tmpStartCaretNode);
        var endIndex = self.allTextNodes.indexOf(tmpEndCaretNode);

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
          var next = self.caret.node.nextSibling();
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
      var dynText = self.textNodes.querySelectorAll("dynamicText");
      if (dynText.length > 0) {
        var rect = self.canvas.getBoundingClientRect();
        var x = evt.clientX - rect.left;
        var y = evt.clientY - rect.top;
        var texts_i;
        var theDynTextNode = null;

        for (var i=0, l=dynText.length; i<l; i++) {
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

      var text = self.caret.node.value;
      var mouseChar = text.charAt(Math.min(self.caret.offset, text.length-1));
      var startIndex = 0;
      var endIndex = text.length;

      // if the character under the mouse position is an space, then try to select all the spaces conected to the character
      if (mouseChar === " ") {
        for (var i=self.caret.offset-1; i>=0; i--) {
          if (text.charAt(i).match(/\S/)) {
            startIndex = i+1;
            break;
          }
        }
        
        for (var i=self.caret.offset+1, l=text.length; i<l; i++) {
          if (text.charAt(i).match(/\S/)) {
            endIndex = i;
            break;
          }
        }
      }
      // single separator chars
      else if (mouseChar.match(/[^A-Za-z0-9_]/)) {
        startIndex = self.caret.offset;
        endIndex = self.caret.offset+1;
      }
      // words
      else {
        for (var i=self.caret.offset-1; i>=0; i--) {
          if (text.charAt(i).match(/[^A-Za-z0-9_]/)) {
            startIndex = i+1;
            break;
          }
        }

        for (var i=self.caret.offset+1, l=text.length; i<l; i++) {
          if (text.charAt(i).match(/[^A-Za-z0-9_]/)) {
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


    var mouseMove_rect;
    var mouseMove_x;
    var mouseMove_y;
    var mouseMove_parentStartNode;
    var mouseMove_commonAncestor;
    var mouseMove_sibling;
    var mouseMove_siblingChild;
    var mouseMove_now;
    var mouseMove_indexCaret;
    var mouseMove_indexSibling;
    var mouseMove_newNode;
    var mouseMove_lineStartCaret;
    var mouseMove_lineCaret;
    var mouseMove_indexStartCaret;
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
      // text blocks in the same parent i.e. siblings or text blocks in diferents lines
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

      var rect = self.canvas.getBoundingClientRect();
      var x = evt.clientX - rect.left;
      var y = evt.clientY - rect.top;

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

        var line = getLine(self.caret.node);
        var startNode = line.getFirstTextNode();
        var endNode = line.getLastTextNode();

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
      var line = null;

      for (var i=0, l=lines.length; i<l; i++) {
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
      var texts_i;
      var xMetric;
      var yMetric;
      var wMetric;
      var hMetric;
      var hDist;
      var vDist;

      var nodeNear = null;
      var minDist = Infinity;
      var nodeContains = null;

      for (var i=0, l=texts.length; i<l; i++) {
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

      var textNode = nodeContains || nodeNear;
      var offset = textNode.value.length;
      var mouseWidth = x - textNode.metrics.x;
      var charWidth;
      var textWidth = 0;
      richTextEditor.auxCtx.font = textNode.styleString; // set the style of the canvas context only one time, to check te width of the text

      // iterate over all characters in the string of the node to get the offset
      for (var i=0, l=textNode.value.length; i<l; i++) {
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
    var self = this;
    var textNodes = self.textNodes;
    var externalColor = self.externalColor;

    // the selection is in the same node
    if (self.startCaret.node === self.caret.node) {
      // prevent the change in font size inside a formula
      if (inFormula(self.caret.node) && (prop === "fontSize")) {
        var formulaNode = self.caret.node;

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
        var startOffset = (self.caret.offset < self.startCaret.offset) ? self.caret.offset : self.startCaret.offset;
        var endOffset = (self.caret.offset > self.startCaret.offset) ? self.caret.offset : self.startCaret.offset;

        var newStyle = self.caret.node.style.clone();
        if (value === undefined) {
          newStyle[prop] = !newStyle[prop];
        }
        else {
          newStyle[prop] = value;
        }

        var newNode = new richTextEditor.TextNode(self.caret.node.value.substring(startOffset, endOffset), "text" , newStyle);

        var leftText = self.caret.node.value.substring(0, startOffset);
        var rightText = self.caret.node.value.substring(endOffset);

        self.caret.node.value = leftText;

        var rightNode = new richTextEditor.TextNode(rightText, "text", self.caret.node.style.clone());

        var parent = self.caret.node.parent;
        var tmpChildren = parent.children;
        parent.children = [];
        for (var i=0, l=tmpChildren.length; i<l; i++) {
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
          // add all children diferent to the caret node
          else {
            parent.addChild(tmpChildren[i]);
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

    // the selection is in differents nodes
    else {
      var propValue = (value === undefined) ? !self.caret.node.style[prop] : value;

      self.allTextNodes = textNodes.querySelectorAll("text");

      var startCaret = self.startCaret;
      var endCaret = self.caret;
      var startIndex = self.allTextNodes.indexOf(self.startCaret.node);
      var endIndex = self.allTextNodes.indexOf(self.caret.node);

      var originalStartIndex = startIndex;
      var originalEndIndex = endIndex;

      if (startIndex > endIndex) {
        var tmp = startIndex;
        startIndex = endIndex;
        endIndex = tmp;
  
        tmp = startCaret;
        startCaret = endCaret;
        endCaret = tmp;
      }

      var leftTextStartCaret = startCaret.node.value.substring(0, startCaret.offset);
      var rightTextStartCaret = startCaret.node.value.substring(startCaret.offset);

      var leftTextEndCaret = endCaret.node.value.substring(0,  endCaret.offset);
      var rightTextEndCaret = endCaret.node.value.substring(endCaret.offset);

      startCaret.node.value = leftTextStartCaret;
      var startCaretRightNode = new richTextEditor.TextNode(rightTextStartCaret, "text", startCaret.node.style.clone());

      endCaret.node.value = rightTextEndCaret;
      var endCaretLeftNode = new richTextEditor.TextNode(leftTextEndCaret, "text", endCaret.node.style.clone());

      startCaret.node.parent.insertAfter(startCaret.node, startCaretRightNode);

      endCaret.node.parent.insertBefore(endCaret.node, endCaretLeftNode);

      var parentStart = startCaret.node.parent;
      var parentEnd = endCaret.node.parent;
      var nextLine = parentStart.nextSibling();
      var next;
      var tmpNext;

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
    var self = this;
    var textNodes = self.textNodes;
    var externalColor = self.externalColor;

    self.removeSelection();

    // if the caret is inside a formula and the node to add is a formula, do nothing
    if ((type === "formula") && (inFormula(self.caret.node))) {
      return;
    }

    var offset = self.caret.offset;

    var newNode;

    // all new formulas init with italics
    var tmpStyle = self.caret.node.style.clone();
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
    else if (
      (type === "text") ||
      (type === "superIndex") ||
      (type === "subIndex")
    ) {
      newNode = new richTextEditor.TextNode("", type, tmpStyle);
    }

    else if (type === "dynamicText") {
      newNode = new richTextEditor.TextNode("", type, tmpStyle);
      newNode.decimals = "2";
      newNode.fixed = false;
    }

    else if (type === "fraction") {
      newNode = new richTextEditor.TextNode("", type, tmpStyle);

      var numNode = new richTextEditor.TextNode("", "numerator", tmpStyle);
      var denNode = new richTextEditor.TextNode("", "denominator", tmpStyle);

      newNode.addChild(numNode);
      newNode.addChild(denNode);
    }

    else if (type === "radical") {
      newNode = new richTextEditor.TextNode("", type, tmpStyle);

      var indexNode = new richTextEditor.TextNode("", "index", tmpStyle);
      var radicandNode = new richTextEditor.TextNode("", "radicand", tmpStyle);

      newNode.addChild(indexNode);
      newNode.addChild(radicandNode);
    }

    else if (
      (type === "sum") ||
      (type === "integral") ||
      (type === "limit")
    ) {
      newNode = new richTextEditor.TextNode("", type, tmpStyle);

      var fromNode = new richTextEditor.TextNode("", "from", tmpStyle);
      var toNode = new richTextEditor.TextNode("", "to", tmpStyle);
      var whatNode = new richTextEditor.TextNode("", "what", tmpStyle);

      newNode.addChild(fromNode);
      newNode.addChild(toNode);
      newNode.addChild(whatNode);
    }

    else if (type === "matrix") {
      newNode = new richTextEditor.TextNode("", type, tmpStyle);

      newNode.rows = parseInt(extra.rows);
      if (isNaN(newNode.rows)) {
        newNode.rows = 2;
      }
      newNode.columns = parseInt(extra.cols);
      if (isNaN(newNode.columns)) {
        newNode.columns = 2;
      }

      for (var i=0, l=newNode.rows*newNode.columns; i<l; i++) {
        var elementNode = new richTextEditor.TextNode("", "element", tmpStyle);
        newNode.addChild(elementNode);
      }
    }

    else if (type === "defparts") {
      newNode = new richTextEditor.TextNode("", type, tmpStyle);

      newNode.parts = parseInt(extra.parts);
      if (isNaN(newNode.parts)) {
        newNode.parts = 2;
      }

      for (var i=0, l=newNode.parts; i<l; i++) {
        var elementNode = new richTextEditor.TextNode("", "element", tmpStyle);
        newNode.addChild(elementNode);
      }
    }
    

    // if the new node is not in a formula, create a new formula node
    if ( (!inFormula(self.caret.node)) && (type !== "formula") && (type !== "text")) {
      var formulaNode = new richTextEditor.TextNode("", "formula" , tmpStyle);

      formulaNode.addChild(newNode);
      newNode = formulaNode;
    }

    var leftText = self.caret.node.value.substring(0, offset);
    var rightText = self.caret.node.value.substring(offset);

    self.caret.node.value = leftText;

    var rightNode = new richTextEditor.TextNode(rightText, "text", self.caret.node.style.clone());

    var parent = self.caret.node.parent;
    var tmpChildren = parent.children;
    parent.children = [];
    for (var i=0, l=tmpChildren.length; i<l; i++) {
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
      // add all children diferent to the caret node
      else {
        parent.addChild(tmpChildren[i]);
      }
    }

    parent.normalize();
    newNode.parent.adjustFontSize();

    // update the nodes metrics
    textNodes.update(self.ctx, externalColor);

    var newCaret = newNode.getFirstTextNode();
    self.caret.set(newCaret, 0);
    self.startCaret.set(newCaret, 0);
    self.updateTextfield();
  }

  /**
   * 
   */
  richTextEditor.TextController.prototype.removeSelection = function() {
    var self = this;
    var textNodes = self.textNodes;
    var externalColor = self.externalColor;

    // the selection is in the same node
    if (self.startCaret.node === self.caret.node) {
      var node = self.startCaret.node;
      var startOffset = self.startCaret.offset;
      var endOffset = self.caret.offset;

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
    // the selection is in differents nodes
    else {
      self.allTextNodes = textNodes.querySelectorAll("text");

      var startCaret = self.startCaret;
      var endCaret = self.caret;
      var startIndex = self.allTextNodes.indexOf(self.startCaret.node);
      var endIndex = self.allTextNodes.indexOf(self.caret.node);

      if (startIndex > endIndex) {
        var tmp = startIndex;
        startIndex = endIndex;
        endIndex = tmp;
  
        tmp = startCaret;
        startCaret = endCaret;
        endCaret = tmp;
      }

      // remove the text selected in the start caret
      startCaret.node.value = startCaret.node.value.substring(0, startCaret.offset);

      // remove the text selected in the end caret
      endCaret.node.value = endCaret.node.value.substring(endCaret.offset);

      var parentStart = startCaret.node.parent;
      var parentEnd = endCaret.node.parent;
      var nextLine = parentStart.nextSibling();
      var next;
      var tmpNext;

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

        for (var i=0, l=parentEnd.children.length; i<l; i++) {
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
    var self = this;

    self.textfield.value = self.caret.node.value || String.fromCharCode(65279);
    self.textfield.setSelectionRange(self.caret.offset, self.caret.offset);

    self.textfieldContainer.style.left = (self.caret.getX() + self.caret.offsetLeft) + "px";
    self.textfieldContainer.style.top  = (self.caret.getY() + self.caret.offsetTop +self.caret.getH()/2) + "px";
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

    for (var i=this.textNodes.children.length-1; i>=0; i--) {
      this.textNodes.removeChild(this.textNodes.children[i]);
    }
    for (var i=0, l=nodes.children.length; i<l; i++) {
      this.textNodes.addChild(nodes.children[i]);
    }

    // update the nodes metrics
    this.textNodes.update(this.ctx, this.externalColor);
    this.range.updateSize(this.canvas.width, this.canvas.height);

    var tmpInitNode = this.textNodes.getFirstTextNode();
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
  richTextEditor.TextController.prototype.addMatrixNode = function(rows, cols) {
    this.addNode("matrix", {rows: rows, cols: cols});
    this.textfield.focus();
  }
  richTextEditor.TextController.prototype.addDefpartsNode = function(parts) {
    this.addNode("defparts", {parts: parts});
    this.textfield.focus();
  }


  return richTextEditor;
})(richTextEditor || {});
