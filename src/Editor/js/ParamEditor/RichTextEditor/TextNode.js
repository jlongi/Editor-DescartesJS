/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var richTextEditor = (function(richTextEditor) {
  richTextEditor.auxCtx = document.createElement("canvas").getContext("2d");
  
  var localColor = "#000000";
  var radicalPath = new Path2D("m 759,1 c -8,0 -15,4 -20,14 L 325,878 153,500 c -5,-11 -11,-14 -17,-9 L 2,596 c -5,4 17,30 22,26 l 65,-47 193,422 c 3,6 27,6 32,-4 L 773,40 V 1 Z");
  var sigmaPath = new Path2D("M 780,707 H 750 C 728,805 695,872 585,872 H 180 L 509,447 225,65 h 313 c 130,0 167,49 188,181 h 30 V 0 H 25 L 384,500 0,1000 h 729 z");
  var integralPath = new Path2D("m 150,828 c -21,88 -42,144 -83,144 -6,0 -9,-2 -9,-6 0,-9 15,-8 15,-34 0,-14 -13,-22 -27,-22 -24,0 -45,22 -45,51 0,20 21,39 56,39 97,0 141,-105 159,-176 L 375,181 c 23,-91 45,-154 89,-153 6,0 9,2 9,6 0,7 -15,13 -15,35 0,14 13,20 27,20 24,0 45,-22 45,-51 C 530,18 508,0 473,0 368,0 326,120 309,190 Z");

  var factorMarginH = 0.075;
  var factorMarginV = 0.05;
  var factorPaddingH = 0.075;
  var factorPaddingV = 0.05;

  /**
   *
   */
  richTextEditor.TextNode = function(value, nodeType, style) {
    this.parent = null;
    this.children = [];
    this.metrics = { ascent:0, descent:0, h:0, w:0, x:0, y:0, offsetX:0, offsetY:0, marginX:0, marginY:0, paddingX:0, paddingY:0 };

    this.value = value;
    this.nodeType = nodeType;
    this.style = style;
    this.styleString = this.style.toString();

    switch(this.nodeType) {
      // the principal text block
      case ("textBlock"):
        this.draw = this.drawTextBlock;
        break;

      // a text line
      case ("textLineBlock"):
        this.draw = this.drawTextLineBlock;
        break;

      // a formula
      case ("formula"):
        this.draw = this.drawFormula;
        break;

      // a super index
      case ("superIndex"):
        this.draw = this.drawSuperIndex;
        break;

      // a sub index
      case ("subIndex"):
        this.draw = this.drawSubIndex;
        break;

      // a dynamic text
      case ("dynamicText"):
        this.draw = this.drawDynamicText;
        break;

      // a fraction
      case ("fraction"):
        this.draw = this.drawFraction;
        break;

      // a numerator or denominator
      case ("numerator"):
      case ("denominator"):
        this.draw = this.drawNumDen;
        break;

      // a radical
      case ("radical"):
        this.draw = this.drawRadical;
        break;

      // a limit
      case ("limit"):
        this.draw = this.drawLimit;
        break;

      // an integral
      case ("integral"):
        this.draw = this.drawIntegral;
        break;

      // a sum
      case ("sum"):
        this.draw = this.drawSum;
        break;

      // a matrix
      case ("matrix"):
        this.draw = this.drawMatrix;
        break;

      // a defparts element
      case ("defparts"):
        this.draw = this.drawDefparts;
        break;

      // a text or new line or math symbol
      case ("text"):
      case ("newLine"):
      case ("mathSymbol"):
        this.draw = this.drawText;
        break;

      // a hyperlink
      case ("hyperlink"):
        this.draw = this.drawHyperlink;
        break;

      // an index of a root or contents of a root or from value of a root
      // an index of a sum or contents of a sum or from value of a sum
      // an element
      case ("index"):
      case ("radicand"):
      case ("from"):
      case ("to"):
      case ("what"):
      case ("element"):
        this.draw = this.drawGenericBlock;
        break;

      // a component of a control
      case ("componentNumCtrl"):
        this.draw = this.drawComponentNumCtrl;
        break;

      // a component of a space
      case ("componentSpace"):
        this.draw = this.drawComponentSpace;
        break;
    }

  }

  /**
   *
   */
  richTextEditor.TextNode.prototype.clone = function() {
    var clone = new richTextEditor.TextNode(this.value, this.nodeType, this.style.clone());
    clone.parent = this.parent;

    for (var i=0, l=this.children.length; i<l; i++) {
      clone.addChild(this.children[i].clone());
    }
    
    return clone;
  }
  /**
   *
   */
  richTextEditor.TextNode.prototype.toStr = function() {
    var str = this.value;

    for (var i=0, l=this.children.length; i<l; i++) {
      str += " " + this.children[i].toStr();
    }
    
    return str;
  }

  /**
   * 
   */
  richTextEditor.TextNode.prototype.stringify = function() {
    var str = '{';

    // if (this.children.length > 0) {
      str += '"C":[';
      for (var i=0, l=this.children.length; i<l; i++) {
        str += this.children[i].stringify() + ((i==l-1)?'':',');
      }
      str += '],';
    // }

    // if (this.value) {
      str += '"V":"' + this.value + '",';
    // }

    str += '"NT":"' + this.nodeType + '",';
    str += '"S":' + JSON.stringify(this.style);

    return str + '}';
  }

  /**
   * Add a child to the tree of nodes
   * @param {richTextEditor.TextNode} child the child to add
   */
  richTextEditor.TextNode.prototype.addChild = function(child) {
    // add reference to the parent
    child.parent = this;
    this.children.push(child);
  }

  /**
   * 
   */
  richTextEditor.TextNode.prototype.removeChild = function(node) {
    var newChildren = []

    for (var i=0, l=this.children.length; i<l; i++) {
      if (this.children[i] !== node) {
        newChildren.push(this.children[i]);
      }
    }

    this.children = newChildren;
  }
  /**
   * 
   */
  richTextEditor.TextNode.prototype.getFirstTextNode = function() {
    var node = this;

    while (node.children.length > 0) {
      node = node.children[0];
    }

    return node;
  }
  /**
   * 
   */
  richTextEditor.TextNode.prototype.getLastTextNode = function() {
    var node = this;

    while (node.children.length > 0) {
      node = node.children[node.children.length-1];
    }

    return node;
  }
  /**
   * 
   */
  richTextEditor.TextNode.prototype.nextSibling = function() {
    if (this.parent) {
      var current = null;
      for (var i=0, l=this.parent.children.length; i<l; i++) {
        if (current) {
          return this.parent.children[i];
        }

        if (this.parent.children[i] === this) {
          current = true;
        }
      }
    }

    return null;
  }
  /**
   * 
   */
  richTextEditor.TextNode.prototype.prevSibling = function() {
    if (this.parent) {
      var current = null;
      for (var i=0, l=this.parent.children.length-1; i<l; i++) {
        if (this.parent.children[i+1] === this) {
          return this.parent.children[i];
        }
      }
    }

    return null;
  }

  /**
   * 
   */
  richTextEditor.TextNode.prototype.querySelectorAll = function(nodeType) {
    var elements = [];

    for (var i=0, l=this.children.length; i<l; i++) {
      elements = elements.concat( this.children[i].querySelectorAll(nodeType) );
    }

    if (this.nodeType === nodeType) {
      elements.push(this);
    }

    return elements;
  }

  /**
   * 
   */
  richTextEditor.TextNode.prototype.insertBefore = function(referenceNode, newNode) {
    newNode.parent = this;
    var indexOf = this.children.indexOf(referenceNode);

    if (indexOf !== -1) {
      this.children.splice(indexOf, 0, newNode);
    }
  }
  /**
   * 
   */
  richTextEditor.TextNode.prototype.insertAfter = function(referenceNode, newNode) {
    newNode.parent = this;
    var indexOf = this.children.indexOf(referenceNode);

    if (indexOf !== -1) {
      this.children.splice(indexOf+1, 0, newNode);
    }
  }

  /**
   * 
   */
  richTextEditor.TextNode.prototype.normalize = function() {
    var emptyNodes = this.querySelectorAll("textLineBlock").concat( this.querySelectorAll("formula") ).concat( this.querySelectorAll("numerator") ).concat( this.querySelectorAll("denominator") ).concat( this.querySelectorAll("superIndex") ).concat( this.querySelectorAll("subIndex") ).concat( this.querySelectorAll("index") ).concat( this.querySelectorAll("subIndex") ).concat( this.querySelectorAll("radicand") ).concat( this.querySelectorAll("from") ).concat( this.querySelectorAll("to") ).concat( this.querySelectorAll("what") ).concat( this.querySelectorAll("element") );
    
    for (var i=0, l=emptyNodes.length; i<l; i++) {
      if (emptyNodes[i].children.length === 0) {
        emptyNodes[i].addChild(new richTextEditor.TextNode("", "text", emptyNodes[i].style));
      }
    }

    var nodesWhitoutSiblings = this.querySelectorAll("formula").concat( this.querySelectorAll("fraction") ).concat( this.querySelectorAll("superIndex") ).concat( this.querySelectorAll("subIndex") ).concat( this.querySelectorAll("radical") ).concat( this.querySelectorAll("sum") ).concat( this.querySelectorAll("integral") ).concat( this.querySelectorAll("limit") ).concat( this.querySelectorAll("matrix") ).concat( this.querySelectorAll("defparts") ).concat( this.querySelectorAll("dynamicText") );
    
    
    for (var i=0, l=nodesWhitoutSiblings.length; i<l; i++) {
      if ( (nodesWhitoutSiblings[i].prevSibling() === null) || ((nodesWhitoutSiblings[i].prevSibling() !== null) && (nodesWhitoutSiblings[i].prevSibling().nodeType !== "text")) ) {
        nodesWhitoutSiblings[i].parent.insertBefore(nodesWhitoutSiblings[i], new richTextEditor.TextNode("", "text", nodesWhitoutSiblings[i].parent.style));
      }
      if ( (nodesWhitoutSiblings[i].nextSibling() === null) || ((nodesWhitoutSiblings[i].nextSibling() !== null) && (nodesWhitoutSiblings[i].nextSibling().nodeType !== "text")) ) {
        nodesWhitoutSiblings[i].parent.insertAfter(nodesWhitoutSiblings[i], new richTextEditor.TextNode("", "text", nodesWhitoutSiblings[i].parent.style));
      }
    }

    return this;
  }

  /**
   * 
   */
  richTextEditor.TextNode.prototype.removeEmptyText = function() {
    var textNodes = this.querySelectorAll("text");
    for (var i=0, l=textNodes.length; i<l; i++) {
      if (textNodes[i].value === "") {
        textNodes[i].parent.removeChild(textNodes[i]);
      }
    }
  }

  /**
   * 
   */
  richTextEditor.TextNode.prototype.adjustFontSize = function(insideFormula) {
    var fontSize = this.style.fontSize;

    if (this.nodeType === "formula") {
      insideFormula = true;
    }

    for (var i=0, l=this.children.length; i<l; i++) {
      if ((this.children[i].nodeType === "text") && (insideFormula)) {
        this.children[i].style.fontSize = fontSize;
        this.children[i].styleString = this.children[i].style.toString();
      }

      else if (this.children[i].nodeType === "index") {
        this.children[i].style.fontSize = Math.max( parseInt(fontSize - fontSize*0.5), 8 );
        this.children[i].styleString = this.children[i].style.toString();
        this.children[i].adjustFontSize(true);
      }

      else if (
        (this.children[i].nodeType === "to") ||
        (this.children[i].nodeType === "from")
      ) {
        this.children[i].style.fontSize = Math.max( parseInt(fontSize - fontSize*0.2), 8 );
        this.children[i].styleString = this.children[i].style.toString();
        this.children[i].adjustFontSize(true);
      }

      else if (
        (this.children[i].nodeType === "numerator") ||
        (this.children[i].nodeType === "denominator")
      ) {
        this.children[i].style.fontSize = Math.max( parseInt(fontSize - fontSize*0.1), 8 );
        this.children[i].styleString = this.children[i].style.toString();
        this.children[i].adjustFontSize(true);
      }

      else if (
        (this.children[i].nodeType === "subIndex") ||
        (this.children[i].nodeType === "superIndex")
      ) {
        this.children[i].style.fontSize = Math.max( parseInt(fontSize - fontSize*0.33), 8 );
        this.children[i].styleString = this.children[i].style.toString();
        this.children[i].adjustFontSize(true);
      }

      else {
        if (insideFormula) {
          this.children[i].style.fontSize = fontSize;
          this.children[i].styleString = this.children[i].style.toString();
        }
        this.children[i].adjustFontSize(insideFormula);
      }
    }
  }

  /**
   * 
   */
  richTextEditor.TextNode.prototype.propagateStyle = function(prop, value) {
    this.style[prop] = value;
    this.styleString = this.style.toString();

    for (var i=0, l=this.children.length; i<l; i++) {
      this.children[i].propagateStyle(prop, value);
    }
  }



  
  /**
   * 
   */
  richTextEditor.TextNode.prototype.update = function(ctx, externalColor) {
    this.calcPosDim();

    if (ctx) {
      ctx.canvas.setAttribute("width", this.metrics.w +1);
      ctx.canvas.setAttribute("height", this.metrics.h +1);
      this.draw(ctx, externalColor);
    }
  }



  /**
   * 
   */
  richTextEditor.TextNode.prototype.calcPosDim = function() {
    if (this.nodeType === "textBlock") {
      var lines = this.children;
      var marginX = 0;
      var displaceY = 0;
      var lineSep;

      this.metrics.w = 0;

      for (var i=0, l=lines.length; i<l; i++) {
        lines[i].adjustLine();
        lines[i].metrics.offsetX = marginX;
        lines[i].metrics.y = displaceY;
        displaceY += parseInt(lines[i].metrics.ascent +0.5);
        lines[i].metrics.offsetY = displaceY;
        
        lineSep = parseInt(lines[i].metrics.descent +0.5) +parseInt(1.5 + lines[i].style.fontSize*0.2);
        // lines[i].metrics.h += lineSep;
        displaceY += lineSep;

        this.metrics.w = Math.max(this.metrics.w, lines[i].metrics.w);
      }

      this.metrics.h = displaceY;
    }
  }
  /**
   * 
   */
  richTextEditor.TextNode.prototype.adjustLine = function() {
    var thisLine = this;

    if (this.nodeType === "textLineBlock") {
      this.metrics.w = 0;
      this.metrics.ascent = 0;
      this.metrics.descent = 0;

      var displaceX = 0;
      var children = this.children;
      var children_i;

      for (var i=0, l=children.length; i<l; i++) {
        children_i = children[i];

        //////////////////////////////////////////////////////////
        if (children_i.nodeType === "text") {
          richTextEditor.auxCtx.font = children_i.styleString;
          var value = (children_i.value !== "") ? children_i.value : "\u200A";
          children_i.metrics = getFontMetrics(richTextEditor.auxCtx.font);
          children_i.metrics.w = parseInt(0.5 + richTextEditor.auxCtx.measureText(value).width);

          children_i.metrics.offsetX = displaceX;

          Object.defineProperties(children_i.metrics, {
            "x" : { get : function() { return thisLine.metrics.offsetX + this.offsetX } },
            "y" : { get : function() { return thisLine.metrics.offsetY; } }
          });
        }

        //////////////////////////////////////////////////////////
        else if (children_i.nodeType === "formula") {
          children_i.adjustFormula();

          children_i.metrics.marginX = parseInt(1.5 + this.style.fontSize*factorMarginH);
          children_i.metrics.marginY = parseInt(1.5 + this.style.fontSize*factorMarginV);

          children_i.metrics.paddingX = parseInt(1.5 + this.style.fontSize*factorPaddingH);
          children_i.metrics.paddingY = parseInt(1.5 + this.style.fontSize*factorPaddingV);

          children_i.metrics.offsetX_aux = displaceX;

          Object.defineProperties(children_i.metrics, {
            "x" : { get : function() { return this.offsetX; } },
            "y" : { get : function() { return this.offsetY; } },

            "offsetX" : { get : function() { return thisLine.metrics.offsetX +this.marginX +this.offsetX_aux; } },
            "offsetY" : { get : function() { return thisLine.metrics.offsetY; } }
          });

          children_i.metrics.w += 2*children_i.metrics.paddingX;
          children_i.metrics.ascent += children_i.metrics.paddingY;
          children_i.metrics.descent += children_i.metrics.paddingY;
          children_i.metrics.h += 2*children_i.metrics.paddingY;

          displaceX += 2*children_i.metrics.marginX;
        }

        // line metrics
        this.metrics.w += children_i.metrics.w +2*children_i.metrics.marginX;
        this.metrics.ascent = Math.max(this.metrics.ascent, children_i.metrics.ascent);
        this.metrics.descent = Math.max(this.metrics.descent, children_i.metrics.descent);
        displaceX += parseInt(children_i.metrics.w + 0.5);
      }

      this.metrics.h = this.metrics.ascent + this.metrics.descent;
    }
  }
  /**
   * 
   */
  richTextEditor.TextNode.prototype.adjustFormula = function() {
    var thisFormula = this;

    this.metrics = { ascent:0, descent:0, h:0, w:0, x:0, y:0, offsetX:0, offsetY:0, marginX:0, marginY:0, paddingX:0, paddingY:0 };

    var children = this.children;
    var children_i;
    var displaceX = 0;

    var prevChild = { metrics : { ascent:0, descent:0, h:0, w:0, x:0, y:0, offsetX:0, offsetY:0, marginX:0, marginY:0, paddingX:0, paddingY:0 } };

    for (var i=0, l=children.length; i<l; i++) {
      children_i = children[i];

      //////////////////////////////////////////////////////////
      if (children_i.nodeType === "text") {
        richTextEditor.auxCtx.font = children_i.styleString;
        children_i.metrics = getFontMetrics(richTextEditor.auxCtx.font);

        var value = (children_i.value !== "") ? children_i.value : "\u200A";
        children_i.metrics.w = parseInt(0.5 + richTextEditor.auxCtx.measureText(value).width);

        children_i.metrics.offsetX = displaceX;

        Object.defineProperties(children_i.metrics, {
          "x" : { get : function() { return thisFormula.metrics.offsetX +thisFormula.metrics.paddingX +this.offsetX ; } },
          "y" : { get : function() { return thisFormula.metrics.offsetY; } }
        });

        displaceX += thisFormula.metrics.marginX;
      }

      
      //////////////////////////////////////////////////////////
      else if (children_i.nodeType === "dynamicText") {
        richTextEditor.auxCtx.font = children_i.styleString;
        children_i.metrics = getFontMetrics(richTextEditor.auxCtx.font);

        children_i.metrics.marginX = parseInt(1.5 + this.style.fontSize*factorMarginH);
        children_i.metrics.paddingX = parseInt(1.5 + this.style.fontSize*factorPaddingH);

        children_i.metrics.w = parseInt(0.5 + richTextEditor.auxCtx.measureText("expr").width) + 2*children_i.metrics.paddingX;

        children_i.metrics.offsetX_aux = displaceX;

        Object.defineProperties(children_i.metrics, {
          "x" : { get : function() { return this.offsetX; } }, 
          "y" : { get : function() { return this.offsetY; } }, 

          "offsetX" : { get : function() { return thisFormula.metrics.offsetX +thisFormula.metrics.paddingX +this.offsetX_aux +this.marginX; } }, 
          "offsetY" : { get : function() { return thisFormula.metrics.offsetY; } },
        });

        displaceX += 2*children_i.metrics.marginX;
      }

      //////////////////////////////////////////////////////////
      // else if (children_i.nodeType === "mathSymbol") {
      //   richTextEditor.auxCtx.font = children_i.styleString;
      //   children_i.metrics = getFontMetrics(richTextEditor.auxCtx.font);

      //   let marginX = parseInt(0.5 + richTextEditor.auxCtx.measureText("\u2009").width);
      //   // let marginX = parseInt(0.5 + richTextEditor.auxCtx.measureText("\u2008").width);

      //   children_i.metrics.w = parseInt(0.5 + richTextEditor.auxCtx.measureText(children_i.value).width) + marginX*2;

      //   children_i.metrics.offsetX = displaceX +marginX;

      //   Object.defineProperties(children_i.metrics, {
      //     "x" : { get : function() { return thisFormula.metrics.offsetX + this.offsetX } },
      //     "y" : { get : function() { return thisFormula.metrics.offsetY; } }
      //   });
      // }      

      //////////////////////////////////////////////////////////
      if (children_i.nodeType === "superIndex") {
        var superIndex = children_i;
        superIndex.adjustFormula();

        superIndex.metrics.marginX = parseInt(1.5 + 0*this.style.fontSize*factorMarginH);
        superIndex.metrics.paddingX = parseInt(1.5 + 0.25*this.style.fontSize*factorPaddingH);
        superIndex.metrics.paddingY = parseInt(1.5 + this.style.fontSize*factorPaddingV);

        superIndex.metrics.offsetX_aux = displaceX;

        superIndex.metrics.prevChild = prevChild;
        
        Object.defineProperties(superIndex.metrics, {
          "x" : { get : function() { return this.offsetX; } }, 
          "y" : { get : function() { return this.offsetY; } }, 

          "offsetX" : { get : function() { return thisFormula.metrics.offsetX +thisFormula.metrics.paddingX +this.offsetX_aux +this.marginX; } }, 
          "offsetY" : { get : function() { return thisFormula.metrics.offsetY -this.descent +this.prevChild.metrics.descent -parseInt(2*this.prevChild.metrics.h/7); } },
        });

        superIndex.metrics.w += 2*superIndex.metrics.paddingX;
        superIndex.metrics.ascent += superIndex.metrics.paddingY;
        superIndex.metrics.descent += superIndex.metrics.paddingY;
        superIndex.metrics.h += 2*superIndex.metrics.paddingY;

        this.metrics.ascent = superIndex.metrics.descent - superIndex.metrics.prevChild.metrics.descent + parseInt(2*superIndex.metrics.prevChild.metrics.h/7) + superIndex.metrics.ascent;

        displaceX += 2*superIndex.metrics.marginX;
      }

      //////////////////////////////////////////////////////////
      else if (children_i.nodeType === "subIndex") {
        var subIndex = children_i;
        subIndex.adjustFormula();

        subIndex.metrics.marginX = parseInt(1.5 + 1.25*this.style.fontSize*factorMarginH);
        subIndex.metrics.paddingX = 0*parseInt(1.5 + 0.25*this.style.fontSize*factorPaddingH);
        subIndex.metrics.paddingY = parseInt(1.5 + this.style.fontSize*factorPaddingV);

        subIndex.metrics.offsetX_aux = displaceX;

        subIndex.metrics.prevChild = prevChild;

        Object.defineProperties(subIndex.metrics, {
          "x" : { get : function() { return this.offsetX; } },
          "y" : { get : function() { return this.offsetY; } },

          "offsetX" : { get : function() { return thisFormula.metrics.offsetX +thisFormula.metrics.paddingX +this.offsetX_aux +0*this.marginX; } },
          "offsetY" : { get : function() { return thisFormula.metrics.offsetY +this.ascent +subIndex.metrics.prevChild.metrics.descent -parseInt(4*subIndex.metrics.prevChild.metrics.h/7); } },
        });

        // subIndex.metrics.w += 2*subIndex.metrics.paddingX;
        subIndex.metrics.w += subIndex.metrics.paddingX;
        subIndex.metrics.ascent += subIndex.metrics.paddingY;
        subIndex.metrics.descent += subIndex.metrics.paddingY;
        subIndex.metrics.h += 2*subIndex.metrics.paddingY;

        this.metrics.descent = subIndex.metrics.ascent +subIndex.metrics.prevChild.metrics.descent -parseInt(4*subIndex.metrics.prevChild.metrics.h/7) +subIndex.metrics.descent;

        // displaceX += 2*subIndex.metrics.marginX;
        displaceX += subIndex.metrics.marginX;
      }

      //////////////////////////////////////////////////////////
      else if (children_i.nodeType === "fraction") {
        var fraction = children_i;

        fraction.adjustFormula();

        var components = fraction.children;
        var num = components[0];
        var den = components[1];

        fraction.metrics.marginX = parseInt(1.5 + this.style.fontSize*factorMarginH);
        fraction.metrics.paddingX = 0*parseInt(1.5 + this.style.fontSize*factorPaddingH);
        fraction.metrics.paddingY = 0*parseInt(1.5 + this.style.fontSize*factorPaddingV);

        var maxWidth = Math.max(num.metrics.w, den.metrics.w) +2*fraction.metrics.paddingX;

        fraction.metrics.prevChild = prevChild;

        fraction.metrics.offsetX_aux = displaceX;
        var offsetY = parseInt(-prevChild.metrics.descent +4*prevChild.metrics.h/9);

        // fraction position
        Object.defineProperties(fraction.metrics, {
          "x" : { get : function() { return this.offsetX; } },
          "y" : { get : function() { return this.offsetY +offsetY; } },

          "offsetX" : { get : function() { return thisFormula.metrics.offsetX +thisFormula.metrics.paddingX +this.marginX +this.offsetX_aux; } },
          "offsetY" : { get : function() { return thisFormula.metrics.offsetY -offsetY; } },
        });

        // num position
        Object.defineProperties(num.metrics, {
          "parent" : { value : fraction },
          "maxWidth" : { value : maxWidth },

          "x" : { get : function() { return this.offsetX; } },
          "y" : { get : function() { return this.offsetY; } },

          "offsetX" : { get : function() { return this.parent.metrics.offsetX + parseInt((this.maxWidth - this.w)/2); } },
          "offsetY" : { get : function() { return this.parent.metrics.offsetY - this.descent -this.parent.metrics.paddingY; } },
        });

        // den position
        Object.defineProperties(den.metrics, {
          "parent" : { value : fraction },
          "maxWidth" : { value : maxWidth },

          "x" : { get : function() { return this.offsetX; } },
          "y" : { get : function() { return this.offsetY; } },

          "offsetX" : { get : function() { return this.parent.metrics.offsetX + parseInt((this.maxWidth - this.w)/2); } },
          "offsetY" : { get : function() { return this.parent.metrics.offsetY + this.ascent + this.parent.metrics.paddingY; } },
        });

        fraction.metrics.w = maxWidth;
        fraction.metrics.ascent = num.metrics.h +offsetY +2*fraction.metrics.paddingY;
        fraction.metrics.descent = den.metrics.h -offsetY +2*fraction.metrics.paddingY;
        fraction.metrics.h = num.metrics.h + den.metrics.h +4*fraction.metrics.paddingY;

        displaceX += 2*fraction.metrics.marginX;
      }

      //////////////////////////////////////////////////////////
      else if (children_i.nodeType === "radical") {
        var radical = children_i;

        radical.adjustFormula();

        var components = radical.children;
        var index = components[0];
        var radicand = components[1];

        radical.metrics.marginX = parseInt(1.5 + this.style.fontSize*factorMarginH);
        radical.metrics.paddingX = parseInt(1.5 + this.style.fontSize*factorPaddingH);
        radical.metrics.paddingY = parseInt(1.5 + this.style.fontSize*factorPaddingV);

        radical.metrics.offsetX_aux = displaceX;
        // radical position
        Object.defineProperties(radical.metrics, {
          "x" : { get : function() { return this.offsetX; } },
          "y" : { get : function() { return this.offsetY; } },

          "offsetX" : { get : function() { return thisFormula.metrics.offsetX +thisFormula.metrics.paddingX +this.marginX +this.offsetX_aux; } },
          "offsetY" : { get : function() { return thisFormula.metrics.offsetY; } },
        });

        //////////////////////////////////
        // w=772, h=1000 radicalSign
        var fontSize = radical.style.fontSize;
        radical.radicalSign = {
          w : fontSize,
          scaleX : fontSize/722,
          scaleY : radicand.metrics.h/1000,
        };
        var displaceIndex = parseInt(index.metrics.w - 2*radical.radicalSign.w/3);

        Object.defineProperties(radical.radicalSign, {
          "parent" : { value : radical },
          "displaceIndex" : { value : displaceIndex },

          "x" : { get: function() { return this.parent.metrics.offsetX +this.parent.metrics.paddingX + Math.max(this.displaceIndex, 0); } },
          "y" : { get: function() { return thisFormula.metrics.offsetY -radicand.metrics.ascent; } },
        });

        // index position
        Object.defineProperties(index.metrics, {
          "parent" : { value : radical },
          "displaceIndex" : { value : displaceIndex },
          "fontSize" : { value : fontSize },

          "x" : { get : function() { return this.offsetX; } },
          "y" : { get : function() { return this.offsetY; } },

          "offsetX" : { get : function() { return this.parent.metrics.offsetX +this.parent.metrics.paddingX + Math.max(this.displaceIndex, 0) -this.displaceIndex; } },
          "offsetY" : { get : function() { return thisFormula.metrics.offsetY -this.descent -2*this.fontSize/5; } },
        });

        // radicand position
        Object.defineProperties(radicand.metrics, {
          "parent" : { value : radical },
          "displaceIndex" : { value : displaceIndex },

          "x" : { get : function() { return this.offsetX; } },
          "y" : { get : function() { return this.offsetY; } },

          "offsetX" : { get : function() { return this.parent.metrics.offsetX +this.parent.metrics.paddingX +this.parent.radicalSign.w +Math.max(this.displaceIndex, 0) } },
          "offsetY" : { get : function() { return thisFormula.metrics.offsetY; } },
        });
        
        var indexWidth = (index.metrics.w < 2*radical.radicalSign.w/3) ? radical.radicalSign.w : parseInt(index.metrics.w+radical.radicalSign.w/3);

        radical.metrics.w = indexWidth +2*radical.metrics.paddingX + radicand.metrics.w;
        radical.metrics.ascent = Math.max(radicand.metrics.ascent, (index.metrics.h +2*fontSize/5)) +radical.metrics.paddingY;
        radical.metrics.descent = radicand.metrics.descent +radical.metrics.paddingY;
        radical.metrics.h = radical.metrics.ascent + radical.metrics.descent;

        displaceX += 2*radical.metrics.marginX;
      }

      //////////////////////////////////////////////////////////
      else if (children_i.nodeType === "sum") {
        var sum = children_i;

        sum.adjustFormula();

        var components = sum.children;
        var sumFrom = components[0];
        var sumTo = components[1];
        var sumWhat = components[2];

        sum.metrics.marginX = parseInt(1.5 + this.style.fontSize*factorMarginH);
        sum.metrics.paddingX = parseInt(1.5 + this.style.fontSize*factorPaddingH);
        sum.metrics.paddingY = parseInt(1.5 + this.style.fontSize*factorPaddingV);

        sum.metrics.offsetX_aux = displaceX;

        // sum position
        Object.defineProperties(sum.metrics, {
          "x" : { get : function() { return this.offsetX; } },
          "y" : { get : function() { return this.offsetY; } },

          "offsetX" : { get : function() { return thisFormula.metrics.offsetX +thisFormula.metrics.paddingX +this.marginX +this.offsetX_aux; } },
          "offsetY" : { get : function() { return thisFormula.metrics.offsetY; } },
        });

        //////////////////////////////////
        // w=780, h=1000
        richTextEditor.auxCtx.font = this.style.toString();;
        var tmpMetric = getFontMetrics(richTextEditor.auxCtx.font);
        
        var sigmaHeight = parseInt(tmpMetric.h*1.2);
        var sigmaWidth = parseInt(0.5 +sigmaHeight*780/1000);
        sum.sigmaSign = {
          w : sigmaWidth,
          h : sigmaHeight,
          scale : sigmaHeight/1000,
        };
        var sumWidth = Math.max(sumTo.metrics.w, sumFrom.metrics.w, sum.sigmaSign.w);

        sum.sigmaSign.parent = sum;
        Object.defineProperties(sum.sigmaSign, {
          "sumWidth" : { value : sumWidth },

          "x" : { get: function() { return this.parent.metrics.offsetX + this.parent.metrics.paddingX +parseInt((this.sumWidth - this.w)/2); } },
          "y" : { get: function() { return thisFormula.metrics.offsetY +tmpMetric.descent -(this.h +tmpMetric.h)/2; } },
        });

        var newBaselineTo = tmpMetric.descent -sumTo.metrics.descent -(sigmaHeight +tmpMetric.h)/2 -sum.metrics.paddingY;

        // sumTo position
        Object.defineProperties(sumTo.metrics, {
          "parent" : { value : sum },
          "sumWidth" : { value : sumWidth },
          "newBaselineTo" : { value : newBaselineTo },

          "x" : { get : function() { return this.offsetX; } },
          "y" : { get : function() { return this.offsetY; } },

          "offsetX" : { get : function() { return this.parent.metrics.offsetX + this.parent.metrics.paddingX +parseInt((this.sumWidth - this.w)/2); } },
          "offsetY" : { get : function() { return thisFormula.metrics.offsetY + this.newBaselineTo; } },
        });

        var newBaselineFrom = sumFrom.metrics.ascent +tmpMetric.descent +(sigmaHeight -tmpMetric.h)/2 +sum.metrics.paddingY;

        // sumFrom position
        Object.defineProperties(sumFrom.metrics, {
          "parent" : { value : sum },
          "sumWidth" : { value : sumWidth },
          "newBaselineFrom" : { value : newBaselineFrom },

          "x" : { get : function() { return this.offsetX; } },
          "y" : { get : function() { return this.offsetY; } },

          "offsetX" : { get : function() { return this.parent.metrics.offsetX + this.parent.metrics.paddingX +parseInt((this.sumWidth - this.w)/2); } },
          "offsetY" : { get : function() { return thisFormula.metrics.offsetY + this.newBaselineFrom; } },
        });

        // sumWhat position
        Object.defineProperties(sumWhat.metrics, {
          "parent" : { value : sum },
          "sumWidth" : { value : sumWidth },

          "x" : { get : function() { return this.offsetX; } },
          "y" : { get : function() { return this.offsetY; } },

          "offsetX" : { get : function() { return this.parent.metrics.offsetX + 2*this.parent.metrics.paddingX +this.sumWidth; } },
          "offsetY" : { get : function() { return thisFormula.metrics.offsetY; } },
        });

        sum.metrics.w = sumWidth + sumWhat.metrics.w +3*sum.metrics.paddingX;
        sum.metrics.ascent = Math.max( sumWhat.metrics.ascent, (-newBaselineTo +sumTo.metrics.ascent) ) +sum.metrics.paddingY;
        sum.metrics.descent = Math.max( sumWhat.metrics.descent, (newBaselineFrom +sumFrom.metrics.descent) ) +sum.metrics.paddingY;
        sum.metrics.h = sum.metrics.ascent + sum.metrics.descent;

        displaceX += 2*sum.metrics.marginX;
      }
      
      //////////////////////////////////////////////////////////
      else if (children_i.nodeType === "integral") {
        var integral = children_i;

        integral.adjustFormula();

        var components = integral.children;
        var integralFrom = components[0];
        var integralTo = components[1];
        var integralWhat = components[2];

        integral.metrics.marginX = parseInt(1.5 + this.style.fontSize*factorMarginH);
        integral.metrics.paddingX = parseInt(1.5 + this.style.fontSize*factorPaddingH);
        integral.metrics.paddingY = parseInt(1.5 + this.style.fontSize*factorPaddingV);

        integral.metrics.offsetX_aux = displaceX;

        // integral position
        Object.defineProperties(integral.metrics, {
          "x" : { get : function() { return this.offsetX; } },
          "y" : { get : function() { return this.offsetY; } },

          "offsetX" : { get : function() { return thisFormula.metrics.offsetX +thisFormula.metrics.paddingX +this.marginX +this.offsetX_aux; } },
          "offsetY" : { get : function() { return thisFormula.metrics.offsetY; } },
        });

        //////////////////////////////////
        // w=529, h=1000
        richTextEditor.auxCtx.font = this.style.toString();;
        var tmpMetric = getFontMetrics(richTextEditor.auxCtx.font);

        var integralHeight = parseInt(tmpMetric.h*1.2);
        var integralWidth = parseInt(10.5 +integralHeight*529/1000);
        integral.sign = {
          w : integralWidth,
          h : integralHeight,
          scale : integralHeight/1000,
        };

        integral.sign.parent = integral;
        Object.defineProperties(integral.sign, {
          "x" : { get: function() { return this.parent.metrics.offsetX + this.parent.metrics.paddingX; } },
          "y" : { get: function() { return thisFormula.metrics.offsetY +tmpMetric.descent -(this.h +tmpMetric.h)/2; } },
        });

        var newBaselineTo = tmpMetric.descent -(integralHeight + tmpMetric.h)/2 -integralTo.metrics.descent +integralHeight/3;

        // integralTo position
        Object.defineProperties(integralTo.metrics, {
          "parent" : { value : integral },
          "integralWidth" : { value : integralWidth },
          "newBaselineTo" : { value : newBaselineTo },

          "x" : { get : function() { return this.offsetX; } },
          "y" : { get : function() { return this.offsetY; } },

          "offsetX" : { get : function() { return this.parent.metrics.offsetX + this.parent.metrics.paddingX +parseInt(4*this.integralWidth/5); } },
          "offsetY" : { get : function() { return thisFormula.metrics.offsetY + this.newBaselineTo; } },
        });

        var newBaselineFrom = tmpMetric.descent +integralFrom.metrics.ascent/2;

        // integralFrom position
        Object.defineProperties(integralFrom.metrics, {
          "parent" : { value : integral },
          "integralWidth" : { value : integralWidth },
          "newBaselineFrom" : { value : newBaselineFrom },

          "x" : { get : function() { return this.offsetX; } },
          "y" : { get : function() { return this.offsetY; } },

          "offsetX" : { get : function() { return this.parent.metrics.offsetX + this.parent.metrics.paddingX +parseInt(2*this.integralWidth/5); } },
          "offsetY" : { get : function() { return thisFormula.metrics.offsetY + this.newBaselineFrom; } },
        });

        var whatDisplace = Math.max( parseInt(4*integralWidth/5) + integralTo.metrics.w, parseInt(2*integralWidth/5 + integralFrom.metrics.w) ) +integral.metrics.paddingX;

        // integralWhat position
        Object.defineProperties(integralWhat.metrics, {
          "parent" : { value : integral },
          "whatDisplace" : { value : whatDisplace },

          "x" : { get : function() { return this.offsetX; } },
          "y" : { get : function() { return this.offsetY; } },

          "offsetX" : { get : function() { return this.parent.metrics.offsetX + this.parent.metrics.paddingX +this.whatDisplace; } },
          "offsetY" : { get : function() { return thisFormula.metrics.offsetY; } },
        });

        integral.metrics.w = whatDisplace + integralWhat.metrics.w +2*integral.metrics.paddingX;
        integral.metrics.ascent = Math.max( integralWhat.metrics.ascent, (-newBaselineTo +integralTo.metrics.ascent) ) +integral.metrics.paddingY;
        integral.metrics.descent = Math.max( integralWhat.metrics.descent, (newBaselineFrom +integralFrom.metrics.descent), integralHeight -integral.metrics.ascent ) +integral.metrics.paddingY;
        integral.metrics.h = Math.max(integral.metrics.ascent + integral.metrics.descent, integralHeight);

        displaceX += 2*integral.metrics.marginX;
      }

      //////////////////////////////////////////////////////////
      else if (children_i.nodeType === "limit") {
        var limit = children_i;

        limit.adjustFormula();

        var components = limit.children;
        var limitFrom = components[0];
        var limitTo = components[1];
        var limitWhat = components[2];

        limit.metrics.marginX = parseInt(1.5 + this.style.fontSize*factorMarginH);
        limit.metrics.paddingX = parseInt(1.5 + this.style.fontSize*factorPaddingH);
        limit.metrics.paddingY = parseInt(1.5 + this.style.fontSize*factorPaddingV);

        limit.metrics.offsetX_aux = displaceX;
        // limit position
        Object.defineProperties(limit.metrics, {
          "x" : { get : function() { return this.offsetX; } },
          "y" : { get : function() { return this.offsetY; } },

          "offsetX" : { get : function() { return thisFormula.metrics.offsetX +thisFormula.metrics.paddingX +this.marginX +this.offsetX_aux; } },
          "offsetY" : { get : function() { return thisFormula.metrics.offsetY; } },
        });

        //////////////////////////////////
        richTextEditor.auxCtx.font = this.style.toString();;
        var tmpMetric = getFontMetrics(richTextEditor.auxCtx.font);
        var limitTextWidth = parseInt(0.5 + richTextEditor.auxCtx.measureText("lím").width);
        var arrowWidth = parseInt(0.5 + richTextEditor.auxCtx.measureText("→").width);

        limitWidth = Math.max(limitTextWidth, limitFrom.metrics.w + arrowWidth + limitTo.metrics.w);

        limit.limitText = {
          parent: limit,
        };
        Object.defineProperties(limit.limitText, {
          "limitWidth" : { value : limitWidth },
          "limitTextWidth" : { value : limitTextWidth },

          "x" : { get : function() { return this.parent.metrics.offsetX + this.parent.metrics.paddingX + (this.limitWidth - this.limitTextWidth)/2 } },
        });

        var newBaseline = tmpMetric.descent +Math.max(limitFrom.metrics.ascent, limitTo.metrics.ascent, 2*tmpMetric.ascent/3) +limit.metrics.paddingY;

        limit.limitArrow = {
          parent: limit,
        };
        Object.defineProperties(limit.limitArrow, {
          "newBaseline" : { value : newBaseline },

          "x" : { get : function() { return this.parent.metrics.offsetX + this.parent.metrics.paddingX +limitFrom.metrics.w} },
          "y" : { get : function() { return thisFormula.metrics.offsetY + this.newBaseline; } },
        });

        // limitFrom position
        Object.defineProperties(limitFrom.metrics, {
          "parent" : { value : limit },
          "newBaseline" : { value : newBaseline },

          "x" : { get : function() { return this.offsetX; } },
          "y" : { get : function() { return this.offsetY; } },

          "offsetX" : { get : function() { return this.parent.metrics.offsetX + this.parent.metrics.paddingX; } },
          "offsetY" : { get : function() { return thisFormula.metrics.offsetY + this.newBaseline; } },
        });

        // limitTo position
        Object.defineProperties(limitTo.metrics, {
          "parent" : { value : limit },
          "arrowWidth" : { value : arrowWidth },
          "newBaseline" : { value : newBaseline },

          "x" : { get : function() { return this.offsetX; } },
          "y" : { get : function() { return this.offsetY; } },
          
          "offsetX" : { get : function() { return this.parent.metrics.offsetX + this.parent.metrics.paddingX + limitFrom.metrics.w + this.arrowWidth; } },
          "offsetY" : { get : function() { return thisFormula.metrics.offsetY + this.newBaseline; } },
        });

        // limitWhat position
        Object.defineProperties(limitWhat.metrics, {
          "parent" : { value : limit },
          "limitWidth" : { value : limitWidth },

          "x" : { get : function() { return this.offsetX; } },
          "y" : { get : function() { return this.offsetY; } },
          
          "offsetX" : { get : function() { return this.parent.metrics.offsetX + 2*this.parent.metrics.paddingX + this.limitWidth; } },
          "offsetY" : { get : function() { return thisFormula.metrics.offsetY; } },
        });

        limit.metrics.w = limitWidth + limitWhat.metrics.w +3*limit.metrics.paddingX;
        limit.metrics.ascent = Math.max(limitWhat.metrics.ascent, tmpMetric.ascent) +limit.metrics.paddingY;
        limit.metrics.descent = newBaseline + Math.max(limitFrom.metrics.descent, limitTo.metrics.descent) +limit.metrics.paddingY;
        limit.metrics.h = limit.metrics.ascent + limit.metrics.descent;

        displaceX += 2*limit.metrics.marginX;
      }

      //////////////////////////////////////////////////////////
      else if (children_i.nodeType === "matrix") {
        var matrix = children_i;

        matrix.adjustFormula();
        
        var components = matrix.children;
        var rows = matrix.rows;
        var cols = matrix.columns;

        matrix.metrics.marginX = parseInt(1.5 + this.style.fontSize*factorMarginH);
        matrix.metrics.paddingX = parseInt(1.5 + this.style.fontSize*factorPaddingH);
        matrix.metrics.paddingY = parseInt(1.5 + this.style.fontSize*factorPaddingV);

        matrix.metrics.offsetX_aux = displaceX;
        // matrix position
        Object.defineProperties(matrix.metrics, {
          "x" : { get : function() { return this.offsetX; } },
          "y" : { get : function() { return this.offsetY; } },

          "offsetX" : { get : function() { return thisFormula.metrics.offsetX +thisFormula.metrics.paddingX +this.marginX +this.offsetX_aux; } },
          "offsetY" : { get : function() { return thisFormula.metrics.offsetY; } },
        });
        
        //////////////////////////////////
        richTextEditor.auxCtx.font = this.style.toString();;
        var tmpMetric = getFontMetrics(richTextEditor.auxCtx.font);

        var rowsH = [];
        var colsW = [];

        var index_row;
        var index_col;

        // get the max height of the rows and the max width of the columns
        for (var j=0, k=rows*cols; j<k; j++) {
          index_row = parseInt(j/cols);
          index_col = j % cols;
          
          rowsH[index_row] = Math.max(rowsH[index_row] || 0, components[j].metrics.h);

          colsW[index_col] = Math.max(colsW[index_col] || 0, components[j].metrics.w);
        }

        var matrixW = (1+cols)*matrix.metrics.paddingX;
        for (var j=0; j<cols; j++) { matrixW += colsW[j]; };

        var matrixH = (1+rows)*matrix.metrics.paddingY;
        for (var j=0; j<rows; j++) { matrixH += rowsH[j]; };
        
        var dispY = tmpMetric.descent - tmpMetric.h/2;

        for (var j=0, k=rows*cols; j<k; j++) {
          index_row = parseInt(j/cols);
          index_col = j % cols;

          components[j].metrics.offsetX_aux = partialSum(colsW, index_col) + (colsW[index_col] - components[j].metrics.w)/2 +index_col*matrix.metrics.paddingX;
          components[j].metrics.offsetY_aux = partialSum(rowsH, index_row) + (rowsH[index_row] - components[j].metrics.h)/2 +(1+index_row)*matrix.metrics.paddingY;

          Object.defineProperties(components[j].metrics, {
            "parent" : { value : matrix },
            "matrixH" : { value : matrixH },
            "dispY" : { value : dispY },

            "x" : { get : function() { return this.offsetX; } },
            "y" : { get : function() { return this.offsetY; } },

            "offsetX" : { get : function() { return this.parent.metrics.offsetX + this.parent.metrics.paddingX + this.offsetX_aux; } },
            "offsetY" : { get : function() { return thisFormula.metrics.offsetY - this.matrixH/2 + this.ascent + this.offsetY_aux + this.dispY; } },
          });
        }

        matrix.metrics.w = matrixW ;
        matrix.metrics.ascent = matrixH/2 -dispY;
        matrix.metrics.descent = matrixH/2 +dispY;
        matrix.metrics.h = matrix.metrics.ascent + matrix.metrics.descent;

        displaceX += 2*matrix.metrics.marginX;
      }
      
      //////////////////////////////////////////////////////////
      else if (children_i.nodeType === "defparts") {
        var defparts = children_i;

        defparts.adjustFormula();

        var components = children_i.children;
        var parts = children_i.parts;

        defparts.metrics.marginX = parseInt(1.5 + this.style.fontSize*factorMarginH);
        defparts.metrics.paddingX = parseInt(1.5 + this.style.fontSize*factorPaddingH);
        defparts.metrics.paddingY = parseInt(1.5 + this.style.fontSize*factorPaddingV);

        defparts.metrics.offsetX_aux = displaceX;
        // defparts position
        Object.defineProperties(defparts.metrics, {
          "parent" : { value : thisFormula },

          "x" : { get : function() { return this.offsetX -2*this.marginX; } },
          "y" : { get : function() { return this.offsetY; } },
          
          "offsetX" : { get : function() { return thisFormula.metrics.offsetX +thisFormula.metrics.paddingX +3*this.marginX +this.offsetX_aux; } },
          "offsetY" : { get : function() { return thisFormula.metrics.offsetY; } },
        });

        //////////////////////////////////
        richTextEditor.auxCtx.font = this.style.toString();;
        var tmpMetric = getFontMetrics(richTextEditor.auxCtx.font);

        var defpartsW = 0;
        var defpartsH = defparts.metrics.paddingY;
        var dispY = tmpMetric.descent - tmpMetric.h/2;

        for (var j=0; j<parts; j++) {
          components[j].metrics.offsetY_aux = defpartsH;

          defpartsW = Math.max(defpartsW, components[j].metrics.w);
          defpartsH += components[j].metrics.h +defparts.metrics.paddingY;
          
          Object.defineProperties(components[j].metrics, {
            "parent" : { value : defparts },
            "dispY" : { value : dispY },

            "x" : { get : function() { return this.offsetX; } },
            "y" : { get : function() { return this.offsetY; } },
            
            "offsetX" : { get : function() { return this.parent.metrics.offsetX + this.parent.metrics.paddingX; } },
            "offsetY" : { get : function() { return thisFormula.metrics.offsetY - this.parent.metrics.defpartsH/2 +this.ascent +this.offsetY_aux + this.dispY; } },
          });
        }
        defparts.metrics.defpartsH = defpartsH;

        defparts.metrics.w = defpartsW +4*defparts.metrics.paddingX;
        defparts.metrics.ascent = defpartsH/2 -dispY;
        defparts.metrics.descent = defpartsH/2 +dispY;
        defparts.metrics.h = defparts.metrics.ascent + defparts.metrics.descent;

        displaceX += 2*defparts.metrics.marginX;
      }

      //////////////////////////////////////////////////////////
      else if ( 
        (children_i.nodeType === "numerator") || 
        (children_i.nodeType === "denominator") ||
        (children_i.nodeType === "index") ||
        (children_i.nodeType === "radicand") ||
        (children_i.nodeType === "from") ||
        (children_i.nodeType === "to") ||
        (children_i.nodeType === "what") ||
        (children_i.nodeType === "element")
      ) {
        children_i.adjustFormula();

        children_i.metrics.paddingX = parseInt(1.5 + this.style.fontSize*factorPaddingH);
        children_i.metrics.paddingY = parseInt(1.5 + this.style.fontSize*factorPaddingV);

        children_i.metrics.w += 2*children_i.metrics.paddingX;
        children_i.metrics.ascent += children_i.metrics.paddingY;
        children_i.metrics.descent += children_i.metrics.paddingY;
        children_i.metrics.h = children_i.metrics.ascent + children_i.metrics.descent;
      }

      //////////////////////////////////////////////////////////
      // asign the previous child
      prevChild = children_i;

      //////////////////////////////////////////////////////////
      this.metrics.ascent = Math.max(this.metrics.ascent, children_i.metrics.ascent);
      this.metrics.descent = Math.max(this.metrics.descent, children_i.metrics.descent);
      // this.metrics.w += parseInt(children_i.metrics.w + 0.5);
      this.metrics.w += children_i.metrics.w +2*children_i.metrics.marginX;
      this.metrics.h = this.metrics.ascent + this.metrics.descent;
      displaceX += parseInt(children_i.metrics.w + 0.5);
    }
  }

  /**
   * 
   */
  richTextEditor.TextNode.prototype.drawTextBlock = function(ctx, externalColor) {
    // ctx.fillStyle = "white";
    // ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    localColor = externalColor;

    ctx.textAlign = "start";
    ctx.textBaseLine = "alphabetic";

    for (var i=0, l=this.children.length; i<l; i++) {
      this.children[i].draw(ctx);
    }

    // ctx.beginPath();
    // ctx.rect(this.metrics.x, this.metrics.y, this.metrics.w, this.metrics.h);
    // ctx.stroke();
  }
  /**
   * 
   */
  richTextEditor.TextNode.prototype.drawTextLineBlock = function(ctx) {
    for (var i=0, l=this.children.length; i<l; i++) {
      // set the color to a fixed color in case the text nodes dont have one
      ctx.strokeStyle = ctx.fillStyle = localColor;

      this.children[i].draw(ctx);
    }

    // ctx.beginPath();
    // ctx.strokeStyle = "grey";
    // ctx.rect(this.metrics.x+0.5, this.metrics.y+0.5, this.metrics.w, this.metrics.h);
    // ctx.stroke();
  }
  /**
   * 
   */
  richTextEditor.TextNode.prototype.drawText = function(ctx) {
    var x = this.metrics.x;
    var y = this.metrics.y;
// console.log(x, y, "|", this.metrics.offsetX, "|", this.value);
    ctx.fillStyle = (this.style.textColor !== null) ? this.style.textColor : localColor;

    ctx.font = this.styleString;

    ctx.beginPath();

    if (this.style.textOverline) {
      ctx.rect(x, y -this.metrics.ascent +parseInt(1 +this.style.fontSize/25), this.metrics.w, parseInt(1 +this.style.fontSize/25) );
      ctx.fill();
    }
    if (this.style.textUnderline) {
      ctx.rect(x, y +parseInt(1 +this.style.fontSize/10), this.metrics.w, parseInt(1 +this.style.fontSize/25) );
      ctx.fill();
    }

    ctx.fillText(this.value, x, y);

    // ctx.beginPath();
    // ctx.strokeStyle = "red";
    // ctx.lineWidth = 1;
    // ctx.rect(this.metrics.x +0.5, this.metrics.y +0.5 -this.metrics.ascent, this.metrics.w, this.metrics.h);
    // ctx.moveTo(this.metrics.x, this.metrics.y +0.5);
    // ctx.lineTo(this.metrics.x + this.metrics.w, this.metrics.y +0.5);
    // ctx.stroke();
  }
  /**
   * 
   */
  richTextEditor.TextNode.prototype.drawDynamicText = function(ctx) {
    var x = this.metrics.x +this.metrics.paddingX;
    var y = this.metrics.y;

    ctx.beginPath();

    ctx.fillStyle = "yellow";
    ctx.rect(this.metrics.x +0.5, this.metrics.y +0.5 -this.metrics.ascent, this.metrics.w, this.metrics.h);
    ctx.fill();

    ctx.fillStyle = (this.style.textColor !== null) ? this.style.textColor : localColor;
    ctx.font = this.styleString;

    ctx.beginPath();

    if (this.style.textOverline) {
      ctx.rect(x, y -this.metrics.ascent +parseInt(1 +this.style.fontSize/25), this.metrics.w, parseInt(1 +this.style.fontSize/25) );
      ctx.fill();
    }
    if (this.style.textUnderline) {
      ctx.rect(x, y +parseInt(1 +this.style.fontSize/10), this.metrics.w, parseInt(1 +this.style.fontSize/25) );
      ctx.fill();
    }

    ctx.fillText("expr", x, y);

    this.drawBorder(ctx, "blue");

    // ctx.beginPath();
    // ctx.strokeStyle = "red";
    // ctx.lineWidth = 1;
    // ctx.rect(this.metrics.x +0.5, this.metrics.y +0.5 -this.metrics.ascent, this.metrics.w, this.metrics.h);
    // ctx.moveTo(this.metrics.x, this.metrics.y +0.5);
    // ctx.lineTo(this.metrics.x + this.metrics.w, this.metrics.y +0.5);
    // ctx.stroke();
  }
  /**
   * 
   */
  richTextEditor.TextNode.prototype.drawFormula = function(ctx) {
    for (var i=0, l=this.children.length; i<l; i++) {
      // set the color to a fixed color in case the text nodes dont have one
      ctx.strokeStyle = ctx.fillStyle = localColor;

      this.children[i].draw(ctx);
    }

    this.drawBorder(ctx, "blue");
  }
  /**
   * 
   */
  richTextEditor.TextNode.prototype.drawFraction = function(ctx) {
    ctx.lineWidth = 6;
    ctx.fillStyle = this.style.textColor || localColor;
    ctx.beginPath();
    var hSeg = parseInt(1 +this.style.fontSize/20);
    ctx.rect(this.metrics.x, this.metrics.offsetY -parseInt(hSeg/2), this.metrics.w, hSeg);
    ctx.fill();

    this.children[0].draw(ctx);
    this.children[1].draw(ctx);

    this.drawBorder(ctx, "blue");
  }
  /**
   * 
   */
  richTextEditor.TextNode.prototype.drawNumDen = function(ctx) {
    for (var i=0, l=this.children.length; i<l; i++) {
      this.children[i].draw(ctx);
    }

    this.drawBorder(ctx, "blue");

  }
  /**
   * 
   */
  richTextEditor.TextNode.prototype.drawSuperIndex = function(ctx) {
    for (var i=0, l=this.children.length; i<l; i++) {
      this.children[i].draw(ctx);
    }

    this.drawBorder(ctx, "blue");
  }
  /**
   * 
   */
  richTextEditor.TextNode.prototype.drawSubIndex = function(ctx) {
    for (var i=0, l=this.children.length; i<l; i++) {
      this.children[i].draw(ctx);
    }

    this.drawBorder(ctx, "blue");
  }
  /**
   * 
   */
  richTextEditor.TextNode.prototype.drawRadical = function(ctx) {
    ctx.save();
    ctx.translate(this.radicalSign.x, this.radicalSign.y);
    ctx.scale(this.radicalSign.scaleX, this.radicalSign.scaleY);
    ctx.fill(radicalPath);
    ctx.restore();

    ctx.beginPath();
    ctx.fillRect(this.children[1].metrics.x+2.5, this.radicalSign.y -0.5, this.children[1].metrics.w -1.5, parseInt(1+this.style.fontSize/18));

    for (var i=0, l=this.children.length; i<l; i++) {
      this.children[i].draw(ctx);
    }

    this.drawBorder(ctx, "blue");
  }
  /**
   * 
   */
  richTextEditor.TextNode.prototype.drawSum = function(ctx) {
    ctx.save();
    ctx.translate(this.sigmaSign.x, this.sigmaSign.y);
    ctx.scale(this.sigmaSign.scale, this.sigmaSign.scale);
    ctx.fill(sigmaPath);
    ctx.restore();

    for (var i=0, l=this.children.length; i<l; i++) {
      this.children[i].draw(ctx);
    }

    this.drawBorder(ctx, "blue");
  }
  /**
   * 
   */
  richTextEditor.TextNode.prototype.drawIntegral = function(ctx) {
    ctx.save();
    ctx.translate(this.sign.x, this.sign.y);
    ctx.scale(this.sign.scale, this.sign.scale);
    ctx.fill(integralPath);
    ctx.restore();

    for (var i=0, l=this.children.length; i<l; i++) {
      this.children[i].draw(ctx);
    }

    this.drawBorder(ctx, "blue");
  }
  /**
   * 
   */
  richTextEditor.TextNode.prototype.drawLimit = function(ctx) {
    for (var i=0, l=this.children.length; i<l; i++) {
      this.children[i].draw(ctx);
    }

    ctx.fillStyle = (this.style.textColor !== null) ? this.style.textColor : localColor;

    ctx.font = this.styleString;

    ctx.fillText("lím", this.limitText.x, this.metrics.y);
    ctx.fillText("→", this.limitArrow.x, this.limitArrow.y);

    this.drawBorder(ctx, "blue");
  }
  /**
   * 
   */
  richTextEditor.TextNode.prototype.drawMatrix = function(ctx) {
    for (var i=0, l=this.children.length; i<l; i++) {
      this.children[i].draw(ctx);
    }

    var w = parseInt(1.5 + this.style.fontSize/25);
    var w_2 = w/2;
    ctx.lineWidth = w;
    ctx.strokeStyle = "black";
    ctx.beginPath();

    ctx.moveTo(this.metrics.x +w_2 +1.5*this.metrics.marginX, this.metrics.y +w_2 -this.metrics.ascent);
    ctx.lineTo(this.metrics.x +w_2, this.metrics.y +w_2 -this.metrics.ascent);
    ctx.lineTo(this.metrics.x +w_2, this.metrics.y -w_2 -this.metrics.ascent +this.metrics.h);
    ctx.lineTo(this.metrics.x +w_2 +1.5*this.metrics.marginX, this.metrics.y -w_2 -this.metrics.ascent +this.metrics.h);

    ctx.moveTo(this.metrics.x +this.metrics.w -w_2 -1.5*this.metrics.marginX, this.metrics.y +w_2 -this.metrics.ascent);
    ctx.lineTo(this.metrics.x +this.metrics.w -w_2, this.metrics.y +w_2 -this.metrics.ascent);
    ctx.lineTo(this.metrics.x +this.metrics.w -w_2, this.metrics.y +w_2 -this.metrics.ascent +this.metrics.h);
    ctx.lineTo(this.metrics.x +this.metrics.w -w_2 -1.5*this.metrics.marginX, this.metrics.y +w_2 -this.metrics.ascent +this.metrics.h);

    ctx.stroke();

    this.drawBorder(ctx, "blue");
  }
  /**
   * 
   */
  richTextEditor.TextNode.prototype.drawDefparts = function(ctx) {
    for (var i=0, l=this.children.length; i<l; i++) {
      this.children[i].draw(ctx);
    }

    var w = parseInt(1.5 + this.style.fontSize/25);
    var w_2 = w/2;
    ctx.lineWidth = w;
    ctx.strokeStyle = "black";
    ctx.beginPath();

    var x1 = 3*this.metrics.marginX;
    var x2 = x1/2;

    ctx.moveTo(this.metrics.x +w_2 +x1, this.metrics.y +w_2 -this.metrics.ascent);
    ctx.bezierCurveTo(
      this.metrics.x +w_2 +x2, this.metrics.y +w_2 -this.metrics.ascent, 
      this.metrics.x +w_2 +x2, this.metrics.y +w_2 -this.metrics.ascent,
      this.metrics.x +w_2 +x2, this.metrics.y +w_2 -this.metrics.ascent +2*this.metrics.marginX
    );
    ctx.lineTo(this.metrics.x +w_2 +x2, this.metrics.y +w_2 -this.metrics.ascent +this.metrics.h/2 -5*this.metrics.marginX);
    ctx.bezierCurveTo(
      this.metrics.x +w_2 +x2, this.metrics.y +w_2 -this.metrics.ascent +this.metrics.h/2,
      this.metrics.x +w_2 +x2, this.metrics.y +w_2 -this.metrics.ascent +this.metrics.h/2,
      this.metrics.x +w_2, this.metrics.y +w_2 -this.metrics.ascent +this.metrics.h/2
    );
    ctx.bezierCurveTo(
      this.metrics.x +w_2 +x2, this.metrics.y +w_2 -this.metrics.ascent +this.metrics.h/2,
      this.metrics.x +w_2 +x2, this.metrics.y +w_2 -this.metrics.ascent +this.metrics.h/2,
      this.metrics.x +w_2 +x2, this.metrics.y +w_2 -this.metrics.ascent +this.metrics.h/2 +5*this.metrics.marginX
    );
    ctx.lineTo(this.metrics.x +w_2 +x2, this.metrics.y +w_2 -this.metrics.ascent +this.metrics.h -2*this.metrics.marginX);
    ctx.bezierCurveTo(
      this.metrics.x +w_2 +x2, this.metrics.y -w_2 -this.metrics.ascent +this.metrics.h,
      this.metrics.x +w_2 +x2, this.metrics.y -w_2 -this.metrics.ascent +this.metrics.h,
      this.metrics.x +w_2 +x1, this.metrics.y -w_2 -this.metrics.ascent +this.metrics.h
    );
    // ctx.moveTo(this.metrics.x +w_2 +2*this.metrics.marginX, this.metrics.y +w_2 -this.metrics.ascent);
    // ctx.lineTo(this.metrics.x +w_2 +this.metrics.marginX, this.metrics.y +w_2 -this.metrics.ascent);

    // ctx.lineTo(this.metrics.x +w_2, this.metrics.y +w_2 -this.metrics.ascent +this.metrics.h/2);

    // ctx.lineTo(this.metrics.x +w_2 +this.metrics.marginX, this.metrics.y -w_2 -this.metrics.ascent +this.metrics.h);
    // ctx.lineTo(this.metrics.x +w_2 +2*this.metrics.marginX, this.metrics.y -w_2 -this.metrics.ascent +this.metrics.h);
    
    ctx.stroke();

    this.drawBorder(ctx, "blue");
  }  
  /**
   * 
   */
  richTextEditor.TextNode.prototype.drawGenericBlock = function(ctx) {
    for (var i=0, l=this.children.length; i<l; i++) {
      this.children[i].draw(ctx);
    }

    this.drawBorder(ctx, "blue");
  }

  /**
   * 
   */
  richTextEditor.TextNode.prototype.drawBorder = function(ctx, color) {
    ctx.beginPath();
    // ctx.setLineDash([4,3]);
    ctx.setLineDash([1,2]);
    ctx.strokeStyle = color;
    ctx.lineWidth = 1;
    ctx.rect(parseInt(this.metrics.x) +0.5, parseInt(this.metrics.y -this.metrics.ascent) +0.5, this.metrics.w, this.metrics.h);
    ctx.stroke();
    ctx.setLineDash([]);
  }



  /**
   * 
   */
  richTextEditor.TextNode.prototype.toRTF = function() {
    var fontTable = [];
    var colorTable = [];

    var children_i;
    var output = "";

    this.mergeTextNodes();

    for (var i=0, l=this.children.length; i<l; i++) {
      children_i = this.children[i];

      if (children_i.nodeType === "textLineBlock") {
        output += children_i.toRTFAux(fontTable, colorTable) + (((l>1)&&(i<l-1))? "\\par" : "");
      }
    }

    var fontTableStr = "{\\fonttbl";
    for (var i=0, l=fontTable.length; i<l; i++) {
      fontTableStr += "\\f" + i + "\\fcharset0 " + fontTable[i] + ";";
    }
    fontTableStr += "}";

    var colorTableStr = "";
    if (colorTable.length > 0) {
      colorTableStr = "{\\colortbl";
      for (var i=0, l=colorTable.length; i<l; i++) {
        colorTableStr += colorTable[i];
      }
      colorTableStr += "}";
    }

    output = "{\\rtf1\\uc0" + fontTableStr + colorTableStr + output + "}";

    return output;
  }
  /**
   * 
   */
  richTextEditor.TextNode.prototype.toRTFAux = function(fontTable, colorTable) {
    var children_i;
    var lastFontFamily;
    var lastFontSize;
    var lastColor = null;

    var output = "";
    var open;
    var close;
    var tmpFontFamily;
    var tmpFontSize;
    var tmpColor;

    var tmpRTF;

    for (var i=0, l=this.children.length; i<l; i++) {
      open = close = "";

      children_i = this.children[i];

      tmpFontFamily = this.addToFontTable(children_i.style.fontType, fontTable);
      tmpFontSize = children_i.style.fontSize;
      tmpColor = this.addToColorTable(children_i.style.textColor, colorTable);

      if ((tmpColor === null) && (colorTable.length > 0)) {
        tmpColor = this.addToColorTable(localColor, colorTable);
      }

      if (tmpColor !== lastColor) {
        open += "\\cf" + tmpColor;
        lastColor = tmpColor;
      }

      if (tmpFontFamily !== lastFontFamily) {
        open += "\\f" + tmpFontFamily;
        lastFontFamily = tmpFontFamily;
      }
      if (tmpFontSize !== lastFontSize) {
        open += "\\fs" + (tmpFontSize*2);
        lastFontSize = tmpFontSize;
      }

      if (children_i.style.textItalic) {
        open += "\\i";
        close = "\\i0" + close;
      }
      if (children_i.style.textBold) {
        open += "\\b";
        close = "\\b0" + close;
      }
      if (children_i.style.textUnderline) {
        open += "\\ul";
        close = "\\ulnone" + close;
      }
      if (children_i.style.textOverline) {
        open += "\\ol";
        close = "\\olnone" + close;
      }

      if (children_i.nodeType === "text") {
        children_i.value = children_i.value.replace(/\\{/g, "{").replace(/\\}/g, "}").replace(/{/g, "\\{").replace(/}/g, "\\}");

        if (open !== "") {
          tmpRTF = open + " " + children_i.value + close;
        }
        else {
          if ((output !== "") && (output.charAt(output.length-1) !== "}")) {
            tmpRTF = " " + children_i.value;
          }
          else {
            tmpRTF = children_i.value;
          }
        }

        output += tmpRTF;
      }
      else if (children_i.nodeType === "formula") {
        output += open + "{\\*\\mjaformula" + children_i.formulaToRTF(lastFontFamily, lastFontSize, lastColor, fontTable, colorTable) + "}" + close;
      }
    }

    return output;
  }
  /**
   * 
   */
  richTextEditor.TextNode.prototype.formulaToRTF = function(lastFontFamily, lastFontSize, lastColor, fontTable, colorTable) {
    var children_i;

    var output = "";
    var open;
    var close;
    var tmpFontFamily;
    var tmpFontSize;
    var tmpColor;

    for (var i=0, l=this.children.length; i<l; i++) {
      open = close = "";

      children_i = this.children[i];

      tmpFontFamily = this.addToFontTable(children_i.style.fontType, fontTable);
      tmpColor = this.addToColorTable(children_i.style.textColor, colorTable);

      if ((tmpColor === null) && (colorTable.length > 0)) {
        tmpColor = this.addToColorTable(localColor, colorTable);
      }

      if (tmpFontFamily !== lastFontFamily) {
        open += "\\f" + tmpFontFamily;
        lastFontFamily = tmpFontFamily;
      }

      if (tmpColor !== lastColor) {
        open += "\\cf" + tmpColor;

        // change the lastColor value if the node is not a text node with empty text
        if ((children_i.nodeType !== "text") || ((children_i.nodeType === "text") && (children_i.value !== ""))) {
          lastColor = tmpColor;
        }
      }

      if (children_i.style.textItalic) {
        open += "\\i";
        close = "\\i0" + close;
      }
      if (children_i.style.textBold) {
        open += "\\b";
        close = "\\b0" + close;
      }
      if (children_i.style.textUnderline) {
        open += "\\ul";
        close = "\\ulnone" + close;
      }
      if (children_i.style.textOverline) {
        open += "\\ol";
        close = "\\olnone" + close;
      }

      if ((children_i.nodeType === "text") && (children_i.value !== "")) {
        children_i.value = children_i.value.replace(/\\{/g, "{").replace(/\\}/g, "}").replace(/{/g, "\\{").replace(/}/g, "\\}");
        if (open !== "") {
          tmpRTF = open + " " + children_i.value + close;
        }
        else {
          if (output.charAt(output.length-1) !== "}") {
            tmpRTF = " " + children_i.value;
          }
          else {
            tmpRTF = children_i.value;
          }
        }

        output += tmpRTF;
      }
      else if (children_i.nodeType === "dynamicText") {
        children_i.value = (children_i.value === "") ? " " : children_i.value;
        output += open + "{\\expr" + " " + children_i.value + "\\decimals " + (children_i.decimals || 2) + "\\fixed" + ((children_i.fixed) ? 1 : 0) + "}" + close;
      }
      else if (
        (children_i.nodeType === "fraction") ||
        (children_i.nodeType === "radical") ||
        (children_i.nodeType === "index") ||
        (children_i.nodeType === "radicand") ||
        (children_i.nodeType === "sum") ||
        (children_i.nodeType === "integral") ||
        (children_i.nodeType === "limit") ||
        (children_i.nodeType === "from") ||
        (children_i.nodeType === "to") ||
        (children_i.nodeType === "what") ||
        (children_i.nodeType === "element")

      ) {
        output += "{\\" + children_i.nodeType + children_i.formulaToRTF(lastFontFamily, lastFontSize, lastColor, fontTable, colorTable) + "}";
      }
      else if (children_i.nodeType === "numerator") {
        output += "{\\num" + children_i.formulaToRTF(lastFontFamily, lastFontSize, lastColor, fontTable, colorTable) + "}";
      }
      else if (children_i.nodeType === "denominator") {
        output += "{\\den" + children_i.formulaToRTF(lastFontFamily, lastFontSize, lastColor, fontTable, colorTable) + "}";
      }
      else if (children_i.nodeType === "superIndex") {
        output += "{\\supix" + children_i.formulaToRTF(lastFontFamily, lastFontSize, lastColor, fontTable, colorTable) + "}";
      }
      else if (children_i.nodeType === "subIndex") {
        output += "{\\subix" + children_i.formulaToRTF(lastFontFamily, lastFontSize, lastColor, fontTable, colorTable) + "}";
      }
      else if (children_i.nodeType === "matrix") {
        output += "{\\matrix\\rows "+ (children_i.rows || 2) +"\\columns "+ (children_i.columns || 2) + children_i.formulaToRTF(lastFontFamily, lastFontSize, lastColor, fontTable, colorTable) + "}";
      }
      else if (children_i.nodeType === "defparts") {
        output += "{\\defparts\\parts "+ (children_i.parts || 2) + children_i.formulaToRTF(lastFontFamily, lastFontSize, lastColor, fontTable, colorTable) + "}";
      }

      
// console.log(children_i.nodeType, children_i, open + children_i.value + close)
    }

    return output;
  }
  /**
   * 
   */
  richTextEditor.TextNode.prototype.addToFontTable = function(fontType, fontTable) {
    var family;

    if (fontType.match(/times/i)) {
      family = "Times New Roman";
    }
    else if (fontType.match(/courier/i)) {
      family = "Courier New";
    }
    else if (fontType.match(/arial/i)) {
      family = "Arial";
    }

    var indexFamily = fontTable.indexOf(family);
    if (indexFamily === -1) {
      indexFamily = fontTable.length;
      fontTable.push(family);
    }

    return indexFamily;
  }
  /**
   * 
   */
  richTextEditor.TextNode.prototype.addToColorTable = function(textColor, colorTable) {
    if (textColor) {
      var color = "\\red" + parseInt(textColor.substring(1,3), 16) + "\\green" + parseInt(textColor.substring(3,5), 16) + "\\blue" + parseInt(textColor.substring(5,7), 16) + ";";

      var colorIndex = colorTable.indexOf(color);
      if (colorIndex === -1) {
        colorIndex = colorTable.length;
        colorTable.push(color);
      }
  
      return colorIndex;
    }
    return null;
  }
  /**
   * 
   */
  richTextEditor.TextNode.prototype.mergeTextNodes = function() {
    var deleteChild = [];
    var lastNode = null;
    for (var i=0, l=this.children.length; i<l; i++) {
      if (this.children[i].nodeType === "text") {
        if ((lastNode !== null) && (lastNode.nodeType === "text")) {
          if (lastNode.style.equals(this.children[i].style)) {
            this.children[i].value = lastNode.value + this.children[i].value;
            deleteChild.push(lastNode);
          }
        }
      }
      else {
        this.children[i].mergeTextNodes();
      }

      lastNode = this.children[i];
    }

    for (var i=0, l=deleteChild.length; i<l; i++) {
      this.removeChild(deleteChild[i]);
    }
  }



  function partialSum(array, index) {
    var result = 0;
    for (var i=0; i<index; i++) {
      result += array[i];
    }
    return result;
  }


  var fontMetrics = {
    "sansserif" : {
      ascent: 1854,
      descent: -434,
      lineGap: 67,
      capHeight: 1409,
      xHeight: 1082,
      unitsPerEm: 2048
    },
    "serif" : {
      ascent: 1825,
      descent: -443,
      lineGap: 87,
      capHeight: 1341,
      xHeight: 940,
      unitsPerEm: 2048
    },
    "monospace" : {
      ascent: 1705,
      descent: -615,
      lineGap: 0,
      capHeight: 1349,
      xHeight: 1082,
      unitsPerEm: 2048
    }
  };

  // https://www.freetype.org/freetype2/docs/glyphs/glyphs-3.html/

  function getFontMetrics(font) {
    // var result = { ascent:0, descent:0, lineGap:0, capHeight:0, xHeight:0, unitsPerEm:0, h:0 };
    var result = { ascent:0, descent:0, h:0, w:0, x:0, y:0, offsetX:0, offsetY:0, marginX:0, marginY:0, paddingX:0, paddingY:0 };

    if (font.trim() == "") {
      return result;
    }

    var fontSize = parseInt( font .match(/(\d+\.*)+px/)[0] );
    var fontName = (font.match("sansserif")) ? "sansserif" : ((font.match("serif")) ? "serif" : "monospace");

    // result.lineGap = fontMetrics[fontName].lineGap * fontSize / fontMetrics[fontName].unitsPerEm;

    result.ascent = Math.ceil( (fontMetrics[fontName].ascent+25) * fontSize / fontMetrics[fontName].unitsPerEm );

    result.descent = Math.ceil( Math.abs( (fontMetrics[fontName].descent-25) * fontSize / fontMetrics[fontName].unitsPerEm ) );

    result.h = result.ascent + result.descent;

    // result.lineGap = Math.ceil( fontMetrics[fontName].lineGap * fontSize / fontMetrics[fontName].unitsPerEm );

    // result.capHeight = Math.ceil( fontMetrics[fontName].capHeight * fontSize / fontMetrics[fontName].unitsPerEm );

    // result.xHeight = Math.ceil( fontMetrics[fontName].xHeight * fontSize / fontMetrics[fontName].unitsPerEm );

    return result;
  }

  return richTextEditor;
})(richTextEditor || {});
