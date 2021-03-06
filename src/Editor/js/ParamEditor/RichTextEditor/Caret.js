/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var richTextEditor = (function(richTextEditor) {

  var textWidth;

  /**
   *
   */
  richTextEditor.Caret = function(container, externalColor, editable) {
    this.externalColor = externalColor;

    this.container = container;

    canvas = container.querySelector("canvas");
    this.offsetLeft = canvas.offsetLeft;
    this.offsetTop  = canvas.offsetTop;

    // element needed for the movement of the scroll to focus the cursor
    this.placeHolder = document.createElement("div");
    this.placeHolder.setAttribute("style", "position:absolute; width:"+ (2*this.offsetLeft) +"px;")
    container.appendChild(this.placeHolder);

    this.el = document.createElement('div');
    this.el.setAttribute("class", "Caret");
    this.el.setAttribute("style", "width:2px; background-color:#000; box-sizing: content-box; border:1px solid white;");

    container.appendChild(this.el);
  }

  richTextEditor.Caret.prototype.set = function(node, offset, ignoreSelection) {
    this.node = node;

    // set the height of the caret
    this.el.style.height = Math.max(node.metrics.h, node.style.fontSize) + "px";
    this.placeHolder.style.height = (Math.max(node.metrics.h, node.style.fontSize) + 2*this.offsetTop) + "px";    

    // set the color of the caret, the same as the text
    this.el.style.backgroundColor = node.style.textColor || this.externalColor;

    this.posAux(offset, ignoreSelection);
  }
  richTextEditor.Caret.prototype.posAux = function(offset, ignoreSelection) {
    this.offset = offset;

    // get the width of the substring from the begining to the offset
    richTextEditor.auxCtx.font = this.node.styleString;
    // textWidth = parseInt(0.5 + richTextEditor.auxCtx.measureText(this.node.value.substring(0, offset)).width);
    textWidth = richTextEditor.auxCtx.measureText(this.node.value.substring(0, offset)).width;

    // set the position
    this.el.style.left = parseInt(this.node.metrics.x +textWidth +this.offsetLeft -1) + "px";

    if (this.node.metrics.empty) {
      this.el.style.top = (this.node.metrics.y -4*this.node.style.fontSize/5 +this.offsetTop) + "px";
    }
    else {
      this.el.style.top  = (this.node.metrics.y -this.node.metrics.ascent +this.offsetTop) + "px";
    }

    var placeHolderLeft = parseInt(this.el.style.left) - this.offsetLeft;
    var placeHolderTop  = parseInt(this.el.style.top)  - this.offsetTop;
    this.placeHolder.style.left = placeHolderLeft + "px";
    this.placeHolder.style.top  = placeHolderTop  + "px";

    var scrollSize = 50;
    var containerWidth = this.container.offsetWidth;
    var containerHeight = this.container.offsetHeight;
    var containerScrollLeft = this.container.scrollLeft;
    var containerScrollTop = this.container.scrollTop;

    // move the scroll of the view to show the caret
    if (containerScrollLeft > placeHolderLeft) {
      this.container.scrollLeft = placeHolderLeft;
    }
    else if (placeHolderLeft > containerWidth + containerScrollLeft -scrollSize) {
      this.container.scrollLeft = placeHolderLeft - (containerWidth -scrollSize);
    }
    if (containerScrollTop > placeHolderTop) {
      this.container.scrollTop = placeHolderTop;
    }
    else if (placeHolderTop > containerHeight + containerScrollTop -scrollSize) {
      this.container.scrollTop = placeHolderTop - (containerHeight -scrollSize);
    }
  }

  richTextEditor.Caret.prototype.getX = function() {
    return parseFloat(this.el.style.left) -this.offsetLeft;
  } 
  richTextEditor.Caret.prototype.getY = function() {
    return parseFloat(this.el.style.top) -this.offsetTop;
  }
  
  richTextEditor.Caret.prototype.getH = function() {
    return this.el.offsetHeight;
  }

  richTextEditor.Caret.prototype.stopBlink = function() {
    this.el.style.animation = "none";
  }
  richTextEditor.Caret.prototype.startBlink = function() {
    this.el.style.animation = null;
  }

  richTextEditor.Caret.prototype.goForward = function() {
    if (this.node.value.length > this.offset) {
      this.posAux(this.offset+1);
      return true;
    }
    return false;
  }
  richTextEditor.Caret.prototype.goBackward = function() {
    if (this.offset > 0) {
      this.posAux(this.offset-1);
      return true;
    }
    return false;
  }

  richTextEditor.Caret.prototype.show = function() {
    this.visible = true;
    this.el.style.display = "block";
    this.placeHolder.style.display = "block";
  }
  richTextEditor.Caret.prototype.hide = function() {
    this.visible = false;
    this.el.style.display = "none";
    this.placeHolder.style.display = "none";
  }
  
  return richTextEditor;
})(richTextEditor || {});
