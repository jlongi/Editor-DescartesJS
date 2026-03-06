/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var richTextEditor = (function(richTextEditor) {

  /**
   *
   */
  richTextEditor.TextConverter = function() { }

  /**
   *
   */
  richTextEditor.TextConverter.prototype.toRTF = function(content) {
    content = content.querySelector(".TextBlock");

    this.defaultColor = content.parentNode.style.color || "rgb(0,0,0)";

    this.fontTable = {};
    this.colorTable = {};
    this.fontCount = this.colorCount = 0;

    let children_i;
    let children_i_class;

    let output = "";

    for (let i=0, l=content.children.length; i<l; i++) {
      children_i = content.children[i];
      children_i_class = children_i.getAttribute("class");

      if (children_i_class === "TextLine") {
        output += this.toRTFAux(children_i) + (((l>1)&&(i<l-1))? "\\par" : "");
      }
    }

    return ("{\\rtf1\\uc0" + this.getFontTable() + this.getColorTable() + output + "}");
  }

  /**
   *
   */
  richTextEditor.TextConverter.prototype.toRTFAux = function(domNode) {
    let txt = "";
    let children_i;
    let children_i_class;
    let children_i_css;
    let fontSize;
    let styleOpen;
    let styleClose;
    let nodeColor;

    let lastFont = "";
    let lastFontSize = "";
    let tmpFont;
    let tmpFontSize;

    for (let i=0, l=domNode.children.length; i<l; i++) {
      children_i = domNode.children[i];
      children_i_class = children_i.getAttribute("class") || "NarrowSpaceNode";

      if ((children_i_class !== "NarrowSpaceNode") && (children_i.textContent !== "") && (children_i.textContent !== richTextEditor.narrowSpace)) {
        children_i_css = children_i.style;
        fontSize = parseFloat(children_i_css.fontSize);
        styleOpen = "";
        styleClose = "";

        // store the last font and the last font size, to prevent repetitions in the output
        tmpFont = this.addToFontTable(children_i.style);
        tmpFontSize = "\\fs" + (fontSize*2);
        if (tmpFont === lastFont) {
          lastFont = tmpFont;
          tmpFont = "";
        }
        else {
          lastFont = tmpFont;
        }
        if (tmpFontSize === lastFontSize) {
          lastFontSize = tmpFontSize;
          tmpFontSize = "";
        }
        else {
          lastFontSize = tmpFontSize;
        }

        // get the styles 
        if (children_i_css["textDecoration"] === "underline") {
          styleOpen = "\\ul";
          styleClose = "\\ulnone";
        }
        else if (children_i_css["textDecoration"] === "overline") {
          styleOpen = "\\ol";
          styleClose = "\\olnone";
        }
        else if (children_i_css["textDecoration"] === "underline overline") {
          styleOpen = "\\ul\\ol";
          styleClose = "\\olnone\\ulnone";
        }
        if (children_i_css["font-style"] === "italic") {
          styleOpen = "\\i"+ styleOpen;
          styleClose = styleClose + "\\i0";
        }
        if (children_i_css["font-weight"] === "bold") {
          styleOpen = "\\b"+ styleOpen;
          styleClose = styleClose + "\\b0";
        }

        nodeColor = this.addToColorTable(children_i);

        if (children_i_class.match(/TextNode/)) {
          txt += (tmpFont + nodeColor + tmpFontSize + styleOpen);

          let children_i_txt = children_i.textContent.replace((new RegExp(String.fromCharCode(160), "g")), " ");

          let separationSpace = ((txt.charAt(txt.length-1) !== " ") && (txt.charAt(txt.length-1) !== "}") && (txt.lastIndexOf("\\") > txt.lastIndexOf(" ")) ) ? " " : "";


          txt += separationSpace + children_i_txt + styleClose;
        }
        else if (children_i_class.match(/FormulaNode/)) {
          let formulaTxt = addSpaceAtEnd(this.formulaToRTF(children_i), "\\mjaformula");
          txt += tmpFont + tmpFontSize + styleOpen + "{\\*" + formulaTxt + "}" + styleClose;
        }
        else {
          // console.log(children_i);
        }
      }
    }

    return txt;
  }

  /**
   *
   */
  richTextEditor.TextConverter.prototype.formulaToRTF = function(domNode) {
    let txt = "";

    let children_i;
    let children_i_class;

    for (let i=0, l=domNode.children.length; i<l; i++) {
      children_i = domNode.children[i];
      children_i_class = children_i.getAttribute("class") || "";

      if ((/^TextNode/).test(children_i_class)) {
        if (children_i.textContent !== richTextEditor.narrowSpace) {
          txt += (this.addToColorTable(children_i) + " " + children_i.textContent + " ").trim();
        }
      }
      if ((/^DynamicTextNode/).test(children_i_class)) {
        if (children_i.textContent !== richTextEditor.narrowSpace) {
          txt += "{\\expr "+ children_i.getAttribute("data-value") +"\\decimals "+ children_i.getAttribute("data-decimals") +"\\fixed"+ ((children_i.getAttribute("data-fixed") == "true") ? 1 : 0) +"}";
        }
      }
      else if ((/^MathSymbolNode/).test(children_i_class)) {
        txt += (this.addToColorTable(children_i) + " " + children_i.textContent + " ").trim();
      }
      else if ((/^FractionNode/).test(children_i_class)) {
        let components = children_i.children;
        let num = richTextEditor.getChildrenByType(components[0], "NumeratorNode");
        let den = richTextEditor.getChildrenByType(components[1], "DenominatorNode");
        num = addSpaceAtEnd(this.formulaToRTF(num), "\\num");
        den = addSpaceAtEnd(this.formulaToRTF(den), "\\den");

        txt += "{\\fraction{" + num + "}{" + den + "}}";
      }
      else if ((/^SuperIndexNode/).test(children_i_class)) {
        let supix = addSpaceAtEnd(this.formulaToRTF(children_i), "\\supix");
        txt += "{" + supix + "}"
      }
      else if ((/^SubIndexNode/).test(children_i_class)) {
        let subix = addSpaceAtEnd(this.formulaToRTF(children_i), "\\subix");
        txt += "{" + subix + "}"
      }
      else if ((/^RadicalNode/).test(children_i_class)) {
        let index = richTextEditor.getChildrenByType(children_i, "IndexNode");
        let radicand = richTextEditor.getChildrenByType(children_i, "RadicandNode");
        index = addSpaceAtEnd(this.formulaToRTF(index), "\\index");
        radicand = addSpaceAtEnd(this.formulaToRTF(radicand), "\\radicand");

        txt += "{\\radical{"+ index +"}{"+ radicand + "}}";
      }
      else if ((/^SumNode/).test(children_i_class)) {
        let sumContainer = children_i.children[0];
        let sumTo = richTextEditor.getChildrenByType(sumContainer, "SumToNode");
        let sumFrom = richTextEditor.getChildrenByType(sumContainer, "SumFromNode");
        let sumWhat = richTextEditor.getChildrenByType(children_i, "SumWhatNode");
        sumTo = addSpaceAtEnd(this.formulaToRTF(sumTo), "\\to");
        sumFrom = addSpaceAtEnd(this.formulaToRTF(sumFrom), "\\from");
        sumWhat = addSpaceAtEnd(this.formulaToRTF(sumWhat), "\\what");

        txt += "{\\sum{" + sumFrom + "}{" + sumTo + "}{" + sumWhat + "}}";
      }
      else if ((/^IntegralNode/).test(children_i_class)) {
        let integralContainer = children_i.children[0];
        let integralTo = richTextEditor.getChildrenByType(integralContainer, "IntegralToNode");
        let integralFrom = richTextEditor.getChildrenByType(integralContainer, "IntegralFromNode");
        let integralWhat = richTextEditor.getChildrenByType(children_i, "IntegralWhatNode");
        integralTo = addSpaceAtEnd(this.formulaToRTF(integralTo), "\\to");
        integralFrom = addSpaceAtEnd(this.formulaToRTF(integralFrom), "\\from");
        integralWhat = addSpaceAtEnd(this.formulaToRTF(integralWhat), "\\what");

        txt += "{\\integral{" + integralFrom + "}{" + integralTo + "}{" + integralWhat + "}}";
      }
      else if ((/^LimitNode/).test(children_i_class)) {
        let limitContainer = children_i.children[0];
        let limitTo = richTextEditor.getChildrenByType(limitContainer, "LimitToNode");
        let limitFrom = richTextEditor.getChildrenByType(limitContainer, "LimitFromNode");
        let limitWhat = richTextEditor.getChildrenByType(children_i, "LimitWhatNode");
        limitTo = addSpaceAtEnd(this.formulaToRTF(limitTo), "\\to");
        limitFrom = addSpaceAtEnd(this.formulaToRTF(limitFrom), "\\from");
        limitWhat = addSpaceAtEnd(this.formulaToRTF(limitWhat), "\\what");

        txt += "{\\limit{" + limitFrom + "}{" + limitTo + "}{" + limitWhat + "}}";
      }
      else if ((/^MatrixNode/).test(children_i_class)) {
        let components = children_i.children;
        let element;
        let rows = components.length;
        let columns = components[0].children.length;

        txt += "{\\matrix\\rows " + rows + "\\columns " + columns;
        for (let mi=0; mi<rows; mi++) {
          for (let mj=0; mj<columns; mj++) {
            element = richTextEditor.getChildrenByType(components[mi].children[mj], "MatrixElementNode");
            txt += "{" + addSpaceAtEnd(this.formulaToRTF(element), "\\element") + "}";
          }
        }
        txt += "}";
      }
      else if ((/^CasesNode/).test(children_i_class)) {
        let components = children_i.children;
        let element;
        let parts = components.length;

        txt += "{\\defparts\\parts " + parts;
        for (let di=0; di<parts; di++) {
          element = richTextEditor.getChildrenByType(components[di], "CasesElementNode");
          txt += "{" + addSpaceAtEnd(this.formulaToRTF(element), "\\element") + "}";
        }
        txt += "}";
      }
      else if ((/^CurlyBracket/).test(children_i_class)) {
      }
      else { 
// console.log(children_i);
      }
    }

    return txt;
  }

  /**
   *
   */
  richTextEditor.TextConverter.prototype.addToFontTable = function(style) {
    let family;
    let fontId = "";

    if ((/times/i).test(style.fontFamily)) {
      family = "Times New Roman";
    }
    else if ((/courier/i).test(style.fontFamily)) {
      family = "Courier New";
    }
    else if ((/arial/i).test(style.fontFamily)) {
      family = "Arial";
    }

    let findIt = false;

    for (let font in this.fontTable) {
      if (this.fontTable.hasOwnProperty(font)) {
        findIt = findIt || (this.fontTable[font] === family);
        if ((findIt) && (fontId == "")) {
          fontId = font;
        }
      }
    }

    if (!findIt) {
      fontId = "f"+(this.fontCount++);
      this.fontTable[fontId] = family;
    }

    return "\\" + fontId;
  }

  /**
   *
   */
  richTextEditor.TextConverter.prototype.getFontTable = function() {
    let output = "{\\fonttbl";

    for (let font in this.fontTable) {
      if (this.fontTable.hasOwnProperty(font)) {
        output += `\\${font}\\fcharset0 ${this.fontTable[font]};`;
      }
    }

    return output + "}";
  }

  /**
   *
   */
  richTextEditor.TextConverter.prototype.addToColorTable = function(node) {
    let style = node.style;
    let colorId = "";
    let findIt = false;
    let newColor;

    let theColor = style.color;

    if ((this.colorCount > 0) && (theColor === "")) {
      theColor = this.defaultColor;
      let tmpNode = node.parentNode;
      while (tmpNode) {
        if ((tmpNode.style) && (tmpNode.style.color)) {
          theColor = tmpNode.style.color;
          break;
        }
        tmpNode = tmpNode.parentNode;
      }
      if ( (tmpNode.getAttribute) && (tmpNode.getAttribute("class")) && (tmpNode.getAttribute("class") === "FormulaNode") ) {
        theColor = null;
      }
    }

    if (theColor) {
      newColor = theColor.substring(theColor.indexOf("(")+1, theColor.length-1).split(",");
      newColor = `\\red${newColor[0].trim()}\\green${newColor[1].trim()}\\blue${newColor[2].trim()};`;

      for (let color in this.colorTable) {
        if (this.colorTable.hasOwnProperty(color)) {
          findIt = findIt || (this.colorTable[color] === newColor);
          if ((findIt) && (colorId === "")) {
            colorId = color;
          }
        }
      }
    }

    if ((!findIt) && (theColor)) {
      colorId = "cf"+(this.colorCount++);
      this.colorTable[colorId] = newColor;
    }

    return (colorId) ? "\\" + colorId : "";
  }

  /**
   *
   */
  richTextEditor.TextConverter.prototype.getColorTable = function() {
    if (this.colorCount === 0) {
      return "";
    }

    let output = "{\\colortbl";

    for (let color in this.colorTable) {
      if (this.colorTable.hasOwnProperty(color)) {
        output += this.colorTable[color];
      }
    }

    return output + "}";
  }

  /**
   *
   */
  function addSpaceAtEnd(value="", extraStr) {
    return (((value[0] === "\\") || (value[0] === "{") || (value[0] === "")) ? extraStr : extraStr+" ") + value;
  }

  return richTextEditor;
})(richTextEditor || {});
