/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }
  
  /**
   *
   */
  descartesJS.UndoRedoManager = function(nodes, caret, startCaret, space) {
    this.space = space;
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
  descartesJS.UndoRedoManager.prototype.storeCaretPositions = function(caret, startCaret) {
    this.caretX = caret.getX();
    this.caretY = caret.getY();
    this.startCaretX = startCaret.getX();
    this.startCaretY = startCaret.getY();
  }


  /**
   * 
   */
  descartesJS.UndoRedoManager.prototype.put = function(nodes, caret, startCaret) {
    var stringNodes = nodes.stringify();
    var init = -1;
    var end  = -1;
    var removed = "";
    var inserted = "";
    var prevState_length = this.prevState.length;
    var stringNodes_length = stringNodes.length;

    if (stringNodes !== this.prevState) {
// console.log("%c" + this.prevState, "color:red;");
// console.log("%c" + stringNodes, "color:blue;");
      // find the last index of the equal characters in stringNodes and this.prevState
      for (var i=0; i<prevState_length; i++) {
        if (stringNodes.charAt(i) !== this.prevState.charAt(i)) {
          init = i;
          break;
        }
      }

      // find the first index of the equal characters in stringNodes and this.prevState
      for (var i=0; i<prevState_length; i++) {
        if (stringNodes.charAt(stringNodes_length -1 -i) !== (this.prevState.charAt(prevState_length -1 -i))) {
          // end = prevState_length -i;
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

        caretX: (caret) ? caret.getX() : this.caretX,
        caretY: (caret) ? caret.getY() : this.caretY,
        startCaretX: (caret) ? startCaret.getX() : this.startCaretX,
        startCaretY: (caret) ? startCaret.getY() : this.startCaretY
      };

// console.log(init, end);
// console.log(this.prevState.substring(0, init));
// console.log(this.prevState.substring(end));
// console.log("%c" + removed, "color:black;background:#ddd;");
// console.log("%c" + inserted, "color:white;background:black;");

      this.prevState = stringNodes;
    }
  }

  /**
   * 
   */
  descartesJS.UndoRedoManager.prototype.undo = function() {
    if (this.lastState > 0) {
      var currentState = this.states[this.lastState];
      this.lastState--;

  // console.log(this.states);
  // console.log(this.lastState, currentState);

      var newNodesStr = "";
      if (currentState.inserted.length > 0) {
        var tmpEnd = currentState.init + currentState.inserted.length;
// console.log(this.prevState.substring(0, currentState.init));
// console.log(currentState.removed + this.prevState.substring(tmpEnd));
        newNodesStr = this.prevState.substring(0, currentState.init) + currentState.removed + this.prevState.substring(tmpEnd);
      }
      else {
// console.log(this.prevState.substring(0, currentState.init))
// console.log(currentState.removed)
// console.log(this.prevState.substring(currentState.init))

        newNodesStr = this.prevState.substring(0, currentState.init) + currentState.removed + this.prevState.substring(currentState.init);
      }

      this.prevState = newNodesStr;

      return {
        nodes: descartesJS.JSONtoTextNodes(JSON.parse(newNodesStr), this.space.evaluator),
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
  descartesJS.UndoRedoManager.prototype.redo = function() {
    if (this.lastState < this.maxState) {
      this.lastState++;

      var currentState = this.states[this.lastState];
      var newNodesStr = this.prevState.substring(0, currentState.init) + currentState.inserted + this.prevState.substring(currentState.end);
      this.prevState = newNodesStr;

      return {
        nodes: descartesJS.JSONtoTextNodes(JSON.parse(newNodesStr), this.space.evaluator),
        caretX: currentState.caretX,
        caretY: currentState.caretY,
        startCaretX: currentState.startCaretX,
        startCaretY: currentState.startCaretY
      }
    }

    return null;
  }

  return descartesJS;
})(descartesJS || {});
