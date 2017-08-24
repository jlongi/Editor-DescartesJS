/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var richTextEditor = (function(richTextEditor) {
  
  richTextEditor.narrowSpace = String.fromCharCode(65279);
  // richTextEditor.narrowSpace = String.fromCharCode(8287);
  // richTextEditor.narrowSpace = " ";

  // create a separator node with no editable
  richTextEditor.separatorNode = document.createElement("span");
  richTextEditor.separatorNode.setAttribute("contenteditable", "false");
  richTextEditor.separatorNode.setAttribute("data-noedit", "true");
  richTextEditor.separatorNode.setAttribute("class", "SeparatorNode");
  richTextEditor.separatorNode.innerHTML = richTextEditor.narrowSpace;

  /**
   *
   */
  richTextEditor.getChildrenByType = function(node, type) {
    var children = node.children;
    var res;

    if (node.hasChildNodes) {
      for (var i=0, l=children.length; i<l; i++) {
        if (children[i].getAttribute("class") === type) {
          return children[i];
        }
      }

      for (var i=0, l=children.length; i<l; i++) {
        res = richTextEditor.getChildrenByType(children[i], type);
        if (res) {
          return res;
        }
      }
    }
    else {
      return null;
    }
  }

  /**
   *
   */
  richTextEditor.newTextBlock = function() {
    var htmlDom = document.createElement("div");
    htmlDom.setAttribute("class", "TextBlock");
    return htmlDom;
  }

  /**
   *
   */
  richTextEditor.newTextLineBlock = function() {
    var htmlDom = document.createElement("div");
    htmlDom.setAttribute("class", "TextLine");
    return htmlDom;
  }

  /**
   *
   */
  richTextEditor.newTextNode = function(style, val) {
    var htmlDom = document.createDocumentFragment();

    var textNode = document.createElement("span");
    textNode.setAttribute("class", "TextNode");
    textNode.setAttribute("style", style);
    textNode.innerHTML = val.replace(/ /g, "&nbsp;");

    var narrowSpace = richTextEditor.separatorNode.cloneNode(true);
    narrowSpace.setAttribute("style", style);

    htmlDom.appendChild(textNode);
    htmlDom.appendChild(narrowSpace);

    return htmlDom;
  }

  /**
   *
   */
  richTextEditor.newNewLine = function(style) {
    var htmlDom = document.createDocumentFragment();

    var textNode = document.createElement("span");
    textNode.setAttribute("class", "TextNode");
    textNode.setAttribute("style", style);
    textNode.innerHTML = richTextEditor.narrowSpace;

    var narrowSpace = richTextEditor.separatorNode.cloneNode(true);
    narrowSpace.setAttribute("style", style);

    htmlDom.appendChild(textNode);
    htmlDom.appendChild(narrowSpace);

    return htmlDom;  }

  /**
   *
   */
  richTextEditor.newFormula = function(style, children) {
    var htmlDom = document.createDocumentFragment();

    var formulaNode = document.createElement("span");
    formulaNode.setAttribute("class", "FormulaNode");
    formulaNode.setAttribute("style", style);
    formulaNode.appendChild(children);

    var narrowSpace = richTextEditor.separatorNode.cloneNode(true);
    narrowSpace.setAttribute("style", style);

    htmlDom.appendChild(richTextEditor.newTextNode(style, richTextEditor.narrowSpace));
    htmlDom.appendChild(formulaNode);
    htmlDom.appendChild(narrowSpace);
    htmlDom.appendChild(richTextEditor.newTextNode(style, richTextEditor.narrowSpace));

    return htmlDom;
  }

  /**
   *
   */
  richTextEditor.newHyperLink = function(style, val, url) {
    var htmlDom = document.createElement("span");
    htmlDom.setAttribute("class", "HyperLinkNode");
    htmlDom.setAttribute("style", style);

    var anchor = document.createElement("a");
    anchor.setAttribute("target", "_blank");
    anchor.setAttribute("href", url);
    anchor.textContent = val;

    htmlDom.appendChild(anchor);

    return htmlDom;
  }

  /**
   *
   */
  richTextEditor.newComponentSpace = function(w, val) {
    var htmlDom = document.createElement("span");
    htmlDom.setAttribute("class", "ComponentSpaceNode");
    htmlDom.setAttribute("style", "display:inline-block; vertical-align:top; width:" + w + "px; height:0px;");
    htmlDom.setAttribute("id", "cID_"+val);

    return htmlDom;
  }

  /**
   *
   */
  richTextEditor.newComponentNumCtrl = function(w, h, val) {
    var htmlDom = document.createElement("span");
    htmlDom.setAttribute("class", "ComponentNumCtrlNode");
    htmlDom.setAttribute("style", "display:inline-block; vertical-align:middle; width:" + w + "px; height:" + h + "px;");
    htmlDom.setAttribute("id", "cID_"+val);

    return htmlDom;
  }

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  /**
   *
   */
  richTextEditor.newDynamicTextNode = function(node) {
    var htmlDom = document.createDocumentFragment();

    var textNode = document.createElement("span");
    textNode.setAttribute("class", "DynamicTextNode");
    textNode.innerHTML = "[expr]";
    textNode.setAttribute("contenteditable", "false");
    textNode.setAttribute("data-decimals", node.decimals);
    textNode.setAttribute("data-fixed", node.fixed);
    textNode.setAttribute("data-value", node.value);
    textNode.setAttribute("data-noedit", "true");

    htmlDom.appendChild(richTextEditor.newFormulaTextNode(richTextEditor.narrowSpace));
    htmlDom.appendChild(textNode);
    htmlDom.appendChild(richTextEditor.separatorNode.cloneNode(true));
    htmlDom.appendChild(richTextEditor.newFormulaTextNode(richTextEditor.narrowSpace));

    return htmlDom;
  }

  /**
   *
   */
  richTextEditor.newFormulaTextNode = function(val) {
    var htmlDom = document.createDocumentFragment();

    var textNode = document.createElement("span");
    textNode.setAttribute("class", "TextNode");
    textNode.innerHTML = val.replace(/ /g, "&nbsp;");

    htmlDom.appendChild(textNode);
    htmlDom.appendChild(richTextEditor.separatorNode.cloneNode(true));

    return htmlDom;
  }

  /**
   *
   */
  richTextEditor.newMathSymbolNode = function(val) {
    var htmlDom = document.createDocumentFragment();

    var mathSymbolNode = document.createElement("span");
    mathSymbolNode.setAttribute("class", "TextNode MathSymbolNode");
    mathSymbolNode.textContent = val;

    htmlDom.appendChild(mathSymbolNode);
    htmlDom.appendChild(richTextEditor.separatorNode.cloneNode(true));

    return htmlDom;
  }

  /**
   *
   */
  richTextEditor.newSuperIndexNode = function(children) {
    var htmlDom = document.createDocumentFragment();

    var superIndexNode = document.createElement("span");
    superIndexNode.setAttribute("class", "SuperIndexNode");
    superIndexNode.appendChild(children);

    htmlDom.appendChild(richTextEditor.newFormulaTextNode(richTextEditor.narrowSpace));
    htmlDom.appendChild(superIndexNode);
    htmlDom.appendChild(richTextEditor.newFormulaTextNode(richTextEditor.narrowSpace));

    return htmlDom;
  }

  /**
   *
   */
  richTextEditor.newSubIndexNode = function(children) {
    var htmlDom = document.createDocumentFragment();

    var subIndexNode = document.createElement("span");
    subIndexNode.setAttribute("class", "SubIndexNode");
    subIndexNode.appendChild(children);

    htmlDom.appendChild(richTextEditor.newFormulaTextNode(richTextEditor.narrowSpace));
    htmlDom.appendChild(subIndexNode);
    htmlDom.appendChild(richTextEditor.newFormulaTextNode(richTextEditor.narrowSpace));

    return htmlDom;
  }

  /**
   *
   */
  richTextEditor.newFractionNode = function(num, den) {
    var htmlDom = document.createDocumentFragment();

    var fractionNode = document.createElement("table");
    fractionNode.setAttribute("class", "FractionNode");

    var numTR = document.createElement("tr");
    var numTD = document.createElement("td");
    var numSpan = document.createElement("span");
    numSpan.setAttribute("class", "NumeratorNode");
    numTR.appendChild(numTD);
    numTD.appendChild(numSpan);
    numSpan.appendChild(num);
    fractionNode.appendChild(numTR);

    var denTR = document.createElement("tr");
    var denTD = document.createElement("td");
    var denSpan = document.createElement("span");
    denSpan.setAttribute("class", "DenominatorNode");
    denTR.appendChild(denTD);
    denTD.appendChild(denSpan);
    denSpan.appendChild(den);
    fractionNode.appendChild(denTR);

    htmlDom.appendChild(richTextEditor.newFormulaTextNode(richTextEditor.narrowSpace));
    htmlDom.appendChild(fractionNode);
    htmlDom.appendChild(richTextEditor.separatorNode.cloneNode(true));
    htmlDom.appendChild(richTextEditor.newFormulaTextNode(richTextEditor.narrowSpace));

    return htmlDom;
  }

  /**
   *
   */
  richTextEditor.newRadicalNode = function(index, radicand) {
    var htmlDom = document.createDocumentFragment();

    var radicalNode = document.createElement("span");
    radicalNode.setAttribute("class", "RadicalNode");

    var indexSpan = document.createElement("span");
    indexSpan.setAttribute("class", "IndexNode");
    indexSpan.appendChild(index);
    radicalNode.appendChild(indexSpan);

    var radicalSign = document.createElement("span");
    radicalSign.setAttribute("class", "RadicalSign");
    radicalSign.setAttribute("contenteditable", "false");
    radicalSign.setAttribute("data-noedit", "true");
    radicalSign.innerHTML = "√";
    radicalNode.appendChild(radicalSign);

    var radicandSpan = document.createElement("span");
    radicandSpan.setAttribute("class", "RadicandNode");
    radicandSpan.appendChild(radicand);
    radicalNode.appendChild(radicandSpan);

    htmlDom.appendChild(richTextEditor.newFormulaTextNode(richTextEditor.narrowSpace));
    htmlDom.appendChild(radicalNode);
    htmlDom.appendChild(richTextEditor.separatorNode.cloneNode(true));
    htmlDom.appendChild(richTextEditor.newFormulaTextNode(richTextEditor.narrowSpace));

    return htmlDom;
  }

  /**
   *
   */
  richTextEditor.newSumNode = function(to, from, what) {
    var htmlDom = document.createDocumentFragment();

    var sumNode = document.createElement("span");
    sumNode.setAttribute("class", "SumNode");

    var sumContainer = document.createElement("table");
    sumContainer.setAttribute("class", "SumContainer");

    var toTR = document.createElement("tr");
    var toTD = document.createElement("td");
    var toSpan = document.createElement("span");
    toSpan.setAttribute("class", "SumToNode");
    toTR.appendChild(toTD);
    toTD.appendChild(toSpan);
    toSpan.appendChild(to);
    sumContainer.appendChild(toTR);

    var sigmaSignTR = document.createElement("tr");
    var sigmaSignTD = document.createElement("td");
    var sigmaSignSpan = document.createElement("span");
    sigmaSignSpan.setAttribute("class", "SigmaSign");
    sigmaSignSpan.setAttribute("contenteditable", "false");
    sigmaSignSpan.setAttribute("data-noedit", "true");
    sigmaSignSpan.innerHTML = "Σ";
    sigmaSignTR.appendChild(sigmaSignTD);
    sigmaSignTD.appendChild(sigmaSignSpan);
    sumContainer.appendChild(sigmaSignTR);

    var fromTR = document.createElement("tr");
    var fromTD = document.createElement("td");
    var fromSpan = document.createElement("span");
    fromSpan.setAttribute("class", "SumFromNode");
    fromTR.appendChild(fromTD);
    fromTD.appendChild(fromSpan);
    fromSpan.appendChild(from);
    sumContainer.appendChild(fromTR);

    var whatSpan = document.createElement("span");
    whatSpan.setAttribute("class", "SumWhatNode");
    whatSpan.appendChild(what);

    sumNode.appendChild(sumContainer);
    sumNode.appendChild(richTextEditor.separatorNode.cloneNode(true));
    sumNode.appendChild(whatSpan);

    htmlDom.appendChild(richTextEditor.newFormulaTextNode(richTextEditor.narrowSpace));
    htmlDom.appendChild(sumNode);
    htmlDom.appendChild(richTextEditor.separatorNode.cloneNode(true));
    htmlDom.appendChild(richTextEditor.newFormulaTextNode(richTextEditor.narrowSpace));

    return htmlDom;
  }

  /**
   *
   */
  richTextEditor.newIntegralNode = function(to, from, what) {
    var htmlDom = document.createDocumentFragment();

    var integralNode = document.createElement("span");
    integralNode.setAttribute("class", "IntegralNode");

    var integralContainer = document.createElement("table");
    integralContainer.setAttribute("class", "IntegralContainer");

    var toTR = document.createElement("tr");
    var toTD = document.createElement("td");
    var toSpan = document.createElement("span");
    toSpan.setAttribute("class", "IntegralToNode");
    toTR.appendChild(toTD);
    toTD.appendChild(toSpan);
    toSpan.appendChild(to);
    integralContainer.appendChild(toTR);

    var integralSignTR = document.createElement("tr");
    var integralSignTD = document.createElement("td");
    var integralSignSpan = document.createElement("span");
    integralSignSpan.setAttribute("class", "IntegralSign");
    integralSignSpan.setAttribute("contenteditable", "false");
    integralSignSpan.setAttribute("data-noedit", "true");
    integralSignSpan.innerHTML = "∫";
    integralSignTR.appendChild(integralSignTD);
    integralSignTD.appendChild(integralSignSpan);
    integralContainer.appendChild(integralSignTR);

    var fromTR = document.createElement("tr");
    var fromTD = document.createElement("td");
    var fromSpan = document.createElement("span");
    fromSpan.setAttribute("class", "IntegralFromNode");
    fromTR.appendChild(fromTD);
    fromTD.appendChild(fromSpan);
    fromSpan.appendChild(from);
    integralContainer.appendChild(fromTR);

    var whatSpan = document.createElement("span");
    whatSpan.setAttribute("class", "IntegralWhatNode");
    whatSpan.appendChild(what);

    integralNode.appendChild(integralContainer);
    integralNode.appendChild(richTextEditor.separatorNode.cloneNode(true));
    integralNode.appendChild(whatSpan);

    htmlDom.appendChild(richTextEditor.newFormulaTextNode(richTextEditor.narrowSpace));
    htmlDom.appendChild(integralNode);
    htmlDom.appendChild(richTextEditor.separatorNode.cloneNode(true));
    htmlDom.appendChild(richTextEditor.newFormulaTextNode(richTextEditor.narrowSpace));

    return htmlDom;
  }

  /**
   *
   */
  richTextEditor.newLimitNode = function(to, from, what) {
    var htmlDom = document.createDocumentFragment();

    var limitNode = document.createElement("span");
    limitNode.setAttribute("class", "LimitNode");

    var limitContainer = document.createElement("span");
    limitContainer.setAttribute("class", "LimitContainer");

    var limitSignSpan = document.createElement("span");
    limitSignSpan.setAttribute("class", "LimitSign");
    limitSignSpan.setAttribute("contenteditable", "false");
    limitSignSpan.setAttribute("data-noedit", "true");
    limitSignSpan.innerHTML = "&nbsp;lím";
    limitContainer.appendChild(limitSignSpan);

    var fromToNodeSpan = document.createElement("span");
    fromToNodeSpan.setAttribute("class", "LimitFromToNode");
    limitContainer.appendChild(fromToNodeSpan);

    var fromSpan = document.createElement("span");
    fromSpan.setAttribute("class", "LimitFromNode");
    fromSpan.appendChild(from);
    fromToNodeSpan.appendChild(fromSpan);

    var arrowSpan = document.createElement("span");
    arrowSpan.setAttribute("class", "LimitArrow");
    arrowSpan.setAttribute("data-noedit", "true");
    arrowSpan.innerHTML = "→";
    fromToNodeSpan.appendChild(arrowSpan);

    var toSpan = document.createElement("span");
    toSpan.setAttribute("class", "LimitToNode");
    toSpan.appendChild(to);
    fromToNodeSpan.appendChild(toSpan);

    var whatSpan = document.createElement("span");
    whatSpan.setAttribute("class", "LimitWhatNode");
    whatSpan.appendChild(what);

    limitNode.appendChild(limitContainer);
    limitNode.appendChild(richTextEditor.separatorNode.cloneNode(true));
    limitNode.appendChild(whatSpan);

    htmlDom.appendChild(richTextEditor.newFormulaTextNode(richTextEditor.narrowSpace));
    htmlDom.appendChild(limitNode);
    htmlDom.appendChild(richTextEditor.separatorNode.cloneNode(true));
    htmlDom.appendChild(richTextEditor.newFormulaTextNode(richTextEditor.narrowSpace));

    return htmlDom;
  }

  /**
   *
   */
  richTextEditor.newElementNode = function(classVal, children) {
    var htmlDom = document.createElement("span");
    htmlDom.setAttribute("class", classVal);
    htmlDom.appendChild(children);

    return htmlDom;
  }

  /**
   *
   */
  richTextEditor.newMatrixNode = function(rows, columns, children) {
    var htmlDom = document.createDocumentFragment();

    var matrixNode = document.createElement("table");
    matrixNode.setAttribute("class", "MatrixNode");

    for (var ci=0; ci<rows; ci++) {
      var matrixTR = document.createElement("tr");
      for (var cj=0; cj<columns; cj++) {
        var matrixTD = document.createElement("td");
        matrixTD.appendChild(richTextEditor.newElementNode("MatrixElementNode", children[cj +ci*columns]));
        matrixTR.appendChild(matrixTD);
      }
      matrixNode.appendChild(matrixTR);
    }

    htmlDom.appendChild(richTextEditor.newFormulaTextNode(richTextEditor.narrowSpace));
    htmlDom.appendChild(matrixNode);
    htmlDom.appendChild(richTextEditor.separatorNode.cloneNode(true));
    htmlDom.appendChild(richTextEditor.newFormulaTextNode(richTextEditor.narrowSpace));

    return htmlDom;
  }

  /**
   *
   */
  richTextEditor.newCasesElementNode = function(parts, children) {
    var htmlDom = document.createDocumentFragment();

    var casesNode = document.createElement("table");
    casesNode.setAttribute("class", "CasesNode");

    for (var ci=0; ci<parts; ci++) {
      var casesTR = document.createElement("tr");
      var casesTD = document.createElement("td");

      casesTD.appendChild(richTextEditor.newElementNode("CasesElementNode", children[ci]));

      casesTR.appendChild(casesTD);
      casesNode.appendChild(casesTR);
    }

    htmlDom.appendChild(richTextEditor.newFormulaTextNode(richTextEditor.narrowSpace));
    htmlDom.appendChild(richTextEditor.newCurlyBracket(parts));
    htmlDom.appendChild(casesNode);    
    htmlDom.appendChild(richTextEditor.separatorNode.cloneNode(true));
    htmlDom.appendChild(richTextEditor.newFormulaTextNode(richTextEditor.narrowSpace));

    return htmlDom;
  }

  richTextEditor.newCurlyBracket = function(parts) {
    var l_curly_bracket_upper_hook = "⎧";
    var l_curly_bracket_middle_piece = "⎨";
    var l_curly_bracket_lower_hook = "⎩";
    // var r_curly_bracket_upper_hook = "⎫";
    // var r_curly_bracket_middle_piece = "⎬";
    // var r_curly_bracket_lower_hook = "⎭";
    var curly_bracket_extension = "⎪";
    var curly_piece;

    var htmlDom = document.createDocumentFragment();

    var curlyBracketNode = document.createElement("div");
    curlyBracketNode.setAttribute("class", "CurlyBracket");
    curlyBracketNode.setAttribute("contenteditable", "false");
    curlyBracketNode.setAttribute("data-noedit", "true");

    for (var ci=0, cl=parts*2-1; ci<cl; ci++) {
      if (ci == 0) { 
        curly_piece = l_curly_bracket_upper_hook;
      }
      else if (ci == cl-1) {
        curly_piece = l_curly_bracket_lower_hook;
      }
      else if (ci == parseInt(cl/2)) {
        curly_piece = l_curly_bracket_middle_piece;
      }
      else {
        curly_piece = curly_bracket_extension;
      }

      var curlyPieceNode = document.createElement("span");
      curlyPieceNode.innerHTML = curly_piece;
      curlyBracketNode.appendChild(curlyPieceNode);
    }

    // htmlDom.appendChild(richTextEditor.newFormulaTextNode(richTextEditor.narrowSpace));
    htmlDom.appendChild(curlyBracketNode);

    return htmlDom;    
  }

  /**
   *
   */
  richTextEditor.adjustFormulaFontSize = function(html, fontSize) {
    var children_i;
    var class_i;
    var oldFontSize;
    var tmpFontSize;

    for (var i=0, l=html.children.length; i<l; i++) {
      children_i = html.children[i];
      class_i = children_i.getAttribute("class") || " ";
      oldFontSize = fontSize;

      if (class_i) {
        if (class_i.match("FormulaNode")) {
          oldFontSize = parseInt( children_i.style["font-size"] );
        }
        else if ( (class_i.match("SuperIndexNode")) || (class_i.match("SubIndexNode")) ) {
          oldFontSize = Math.max( Math.floor(oldFontSize - oldFontSize/3), 8 );
          children_i.style["font-size"] = oldFontSize + "px";
          children_i.style["line-height"] = oldFontSize + "px";
        }
        else if (class_i.match("FractionNode")) {
          oldFontSize = Math.max( Math.round(oldFontSize - oldFontSize*0.1), 8 );
          children_i.style["font-size"] = oldFontSize + "px";
          children_i.style["line-height"] = oldFontSize + "px";
        }
        else if ( (class_i.match("IndexNode"))  ) {
          oldFontSize = Math.max( Math.round(oldFontSize - oldFontSize*0.2), 8 );
          children_i.style["font-size"] = oldFontSize + "px";
          children_i.style["line-height"] = oldFontSize + "px";
        }
        else if (class_i.match("LimitFromToNode")) {
          children_i.style["font-size"] = oldFontSize + "px";
          children_i.style["line-height"] = oldFontSize + "px";
        }
        else if ( (class_i.match("ToNode")) || (class_i.match("FromNode")) ) {
          children_i.style["font-size"] = oldFontSize + "px";
          children_i.style["line-height"] = oldFontSize + "px";
          oldFontSize = Math.max( Math.round(oldFontSize - oldFontSize*0.2), 8 );
        }
        else {
          if (oldFontSize) {
            children_i.style["font-size"] = oldFontSize + "px";
            children_i.style["line-height"] = oldFontSize + "px";
          }
        } 

        // console.log(children_i, class_i, oldFontSize)
      }

      richTextEditor.adjustFormulaFontSize(children_i, oldFontSize);
    }

  }

  /**
   *
   */
  richTextEditor.adjustHeight = function(html) {
    var children_i;
    var class_i;
    var prev_height;
    var height_i;

    for (var i=0, l=html.children.length; i<l; i++) {
      children_i = html.children[i];
      class_i = children_i.getAttribute("class");

      // adjust the children before adjust the node
      richTextEditor.adjustHeight(children_i);

      // get the height of the node now that the children are adjusted
      height_i = parseInt(children_i.offsetHeight);

      ////////////////////////////////////////////////////////////////////////////////////////////////////////
      if (class_i == "FractionNode") {
        children_i.style.verticalAlign = parseInt(children_i.style.fontSize)/3 + "px";
      }
      ////////////////////////////////////////////////////////////////////////////////////////////////////////
      else if (class_i == "SuperIndexNode") {
        children_i.style.verticalAlign = prev_height*0.5 + "px";
      }
      ////////////////////////////////////////////////////////////////////////////////////////////////////////
      else if (class_i == "SubIndexNode") {
        children_i.style.verticalAlign = -prev_height*0.28 + "px";
      }
      ////////////////////////////////////////////////////////////////////////////////////////////////////////
      else if (class_i == "IndexNode") {
        children_i.style.verticalAlign = height_i*(0.7) + "px";
      }
      ////////////////////////////////////////////////////////////////////////////////////////////////////////
      else if (class_i == "RadicalNode") {
        var radicalSign = richTextEditor.getChildrenByType(children_i, "RadicalSign");
        var radicanNode = richTextEditor.getChildrenByType(children_i, "RadicandNode");
        radicalSign.style.fontSize = radicanNode.offsetHeight + "px";
        radicalSign.style.lineHeight = "85%";
        radicalSign.style.height = radicanNode.offsetHeight + "px";
        radicalSign.style.verticalAlign = "bottom";
        radicanNode.style.marginLeft = -(radicanNode.offsetHeight/31) +"px";
        // radicanNode.style.borderWidth = (radicanNode.offsetHeight/30) + "px";
      }
      ////////////////////////////////////////////////////////////////////////////////////////////////////////
      else if (class_i == "SumNode") {
        var sumContainer = richTextEditor.getChildrenByType(children_i, "SumContainer");
        var sumToNode    = richTextEditor.getChildrenByType(sumContainer, "SumToNode");
        var sigmaSign    = richTextEditor.getChildrenByType(sumContainer, "SigmaSign")
        var sumFromNode  = richTextEditor.getChildrenByType(sumContainer, "SumFromNode")
        var sumWhatNode  = richTextEditor.getChildrenByType(children_i, "SumWhatNode");

        sumContainer.style.verticalAlign = parseInt(sigmaSign.offsetHeight*0.9)+"px";
      }
      ////////////////////////////////////////////////////////////////////////////////////////////////////////
      else if (class_i == "IntegralNode") {
        var integralContainer = richTextEditor.getChildrenByType(children_i, "IntegralContainer");
        var integralToNode    = richTextEditor.getChildrenByType(integralContainer, "IntegralToNode");
        var integralSign      = richTextEditor.getChildrenByType(integralContainer, "IntegralSign")
        var integralFromNode  = richTextEditor.getChildrenByType(integralContainer, "IntegralFromNode")
        var integralWhatNode  = richTextEditor.getChildrenByType(children_i, "IntegralWhatNode");

        integralContainer.style.verticalAlign = parseInt(integralSign.offsetHeight*0.9)+"px";
        // integralToNode.style.paddingLeft = (1.5+((integralSign.style.fontStyle === "oblique")?0.5:0))*(integralSign.offsetWidth) +"px";
        integralToNode.style.paddingLeft = 1.5*(integralSign.offsetWidth) +"px";
        integralFromNode.style.paddingLeft = (integralSign.offsetWidth/2) +"px";
      }
      ////////////////////////////////////////////////////////////////////////////////////////////////////////
      else if (class_i == "MatrixNode") {
        var elements = children_i.querySelectorAll(".MatrixElementNode");

        var maxW = maxH = -10000;

        // get the max width and max height
        for (var ci=0; ci<elements.length; ci++) {
          maxW = Math.max(maxW, elements[ci].offsetWidth);
          maxH = Math.max(maxH, elements[ci].offsetHeight);
        }

        // change the style
        for (var ci=0; ci<elements.length; ci++) {
          elements[ci].parentNode.style.width = maxW + "px";
          elements[ci].parentNode.style.height = maxH + "px";
        }
      }
      ////////////////////////////////////////////////////////////////////////////////////////////////////////
      else if (class_i == "CasesNode") {
        var elements = children_i.querySelectorAll(".CasesElementNode");
        var maxW = maxH = -10000;

        for (var ci=0; ci<elements.length; ci++) {
          maxW = Math.max(maxW, elements[ci].offsetWidth);
          maxH = Math.max(maxH, elements[ci].offsetHeight);
        }

        for (var ci=0; ci<elements.length; ci++) {
          elements[ci].parentNode.style.width = maxW + "px";
          elements[ci].parentNode.style.height = (maxH) + "px";
        }
        if (children_i.previousSibling) {          
          var ch_h = (children_i.offsetHeight/children_i.previousSibling.children.length);
          for (var ci=0, cl=children_i.previousSibling.children.length; ci<cl; ci++) {
            children_i.previousSibling.children[ci].style.height = Math.floor(ch_h) + "px";
            children_i.previousSibling.children[ci].style.fontSize = Math.ceil(ch_h*0.8+1) + "px";

            if (ci == parseInt(cl/2)) {
              children_i.previousSibling.children[ci].style.lineHeight = Math.floor(ch_h*2.3) + "px";
            }
            else {
              children_i.previousSibling.children[ci].style.lineHeight = Math.floor(ch_h*1.525) + "px";
            }
          }
        }
      }
      ////////////////////////////////////////////////////////////////////////////////////////////////////////
      else {
        // console.log("nodo desconocido", children_i)
      }

      prev_height = height_i;
    } // end for
  }


  return richTextEditor;
})(richTextEditor || {});
