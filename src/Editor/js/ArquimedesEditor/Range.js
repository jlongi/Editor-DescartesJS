/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  /**
   *
   */
  descartesJS.Range = function(container) {
    this.canvas = container.querySelector("#descartesJS_stage_canvas");
    this.canvas.style.zIndex = -1;
    this.canvas.style.background = "white";
    this.ctx = this.canvas.getContext("2d");
  }

  /**
   * 
   */
  descartesJS.Range.prototype.updateSize = function(w, h) {
    this.canvas.setAttribute("width",  w);
    this.canvas.setAttribute("height", h);
  }

  /**
   * 
   */
  descartesJS.Range.prototype.draw = function(allTextNodes, startCaret, endCaret, startIndex, endIndex) {
    if (startIndex > endIndex) {
      var tmp = startIndex;
      startIndex = endIndex;
      endIndex = tmp;

      tmp = startCaret;
      startCaret = endCaret;
      endCaret = tmp;
    }

    this.clear();

    this.ctx.fillStyle = "#b1d6ff";
    this.ctx.beginPath();

    // the selection is in the same node
    if (startIndex === endIndex) {
      this.ctx.rect(Math.min(startCaret.getX(), endCaret.getX()), startCaret.getY(), Math.abs(startCaret.getX() - endCaret.getX()), startCaret.node.metrics.h);
    }
    else {
      // selection in the start node
      this.ctx.rect(startCaret.getX(), startCaret.getY(), startCaret.node.metrics.w - (startCaret.getX() - startCaret.node.metrics.x), startCaret.node.metrics.h);

      // selection in the end node
      this.ctx.rect(endCaret.node.metrics.x, endCaret.getY(), endCaret.getX() -endCaret.node.metrics.x, endCaret.node.metrics.h);

      // selection in between nodes
      for (var i=startIndex+1; i<endIndex; i++) {
        this.ctx.rect(allTextNodes[i].metrics.x, allTextNodes[i].metrics.y-allTextNodes[i].metrics.ascent, allTextNodes[i].metrics.w, allTextNodes[i].metrics.h);
      }
    }

    this.ctx.fill();
  }
  /**
   * 
   */
  descartesJS.Range.prototype.clear = function() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  return descartesJS;
})(descartesJS || {});
