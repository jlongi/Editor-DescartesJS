/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var richTextEditor = (function(richTextEditor) {

  /**
   *
   */
  richTextEditor.TextConverter = function() {
  }

  /**
   *
   */
  richTextEditor.TextConverter.prototype.toRTF = function(content) {
    content = content.querySelector(".TextBlock");

    this.defaultColor = content.parentNode.style.color || "rgb(0,0,0)";

    this.fontTable = { };
    this.fontCount = 0;
    this.colorTable = {};
    this.colorCount = 0;

    var children_i;
    var children_i_class;

    var output = "";

    for (var i=0, l=content.children.length; i<l; i++) {
      children_i = content.children[i];
      children_i_class = children_i.getAttribute("class");

      if (children_i_class === "TextLine") {
        output += this.toRTFAux(children_i) + (((l>1)&&(i<l-1))? "\\par" : "");
      }
    }

    output = ("{\\rtf1\\uc0" + this.getFontTable() + this.getColorTable() + output + "}")
      // .replace(/\\b0\\b/g, "")
      // .replace(/\\i0\\i/g, "")

// console.log(content);
// console.log(output);
    return output;
  }

  /**
   *
   */
  richTextEditor.TextConverter.prototype.toRTFAux = function(domNode) {
    var txt = "";
    var children_i;
    var children_i_css;
    var fontSize;
    var styleOpen;
    var styleClose;
    var tmpStyle;

    var nodeText;
    var nodeColor;

    var lastFont = "";
    var lastFontSize = "";
    var tmpFont;
    var tmpFontSize;

    for (var i=0, l=domNode.children.length; i<l; i++) {
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

          var children_i_txt = children_i.textContent.replace((new RegExp(String.fromCharCode(160), "g")), " ");

// console.log(txt, txt.lastIndexOf("\\"), txt.lastIndexOf(" "))
          var separationSpace = ((txt.charAt(txt.length-1) !== " ") && (txt.charAt(txt.length-1) !== "}") && (txt.lastIndexOf("\\") > txt.lastIndexOf(" ")) ) ? " " : "";


          txt += separationSpace + children_i_txt + styleClose;
        }
        else if (children_i_class.match(/FormulaNode/)) {
          var formulaTxt = addSpaceAtEnd(this.formulaToRTF(children_i), "\\mjaformula");
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
    var txt = "";

    var children_i;
    var children_i_class;

    for (var i=0, l=domNode.children.length; i<l; i++) {
      children_i = domNode.children[i];
      children_i_class = children_i.getAttribute("class") || "";

      if (children_i_class.match(/^TextNode/)) {
        if (children_i.textContent !== richTextEditor.narrowSpace) {
          txt += (this.addToColorTable(children_i) + " " + children_i.textContent + " ").trim();
        }
      }
      if (children_i_class.match(/^DynamicTextNode/)) {
        if (children_i.textContent !== richTextEditor.narrowSpace) {
          txt += "{\\expr "+ children_i.getAttribute("data-value") +"\\decimals "+ children_i.getAttribute("data-decimals") +"\\fixed"+ ((children_i.getAttribute("data-fixed") == "true") ? 1 : 0) +"}";
        }
      }
      else if (children_i_class.match(/^MathSymbolNode/)) {
        txt += (this.addToColorTable(children_i) + " " + children_i.textContent + " ").trim();
      }
      else if (children_i_class.match(/^FractionNode/)) {
        var components = children_i.children;
        var num = richTextEditor.getChildrenByType(components[0], "NumeratorNode");
        var den = richTextEditor.getChildrenByType(components[1], "DenominatorNode");
        num = addSpaceAtEnd(this.formulaToRTF(num), "\\num");
        den = addSpaceAtEnd(this.formulaToRTF(den), "\\den");

        txt += "{\\fraction{" + num + "}{" + den + "}}";
      }
      else if (children_i_class.match(/^SuperIndexNode/)) {
        var supix = addSpaceAtEnd(this.formulaToRTF(children_i), "\\supix");
        txt += "{" + supix + "}"
      }
      else if (children_i_class.match(/^SubIndexNode/)) {
        var subix = addSpaceAtEnd(this.formulaToRTF(children_i), "\\subix");
        txt += "{" + subix + "}"
      }
      else if (children_i_class.match(/^RadicalNode/)) {
        var index = richTextEditor.getChildrenByType(children_i, "IndexNode");
        var radicand = richTextEditor.getChildrenByType(children_i, "RadicandNode");
        index = addSpaceAtEnd(this.formulaToRTF(index), "\\index");
        radicand = addSpaceAtEnd(this.formulaToRTF(radicand), "\\radicand");

        txt += "{\\radical{"+ index +"}{"+ radicand + "}}";
      }
      else if (children_i_class.match(/^SumNode/)) {
        var sumContainer = children_i.children[0];
        var sumTo = richTextEditor.getChildrenByType(sumContainer, "SumToNode");
        var sumFrom = richTextEditor.getChildrenByType(sumContainer, "SumFromNode");
        var sumWhat = richTextEditor.getChildrenByType(children_i, "SumWhatNode");
        sumTo = addSpaceAtEnd(this.formulaToRTF(sumTo), "\\to");
        sumFrom = addSpaceAtEnd(this.formulaToRTF(sumFrom), "\\from");
        sumWhat = addSpaceAtEnd(this.formulaToRTF(sumWhat), "\\what");

        txt += "{\\sum{" + sumFrom + "}{" + sumTo + "}{" + sumWhat + "}}";
      }
      else if (children_i_class.match(/^IntegralNode/)) {
        var integralContainer = children_i.children[0];
        var integralTo = richTextEditor.getChildrenByType(integralContainer, "IntegralToNode");
        var integralFrom = richTextEditor.getChildrenByType(integralContainer, "IntegralFromNode");
        var integralWhat = richTextEditor.getChildrenByType(children_i, "IntegralWhatNode");
        integralTo = addSpaceAtEnd(this.formulaToRTF(integralTo), "\\to");
        integralFrom = addSpaceAtEnd(this.formulaToRTF(integralFrom), "\\from");
        integralWhat = addSpaceAtEnd(this.formulaToRTF(integralWhat), "\\what");

        txt += "{\\integral{" + integralFrom + "}{" + integralTo + "}{" + integralWhat + "}}";
      }
      else if (children_i_class.match(/^LimitNode/)) {
        var limitContainer = children_i.children[0];
        var limitTo = richTextEditor.getChildrenByType(limitContainer, "LimitToNode");
        var limitFrom = richTextEditor.getChildrenByType(limitContainer, "LimitFromNode");
        var limitWhat = richTextEditor.getChildrenByType(children_i, "LimitWhatNode");
        limitTo = addSpaceAtEnd(this.formulaToRTF(limitTo), "\\to");
        limitFrom = addSpaceAtEnd(this.formulaToRTF(limitFrom), "\\from");
        limitWhat = addSpaceAtEnd(this.formulaToRTF(limitWhat), "\\what");

        txt += "{\\limit{" + limitFrom + "}{" + limitTo + "}{" + limitWhat + "}}";
      }
      else if (children_i_class.match(/^MatrixNode/)) {
        var components = children_i.children;
        var element;
        var rows = components.length;
        var columns = components[0].children.length;

        txt += "{\\matrix\\rows " + rows + "\\columns " + columns;
        for (var mi=0; mi<rows; mi++) {
          for (var mj=0; mj<columns; mj++) {
            element = richTextEditor.getChildrenByType(components[mi].children[mj], "MatrixElementNode");
            txt += "{" + addSpaceAtEnd(this.formulaToRTF(element), "\\element") + "}";
          }
        }
        txt += "}";
      }
      else if (children_i_class.match(/^CasesNode/)) {
        var components = children_i.children;
        var element;
        var parts = components.length;

        txt += "{\\defparts\\parts " + parts;
        for (var di=0; di<parts; di++) {
          element = richTextEditor.getChildrenByType(components[di], "CasesElementNode");
          txt += "{" + addSpaceAtEnd(this.formulaToRTF(element), "\\element") + "}";
        }
        txt += "}";
      }
      else if (children_i_class.match(/^CurlyBracket/)) {
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
    var family;
    var fontId = "";

    if (style.fontFamily.match(/times/i)) {
      family = "Times New Roman";
    }
    else if (style.fontFamily.match(/courier/i)) {
      family = "Courier New";
    }
    else if (style.fontFamily.match(/arial/i)) {
      family = "Arial";
    }

    var findIt = false;

    for (var font in this.fontTable) {
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
    var output = "{\\fonttbl";

    for (var font in this.fontTable) {
      if (this.fontTable.hasOwnProperty(font)) {
        output += "\\" + font + "\\fcharset0 " + this.fontTable[font] + ";";
      }
    }

    return output + "}";
  }

  /**
   *
   */
  richTextEditor.TextConverter.prototype.addToColorTable = function(node) {
    var style = node.style;
    var colorId = "";
    var findIt = false;
    var newColor;

    var theColor = style.color;

    if ((this.colorCount > 0) && (theColor === "")) {
      theColor = this.defaultColor;
      var tmpNode = node.parentNode;
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
      newColor = "\\red" + newColor[0].trim() + "\\green" + newColor[1].trim() + "\\blue" + newColor[2].trim() + ";"

      for (var color in this.colorTable) {
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

    var output = "{\\colortbl";

    for (var color in this.colorTable) {
      if (this.colorTable.hasOwnProperty(color)) {
        output += this.colorTable[color];
      }
    }

    return output + "}";
  }

  /**
   *
   */
  function addSpaceAtEnd(value, extraStr) {
    return (((value.charAt(0) === "\\") || (value.charAt(0) === "{") || (value.charAt(0) === "")) ? extraStr : extraStr+" ") + value;
  }

  return richTextEditor;
})(richTextEditor || {});
