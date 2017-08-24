/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var richTextEditor = (function(richTextEditor) {
  var mathMax = Math.max;

  var tokens;
  var indexToken;
  var fontTable;
  var openBlockIndex;
  var tempI;
  var colorTable;
  var colorTableIndex;
  var r;
  var g;
  var b;
  var newNode;
  var lastNode;
  var lastDynamicNode;
  var lastMatrixNode;
  var lastPartsNode;
  var descartesFormula;
  var dinamycText;
  var setDecimals;
  var setRows;
  var setColumns;
  var setParts;
  var currentBlock;
  var styleStack;
  var styleStackTop;
  var stableWidth;
  var blockNum;
  var formulaBlock;
  var formulaStack;
  var hasFormula;
  var descartesComponentNumCtrl;
  var descartesComponentSpace;
  var descartesHyperLink;

  /**
   * Descartes RTF parser
   * @constructor
   */
  richTextEditor.RTFParser = function() {
    this.tokenizer = new richTextEditor.RTFTokenizer();
  }

  /**
   * Parse a string and get a rtf parse tree
   * @param {String} input the input string to parse
   * @param {RTFNode} return a parse tree corresponding to the rtf input
   */
  richTextEditor.RTFParser.prototype.parse = function(input, defaultStyle) {
    input = input || "{\\rtf1\\uc0{\\fonttbl\\f0\\fcharset0 Times New Roman;}\\f0 }}";

    if (input.match(/^{\\rtf1\\uc0/)) {
      input = input.substring(10);
    }
    else {
      input = simpleTextToRTF(input, defaultStyle);
    }

// console.log(input);
    tokens = this.tokenizer.tokenize(input);
    tokens = checkMathSymboslInFormula(tokens);
    indexToken = 0;
    fontTable = {};
    tempI = 2;
// console.log(tokens);

    // build the font block
    if ( (tokens[0].type == "openBlock") && (tokens[1].value == "fonttbl") ) {
      openBlockIndex = tokens[0].value;

      while ( ((tokens[tempI].type != "closeBlock") && (tokens[tempI].value != openBlockIndex)) ) {
        fontTable[tokens[tempI].value] = (tokens[tempI+2].value).substring(0, (tokens[tempI+2].value).length-1);
        tempI = tempI + 3;
      }

      tempI++;
    }

    colorTable = {};
    colorTableIndex = 0;

    // build the color block
    if ( (tokens[tempI].type == "openBlock") && (tokens[tempI+1].value == "colortbl") ) {
      openBlockIndex = tokens[tempI++].value;

      tempI++;

      while ( ((tokens[tempI].type != "closeBlock") && (tokens[tempI].value != openBlockIndex)) ) {
        r = parseInt(tokens[tempI++].value.substring(3)).toString(16);
        g = parseInt(tokens[tempI++].value.substring(5)).toString(16);
        b = parseInt(tokens[tempI++].value.substring(4)).toString(16);

        if (tokens[tempI].value === ";") {
          tempI++;
        }

        // #rrggbb
        colorTable[colorTableIndex++] = "#" + ((r.length < 2)? "0"+r : r) + ((g.length < 2)? "0"+g : g) + ((b.length < 2)? "0"+b : b);
      }

      tempI++;
    }

    // initial parse tree nodes
    newNode = new richTextEditor.TextNode("", "textBlock", "", false, "");
    lastNode = new richTextEditor.TextNode("", "textLineBlock", "", false, "");
    newNode.addChild(lastNode);

    lastDynamicNode = null;
    lastMatrixNode = null;
    lastPartsNode = null;
    descartesFormula = false;
    dinamycText = false;
    setDecimals = false;
    setRows = false;
    setColumns = false;
    setParts = false;
    currentBlock = [];
    styleStack = [ new richTextEditor.FontStyle(20, "Arial", "", "", false, false, null) ];
    styleStackTop = styleStack[0];
    stableWidth = true;

    blockNum = -1;
    formulaBlock = -1;
    formulaStack = [];

    // has formula flag
    hasFormula = false;

    // arquimedes rft components
    descartesComponentNumCtrl = false;
    descartesComponentSpace = false;
    descartesHyperLink = false;

    // build the text nodes
    for (var i=tempI, l=tokens.length; i<l; i++) {
      // font type
      if ((tokens[i].type == "controlWord") && (fontTable[tokens[i].value])) {
        styleStackTop.fontType = fontTable[tokens[i].value];
        continue;
      }
      // font size
      else if ((tokens[i].type == "controlWord") && (tokens[i].value.match(/^fs(\d+)/))) {
        styleStackTop.fontSize = parseInt(((tokens[i].value.match(/^fs(\d+)/))[1])/2);
        continue;
      }
      // init bold text
      else if ((tokens[i].type == "controlWord") && (tokens[i].value == "b")) {
        styleStackTop.textBold = "bold";
        continue;
      }
      // end bold text
      else if ((tokens[i].type == "controlWord") && (tokens[i].value == "b0")) {
        styleStackTop.textBold = "";
        continue;
      }
      // init italic text
      else if ((tokens[i].type == "controlWord") && (tokens[i].value == "i")) {
        styleStackTop.textItalic = "italic";
        continue;
      }
      // end italic text
      else if ((tokens[i].type == "controlWord") && (tokens[i].value == "i0")) {
        styleStackTop.textItalic = "";
        continue;
      }
      // init underline text
      else if ((tokens[i].type == "controlWord") && (tokens[i].value == "ul")) {
        styleStackTop.textUnderline = true;
        continue;
      }
      // end underline text
      else if ((tokens[i].type == "controlWord") && (tokens[i].value == "ulnone")) {
        styleStackTop.textUnderline = false;
        continue;
      }
      // init overline text
      else if ((tokens[i].type == "controlWord") && (tokens[i].value == "ol")) {
        styleStackTop.textOverline = true;
        continue;
      }
      // end overline text
      else if ((tokens[i].type == "controlWord") && (tokens[i].value == "olnone")) {
        styleStackTop.textOverline = false;
        continue;
      }
      // color text
      else if ((tokens[i].type == "controlWord") && (tokens[i].value.match(/^cf(\d+)/))) {
        styleStackTop.textColor = colorTable[parseInt(tokens[i].value.substring(2))];
        if (formulaStack.length > 0) {
          formulaStack[formulaStack.length-1].style.textColor = styleStackTop.textColor;
        }

        continue;
      }
      // init a rtf block, expressions or formulas
      else if (tokens[i].type == "openBlock") {
        blockNum = tokens[i].value;

        styleStackTop = styleStackTop.clone();
        styleStack.push(styleStackTop);

        formulaStack.push(null);

        continue;
      }
      // close a rtf block, expression or formulas
      else if (tokens[i].type == "closeBlock") {
        if (tokens[i].value == formulaBlock) {
          formulaBlock = -1;
          descartesFormula = false;
          lastNode = lastNode.parent;
        }

        styleStack.pop();
        styleStackTop = styleStack[styleStack.length-1];

        formulaStack.pop();

        continue;
      }
      // a new line
      else if ((tokens[i].type == "controlWord") && (tokens[i].value == "par")) {
        lastNode.addChild( new richTextEditor.TextNode("", "newLine", styleStackTop.clone()) );

        newNode = new richTextEditor.TextNode("", "textLineBlock", styleStackTop.clone());

        // find a textBlock to add the new line
        if (lastNode.nodeType != "textBlock") {
          lastNode = lastNode.parent;

          while (lastNode.nodeType != "textBlock") {
            lastNode = lastNode.parent;
          }
        }

        lastNode.addChild(newNode);
        lastNode = newNode;

        continue;
      }
      // descartes formula
      else if ((tokens[i].type == "controlWord") && (tokens[i].value == "mjaformula")) {
        hasFormula = true;
        formulaBlock = blockNum;
        descartesFormula = true;

        newNode = new richTextEditor.TextNode("", "formula", styleStackTop.clone());
        lastNode.addChild(newNode);
        lastNode = newNode;

        formulaStack[formulaStack.length-1] = newNode;

        continue;
      }
      // fraction, sum, integral and limit
      else if ((tokens[i].type == "controlWord") && ((tokens[i].value == "fraction") ||
                                                     (tokens[i].value == "radicand") ||
                                                     (tokens[i].value == "radical") ||
                                                     (tokens[i].value == "what") ||
                                                     (tokens[i].value == "sum") ||
                                                     (tokens[i].value == "integral") ||
                                                     (tokens[i].value == "limit")
                                                    )) {
        var tmpStyle = formulaStack[formulaStack.length-2].style.clone();

        newNode = new richTextEditor.TextNode("",  tokens[i].value, tmpStyle);

        // add the new node to the element previous to the top, because the top contains the new element to add
        formulaStack[formulaStack.length-2].addChild(newNode);

        // the new element is the stack top
        formulaStack[formulaStack.length-1] = newNode;

        continue;
      }
      // root index, limits of sum and integral
      else if ((tokens[i].type == "controlWord") && ( (tokens[i].value == "index")) ||
                                                      (tokens[i].value == "to") ||
                                                      (tokens[i].value == "from") ) {
        var tmpStyle = formulaStack[formulaStack.length-2].style.clone();

        // the size of the font can not be less than 8
        tmpStyle.fontSize = mathMax( parseInt(tmpStyle.fontSize - tmpStyle.fontSize*.2), 8 );

        newNode = new richTextEditor.TextNode("", tokens[i].value, tmpStyle);

        // add the new node to the element previous to the top, because the top contains the new element to add
        formulaStack[formulaStack.length-2].addChild(newNode);

        // the new element is the stack top
        formulaStack[formulaStack.length-1] = newNode;

        continue;
      }
      // numerator or denominator of a fraction
      else if ((tokens[i].type == "controlWord") && ((tokens[i].value == "num") || (tokens[i].value == "den"))) {
        var tmpStyle = formulaStack[formulaStack.length-2].style.clone();

        // the size of the font can not be less than 8
        tmpStyle.fontSize = mathMax( Math.round(tmpStyle.fontSize - tmpStyle.fontSize*.1), 8 );

        if (tokens[i].value == "num") {
          newNode = new richTextEditor.TextNode("", "numerator", tmpStyle);
        }
        else if (tokens[i].value == "den") {
          newNode = new richTextEditor.TextNode("", "denominator", tmpStyle);
        }

        // add the new node to the element previous to the top, because the top contains the new element to add
        formulaStack[formulaStack.length-2].addChild(newNode);

        // the new element is the stack top
        formulaStack[formulaStack.length-1] = newNode;

        continue;
      }
      // subindex or superindex
      else if ((tokens[i].type == "controlWord") && ((tokens[i].value == "subix") || (tokens[i].value == "supix"))) {
        var tmpStyle = formulaStack[formulaStack.length-2].style.clone();

        // the size of the font can not be less than 8
        tmpStyle.fontSize = mathMax( Math.floor(tmpStyle.fontSize - tmpStyle.fontSize/3), 8 );

        if (tokens[i].value == "subix") {
          newNode = new richTextEditor.TextNode("", "subIndex", tmpStyle);
        }
        else if (tokens[i].value == "supix") {
          newNode = new richTextEditor.TextNode("", "superIndex", tmpStyle);
        }

        newNode.originalStyle = formulaStack[formulaStack.length-2].style.clone();

        // add the new node to the element previous to the top, because the top contains the new element to add
        formulaStack[formulaStack.length-2].addChild(newNode);

        // the new element is the stack top
        formulaStack[formulaStack.length-1] = newNode;

        continue;
      }
      // defparts, a matrix or an element
      else if ((tokens[i].type == "controlWord") && ( (tokens[i].value == "defparts") || (tokens[i].value == "matrix") || (tokens[i].value == "element") )) {
        var tmpStyle = formulaStack[formulaStack.length-2].style.clone();

        newNode = new richTextEditor.TextNode("", tokens[i].value, tmpStyle);

        // add the new node to the element previous to the top, because the top contains the new element to add
        formulaStack[formulaStack.length-2].addChild(newNode);

        // the new element is the stack top
        formulaStack[formulaStack.length-1] = newNode;

        if (tokens[i].value == "defparts") {
          lastPartsNode = newNode;
        }
        else if (tokens[i].value == "matrix") {
          lastMatrixNode = newNode;
        }

        continue;
      }
      // number of parts
      else if ((tokens[i].type == "controlWord") && (tokens[i].value == "parts")) {
        setParts = true;
        continue;
      }
      // set the number of parts
      else if ((tokens[i].type == "text") && (setParts)) {
        lastPartsNode.parts = (parseInt(tokens[i].value));
        setParts = false;
        continue;
      }
      // number of rows
      else if ((tokens[i].type == "controlWord") && (tokens[i].value == "rows")) {
        setRows = true;
        continue;
      }
      // set the number of rows
      else if ((tokens[i].type == "text") && (setRows)) {
        lastMatrixNode.rows = (parseInt(tokens[i].value));
        setRows = false;
        continue;
      }
      // number of columns
      else if ((tokens[i].type == "controlWord") && (tokens[i].value == "columns")) {
        setColumns = true;
        continue;
      }
      // set the number of columns
      else if ((tokens[i].type == "text") && (setColumns)) {
        lastMatrixNode.columns = (parseInt(tokens[i].value));
        setColumns = false;
        continue;
      }
      // dinamyc text
      else if ((tokens[i].type == "controlWord") && (tokens[i].value == "expr")) {
        stableWidth = false;
        dinamycText = true;
        continue;
      }
      // number of decimals in the text
      else if ((tokens[i].type == "controlWord") && (tokens[i].value == "decimals")) {
        setDecimals = true;
        continue;
      }
      // set the number of decimals
      else if ((tokens[i].type == "text") && (setDecimals)) {
        lastDynamicNode.decimals = tokens[i].value;
        setDecimals = false;
        continue;
      }
      // init fixed representation
      else if ((tokens[i].type == "controlWord") && (tokens[i].value == "fixed1")) {
        lastDynamicNode.fixed = true;
        continue;
      }
      // end fixed representation
      else if ((tokens[i].type == "controlWord") && (tokens[i].value == "fixed0")) {
        lastDynamicNode.fixed = false;
        continue;
      }
      // a component
      else if ((tokens[i].type == "controlWord") && (tokens[i].value == "component")) { }
      // a control component
      else if ((tokens[i].type == "controlWord") && (tokens[i].value == "NumCtrl")) {
        descartesComponentNumCtrl = true;
      }
      // a space component
      else if ((tokens[i].type == "controlWord") && (tokens[i].value == "Space")) {
        descartesComponentSpace = true;
      }
      // hyperlink
      else if ((tokens[i].type == "controlWord") && (tokens[i].value == "hyperlink")) {
        descartesHyperLink = true;
      }
      // hyperlink content
      else if ((tokens[i].type == "text") && (descartesHyperLink)) {
        textContent = ((tokens[i].value).split("|"))[0];
        tmpStyle = styleStackTop.clone();

        newNode = new richTextEditor.TextNode(textContent, "hyperlink", tmpStyle);
        newNode.URL = ((tokens[i].value).split("|"))[1];

        if (lastNode.nodeType != "textLineBlock") {
          lastNode = lastNode.parent;

          while (lastNode.nodeType != "textLineBlock") {
            lastNode = lastNode.parent;
          }
        }

        lastNode.addChild(newNode);

        descartesHyperLink = false;
        continue;
      }
      // a control component content
      else if ((tokens[i].type == "text") && (descartesComponentNumCtrl)) {
        newNode = new richTextEditor.TextNode(tokens[i].value, "componentNumCtrl", styleStackTop.clone());

        lastNode.addChild(newNode);

        descartesComponentNumCtrl = false;
        continue;
      }
      // a space component content
      else if ((tokens[i].type == "text") && (descartesComponentSpace)) {
        newNode = new richTextEditor.TextNode(tokens[i].value, "componentSpace", styleStackTop.clone());

        lastNode.addChild(newNode);

        descartesComponentSpace = false;
        continue;
      }
      // dynamic text content
      else if ((tokens[i].type == "text") && (dinamycText)) {
        var tmpStyle = formulaStack[formulaStack.length-2].style.clone();

        textContent = tokens[i].value;

        newNode = new richTextEditor.TextNode(textContent, "dynamicText", tmpStyle);

        // add the new node to the element previous to the top, because the top contains the new element to add
        formulaStack[formulaStack.length-2].addChild(newNode);

        // the new element is the stack top
        formulaStack[formulaStack.length-1] = newNode;

        // save the reference to the last dynamic node, to asign the number of decimals and the fixed representation
        lastDynamicNode = newNode;

        dinamycText = false;
        continue;
      }
      // no formula text
      else if ((tokens[i].type == "text") && (!dinamycText) && (!descartesFormula)) {
        textContent = tokens[i].value;

        newNode = new richTextEditor.TextNode(textContent, "text", styleStackTop.clone());

        if (lastNode.nodeType != "textLineBlock") {
          lastNode = lastNode.parent;

          while (lastNode.nodeType != "textLineBlock") {
            lastNode = lastNode.parent;
          }
        }

        lastNode.addChild(newNode);
        continue;
      }
      // formula text
      else if ((tokens[i].type == "text") && (!dinamycText) && (descartesFormula)) {
        textContent = tokens[i].value;

        newNode = new richTextEditor.TextNode(textContent, "text", formulaStack[formulaStack.length-1].style.clone());

        // add the new node to the top of the formulas stack
        formulaStack[formulaStack.length-1].addChild(newNode);

        continue;
      }
      // mathematical symbols parentheses
      else if ( (tokens[i].type == "(") || (tokens[i].type == ")") ) {
        var tmpStyle = formulaStack[formulaStack.length-1].style.clone();
        tmpStyle.textItalic = "";

        newNode = new richTextEditor.TextNode(tokens[i].type, "mathSymbol", tmpStyle);

        // add the new node to the top of the formulas stack
        formulaStack[formulaStack.length-1].addChild(newNode);

        continue;
      }
      // mathematical symbols +, -, *,  =
      else if ( (tokens[i].type == "+") || (tokens[i].type == "-") ||
                (tokens[i].type == "*") || (tokens[i].type == "=") ) {
        newNode = new richTextEditor.TextNode(tokens[i].type, "mathSymbol", formulaStack[formulaStack.length-1].style.clone());

        // add the new node to the top of the formulas stack
        formulaStack[formulaStack.length-1].addChild(newNode);

        continue;
      }

      // unknown elements
      else {
//         console.log("Desconocido ", tokens[i]);
      }
    }

    // get the root node
    if (lastNode != null) {
      var rootNode = lastNode.getRoot();
      rootNode.stableWidth = stableWidth;
      // rootNode.getTextMetrics();

      rootNode.hasFormula = hasFormula;

      // console.log(rootNode);
    }

    return rootNode;
  }

  /**
   * Font style for rtf text
   * @param {Number} fontsize the size of the font
   * @param {String} fontType the font family name
   * @param {String} textItalic the flag if the text is italic
   * @param {String} textBold the flag if the text is bold
   * @param {Boolean} textUnderline the flag if the text is undelined
   * @param {Boolean} textOverline the flag if the text is overlined
   * @param {String} textColor the color of the text
   * @constuctor
   */
  richTextEditor.FontStyle = function(fontSize, fontType, textItalic, textBold, textUnderline, textOverline, textColor) {
    this.fontSize = fontSize;
    this.fontType = fontType;
    this.textItalic = textItalic;
    this.textBold = textBold;
    this.textUnderline = textUnderline;
    this.textOverline = textOverline;
    this.textColor = textColor;
  }

  /**
   * Convert the font style to a string representation
   * @return {String} return the string representation of the style
   */
  richTextEditor.FontStyle.prototype.toString = function() {
    if ((/arial/i).test(this.fontType)) {
      this.fontType = "Arial,Helvetica,Sans-serif";
    }
    else if ((/times/i).test(this.fontType)) {
      this.fontType = "'Times New Roman',Times,serif";
    }
    else if ((/courier/i).test(this.fontType)) {
      this.fontType = "'Courier New',Courier,Monospace";
    }

    return (this.textBold + " " + this.textItalic + " " + this.fontSize + "px " + this.fontType).trim();
  }

  /**
   * Get a CSS style
   * {String} retur a CSS style for the font style
   */
  richTextEditor.FontStyle.prototype.toCSS = function(inFormula) {
    var cssRule = ""; 
    // var cssRule = 'style="font-size:' + this.fontSize + 'px; line-height:' + this.fontSize + 'px; font-family:' + this.fontType + '; ';
    // var cssRule = 'style="font-size:' + this.fontSize + 'px; line-height:initial; font-family:' + this.fontType + ';';

    if (!inFormula) {
      cssRule = 'font-size:' + this.fontSize + 'px; line-height:' + this.fontSize + 'px; font-family:' + this.fontType + ";";
      
      if (this.textUnderline && !this.textOverline) {
        cssRule += 'text-decoration:underline;';
      }
      if (!this.textUnderline && this.textOverline) {
        cssRule += 'text-decoration:overline;';
      }
      if (this.textUnderline && this.textOverline) {
        cssRule += 'text-decoration:underline overline;';
      }
      if (this.textBold && !this.textItalic) {
        cssRule += 'font-style:normal; font-weight:bold;';
      }
      if (!this.textBold && this.textItalic) {
        cssRule += 'font-style:italic; font-weight:normal;';
      }
      if (this.textBold && this.textItalic) {
        cssRule += 'font-style:italic; font-weight:bold;';
      }
      if (!this.textBold && !this.textItalic) {
        cssRule += 'font-style:normal; font-weight:normal;';
      }
    }
    
    if (this.textColor) {
      cssRule += 'color:' + this.textColor + ';';
    }

    return cssRule;
  }

  /**
   * Clone a font style
   * @return {FontStyle} return a clone font style
   */
  richTextEditor.FontStyle.prototype.clone = function() {
    return new richTextEditor.FontStyle(this.fontSize, this.fontType, this.textItalic, this.textBold, this.textUnderline, this.textOverline, this.textColor);
  }

  function checkMathSymboslInFormula(tokens) {
    return tokens;
//     console.log(tokens);
    var tokensResult = [];

    var inFormula = false;
    var ignoreText = false;
    var inExpression = false;
    var currentOpenBlock = [];

    for (var i=0, l=tokens.length; i<l; i++) {
      // register if open a block, to see if it is within a formula or not
      if (tokens[i].type == "openBlock") {
        currentOpenBlock.push(tokens[i].value);
      }

      // register if close a block, to see if it is within a formula or not
      if (tokens[i].type == "closeBlock") {
        currentOpenBlock.pop();

        if (currentOpenBlock.length <= 0) {
          inFormula = false;
        }
      }

      // the parentheses within an expression should not be changed
      if ((tokens[i].type == "controlWord") && ((tokens[i].value == "expr") || (tokens[i].value == "decimals"))) {
        ignoreText = true;
      }

      // register if is on a formula, to check the texts within it
      if ((tokens[i].type == "controlWord") && (tokens[i].value == "mjaformula")) {
        inFormula = true
      }

      // if the token is a text and we are in a formula and the text is not an expression then must seek parentheses
      if ((tokens[i].type == "text") && (inFormula) && (!ignoreText)) {
        var lastIndex = 0;
        var value = tokens[i].value;
        var newValue = "";

        for (var j=0, k=value.length; j<k; j++) {

          if ( (value.charAt(j) == "(") || (value.charAt(j) == ")") ||
               (value.charAt(j) == "+") || (value.charAt(j) == "-") ||
               (value.charAt(j) == "*") || (value.charAt(j) == "=")
             ) {
            newValue = value.substring(lastIndex, j);
            if (newValue != "") {
              tokensResult.push( {type: "text", value: newValue} );
            }
            tokensResult.push( {type: value.charAt(j), value: value.charAt(j)} );
            lastIndex = j+1;
          }

        }

        // when end the for, add the rest of the string
        newValue = value.substring(lastIndex, j);
        if (newValue != "") {
          tokensResult.push( {type: "text", value: newValue} );
        }
      }
      // other nodes
      else {
        tokensResult.push(tokens[i]);
        if ((tokens[i].type == "text") && (ignoreText)) {
          ignoreText = false;
        }
      }
    }

//     console.log(tokensResult);
    return tokensResult;
  }

  /**
   *
   */
  function simpleTextToRTF(txt, defaultStyle) {
    var styleOpen = "";
    var styleClose = "";

    // get the styles 
    if (defaultStyle.textDecoration === "underline") {
      styleOpen = "\\ul";
      styleClose = "\\ulnone";
    }
    else if (defaultStyle.textDecoration === "overline") {
      styleOpen = "\\ol";
      styleClose = "\\olnone";
    }
    else if (defaultStyle.textDecoration === "underline overline") {
      styleOpen = "\\ul\\ol";
      styleClose = "\\olnone\\ulnone";
    }
    if (defaultStyle.fontStyle === "italic") {
      styleOpen = "\\i"+ styleOpen;
      styleClose = styleClose + "\\i0";
    }
    if (defaultStyle.fontWeight === "bold") {
      styleOpen = "\\b"+ styleOpen;
      styleClose = styleClose + "\\b0";
    }

    if (styleOpen.charAt(styleOpen.length-1) !== " ") {
      styleOpen += " ";
    }
    
    var pos = 0;
    var lastPos = 0;
    var charAt;
    var charAtAnt;
    var textElements = [];
    var ignoreSquareBracket = -1;
    var bracketText = "";

    while (pos < txt.length) {
      charAt = txt.charAt(pos);
      charAtAnt = txt.charAt(pos-1);

      // open square bracket scaped
      if ((charAt === "[") && (charAtAnt === "\\")) {
        textElements.push(txt.substring(lastPos, pos-1) + "[");
        lastPos = pos+1;
      }

      // close square bracket scaped
      else if ((charAt === "]") && (charAtAnt === "\\")) {
        textElements.push(txt.substring(lastPos, pos-1) + "]");
        lastPos = pos+1;
      }

      // if find an open square bracket
      else if ((charAt === "[") && (ignoreSquareBracket === -1)) {
        textElements.push(txt.substring(lastPos, pos));
        lastPos = pos;
        ignoreSquareBracket++;
      }

      else if (charAt === "[") {
        ignoreSquareBracket++;
      }

      // if find a close square bracket add the string +'
      else if ((charAt === "]") && (ignoreSquareBracket === 0)) {
        textElements.push( "{\\*\\mjaformula{\\expr "+ txt.substring(lastPos+1, pos) +"\\decimals 2\\fixed0}}")
        lastPos = pos+1;
        ignoreSquareBracket--;
      }

      else if (txt.charAt(pos) == "]") {
        ignoreSquareBracket = (ignoreSquareBracket < 0) ? ignoreSquareBracket : ignoreSquareBracket-1;
        bracketText = bracketText + txt.charAt(pos);
      }

      else {
        bracketText = bracketText + txt.charAt(pos);
      }

      pos++;
    }
    textElements.push(txt.substring(lastPos, pos));
    txt = textElements.join("");

    return "{\\fonttbl\\f0\\fcharset0 "+ defaultStyle.fontFamily +";}\\f0\\fs"+ (parseInt(defaultStyle.fontSize)*2) + (styleOpen || " " ) + txt.replace(/\\n/g, "\\par ") + styleClose + "}";

  }

  return richTextEditor;
})(richTextEditor || {});
