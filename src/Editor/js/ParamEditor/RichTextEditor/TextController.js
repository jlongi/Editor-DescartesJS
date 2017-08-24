/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var richTextEditor = (function(richTextEditor) {

  var INTRO_KEY = 13;
  var DELETE_KEY = 46;
  var BACKSPACE_KEY = 8;

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
  richTextEditor.TextController = function(component, defaultStyle, externalColor) {
    this.component = component;
    this.defaultStyle = defaultStyle;
    this.externalColor = externalColor;

    // create dialogs
    this.createDynamicTextNodeDialog();
    this.createMatrixDialog();
    this.createCasesDialog();

    // make the text block editable with the contetneditable attribute
    this.textBlock = component.textArea.querySelector(".TextBlock");
    this.textBlock.setAttribute("contenteditable", "true");
    this.textBlock.setAttribute("spellcheck", "false");

    // make no editable all the nodes with a data-noedit="true" attribute
    var nonEditable = this.textBlock.querySelectorAll("[data-noedit='true']");
    for (var i=0, l=nonEditable.length; i<l; i++) {
      nonEditable[i].setAttribute("contenteditable", "false");
    }

    // adjust the text
    this.correctText();

    // set the focus on the block element
    this.textBlock.focus();
    var selection = window.getSelection();
    var range = selection.getRangeAt(0);
    var start = range.startContainer;

    // the text is empty then add a text node to hold the input text and focus
    if ((start.nodeType !== 3) && (start.getAttribute("class") === "TextLine") && (!start.hasChildNodes())) {
      var newTextNode = document.createElement("span");
      newTextNode.setAttribute("class", "TextNode");
      newTextNode.innerHTML = richTextEditor.narrowSpace;
      this.setDefaultStyle(newTextNode);
      start.appendChild(newTextNode);

      // set the selection
      range.selectNodeContents(newTextNode);
      range.collapse(true);
      selection.removeAllRanges();
      selection.addRange(range);
    }

    this.notifyStyle();

    // copy of the textController object
    var self = this;

    /**
     *
     */
    this.textBlock.addEventListener("copy", function(evt) {
      evt.preventDefault();
      var selection = window.getSelection();
      var range = selection.getRangeAt(0);
      var docFra = range.cloneContents();
      var childNodes = domNodesToArray(docFra.childNodes);

      var tmpDiv = document.createElement("div");
      for (var i=0, l=childNodes.length; i<l; i++) {
        if (childNodes[i].innerHTML !== "") {
          tmpDiv.appendChild(childNodes[i]);
        }
      }

      evt.clipboardData.setData("text/plain", tmpDiv.textContent);
      evt.clipboardData.setData("text/richText", tmpDiv.innerHTML.replace(/\n/g,""));
    });
    /**
     *
     */
    this.textBlock.addEventListener("cut", function(evt) {
      evt.preventDefault();
      var selection = window.getSelection();
      var range = selection.getRangeAt(0);
      var docFra = self.removeSelection(selection, range);
      var childNodes = domNodesToArray(docFra.childNodes);

      var tmpDiv = document.createElement("div");
      for (var i=0, l=childNodes.length; i<l; i++) {
        if (childNodes[i].innerHTML !== "") {
          tmpDiv.appendChild(childNodes[i]);
        }
      }

      evt.clipboardData.setData("text/plain", tmpDiv.textContent);
      evt.clipboardData.setData("text/richText", tmpDiv.innerHTML.replace(/\n/g,""));
    });
    /**
     *
     */
    this.textBlock.addEventListener("paste", function(evt) {
      evt.preventDefault();
      var tmpDiv = document.createElement("div");
      tmpDiv.innerHTML = evt.clipboardData.getData("text/richText") || evt.clipboardData.getData("text/plain").replace(/(\n)+/g, "").replace(/(\r)+/g, "");

      var selection = window.getSelection();
      var range = selection.getRangeAt(0);

      if (!selection.isCollapsed) {
        self.removeSelection(selection, range);
      }

      selection = window.getSelection();
      range = selection.getRangeAt(0);

      ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      // paste text whitout format
      if ((tmpDiv.childNodes.length === 1) && (tmpDiv.firstChild.nodeType === 3)) {
        var startOffset = range.startOffset
        var txt = range.startContainer.textContent;
        range.startContainer.textContent = txt.substring(0, startOffset) + tmpDiv.firstChild.textContent + txt.substring(startOffset);

        range.setStart(range.startContainer, startOffset + tmpDiv.firstChild.textContent.length);
        selection.removeAllRanges();
        selection.addRange(range);
      }
      ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      // a text tree
      else {
        // remove all tbody elements added in the innerHTML of the paste data
        var tbodys = tmpDiv.querySelectorAll("tbody");
        var tmpChild;
        for (var i=0, l=tbodys.length; i<l; i++) {
          tmpChild = domNodesToArray(tbodys[i].childNodes);
          for (var j=0, k=tmpChild.length; j<k; j++) {
            tbodys[i].parentNode.appendChild(tmpChild[j]);
          }
          tbodys[i].parentNode.removeChild(tbodys[i]);
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        // multiple lines copied
        if ( (tmpDiv.firstChild) && (tmpDiv.firstChild.getAttribute) && (tmpDiv.firstChild.getAttribute("class") === "TextLine") ) {
          var tNode = (selection.focusNode.nodeType === 3) ? selection.focusNode.parentNode : selection.focusNode;

          if (inFormulaNode(tNode)) {
            var firstTxt = tNode.textContent.substring(0, range.startOffset);
            var middleTxt = tmpDiv.textContent.replace(new RegExp(richTextEditor.narrowSpace, "g"), "");
            var lastTxt = tNode.textContent.substring(range.startOffset);

            tNode.textContent = firstTxt + middleTxt + lastTxt;

            range.setStart(tNode.firstChild, firstTxt.length+middleTxt.length);
            range.collapse(true);
            selection.removeAllRanges();
            selection.addRange(range);
          }
          else {
            self.addNewLine(selection, range);
            var lastLine = selection.focusNode.parentNode;
            while (lastLine && (lastLine.getAttribute) && (lastLine.getAttribute("class") !== "TextLine")) {
              lastLine = lastLine.parentNode;
            }
            var firstLine = lastLine.previousSibling;

            var firstLinePasteData = tmpDiv.firstChild;
            tmpDiv.removeChild(firstLinePasteData);
            var lastLinePasteData = tmpDiv.lastChild;
            tmpDiv.removeChild(lastLinePasteData);          

            // add elements to the first line
            if ( firstLine && (firstLine.lastChild.getAttribute) && (firstLine.lastChild.getAttribute("class") !== "SeparatorNode") && firstLinePasteData && (firstLinePasteData.firstChild)  && (firstLinePasteData.firstChild.getAttribute)  && (firstLinePasteData.firstChild.getAttribute("class") !== "SeparatorNode") ) {
              firstLine.appendChild(richTextEditor.separatorNode.cloneNode(true));
            }
            var childNodes = domNodesToArray(firstLinePasteData.childNodes);
            for (var i=0, l=childNodes.length; i<l; i++) {
              firstLine.appendChild(childNodes[i]);
            }

            // add elements to the last line
            if ( lastLine && (lastLine.firstChild.getAttribute) && (lastLine.firstChild.getAttribute("class") !== "SeparatorNode") && lastLinePasteData && (lastLinePasteData.lastChild)  && (lastLinePasteData.lastChild.getAttribute)  && (lastLinePasteData.lastChild.getAttribute("class") !== "SeparatorNode") ) {
              lastLinePasteData.appendChild(richTextEditor.separatorNode.cloneNode(true));
            }
            var childNodes = domNodesToArray(lastLinePasteData.childNodes);
            for (var i=0, l=childNodes.length; i<l; i++) {
              lastLine.insertBefore(childNodes[i], lastLine.firstChild);
            }
          }
        }
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        // text in a single line copied
        else {
          var needsFormulaNode = false;
          var docFra = document.createDocumentFragment();
          var childNodes = domNodesToArray(tmpDiv.childNodes);
          var childClass;
          for (var i=0, l=childNodes.length; i<l; i++) {
            childClass = childNodes[i].getAttribute("class") || "";

            if (childClass.match(/DynamicTextNode|FractionNode|SuperIndexNode|SubIndexNode|RadicalNode|SumNode|IntegralNode|LimitNode|MatrixNode|CasesNode/)) {
              needsFormulaNode = true;
            }
            docFra.appendChild(childNodes[i])
          }

          // add missing elemnts and clean extra separators
          docFra.insertBefore(richTextEditor.newFormulaTextNode(richTextEditor.narrowSpace), docFra.firstChild);
          docFra.appendChild(richTextEditor.newFormulaTextNode(richTextEditor.narrowSpace));
          var childNodes = domNodesToArray(docFra.childNodes);
          var next;
          for (var i=0, l=childNodes.length; i<l; i++) {
            next = childNodes[i].nextSibling;

            if ( (next) && (childNodes[i].getAttribute) && (childNodes[i].getAttribute("class") === "SeparatorNode") && (next.getAttribute) && (next.getAttribute("class") === "SeparatorNode") ) {
              docFra.removeChild(childNodes[i]);
            }
          }
          //

          var tNode = (range.startContainer.nodeType === 3) ? range.startContainer.parentNode : range.startContainer;
          // needs a formula node because has formula elements
          if (needsFormulaNode) {
            var focusTextNode = docFra.querySelector(".TextNode");

            // add the content to a TextNode
            if (!inFormulaNode(selection.focusNode)) {
              var style = (tNode.getAttribute("style") || "font-style: italic").replace("font-style: normal", "font-style: italic");
              docFra = richTextEditor.newFormula(style, docFra);
            }

            self.splitTextNode(tNode, docFra, range.startOffset);
            setCaretToNode(selection, range, focusTextNode);

            // correct the caret position
            var container = (range.startContainer.nodeType === 3) ? range.startContainer.parentNode : range.startContainer;
            var prev = container.previousSibling;
            while (prev && (prev.getAttribute) && (prev.getAttribute("class") === "SeparatorNode")) {
              prev = prev.previousSibling;
            }
            if (prev) {
              range.setStart( prev.firstChild || prev, prev.textContent.length );
              range.collapse(true);
              selection.removeAllRanges();
              selection.addRange(range);
              self.correctText();
            }
            // end correct the caret postion
          }
          // do not need a formula node
          else {
            if (inFormulaNode(tNode)) {
              var firstTxt = tNode.textContent.substring(0, range.startOffset);
              var middleTxt = docFra.textContent.replace(new RegExp(richTextEditor.narrowSpace, "g"), "");
              var lastTxt = tNode.textContent.substring(range.startOffset);

              tNode.textContent = firstTxt + middleTxt + lastTxt;

              range.setStart(tNode.firstChild, firstTxt.length+middleTxt.length);
              range.collapse(true);
              selection.removeAllRanges();
              selection.addRange(range);
            }
            else {
              var focusTextNode = docFra.querySelector(".TextNode");
              self.splitTextNode(tNode, docFra, range.startOffset);
              setCaretToNode(selection, range, focusTextNode);

              // correct the caret position
              var container = (range.startContainer.nodeType === 3) ? range.startContainer.parentNode : range.startContainer;
              var prev = container.previousSibling;
              while (prev && (prev.getAttribute) && (prev.getAttribute("class") === "SeparatorNode")) {
                prev = prev.previousSibling;
              }
              if (prev) {
                range.setStart( prev.firstChild || prev, prev.textContent.length );
                range.collapse(true);
                selection.removeAllRanges();
                selection.addRange(range);
                self.correctText();
              }
              // end correct the caret postion
            }
          }
        }
      }
    });

    /**
     *
     */
    this.textBlock.addEventListener("mousedown", function(evt) {
      evt.preventDefault();

      self.mousepressed = true;
      self.firstMove = true;

      var selection = window.getSelection();
      var tmpRange = document.caretRangeFromPoint(evt.clientX, evt.clientY);
      selection.removeAllRanges();
      selection.addRange(tmpRange);
      self.fixMouseSelection(selection, tmpRange);

      self.startSelection = tmpRange.startContainer;
      if (self.startSelection.nodeType === 3) {
        self.startSelection = self.startSelection.parentNode;
      }

      self.notifyStyle();
    });

    /**
     *
     */
    this.textBlock.addEventListener("dblclick", function(evt) {
      if ( (evt.target.getAttribute) && (evt.target.getAttribute("class")) && (evt.target.getAttribute("class") === "DynamicTextNode") ) {
        self.showDynamicTextNodeDialog(evt.target);
      }
    });

    /**
     *
     */
    document.addEventListener("mouseup", function(evt) {
      self.mousepressed = false;
      self.firstMove = false;
    });

    /**
     * 
     */
    this.textBlock.addEventListener("mousemove", function(evt) {
     evt.preventDefault();

      if (self.mousepressed) {
        var selection = window.getSelection();
        var range = selection.getRangeAt(0);

        var tmpFocus = self.startSelection;
        if (tmpFocus.nodeType === 3) {
          tmpFocus = tmpFocus.parentNode;
        }

        // mouse over the same TextBlock
        if (tmpFocus === evt.target) {
          var tmpRange = document.caretRangeFromPoint(evt.clientX, evt.clientY);
          selection.extend(tmpRange.startContainer, tmpRange.startOffset);
        }
        //
        else {
          var container = self.startSelection.parentNode;
          var siblings;

          // get all the siblings
          if ( (container.getAttribute) && (container.getAttribute("class") && (container.getAttribute("class") === "TextLine")) ) {
            siblings = [];
            var textLines = self.textBlock.querySelectorAll(".TextLine");
            for (var i=0, l=textLines.length; i<l; i++) {
              siblings = siblings.concat(domNodesToArray(textLines[i].childNodes));
            }
          }
          else {
            siblings = container.childNodes;
          }

          // iterate over all the siblings to find the node
          for (var i=0, l=siblings.length; i<l; i++) {
            if (siblings[i].contains(evt.target)) {
              if ( (siblings[i].getAttribute) && (siblings[i].getAttribute("class") && (siblings[i].getAttribute("class") === "TextNode")) ) {
                var tmpRange = document.caretRangeFromPoint(evt.clientX, evt.clientY);
                selection.extend(tmpRange.startContainer, tmpRange.startOffset);
              }
              else {
                selection.extend(siblings[i], siblings[i].childNodes.length);
              }
              break;
            }
          } // end for
        }
      }
    });

    /**
     *
     */
    function isContain(nodes, child) {
      if ((nodes) && (child)) {
        while (child) {
          if (nodes === child) {
            return true;
          }
          child = child.parentNode;
        }
        return false;
      }
      return false;
    }

    /**
     *
     */
    this.textBlock.addEventListener("keydown", function(evt) {
      var key = evt.keyCode;
      var char = String.fromCharCode(evt.keyCode || evt.charCode);
      var selection = window.getSelection();
      var range = selection.getRangeAt(0);

      self.control = false;

      var ctrlkey = (evt.ctrlKey || evt.metaKey);
      var shiftKey = evt.shiftKey;

      // prevent the original functionality for control events 
      // if (ctrlkey) {
      //   evt.preventDefault();
      //   evt.stopPropagation();
      // }

      // ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      // // paste
      // if (ctrlkey && (char === "V")) {
      //   // evt.preventDefault();
      // }
      // ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      // // copy
      // else if (ctrlkey && (char === "C")) {
      //   // evt.preventDefault();
      // }
      // ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      // // cut
      // else if (ctrlkey && (char === "X")) {
      //   evt.preventDefault();
      // }
      ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      // bold
      if (ctrlkey && (char === "B")) {
        evt.preventDefault();
        self.changeStyleProp({ name:"font-weight", value:"bold" });
      }
      // ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      // italic
      else if (ctrlkey && (char === "Y")) {
        evt.preventDefault();
        self.changeStyleProp({ name:"font-style", value:"italic" });
      }
      ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      // underline
      else if (ctrlkey && (char === "U")) {
        evt.preventDefault();
        self.changeStyleProp({ name:"text-decoration", value:"underline" });
      }
      // ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      // // overline
      // else if (ctrlkey && (char === "O")) {
      //   evt.preventDefault();
      //   self.changeStyleProp({ name:"text-decoration", value:"overline" });
      // }
      ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      // add formula or fraction
      else if (ctrlkey && (char === "F")) {
        evt.preventDefault();
        self.addFormulaOrFraction();
      }
      ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      // special case to add a fraction
      if (ctrlkey && ((char === "/") || (char === "7")) ) {
        evt.preventDefault();
        self.addFraction();
      }
      ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      // add super index
      else if (ctrlkey && (key === UP_KEY)) {
        evt.preventDefault();
        self.addSuperIndex();
      }
      ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      // add sub index
      else if (ctrlkey && (key === DOWN_KEY)) {
        evt.preventDefault();
        self.addSubIndexNode();
      }
      ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      // add radical
      else if (ctrlkey && (char === "R")) {
        evt.preventDefault();
        self.addRadicalNode();
      }
      ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      // add sum
      else if (ctrlkey && (char === "S")) {
        evt.preventDefault();
        self.addSumNode();
      }
      ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      // add integral
      else if (ctrlkey && (char === "I")) {
        evt.preventDefault();
        self.addIntegralNode();
      }
      ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      // add limit
      else if (ctrlkey && (char === "L")) {
        evt.preventDefault();
        self.addLimitNode();
      }
      ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      // add expression
      else if (ctrlkey && (char === "E")) {
        evt.preventDefault();
        self.addDynamicTextNode();
      }
      ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      // add matrix
      else if (ctrlkey && (char === "M")) {
        evt.preventDefault();
        self.showMatrixDialog();
      }

      ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      else if (key === INTRO_KEY) {
        evt.preventDefault();
        self.addNewLine(selection, range);
      }
      ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      else if (key === DELETE_KEY) {
        if (selection.isCollapsed) {
          self.delete(selection, range, evt);
        }
        else {
          evt.preventDefault();
          self.removeSelection(selection, range);
        }
      }
      ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      else if (key === BACKSPACE_KEY) {
        if (selection.isCollapsed) {
          self.backspace(selection, range, evt);
        }
        else {
          evt.preventDefault();
          self.removeSelection(selection, range);
        }
      }
      ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      else if (key === INIT_KEY) {
        evt.preventDefault();
        // get the current text line of the cursor
        var textLine = range.startContainer.parentNode;
        while ((textLine.getAttribute) && (textLine.getAttribute("class") !== "TextLine")) {
          textLine = textLine.parentNode;
        }

        var textNodes = textLine.querySelectorAll(".TextNode");
        textNodes = domNodesToArray(textNodes);
        if (textNodes.length !== 0) {
          // set the selection
          range.selectNodeContents(textNodes[0]);
          range.collapse(true);
          selection.removeAllRanges();
          selection.addRange(range);
        }
      }
      ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      else if (key === END_KEY) {
        evt.preventDefault();
        // get the current text line of the cursor
        var textLine = range.startContainer.parentNode;
        while ((textLine.getAttribute) && (textLine.getAttribute("class") !== "TextLine")) {
          textLine = textLine.parentNode;
        }

        var textNodes = textLine.querySelectorAll(".TextNode");
        textNodes = domNodesToArray(textNodes);
        if (textNodes.length !== 0) {
          // set the selection
          var tmpTextNode = textNodes[textNodes.length-1];
          range.setStart(tmpTextNode.firstChild, tmpTextNode.textContent.length);
          range.collapse(true);
          selection.removeAllRanges();
          selection.addRange(range);
        }
      }
      ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      else if (key === LEFT_KEY) {
        if (shiftKey) {
          self.moveLeftShift(selection, range, evt);
        }
        else {
          self.moveLeft(selection, range, evt);
        }
      }
      ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      else if (key === RIGHT_KEY) {
        if (shiftKey) {
          self.moveRightShift(selection, range, evt);
        }
        else {
          self.moveRight(selection, range, evt);
        }
      }
      ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      else if (!ctrlkey && (key === UP_KEY)) {
        if (shiftKey) {
          evt.preventDefault()
        }
        else {
          if (inFormulaNode(selection.focusNode)) {
            self.moveUp(selection, range, evt);
          }
        }
      }
      ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      else if (!ctrlkey && (key === DOWN_KEY)) {
        if (shiftKey) {
          evt.preventDefault()
        }
        else {
          if (inFormulaNode(selection.focusNode)) {
            self.moveDown(selection, range, evt);
          }
        }
      }

// console.log(key, evt.ctrlKey, char)
    });

    /**
     *
     */
    this.textBlock.addEventListener("keypress", function(evt) {
      var char = String.fromCharCode(evt.keyCode || evt.charCode);

      var selection = window.getSelection();
      var range = selection.getRangeAt(0);

      // initial condition when the TextLine node is empty
      if (range.startContainer.nodeType !== 3) {
        evt.preventDefault();

        var container = range.startContainer;

        // remove narrow spaces
        if (container.textContent === richTextEditor.narrowSpace) {
          container.removeAttribute("data-remove");

          var tmpNode = container.nextSibling;
          if (tmpNode) {
            tmpNode.removeAttribute("data-remove");
          }
          else {
            tmpNode = container.previousSibling;
            if (tmpNode) {
              tmpNode.removeAttribute("data-remove");
            }
          }

          container.textContent = "";
        }

        if ( (container.getAttribute) && (container.getAttribute("class")) && (container.getAttribute("class").match("TextNode")) ) {
          var newTextNode = document.createTextNode(char);
          range.insertNode(newTextNode);
          container.normalize();
        }
        else {
          console.log(range.startContainer, range)
        }

        // set the caret
        range.setStart(newTextNode, 1);
        range.collapse(true);
        selection.removeAllRanges();
        selection.addRange(range);
      }
      else {
        if (!selection.isCollapsed) {
          self.removeSelection(selection, range)
        }

        // remove narrow spaces
        if (range.startContainer.textContent === richTextEditor.narrowSpace) {
          evt.preventDefault();
          range.startContainer.textContent = char;

          // set the caret
          range.setStart(range.startContainer, 1);
          range.collapse(true);
          selection.removeAllRanges();
          selection.addRange(range);

          // clean marked elements
          var container = range.startContainer;
          if (container.nodeType === 3) {
            container = container.parentNode;
          }
          container.removeAttribute("data-remove");

          var tmpNode = container.previousSibling;
          if (tmpNode) {
            tmpNode.removeAttribute("data-remove");
          }
          else {
            tmpNode = container.nextSibling;
            if (tmpNode) {
              tmpNode.removeAttribute("data-remove");
            }
          }

          removeMarkedElements(self.textBlock);
        }
      }
    });

  }


  /**
   *
   */
  richTextEditor.TextController.prototype.changeFontSize = function(fontSize) {
    this.changeStyleProp({ name:"font-size", value:fontSize+"px" });
    this.changeStyleProp({ name:"line-height", value:fontSize+"px" });
    richTextEditor.adjustFormulaFontSize(this.textBlock);
    richTextEditor.adjustHeight(this.textBlock);
  }

  /**
   *
   */
  richTextEditor.TextController.prototype.changeFontFamily = function(fontFamily) {
    if (fontFamily === "SansSerif") {
      fontFamily = "Arial, Helvetica, sans-serif";
    }
    else if (fontFamily === "Serif") {
      fontFamily = "'Times New Roman', Times, serif";
    }
    else if (fontFamily === "Monospaced") {
      fontFamily = "'Courier New', Courier, monospace";
    }

    this.changeStyleProp({ name:"font-family", value:fontFamily });
    richTextEditor.adjustFormulaFontSize(this.textBlock);
    richTextEditor.adjustHeight(this.textBlock);
  }


  /**
   *
   */
  richTextEditor.TextController.prototype.changeStyleProp = function(style) {
    var selection = window.getSelection();
    var range = selection.getRangeAt(0);
    var antCollapsed = range.collapsed;

//console.log(style.name === "color")

    var commonAncestor = range.commonAncestorContainer;
// console.log(commonAncestor);
    //////////////////////////////////////////////////////////////////////////////////////////
    // commonAncestor is a text node, then the selection is in the same node
    if (commonAncestor.nodeType === 3) {
      var formulaNode = inFormulaNode(range.startContainer) || inFormulaNode(range.endContainer);

      // inside a formula node the style apply only to the formula
      if (formulaNode) {
        style = getCurrentStyle(formulaNode, style)
        formulaNode.style[style.name] = style.value;
        selection.removeAllRanges();
        selection.addRange(range);
      }
      // outside a formula split the text and add the pieces to the text line
      else {
        commonAncestor = commonAncestor.parentNode;
        style = getCurrentStyle(commonAncestor, style);

        var docFra = document.createDocumentFragment();

        var txtContent = commonAncestor.textContent;
        var initTxt = txtContent.substring(0, range.startOffset)
        var middleTxt = txtContent.substring(range.startOffset, range.endOffset);
        var endTxt = txtContent.substring(range.endOffset);

        var initNode = commonAncestor.cloneNode(true);
        initNode.textContent = initTxt;

        var middleNode = commonAncestor.cloneNode(true);
        middleNode.style[style.name] = style.value;
        middleNode.textContent = middleTxt || richTextEditor.narrowSpace;
        var narrowSpaceNode = richTextEditor.separatorNode.cloneNode(true);
        narrowSpaceNode.style[style.name] = style.value;
        
        var endNode = commonAncestor.cloneNode(true);
        endNode.textContent = endTxt;

        if (initTxt) {
          docFra.appendChild(initNode);
          docFra.appendChild(richTextEditor.separatorNode.cloneNode(true));
        }
        docFra.appendChild(middleNode);
        if (endTxt) {
          docFra.appendChild(narrowSpaceNode);
          docFra.appendChild(endNode);
        }

        commonAncestor.parentNode.replaceChild(docFra, commonAncestor);

        // mark the new node for removal if don't enter text
        removeMarkedElements(this.textBlock);
        if (middleNode.textContent === richTextEditor.narrowSpace) {
          middleNode.setAttribute("data-remove", "true");
          narrowSpaceNode.setAttribute("data-remove", "true");
        }

        // set the range to the new added node
        range.selectNodeContents(middleNode);
        if (antCollapsed) {
          range.collapse(true);
        }
        selection.removeAllRanges();
        selection.addRange(range);
      }
    }
    //////////////////////////////////////////////////////////////////////////////////////////
    else if (commonAncestor.getAttribute("class") === "TextNode") {
      style = getCurrentStyle(commonAncestor, style);
      commonAncestor.style[style.name] = style.value;
    }
    //////////////////////////////////////////////////////////////////////////////////////////
    else if (commonAncestor.getAttribute("class") === "TextLine") {
      var oldContainer;
      var oldOffset;

      if (inFormulaNode(range.startContainer)) {
        oldContainer = range.endContainer;
        oldOffset = range.endOffset;
        range.selectNode(range.startContainer);
        range.setEnd(oldContainer, oldOffset);
      }
      if (inFormulaNode(range.endContainer)) {
        oldContainer = range.startContainer;
        oldOffset = range.startOffset;
        range.selectNode(range.endContainer);
        range.setStart(oldContainer, oldOffset);
      }
      var docFra = range.extractContents();
      selection.collapseToStart();

      var childNodes = domNodesToArray(docFra.childNodes);
      style = getCurrentStyle(docFra.firstChild, style);

      // remove empty elements
      for (var i=0, l=childNodes.length; i<l; i++) {
        if (childNodes[i].textContent === "") {
          docFra.removeChild(childNodes[i]);
        }
      }

      // add a narrowSpaceNode to the init of the selection
      if ( (!inFormulaNode(docFra.firstChild)) && (docFra.firstChild.innerHTML !== richTextEditor.narrowSpace) && (!docFra.firstChild.getAttribute(["data-noedit"])) ) {
        var initNarrowSpace = richTextEditor.separatorNode.cloneNode(true);
        docFra.insertBefore(initNarrowSpace, docFra.firstChild);
      }
      // add a narrowSpaceNode to the end of the selection
      if ( (!inFormulaNode(docFra.lastChild)) && (docFra.lastChild.innerHTML !== richTextEditor.narrowSpace) && (!docFra.lastChild.getAttribute(["data-noedit"])) ) {
        var endNarrowSpace = richTextEditor.separatorNode.cloneNode(true);
        docFra.appendChild(endNarrowSpace);
      }

      // set the style to the children
      childNodes = domNodesToArray(docFra.childNodes);
      for (var i=0, l=childNodes.length; i<l; i++) {
        childNodes[i].style[style.name] = style.value;
      }

      range.insertNode(docFra);
      selection.removeAllRanges();
      selection.addRange(range);
    }
    //////////////////////////////////////////////////////////////////////////////////////////
    else if (commonAncestor.getAttribute("class") === "TextBlock") {
      // get the TextLine nodes 
      var firstParentNode = range.startContainer.parentNode;
      while ((firstParentNode.getAttribute) && (firstParentNode.getAttribute("class")) && (firstParentNode.getAttribute("class") !== "TextLine")) {
        firstParentNode = firstParentNode.parentNode;
      }
      var lastParentNode = range.endContainer.parentNode;
      while ((lastParentNode.getAttribute) && (lastParentNode.getAttribute("class")) && (lastParentNode.getAttribute("class") !== "TextLine")) {
        lastParentNode = lastParentNode.parentNode;
      }

      var docFra = range.extractContents();
      var firstNode = docFra.removeChild(docFra.firstChild);
      var lastNode = docFra.removeChild(docFra.lastChild);

      style = getCurrentStyle(firstNode.firstChild, style);

      // clean firsParentNode
      var childNodes = domNodesToArray(firstParentNode.childNodes);
      for (var i=0, l=childNodes.length; i<l; i++) {
        if (childNodes[i].textContent === "") {
          firstParentNode.removeChild(childNodes[i]);
        }
      }
      // clean lastParentNode
      var childNodes = domNodesToArray(lastParentNode.childNodes);
      for (var i=0, l=childNodes.length; i<l; i++) {
        if (childNodes[i].textContent === "") {
          lastParentNode.removeChild(childNodes[i]);
        }
      }

      var startContainer;
      if ( (firstParentNode.lastChild) && (!firstParentNode.lastChild.getAttribute("data-noedit")) && (firstParentNode.lastChild.innerHTML !== richTextEditor.narrowSpace) ) {
        firstParentNode.appendChild(richTextEditor.separatorNode.cloneNode(true));
      }
      var childNodes = domNodesToArray(firstNode.childNodes);
      for (var i=0, l=childNodes.length; i<l; i++) {
        if (childNodes[i].textContent !== "") {
          childNodes[i].style[style.name] = style.value;
          firstParentNode.appendChild(childNodes[i]);
          if ((!startContainer) && (!childNodes[i].getAttribute("data-noedit")) && (childNodes[i].innerHTML !== richTextEditor.narrowSpace)) {
            startContainer = childNodes[i];
          }
        }
      }

      // change the style to the nodes in the docFra
      childNodes = domNodesToArray(docFra.childNodes);
      for (var i=0, l=childNodes.length; i<l; i++) {
        for (var j=0, k=childNodes[i].childNodes.length; j<k; j++) {
          childNodes[i].childNodes[j].style[style.name] = style.value;
        }
      }

      var endContainer;
      if ( (lastParentNode.firstChild) && (!lastParentNode.firstChild.getAttribute("data-noedit")) && (lastParentNode.firstChild.innerHTML !== richTextEditor.narrowSpace) ) {
        lastParentNode.insertBefore(richTextEditor.separatorNode.cloneNode(true), lastParentNode.firstChild);
      }
      childNodes = domNodesToArray(lastNode.childNodes);
      for (var i=0, l=childNodes.length; i<l; i++) {
        if (childNodes[i].textContent !== "") {
          childNodes[l-i-1].style[style.name] = style.value;
          lastParentNode.insertBefore(childNodes[l-i-1], lastParentNode.firstChild);

          endContainer = childNodes[i];
        }
      }

      range.insertNode(docFra);


      range.setStart(startContainer, 0);
      range.setEnd(endContainer, endContainer.childNodes.length);
      selection.removeAllRanges();
      selection.addRange(range);
    }

    this.notifyStyle();
  }

  /**
   *
   */
  function setCaretToNode(selection, range, node) {
    range.selectNodeContents( node.firstChild || node );
    range.collapse(true);
    selection.removeAllRanges();
    selection.addRange(range);
  }

  /**
   *
   */
  richTextEditor.TextController.prototype.correctText = function() {
    cleanEmptyText(this.textBlock);
    addSeparators(this.textBlock);
    richTextEditor.adjustFormulaFontSize(this.textBlock);
    richTextEditor.adjustHeight(this.textBlock);
  }

  /**
   *
   */
  richTextEditor.TextController.prototype.addFormulaOrFraction = function() {
    var selection = window.getSelection();
    var range = selection.getRangeAt(0);

    if (!selection.isCollapsed) {
      this.removeSelection(selection, range);
    }

    var formula = inFormulaNode(range.startContainer);
    var focusTextNode;

    if (!formula) {
      focusTextNode = this.addFormula();
      // focus the formula
      setCaretToNode(selection, range, focusTextNode);

      // adjust the font size and vertical aligment of the elements in the text
      this.correctText();
    }
    else {
      this.addFraction();
    }
  }

  /**
   *
   */
  richTextEditor.TextController.prototype.addFormulaAsNeeded = function(selection, range) {
    if (!selection.isCollapsed) {
      this.removeSelection(selection, range);
    }

    var formula = inFormulaNode(range.startContainer);
    var focusTextNode;

    if (!formula) {
      focusTextNode = this.addFormula();
      setCaretToNode(selection, range, focusTextNode);
    }
  }

  /**
   *
   */
  richTextEditor.TextController.prototype.addFormula = function() {
    var selection = window.getSelection();
    var range = selection.getRangeAt(0);

    if (!inFormulaNode(range.startContainer)) {
      var tNode = (range.startContainer.nodeType === 3) ? range.startContainer.parentNode : range.startContainer;

      var formulaChildren = richTextEditor.newFormulaTextNode(richTextEditor.narrowSpace);
      var focusTextNode = formulaChildren.querySelector(".TextNode");
      var style = (tNode.getAttribute("style") || "font-style: italic").replace("font-style: normal", "font-style: italic");
      var formula = richTextEditor.newFormula(style, formulaChildren);

      this.splitTextNode(tNode, formula, range.startOffset);

      setCaretToNode(selection, range, focusTextNode);

      return focusTextNode;
    }
    return null;
  }

  /**
   *
   */
  richTextEditor.TextController.prototype.addSubIndexNode = function() {
    var selection = window.getSelection();
    var range = selection.getRangeAt(0);

    this.addFormulaAsNeeded(selection, range);

    var indexNode = richTextEditor.newFormulaTextNode(richTextEditor.narrowSpace);
    var focusTextNode = indexNode.querySelector(".TextNode");
    var subIndexNode = richTextEditor.newSubIndexNode(indexNode);

    var tNode = range.startContainer.parentNode;
    this.splitTextNode(tNode, subIndexNode, range.startOffset);

    setCaretToNode(selection, range, focusTextNode);

    // adjust the font size and vertical aligment of the elements in the text
    this.correctText();
  }

  /**
   *
   */
  richTextEditor.TextController.prototype.addSuperIndex = function() {
    var selection = window.getSelection();
    var range = selection.getRangeAt(0);

    this.addFormulaAsNeeded(selection, range);

    var indexNode = richTextEditor.newFormulaTextNode(richTextEditor.narrowSpace);
    var focusTextNode = indexNode.querySelector(".TextNode");
    var superIndexNode = richTextEditor.newSuperIndexNode(indexNode);

    var tNode = range.startContainer.parentNode;
    this.splitTextNode(tNode, superIndexNode, range.startOffset);

    setCaretToNode(selection, range, focusTextNode);

    // adjust the font size and vertical aligment of the elements in the text
    this.correctText();
  }

  /**
   *
   */
  richTextEditor.TextController.prototype.addFraction = function() {
    var selection = window.getSelection();
    var range = selection.getRangeAt(0);

    this.addFormulaAsNeeded(selection, range);

    var numNode = richTextEditor.newFormulaTextNode(richTextEditor.narrowSpace);
    var denNode = richTextEditor.newFormulaTextNode(richTextEditor.narrowSpace);
    var focusTextNode = numNode.querySelector(".TextNode");
    var fractionNode = richTextEditor.newFractionNode(numNode, denNode);

    var tNode = range.startContainer.parentNode;
    this.splitTextNode(tNode, fractionNode, range.startOffset);

    setCaretToNode(selection, range, focusTextNode);

    // adjust the font size and vertical aligment of the elements in the text
    this.correctText();
  }

  /**
   *
   */
  richTextEditor.TextController.prototype.addRadicalNode = function() {
    var selection = window.getSelection();
    var range = selection.getRangeAt(0);

    this.addFormulaAsNeeded(selection, range);

    var indexNode = richTextEditor.newFormulaTextNode(richTextEditor.narrowSpace);
    var radicandNode = richTextEditor.newFormulaTextNode(richTextEditor.narrowSpace);
    var focusTextNode = indexNode.querySelector(".TextNode");
    var radicalNode = richTextEditor.newRadicalNode(indexNode, radicandNode);

    var tNode = range.startContainer.parentNode;
    this.splitTextNode(tNode, radicalNode, range.startOffset);

    setCaretToNode(selection, range, focusTextNode);

    // adjust the font size and vertical aligment of the elements in the text
    this.correctText();
  }

  /**
   *
   */
  richTextEditor.TextController.prototype.addSumNode = function() {
    var selection = window.getSelection();
    var range = selection.getRangeAt(0);

    this.addFormulaAsNeeded(selection, range);

    var toNode = richTextEditor.newFormulaTextNode(richTextEditor.narrowSpace);
    var fromNode = richTextEditor.newFormulaTextNode(richTextEditor.narrowSpace);
    var whatNode = richTextEditor.newFormulaTextNode(richTextEditor.narrowSpace);
    var focusTextNode = fromNode.querySelector(".TextNode");
    var sumNode = richTextEditor.newSumNode(toNode, fromNode, whatNode);

    var tNode = range.startContainer.parentNode;
    this.splitTextNode(tNode, sumNode, range.startOffset);

    setCaretToNode(selection, range, focusTextNode);

    // adjust the font size and vertical aligment of the elements in the text
    this.correctText();
  }

  /**
   *
   */
  richTextEditor.TextController.prototype.addIntegralNode = function() {
    var selection = window.getSelection();
    var range = selection.getRangeAt(0);

    this.addFormulaAsNeeded(selection, range);

    var toNode = richTextEditor.newFormulaTextNode(richTextEditor.narrowSpace);
    var fromNode = richTextEditor.newFormulaTextNode(richTextEditor.narrowSpace);
    var whatNode = richTextEditor.newFormulaTextNode(richTextEditor.narrowSpace);
    var focusTextNode = fromNode.querySelector(".TextNode");
    var sumNode = richTextEditor.newIntegralNode(toNode, fromNode, whatNode);

    var tNode = range.startContainer.parentNode;
    this.splitTextNode(tNode, sumNode, range.startOffset);

    setCaretToNode(selection, range, focusTextNode);

    // adjust the font size and vertical aligment of the elements in the text
    this.correctText();
  }

  /**
   *
   */
  richTextEditor.TextController.prototype.addLimitNode = function() {
    var selection = window.getSelection();
    var range = selection.getRangeAt(0);

    this.addFormulaAsNeeded(selection, range);

    var toNode = richTextEditor.newFormulaTextNode(richTextEditor.narrowSpace);
    var fromNode = richTextEditor.newFormulaTextNode(richTextEditor.narrowSpace);
    var whatNode = richTextEditor.newFormulaTextNode(richTextEditor.narrowSpace);
    var focusTextNode = fromNode.querySelector(".TextNode");
    var limitNode = richTextEditor.newLimitNode(toNode, fromNode, whatNode);

    var tNode = range.startContainer.parentNode;
    this.splitTextNode(tNode, limitNode, range.startOffset);

    setCaretToNode(selection, range, focusTextNode);

    // adjust the font size and vertical aligment of the elements in the text
    this.correctText();
  }

  /**
   *
   */
  richTextEditor.TextController.prototype.addDynamicTextNode = function() {
    var selection = window.getSelection();
    var range = selection.getRangeAt(0);

    this.addFormulaAsNeeded(selection, range);

    var expr = richTextEditor.newDynamicTextNode({ value: "1", fixed: "false", decimals: 2 });
    var focusTextNode = expr.querySelector(".TextNode");

    var tNode = range.startContainer.parentNode;
    this.splitTextNode(tNode, expr, range.startOffset);

    setCaretToNode(selection, range, focusTextNode);

    // adjust the font size and vertical aligment of the elements in the text
    this.correctText();
  }

  /**
   *
   */
  richTextEditor.TextController.prototype.addMatrixNode = function() {
    var selection = window.getSelection();
    var range = selection.getRangeAt(0);

    this.addFormulaAsNeeded(selection, range);

    var rows = this.matrix_rows;
    var columns = this.matrix_columns;
    var children = [];
    
    for (var ci=0; ci<rows; ci++) {
      for (var cj=0; cj<columns; cj++) {
        children.push( richTextEditor.newFormulaTextNode(richTextEditor.narrowSpace) );
      }
    }

    var matrix = richTextEditor.newMatrixNode(rows, columns, children);
    var focusTextNode = matrix.querySelector(".TextNode");

    var tNode = range.startContainer.parentNode;
    this.splitTextNode(tNode, matrix, range.startOffset);

    setCaretToNode(selection, range, focusTextNode);

    // adjust the font size and vertical aligment of the elements in the text
    this.correctText();
  }
  
  /**
   *
   */
  richTextEditor.TextController.prototype.addCasesNode = function() {
    var selection = window.getSelection();
    var range = selection.getRangeAt(0);

    this.addFormulaAsNeeded(selection, range);

    var parts = this.cases_parts;
    var children = [];
    
    for (var ci=0; ci<parts; ci++) {
      children.push( richTextEditor.newFormulaTextNode(richTextEditor.narrowSpace) );
    }

    var cases = richTextEditor.newCasesElementNode(parts, children);
    var focusTextNode = cases.querySelector(".TextNode");

    var tNode = range.startContainer.parentNode;
    this.splitTextNode(tNode, cases, range.startOffset);

    setCaretToNode(selection, range, focusTextNode);

    // adjust the font size and vertical aligment of the elements in the text
    this.correctText();
  }
  
  /**
   *
   */
  richTextEditor.TextController.prototype.addNewLine = function(selection, range) {
    var initialRange = range.cloneRange();
    initialRange.collapse(true);

    if (!selection.isCollapsed) {
      this.removeSelection(selection, range)

      selection.removeAllRanges();
      selection.addRange(initialRange);
      range = selection.getRangeAt(0);
    }

    if (!inFormulaNode(range.startContainer)) {
      // get the parent TextLine
      var textLine = range.startContainer.parentNode;
      while ((textLine.getAttribute) && (textLine.getAttribute("class") !== "TextLine")) {
        textLine = textLine.parentNode;
      }

      // last node in a TextLine
      var last = textLine.lastChild;
      while (last.hasChildNodes()) {
        last = last.lastChild;
      }

      // select the content from the caret to the end of the line and extract the contetn
      selection.extend(last, last.textContent.length)
      range = selection.getRangeAt(0);
      var docFra = range.extractContents();

      // clean the last child of the TextLine
      var tmpLast = textLine.lastChild;
      if (tmpLast.innerHTML === "") {
        if (tmpLast.childNodes.length === 1) {
          tmpLast.innerHTML = richTextEditor.narrowSpace;
        }
        else {
          textLine.removeChild(tmpLast);
        }
      }

      var tmpTextLine;

      // prepare the new text line
      // if the extracted part has none or one node, then populate the tmpTextLine
      if (docFra.childNodes.length < 2) {
        var tmpTextNode = last.parentNode.cloneNode();
        tmpTextNode.innerHTML = (docFra.hasChildNodes()) ? docFra.firstChild.textContent : richTextEditor.narrowSpace;
        tmpTextLine = textLine.cloneNode();
        tmpTextLine.appendChild(tmpTextNode);
      }
      else {
        // remove the vestiges of the selection
        if (docFra.firstChild.innerHTML === "") {
          docFra.removeChild(docFra.firstChild);
        }
        if ((docFra.firstChild.getAttribute) && (docFra.firstChild.getAttribute("data-noedit")) && (docFra.firstChild.innerHTML === richTextEditor.narrowSpace)) {
          docFra.removeChild(docFra.firstChild);
        }
        if (docFra.lastChild.innerHTML === "") {
          docFra.removeChild(docFra.lastChild);
        }
        tmpTextLine = textLine.cloneNode();
        tmpTextLine.appendChild(docFra); 
      }

      textLine.parentNode.insertBefore(tmpTextLine, textLine);
      textLine.parentNode.insertBefore(textLine, tmpTextLine);

      var tmpFirst = tmpTextLine.firstChild
      while (tmpFirst.hasChildNodes()) {
        tmpFirst = tmpFirst.firstChild;
      }

      range.setStart(tmpFirst, 0);
      range.collapse(true);
      selection.removeAllRanges();
      selection.addRange(range);
    }
  }

  /**
   *
   */
  richTextEditor.TextController.prototype.splitTextNode = function(tNode, middleNode, pos) {
    var txtContent = tNode.textContent;

    var initNode = tNode.cloneNode(true);
    initNode.textContent = txtContent.substring(0, pos) || richTextEditor.narrowSpace;
    var narrowSpace = richTextEditor.separatorNode.cloneNode(true);
    narrowSpace.setAttribute("style", tNode.getAttribute("style"));
    var lastNode = tNode.cloneNode(true);
    lastNode.textContent = txtContent.substring(pos) || richTextEditor.narrowSpace;

    var docFra = document.createDocumentFragment();
    docFra.appendChild(initNode);
    docFra.appendChild(narrowSpace);
    docFra.appendChild(middleNode);
    docFra.appendChild(lastNode);

    tNode.parentNode.replaceChild(docFra, tNode);
  }

  /**
   *
   */
  richTextEditor.TextController.prototype.notifyStyle = function() {
    var selection = window.getSelection();
    var range = selection.getRangeAt(0);

    var container = range.startContainer;
    if (container) {
      if (container.nodeType === 3) {
        container = container.parentNode;
      }
      else {
        container = range.startContainer.childNodes[range.startOffset];
        if (container.nodeType === 3) {
          container = container.parentNode;
        }
      }
      container = inFormulaNode(container) || container;


      var propStyle = ["font-family", "font-size", "font-style", "font-weight", "text-decoration", "color"];
      var style = {};
      for (var i=0, l=propStyle.length; i<l; i++) {
        style[propStyle[i]] = container.style[propStyle[i]];
      }

      this.textBlock.parentNode.dispatchEvent(new CustomEvent("rft_change", { "detail": style }));
    }
  }

  /**
   *
   */
  richTextEditor.TextController.prototype.moveLeft = function(selection, range, evt) {
    if ( ((selection.focusNode.nodeType === 3) && (selection.focusOffset === 0)) ||
         (selection.focusNode.textContent === richTextEditor.narrowSpace) ) {

      this.moveUp(selection, range, evt);
    }
  }

  /**
   *
   */
  richTextEditor.TextController.prototype.moveRight = function(selection, range, evt) {
    if ( ((selection.focusNode.nodeType === 3) && (selection.focusOffset === selection.focusNode.length)) ||
         (selection.focusNode.textContent === richTextEditor.narrowSpace) ) {

      this.moveDown(selection, range, evt);
    }
  }

  /**
   *
   */
  richTextEditor.TextController.prototype.moveLeftShift = function(selection, range, evt) {
    if ( (selection.focusNode.nodeType !== 3) || ((selection.focusNode.nodeType === 3) && (selection.focusOffset <= 1)) ) {
      evt.preventDefault();

      // get the container
      var container = (selection.focusNode.nodeType === 3) ? selection.focusNode.parentNode : selection.focusNode;
      var anchorContainer = (selection.anchorNode.nodeType === 3) ? selection.anchorNode.parentNode : selection.anchorNode;
      var containerParent = anchorContainer.parentNode;

      var siblingNodes = [];

      if ( (containerParent.getAttribute) && (containerParent.getAttribute("class") === "TextLine") ) {
        var textLines = this.textBlock.querySelectorAll(".TextLine");
        for (var i=0, l=textLines.length; i<l; i++) {
          siblingNodes = siblingNodes.concat( domNodesToArray(textLines[i].childNodes) );
        }
      }
      else {
        siblingNodes = domNodesToArray(containerParent.childNodes);
      }
      var indexOfCurrentNode = siblingNodes.indexOf(container);

      if (indexOfCurrentNode >= 0) {
        var newNode = siblingNodes[--indexOfCurrentNode];
        while ( (newNode) && (newNode.getAttribute) && (newNode.getAttribute("class") !== "TextNode") ) {
          newNode = siblingNodes[--indexOfCurrentNode];
        }

        if (newNode) {
          selection.extend(newNode.firstChild || newNode, newNode.textContent.length-1);
        }
      }

      removeMarkedElements(this.textBlock);

      this.notifyStyle();
    }
  }

  /**
   *
   */
  richTextEditor.TextController.prototype.moveRightShift = function(selection, range, evt) {
    if ( (selection.focusNode.nodeType !== 3) || ((selection.focusNode.nodeType === 3) && (selection.focusOffset === selection.focusNode.textContent.length)) ) {
      evt.preventDefault();

      // get the container
      var container = (selection.focusNode.nodeType === 3) ? selection.focusNode.parentNode : selection.focusNode;
      var anchorContainer = (selection.anchorNode.nodeType === 3) ? selection.anchorNode.parentNode : selection.anchorNode;
      var containerParent = anchorContainer.parentNode;

      var siblingNodes = [];

      if ( (containerParent.getAttribute) && (containerParent.getAttribute("class") === "TextLine") ) {
        var textLines = this.textBlock.querySelectorAll(".TextLine");
        for (var i=0, l=textLines.length; i<l; i++) {
          siblingNodes = siblingNodes.concat( domNodesToArray(textLines[i].childNodes) );
        }
      }
      else {
        siblingNodes = domNodesToArray(containerParent.childNodes);
      }
      var indexOfCurrentNode = siblingNodes.indexOf(container);

      if (indexOfCurrentNode >= 0) {
        var newNode = siblingNodes[++indexOfCurrentNode];
        while ( (newNode) && (newNode.getAttribute) && (newNode.getAttribute("class") !== "TextNode") ) {
          newNode = siblingNodes[++indexOfCurrentNode];
        }

        if (newNode) {
          selection.extend(newNode.firstChild || newNode, 1);
        }
      }

      removeMarkedElements(this.textBlock);

      this.notifyStyle();
    }
  }

  /**
   *
   */
  richTextEditor.TextController.prototype.moveUp = function(selection, range, evt) {
    evt.preventDefault();

    // get the container
    var container = selection.focusNode.parentNode;

    var textNodes = domNodesToArray(this.textBlock.querySelectorAll(".TextNode"));
    var indexOfTextNode = textNodes.indexOf(container);
    if (indexOfTextNode > 0) {
      var newNode = textNodes[indexOfTextNode-1].firstChild;
  
      var pos = newNode.textContent.length -(( (inFormulaNode(newNode)) || (inFormulaNode(range.endContainer) && !inFormulaNode(newNode)) ) ? 0 : 1);

      // if (selection.isCollapsed) {
        selection.collapse(newNode, Math.max(0, pos));
      // }
      // else {
        // selection.extend(newNode, Math.max(0, newNode.textContent.length-1));
      // }
    }

    removeMarkedElements(this.textBlock);

    this.notifyStyle();
  }

 /**
  *
  */
  richTextEditor.TextController.prototype.moveDown = function(selection, range, evt) {
    evt.preventDefault();

    // get the container
    var container = selection.focusNode.parentNode;

    var textNodes = domNodesToArray(this.textBlock.querySelectorAll(".TextNode"));
    var indexOfTextNode = textNodes.indexOf(container);
    if ( (indexOfTextNode >= 0) && (indexOfTextNode+1 < textNodes.length) ) {
      var newNode = textNodes[indexOfTextNode+1].firstChild;
  
      var pos = ( inFormulaNode(newNode) || (inFormulaNode(container) && !inFormulaNode(newNode)) ) ? 0 : 1;

      // if (selection.isCollapsed) {
        selection.collapse(newNode, Math.min(newNode.textContent.length, pos));
      // }
      // else {
        // selection.extend(newNode, Math.min(newNode.textContent.length, 1));
      // }
    }

    removeMarkedElements(this.textBlock);

    this.notifyStyle();
  }

  /**
   *
   */
  richTextEditor.TextController.prototype.removeSelection = function(selection, range) {
    var docFra;
    var oldContainer;
    var oldOffset;

    if ( (!inFormulaNode(range.startContainer)) || (!inFormulaNode(range.endContainer)) ) {
      if (inFormulaNode(range.startContainer)) {
        oldContainer = range.endContainer;
        oldOffset = range.endOffset;
        range.selectNode(range.startContainer);
        range.setEnd(oldContainer, oldOffset);
      }
      if (inFormulaNode(range.endContainer)) {
        oldContainer = range.startContainer;
        oldOffset = range.startOffset;
        range.selectNode(range.endContainer);
        range.setStart(oldContainer, oldOffset);
      }
    }

    var commonAncestor = range.commonAncestorContainer;
// console.log(commonAncestor)
    //////////////////////////////////////////////////////////////////////////////
    if (commonAncestor.nodeType === 3) {
      docFra = range.extractContents();
      if (commonAncestor.textContent === "") {
        range.startContainer.textContent = richTextEditor.narrowSpace;
        range.selectNode(range.startContainer);
        selection.removeAllRanges();
        selection.addRange(range);
      }
      selection.collapseToStart();
    }
    // //////////////////////////////////////////////////////////////////////////////
    // else if ((commonAncestor.getAttribute) && (commonAncestor.getAttribute("class")) && (commonAncestor.getAttribute("class") === "TextLine")) {
    //   docFra = range.extractContents();

    //   var childNodes = domNodesToArray(range.startContainer.childNodes);
    //   var newFocusNode;
    //   for (var i=0, l=childNodes.length; i<l; i++) {
    //     if (childNodes[i].textContent === "") {
    //       var next = childNodes[i].nextSibling;
    //       if ( (next) && (next.textContent === "") ) {
    //         childNodes[i].innerHTML = richTextEditor.narrowSpace;
    //         newFocusNode = childNodes[i];
    //       }
    //       else {
    //         childNodes[i].parentNode.removeChild(childNodes[i]);
    //       }
    //     }
    //   }

    //   if (newFocusNode) {
    //     var next = newFocusNode.nextSibling;
    //     if ( (next) && (next.getAttribute) && (next.getAttribute("class") !== "SeparatorNode") ) {
    //       newFocusNode.parentNode.insertBefore(richTextEditor.separatorNode.cloneNode(true), next);
    //     }

    //     range.selectNode(newFocusNode);
    //     selection.removeAllRanges();
    //     selection.addRange(range);
    //     selection.collapseToStart();
    //   }
    //   else {
    //     selection.collapseToStart();
    //   }
    // }
    //////////////////////////////////////////////////////////////////////////////
    else if ((commonAncestor.getAttribute) && (commonAncestor.getAttribute("class")) && (commonAncestor.getAttribute("class") === "TextBlock")) {
      // get the TextLine nodes 
      var firstParentNode = range.startContainer.parentNode;
      while ((firstParentNode.getAttribute) && (firstParentNode.getAttribute("class")) && (firstParentNode.getAttribute("class") !== "TextLine")) {
        firstParentNode = firstParentNode.parentNode;
      }
      var lastParentNode = range.endContainer.parentNode;
      while ((lastParentNode.getAttribute) && (lastParentNode.getAttribute("class")) && (lastParentNode.getAttribute("class") !== "TextLine")) {
        lastParentNode = lastParentNode.parentNode;
      }
      docFra = range.extractContents();

      var newFocusNode;
      if (firstParentNode.lastChild.textContent === "") {
        firstParentNode.lastChild.innerHTML = richTextEditor.narrowSpace;
        newFocusNode = firstParentNode.lastChild;
      }

      if ( (firstParentNode.lastChild.getAttribute) && (firstParentNode.lastChild.getAttribute("class") !== "SeparatorNode") && (lastParentNode.firstChild.getAttribute) && (lastParentNode.firstChild.getAttribute("class") !== "SeparatorNode") ) {
        firstParentNode.appendChild(richTextEditor.separatorNode.cloneNode(true));
      }

      var childNodes = domNodesToArray(lastParentNode.childNodes);
      for (var i=0, l=childNodes.length; i<l; i++) {
        firstParentNode.appendChild(childNodes[i]);
      }
      lastParentNode.parentNode.removeChild(lastParentNode);

      childNodes = domNodesToArray(firstParentNode.childNodes);
      for (var i=0, l=childNodes.length; i<l; i++) {
        if (childNodes[i].textContent === "") {
          firstParentNode.removeChild(childNodes[i]);
        }
      }

      if (newFocusNode) {
        range.selectNode(newFocusNode);
        selection.removeAllRanges();
        selection.addRange(range);
        selection.collapseToStart();
      }
      else {
        selection.collapseToStart();
      }
    }
    //////////////////////////////////////////////////////////////////////////////
    else {
      docFra = range.extractContents();

      var childNodes = domNodesToArray(range.startContainer.childNodes);
      var newFocusNode;
      for (var i=0, l=childNodes.length; i<l; i++) {
        if (childNodes[i].textContent === "") {
          var next = childNodes[i].nextSibling;
          if ( (next) && (next.textContent === "") ) {
            childNodes[i].innerHTML = richTextEditor.narrowSpace;
            newFocusNode = childNodes[i];
          }
          else {
            childNodes[i].parentNode.removeChild(childNodes[i]);
          }
        }
      }

      if (newFocusNode) {
        var next = newFocusNode.nextSibling;
        if ( (next) && (next.getAttribute) && (next.getAttribute("class") !== "SeparatorNode") ) {
          newFocusNode.parentNode.insertBefore(richTextEditor.separatorNode.cloneNode(true), next);
        }

        range.selectNode(newFocusNode);
        selection.removeAllRanges();
        selection.addRange(range);
        selection.collapseToStart();
      }
      else {
        selection.collapseToStart();
      }
    }

    this.correctText();

    return docFra;
  }

  /**
   *
   */
  richTextEditor.TextController.prototype.backspace = function(selection, range, evt) {
    if (range.startContainer.nodeType === 3) {
      var container = range.startContainer.parentNode;

      // init of the text
      if (range.startOffset === 0) {
        evt.preventDefault();

        var prev = container.previousSibling;

        // if has a previousSibling try to delete the last character in the previousSibling
        if ((prev) && (prev.getAttribute) && (prev.getAttribute("data-noedit") && (prev.textContent === richTextEditor.narrowSpace))) {
          newSelNode = prev.previousSibling;

          if (newSelNode) {
            if (inFormulaNode(newSelNode)) {
              prev.parentNode.removeChild(prev);
              newSelNode.parentNode.removeChild(newSelNode);

              var containerParent = container.parentNode;
              if (inFormulaNode(containerParent)) {
                var prev = container.previousSibling;
                if ((prev) && (prev.getAttribute) && (prev.getAttribute("data-noedit") && (prev.textContent === richTextEditor.narrowSpace))) {
                  newSelNode = prev.previousSibling;
                  
                  if (newSelNode) {
                    var pos = newSelNode.textContent.length;

                    // join the content in one node
                    newSelNode.textContent += container.textContent;

                    // fix seleccion
                    range.setStart(newSelNode.firstChild || newSelNode, pos);
                    range.collapse(true);
                    selection.removeAllRanges();
                    selection.addRange(range);

                    // remove innecesary nodes
                    prev.parentNode.removeChild(prev);
                    container.parentNode.removeChild(container);
                  }
                }
              }
            }
            else {
              // remove the old marked elements
              removeMarkedElements(this.textBlock);

              newSelNode.textContent = newSelNode.textContent.substring(0, newSelNode.textContent.length-1);

              // mark the element for posibly deletion
              if (newSelNode.textContent === "") {
                newSelNode.textContent = richTextEditor.narrowSpace;

                prev.setAttribute("data-remove", "true");
                newSelNode.setAttribute("data-remove", "true");
              }

              range.setStart(newSelNode.firstChild || newSelNode, newSelNode.textContent.length);
              range.collapse(true);
              selection.removeAllRanges();
              selection.addRange(range);
            }
          }
        }
        // try to delete the previous character in the previous line if any
        else {
          var currLine = container.parentNode;
          var prevLine = currLine.previousSibling;

          if (prevLine) {
            var prevLastChild = prevLine.lastChild;
            while (prevLastChild && prevLastChild.hasChildNodes()) {
              prevLastChild = prevLastChild.lastChild;
            }
            // correct the caret position
            range.setStart(prevLastChild, prevLastChild.length);
            range.collapse(true);
            selection.removeAllRanges();
            selection.addRange(range);

            removeMarkedElements(this.textBlock);

            var childNodes = domNodesToArray(currLine.childNodes);
            if (childNodes.length > 0) {
              // add a separator
              prevLine.appendChild(richTextEditor.separatorNode.cloneNode(true));

              for (var i=0, l=childNodes.length; i<l; i++) {
                prevLine.appendChild(childNodes[i]);
              }
            }
            currLine.parentNode.removeChild(currLine);
          }
        }
      }
      // delete the first character in a TextNode
      else if (range.startOffset === 1) {
        evt.preventDefault();

        container.textContent = container.textContent.substring(1);

        // mark the element for posibly deletion
        if (container.textContent === "") {
          container.textContent = richTextEditor.narrowSpace;

          if (!inFormulaNode(container)) {
            container.setAttribute("data-remove", "true");

            var prev = container.previousSibling;
            if ( (prev) && (prev.getAttribute) && (prev.getAttribute("data-noedit")) && (prev.textContent === richTextEditor.narrowSpace) ) {
              prev.setAttribute("data-remove", "true");
            }
            else {
              prev = container.nextSibling;
              if ( (prev) && (prev.getAttribute) && (prev.getAttribute("data-noedit")) && (prev.textContent === richTextEditor.narrowSpace) ) {
                prev.setAttribute("data-remove", "true");
              }
            }
          }
        }

        range.setStart(container.firstChild || container, 0);
        range.collapse(true);
        selection.removeAllRanges();
        selection.addRange(range);
      }
    }
    else {
      evt.preventDefault();
    }

    this.correctText();
  }

  /**
   *
   */
  richTextEditor.TextController.prototype.delete = function(selection, range, evt) {
    if (range.startContainer.nodeType === 3) {
      var container = range.startContainer.parentNode;

      // end of the text
      if (range.startOffset === container.textContent.length) {
        evt.preventDefault();

        var next = container.nextSibling;

        // if has a nextSibling try to delete the first character in the nextSibling
        if ((next) && (next.getAttribute) && (next.getAttribute("data-noedit") && (next.textContent === richTextEditor.narrowSpace))) {
          newSelNode = next.nextSibling;

          if (newSelNode) {
            if (inFormulaNode(newSelNode)) {
              next.parentNode.removeChild(next);
              newSelNode.parentNode.removeChild(newSelNode);

              var containerParent = container.parentNode;
              if (inFormulaNode(containerParent)) {
                var next = container.nextSibling;
                if ((next) && (next.getAttribute) && (next.getAttribute("data-noedit") && (next.textContent === richTextEditor.narrowSpace))) {
                  newSelNode = next.nextSibling;
                  
                  if (newSelNode) {
                    var pos = newSelNode.textContent.length;

                    // join the content in one node
                    newSelNode.textContent += container.textContent;

                    // fix seleccion
                    range.setStart(newSelNode.firstChild || newSelNode, pos);
                    range.collapse(true);
                    selection.removeAllRanges();
                    selection.addRange(range);

                    // remove innecesary nodes
                    next.parentNode.removeChild(next);
                    container.parentNode.removeChild(container);
                  }
                }
              }              
            }
            else {
              // remove the old marked elements
              removeMarkedElements(this.textBlock);

              newSelNode.textContent = newSelNode.textContent.substring(1);

              // mark the element for posibly deletion
              if (newSelNode.textContent === "") {
                newSelNode.textContent = richTextEditor.narrowSpace;
                next.setAttribute("data-remove", "true");
                newSelNode.setAttribute("data-remove", "true");
              }

              range.setStart(newSelNode.firstChild || newSelNode, 0);
              range.collapse(true);
              selection.removeAllRanges();
              selection.addRange(range);
            }
          }
        }
        // try to delete the next character in the next line if any
        else {
          var currLine = container.parentNode;
          var nextLine = currLine.nextSibling;

          if (nextLine) {
            removeMarkedElements(this.textBlock);

            var childNodes = domNodesToArray(nextLine.childNodes);
            if (childNodes.length > 0) {
              // add a separator
              currLine.appendChild(richTextEditor.separatorNode.cloneNode(true));

              for (var i=0, l=childNodes.length; i<l; i++) {
                currLine.appendChild(childNodes[i]);
              }
            }
            nextLine.parentNode.removeChild(nextLine);
          }
        }
      }
      // delete the first character in a TextNode
      else if (range.startOffset === container.textContent.length-1) {
        evt.preventDefault();

        container.textContent = container.textContent.substring(0, container.textContent.length-1);

        // mark the element for posibly deletion
        if (container.textContent === "") {
          container.textContent = richTextEditor.narrowSpace;

          if (!inFormulaNode(container)) {
            container.setAttribute("data-remove", "true");

            var prev = container.previousSibling;
            if ( (prev) && (prev.getAttribute) && (prev.getAttribute("data-noedit")) && (prev.textContent === richTextEditor.narrowSpace) ) {
              prev.setAttribute("data-remove", "true");
            }
            else {
              prev = container.nextSibling;
              if ( (prev) && (prev.getAttribute) && (prev.getAttribute("data-noedit")) && (prev.textContent === richTextEditor.narrowSpace) ) {
                prev.setAttribute("data-remove", "true");
              }
            }
          }
        }

        range.setStart(container.firstChild || container, container.textContent.length);
        range.collapse(true);
        selection.removeAllRanges();
        selection.addRange(range);
      }
    }
    else {
      evt.preventDefault();
    }

    this.correctText();
  }

  /**
   *
   */
  richTextEditor.TextController.prototype.fixMouseSelection = function(selection, range) {
    var container = range.startContainer;
    var newContainer;

    if ((container.nodeType === 3) && (container.parentNode.getAttribute("class") === "DynamicTextNode")) {
      setCaretToNode(selection, range, container.parentNode.nextSibling.nextSibling);
    }
    else if (container.nodeType !== 3) {
      var child = container.children[Math.max(0, range.startOffset-1)];
// console.log("---", container, child, range.startOffset)
      if ( (child) && (child.getAttribute) && (child.getAttribute("class") === "SeparatorNode") ) {
        newContainer = child.previousSibling;
        while ( (newContainer) && (newContainer.getAttribute("data-noedit")) ) {
          newContainer = newContainer.previousSibling;
        }
        if (newContainer === null) {
          newContainer = child.nextSibling;
          while ( (newContainer) && (newContainer.getAttribute("data-noedit")) ) {
            newContainer = newContainer.nextSibling;
          }
        }
      }
      // else if ( (child) && (child.getAttribute) && (child.getAttribute("class") === "DynamicTextNode") ) {
      else if ( (child) && (child.getAttribute) ) {
        newContainer = child.nextSibling;
        while ( (newContainer) && (newContainer.getAttribute("data-noedit")) ) {
          newContainer = newContainer.nextSibling;
        }
        if (newContainer === null) {
          newContainer = child.previousSibling;
          while ( (newContainer) && (newContainer.getAttribute("data-noedit")) ) {
            newContainer = newContainer.previousSibling;
          }
        }
      }
      else {
        console.log("cursor en ", child, "|", container, range.startOffset)
      }

      // change the caret position to a valid one
      if (newContainer) {
        setCaretToNode(selection, range, newContainer);
// console.log("hola", newContainer)
      }
    }

    removeMarkedElements(this.textBlock);
  }

  /**
   *
   */
  richTextEditor.TextController.prototype.setDefaultStyle = function(node) {
    for (var propName in this.defaultStyle) {
      if (this.defaultStyle.hasOwnProperty(propName)) {
        node.style[propName] = this.defaultStyle[propName];
      }
    }
  }

  /**
   *
   */
  function cleanEmptyText(domNode) {
    cleanNewLines(domNode);

    var textNodes = domNodesToArray( domNode.querySelectorAll(".TextNode") );
    var textNodes_i;
    var next;
    var nextAux;

    // mark the elements to remove
    for (var i=0, l=textNodes.length; i<l; i++) {
      textNodes_i = textNodes[i];

      next = textNodes_i.nextSibling;
      nextAux = (next) ? next.nextSibling : null;

      if (textNodes_i.innerHTML === richTextEditor.narrowSpace) {
        if ( (next) && (next.getAttribute) && (next.getAttribute("class") === "SeparatorNode") && (nextAux) && (nextAux.innerHTML === richTextEditor.narrowSpace) && (nextAux.getAttribute) && (nextAux.getAttribute("class") === "TextNode") && (equalStyle(textNodes_i, nextAux)) ) {
          textNodes_i.setAttribute("data-remove", "true");
          next.setAttribute("data-remove", "true");
        }
        else if ( (next) && (next.getAttribute) && (next.getAttribute("class") === "SeparatorNode") && (nextAux) && (nextAux.innerHTML !== richTextEditor.narrowSpace) && (nextAux.getAttribute) && (nextAux.getAttribute("class") === "TextNode") && (equalStyle(textNodes_i, nextAux)) ) {

          textNodes_i.setAttribute("data-remove", "true");
          next.setAttribute("data-remove", "true");
        }

      }
      else {
        if ( (next) && (next.getAttribute) && (next.getAttribute("class") === "SeparatorNode") && (nextAux) && (nextAux.innerHTML === richTextEditor.narrowSpace) && (nextAux.getAttribute) && (nextAux.getAttribute("class") === "TextNode") && (equalStyle(textNodes_i, nextAux)) ) {
          next.setAttribute("data-remove", "true");
          nextAux.setAttribute("data-remove", "true");
        }
      }
    }

    removeMarkedElements(domNode);
  }

  /**
   *
   */
  function removeMarkedElements(domNode) {
    // remove the marked elements
    var textNodes = domNode.querySelectorAll("[data-remove]");
    for (var i=0, l=textNodes.length; i<l; i++) {
      textNodes[i].parentNode.removeChild(textNodes[i]);
    }
  }

  /**
   *
   */
  function addSeparators(domNode) {
    var textNodes = domNodesToArray( domNode.querySelectorAll(".TextNode") );
    var textNodes_i;
    var next;

    // add separators between text nodes
    for (var i=0, l=textNodes.length; i<l; i++) {
      textNodes_i = textNodes[i];
      next = textNodes_i.nextSibling;

      if ( (next) && (next.getAttribute) && (next.getAttribute("class") !== "SeparatorNode") ) {
        if (textNodes[i+1]) {
          var separatorNode = richTextEditor.separatorNode;
          separatorNode.style = textNodes_i.style;
          next.parentNode.insertBefore(separatorNode, next);
        }
      }
    }
  }

  /**
   *
   */
  function equalStyle(node1, node2) {
    node1 = node1.style;
    node2 = node2.style;

    var res = true;

    var attr = ["font-family", "font-size", "font-style", "font-weight", "text-decoration", "color"];
    for (var i=0, l=attr.length; i<l; i++) {
      res = res && (node1[attr] === node2[attr]);
    }

    return res;
  }

  /**
   *
   */
  function cleanNewLines(domNode) {
    var lines = domNode.children;
    var last;

    for (var i=0, l=lines.length; i<l; i++) {
      last = lines[i].lastChild;
      if ((last) && (last.getAttribute) && (last.getAttribute("data-noedit"))) {
        last.parentNode.removeChild(last);
      }
    }
  }

  /**
   *
   */
  function inFormulaNode(node) {
    if (node.nodeType === 3) {
      node = node.parentNode;
    }

    while ((node.getAttribute) && (node.getAttribute("class") !== "TextBlock")) {
      if (node.getAttribute("class") === "FormulaNode") {
        return node;
      }
      node = node.parentNode;
    }

    return null;
  }

  /**
   *
   */
  function getCurrentStyle(node, style) {
    // the style is the same, then remove te style
    if (node.style[style.name] === style.value) {
      if ( ((style.name === "font-weight") && (style.value === "bold")) || ((style.name === "font-style") && (style.value === "italic")) ) {
        style.value = "normal";
      }
      if (style.name === "text-decoration") {
        if ( (style.value === "underline") || (style.value === "overline") ) {
         style.value = "none";
        }
      }
    }

    // special case
    if (style.name === "text-decoration") {
      // has underline and overline style the remove the repeated
      if (node.style[style.name] === "underline overline") {
        if (style.value === "underline") {
          style.value = "overline";
        }
        else if (style.value === "overline") {
          style.value = "underline";
        }
      }
      // has underline and the new style set overline OR has overline and the new style set underline, then combine the attributes
      if ( ((node.style[style.name] === "underline") && (style.value === "overline")) || ((node.style[style.name] === "overline") && (style.value === "underline")) ) {
        style.value = "underline overline";
      }
    }

    return style;
  }

  /**
   *
   */
  function domNodesToArray(nodes) {
    return Array.prototype.slice.call(nodes);
  }


  /**
   *
   */
  richTextEditor.TextController.prototype.createDynamicTextNodeDialog = function() {
    var self = this;

    this.dynamicTextNodeDialog = document.createElement("dialog");
    this.dynamicTextNodeDialog.style.padding = "10px";
    var form_div = document.createElement("div");
    var decimals_label = document.createElement("label");
    decimals_label.innerHTML = "decimales";
    this.decimals_inpt = document.createElement("input");
    this.decimals_inpt.setAttribute("type", "text");
    var fixed_id = "fixed_id_" + parseInt(Math.random()*1000);
    var fixed_label = document.createElement("label");
    fixed_label.innerHTML = "fijo";
    fixed_label.setAttribute("for", fixed_id);
    this.fixed_inpt = document.createElement("input");
    this.fixed_inpt.setAttribute("type", "checkbox");
    this.fixed_inpt.setAttribute("id", fixed_id)
    var exprValue_label = document.createElement("label");
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
        self.dynamicTextNode.setAttribute("data-decimals", self.decimals_inpt.value);
        self.dynamicTextNode.setAttribute("data-fixed", self.fixed_inpt.checked);
        self.dynamicTextNode.setAttribute("data-value", self.exprValue_inpt.value);
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
  richTextEditor.TextController.prototype.showDynamicTextNodeDialog = function(dynamicTextNode) {
    this.dynamicTextNodeDialog.querySelector("#btn_accept_code_editor").innerHTML = babel.transGUI("ok_btn");
    this.dynamicTextNodeDialog.querySelector("#btn_cancel_code_editor").innerHTML = babel.transGUI("cancel_btn");

    this.dynamicTextNode = dynamicTextNode;

    this.decimals_inpt.value = dynamicTextNode.getAttribute("data-decimals");
    this.fixed_inpt.checked = (dynamicTextNode.getAttribute("data-fixed") == "true");
    this.exprValue_inpt.value = dynamicTextNode.getAttribute("data-value");

    this.dynamicTextNodeDialog.showModal();
  }

  /**
   *
   */
  richTextEditor.TextController.prototype.createMatrixDialog = function() {
    var self = this;

    this.matrixDialog = document.createElement("dialog");
    this.matrixDialog.style.padding = "10px";
    var form_div = document.createElement("div");
    var columns_label = document.createElement("label"); // m
    columns_label.innerHTML = "m";
    this.columns_inpt = document.createElement("input");
    this.columns_inpt.setAttribute("type", "text");
    this.columns_inpt.setAttribute("style", "width:80px;");
    this.columns_inpt.value = 2;
    var rows_label = document.createElement("label"); //n
    rows_label.innerHTML = "n";
    this.rows_inpt = document.createElement("input");
    this.rows_inpt.setAttribute("type", "text");
    this.rows_inpt.setAttribute("style", "width:78px;");
    this.rows_inpt.value = 2;

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

      var selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(self.storeRange);

      self.matrix_rows = self.rows_inpt.value || 2;
      self.matrix_columns = self.columns_inpt.value || 2;
      self.addMatrixNode();
    });

    btn_cancel.addEventListener("click", function(evt) {
      self.matrixDialog.close();
    });
  }

  /**
   *
   */
  richTextEditor.TextController.prototype.showMatrixDialog = function() {
    this.matrixDialog.querySelector("#btn_accept_code_editor").innerHTML = babel.transGUI("ok_btn");
    this.matrixDialog.querySelector("#btn_cancel_code_editor").innerHTML = babel.transGUI("cancel_btn");

    var selection = window.getSelection();
    this.storeRange = selection.getRangeAt(0);

    this.matrixDialog.showModal();
  }

  /**
   *
   */
  richTextEditor.TextController.prototype.createCasesDialog = function() {
    var self = this;

    this.casesDialog = document.createElement("dialog");
    this.casesDialog.style.padding = "10px";
    var form_div = document.createElement("div");
    var parts_label = document.createElement("label"); // m
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

      var selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(self.storeRange);

      self.cases_parts = self.parts_inpt.value || 2;
      self.addCasesNode();
    });

    btn_cancel.addEventListener("click", function(evt) {
      self.casesDialog.close();
    });
  }

  /**
   *
   */
  richTextEditor.TextController.prototype.showCasesDialog = function() {
    this.casesDialog.querySelector("#btn_accept_code_editor").innerHTML = babel.transGUI("ok_btn");
    this.casesDialog.querySelector("#btn_cancel_code_editor").innerHTML = babel.transGUI("cancel_btn");

    var selection = window.getSelection();
    this.storeRange = selection.getRangeAt(0);

    this.casesDialog.showModal();
  }

  return richTextEditor;
})(richTextEditor || {});
