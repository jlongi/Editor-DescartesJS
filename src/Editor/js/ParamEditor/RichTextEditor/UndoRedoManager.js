/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var richTextEditor = (function(richTextEditor) {

  /**
   *
   */
  richTextEditor.UndoRedoManager = function(nodes, caret, startCaret) {
    this.states = [];
    this.lastState = -1;
    this.maxState;
    this.prevState = "";

    this.storeCaretPositions(caret, startCaret);
    this.put(nodes);
  }

  /**
   * 
   */
  richTextEditor.UndoRedoManager.prototype.storeCaretPositions = function(caret, startCaret) {
    this.caretX = caret.getX();
    this.caretY = caret.getY();
    this.startCaretX = startCaret.getX();
    this.startCaretY = startCaret.getY();
  }

  /**
   * 
   */
  richTextEditor.UndoRedoManager.prototype.put = function(nodes) {
    let stringNodes = nodes.stringify();
    let init = -1;
    let end  = -1;
    let removed = "";
    let inserted = "";
    let prevState_length = this.prevState.length;
    let stringNodes_length = stringNodes.length;

    if (stringNodes !== this.prevState) {
      // find the last index of the equal characters in stringNodes and this.prevState
      for (let i=0; i<prevState_length; i++) {
        if (stringNodes.charAt(i) !== this.prevState.charAt(i)) {
          init = i;
          break;
        }
      }

      // find the first index of the equal characters in stringNodes and this.prevState
      for (let i=0; i<prevState_length; i++) {
        if (stringNodes.charAt(stringNodes_length -1 -i) !== (this.prevState.charAt(prevState_length -1 -i))) {
          end = i;
          break;
        }
      }

      if ((init !== -1) && (end !== -1)) {
        removed = this.prevState.substring(init, prevState_length -end);
        inserted = stringNodes.substring(init, stringNodes_length -end);
      }
      if (end !== -1) {
        end = prevState_length -end;
      }

      this.lastState++;
      this.maxState = this.lastState;

      this.states[this.lastState] = {
        init: init,
        end: end,
        removed: removed,
        inserted: inserted,

        caretX: this.caretX,
        caretY: this.caretY,
        startCaretX: this.startCaretX,
        startCaretY: this.startCaretY
      };

      this.prevState = stringNodes;
    }
  }

  /**
   * 
   */
  richTextEditor.UndoRedoManager.prototype.undo = function() {
    if (this.lastState > 0) {
      let currentState = this.states[this.lastState];
      this.lastState--;

      let newNodesStr = "";
      if (currentState.inserted.length > 0) {
        let tmpEnd = currentState.init + currentState.inserted.length;
        newNodesStr = this.prevState.substring(0, currentState.init) + currentState.removed + this.prevState.substring(tmpEnd);
      }
      else {
        newNodesStr = this.prevState.substring(0, currentState.init) + currentState.removed + this.prevState.substring(currentState.init);
      }

      this.prevState = newNodesStr;

      return {
        nodes: richTextEditor.JSONtoTextNodes(JSON.parse(newNodesStr)),
        caretX: currentState.caretX,
        caretY: currentState.caretY,
        startCaretX: currentState.startCaretX,
        startCaretY: currentState.startCaretY
      }
    }

    return null;
  }

  /**
   * 
   */
  richTextEditor.UndoRedoManager.prototype.redo = function() {
    if (this.lastState < this.maxState) {
      this.lastState++;

      let currentState = this.states[this.lastState];
      let newNodesStr = this.prevState.substring(0, currentState.init) + currentState.inserted + this.prevState.substring(currentState.end);
      this.prevState = newNodesStr;

      return {
        nodes: richTextEditor.JSONtoTextNodes(JSON.parse(newNodesStr)),
        caretX: currentState.caretX,
        caretY: currentState.caretY,
        startCaretX: currentState.startCaretX,
        startCaretY: currentState.startCaretY
      }
    }

    return null;
  }

  return richTextEditor;
})(richTextEditor || {});