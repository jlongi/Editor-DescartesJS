/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var richTextEditor = (function(richTextEditor) {

  /**
   *
   */
  richTextEditor.TextNode = function(value, nodeType, style) {
    this.parent = null;
    this.children = [];

    this.value = value;
    this.nodeType = nodeType;
    this.style = style;
    this.styleString = style.toString()
    this.color = style.textColor;
    this.underline = style.textUnderline;
    this.overline = style.textOverline;
  }

  /**
   * Get the root of the tree of nodes
   * return {RTFNode} return the root of the tree of nodes
   */
  richTextEditor.TextNode.prototype.getRoot = function() {
    if (this.parent === null) {
      return this;
    }
    return this.parent.getRoot();
  }

  /**
   * Add a child to the tree of nodes
   * @param {richTextEditor.TextNode} child the child to add
   */
  richTextEditor.TextNode.prototype.addChild = function(child) {
    child.parent = this;
    this.children.push(child);
  }

  /**
   *
   */
  richTextEditor.TextNode.prototype.toHTML = function() {
    return this.toHTMLAux();
  }  

  /**
   *
   */
  richTextEditor.TextNode.prototype.toHTMLAux = function() {
    var htmlDom = document.createDocumentFragment();
    var css = (this.style) ? this.style.toCSS() : "";
    var domNode;

    ////////////////////////////////////////////////////////////////////////////////////////////////
    if (this.nodeType === "textBlock") {
      domNode = richTextEditor.newTextBlock();
      for (var i=0, l=this.children.length; i<l; i++) {
        domNode.appendChild( this.children[i].toHTMLAux() );
      }
    }
    ////////////////////////////////////////////////////////////////////////////////////////////////
    else if (this.nodeType === "textLineBlock") {
      domNode = richTextEditor.newTextLineBlock();
      for (var i=0, l=this.children.length; i<l; i++) {
        domNode.appendChild( this.children[i].toHTMLAux() );
      }
    }
    ////////////////////////////////////////////////////////////////////////////////////////////////
    else if (this.nodeType === "text") {
      domNode = richTextEditor.newTextNode(css, this.value);
    }
    ////////////////////////////////////////////////////////////////////////////////////////////////
    else if (this.nodeType === "newLine") {
      domNode = richTextEditor.newNewLine(css);
    }
    ////////////////////////////////////////////////////////////////////////////////////////////////
    else if (this.nodeType === "hyperlink") {
      domNode = richTextEditor.newHyperLink(css, this.value, this.URL);
    }
    ////////////////////////////////////////////////////////////////////////////////////////////////
    else if (this.nodeType === "formula") {
      domNode = richTextEditor.newFormula(css, formulaToHTML(this));
    }
    ////////////////////////////////////////////////////////////////////////////////////////////////
    else if (this.nodeType === "componentSpace") {
      domNode = richTextEditor.newComponentSpace(this.componentSpace.w, this.value);
    }
    ////////////////////////////////////////////////////////////////////////////////////////////////
    else if (this.nodeType === "componentNumCtrl") {
      domNode = richTextEditor.newComponentNumCtrl(this.componentSpace.w, this.componentSpace.h, this.value);
    }
    ////////////////////////////////////////////////////////////////////////////////////////////////
    else {
      domNode = document.createDocumentFragment();
      console.log(">>>", this, "<<<");
    }

    htmlDom.appendChild(domNode);

    return htmlDom;
  }

  /**
   *
   */
  function formulaToHTML(formula) {
    var htmlDom = document.createDocumentFragment();
    var children_i;
    var domNode;

    ////////////////////////////////////////////////////////////////////////////////////////////////
    // for empty parameters
    if (formula.children.length === 0) {
      domNode = richTextEditor.newFormulaTextNode(richTextEditor.narrowSpace);
      htmlDom.appendChild(domNode);
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////
    for (var i=0; i<formula.children.length; i++) {
      children_i = formula.children[i];

      ////////////////////////////////////////////////////////////////////////////////////////////////
      if (children_i.nodeType === "text") {
        domNode = richTextEditor.newFormulaTextNode(children_i.value);
      }
      ////////////////////////////////////////////////////////////////////////////////////////////////
      else if (children_i.nodeType === "dynamicText") {
        domNode = richTextEditor.newDynamicTextNode(children_i);
      }
      ////////////////////////////////////////////////////////////////////////////////////////////////
      // ToDo: componer los signos matematicos, para que no se puedan editar
      else if (children_i.nodeType === "mathSymbol") {
        domNode = richTextEditor.newMathSymbolNode(children_i.value);
      }
      ////////////////////////////////////////////////////////////////////////////////////////////////
      else if (children_i.nodeType === "superIndex") {
        domNode = richTextEditor.newSuperIndexNode(formulaToHTML(children_i));
      }
      ////////////////////////////////////////////////////////////////////////////////////////////////
      else if (children_i.nodeType === "subIndex") {
        domNode = richTextEditor.newSubIndexNode(formulaToHTML(children_i));
      }
      ////////////////////////////////////////////////////////////////////////////////////////////////
      else if (children_i.nodeType === "fraction") {
        domNode = richTextEditor.newFractionNode(formulaToHTML(children_i.children[0]), formulaToHTML(children_i.children[1]));
      }
      ////////////////////////////////////////////////////////////////////////////////////////////////
      else if (children_i.nodeType === "radical") {
        domNode = richTextEditor.newRadicalNode(formulaToHTML(children_i.children[0]), formulaToHTML(children_i.children[1]));
      }
      ////////////////////////////////////////////////////////////////////////////////////////////////
      else if (children_i.nodeType === "sum") {
        domNode = richTextEditor.newSumNode(formulaToHTML(children_i.children[1]), formulaToHTML(children_i.children[0]), formulaToHTML(children_i.children[2]));
      }
      ////////////////////////////////////////////////////////////////////////////////////////////////
      else if (children_i.nodeType === "integral") {
        domNode = richTextEditor.newIntegralNode(formulaToHTML(children_i.children[1]), formulaToHTML(children_i.children[0]), formulaToHTML(children_i.children[2]));
      }
      ////////////////////////////////////////////////////////////////////////////////////////////////
      else if (children_i.nodeType === "limit") {
        domNode = richTextEditor.newLimitNode(formulaToHTML(children_i.children[1]), formulaToHTML(children_i.children[0]), formulaToHTML(children_i.children[2]));
      }
      ////////////////////////////////////////////////////////////////////////////////////////////////
      else if (children_i.nodeType === "matrix") {
        var children = [];
        for (var ci=0, cl=children_i.children.length; ci<cl; ci++) {
          children.push( formulaToHTML(children_i.children[ci]) );
        }
        domNode = richTextEditor.newMatrixNode(children_i.rows, children_i.columns, children);
      }
      ////////////////////////////////////////////////////////////////////////////////////////////////
      else if (children_i.nodeType === "defparts") {
        var children = [];
        for (var ci=0; ci<children_i.parts; ci++) {
          children.push( formulaToHTML(children_i.children[ci]) );
        }
        domNode = richTextEditor.newCasesElementNode(children_i.parts, children);
      }

      ////////////////////////////////////////////////////////////////////////////////////////////////
      else {
        domNode = document.createDocumentFragment();
        console.log(">>>", children_i, "<<<");
      }


      htmlDom.appendChild(domNode);
    }

    return htmlDom;
  }

  return richTextEditor;
})(richTextEditor || {});
