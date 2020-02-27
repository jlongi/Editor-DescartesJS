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
  var dynamicText;
  var setDecimals;
  var setType;
  var setRows;
  var setColumns;
  var setParts;
  var currentBlock;
  var styleStack;
  var styleStackTop;
  var blockNum;
  var formulaBlock;
  var formulaStack;
  var descartesComponentNumCtrl;
  var descartesComponentSpace;
  var descartesHyperLink;
  var rootNode;

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
    input = input || "{\\rtf1\\uc0{\\fonttbl\\f0\\fcharset0 Times New Roman;}\\f0}}";

// input test
// input = "{\\rtf1\\uc0{\\fonttbl\\f0\\fcharset0 Times New Roman;\\f1\\fcharset0 Courier New;\\f2\\fcharset0 Times New Roman;\\f3\\fcharset0 Times New Roman;}{\\colortbl\\red230\\green0\\blue0;\\red0\\green0\\blue0;}\\f1\\fs48 Hola mundo\\par \\f2\\fs48 \\cf0 Hola \\cf1 mundo \\i\\ul\\ol{\\*\\mjaformula 1{\\fraction{\\num\\cf0 2snfgsdfgsdf\\cf1}{\\den 3}}4}\\i0\\ulnone\\olnone  fadfads\\fs30}";

    if (input.match(/^{\\rtf1\\uc0/)) {
      input = input.substring(10);
    }
    else {
      input = plainTextToRTF(input, defaultStyle);
    }
// console.log(input);
    tokens = this.tokenizer.tokenize(input);
    tokens = checkMathSymboslInFormula(tokens);
    indexToken = 0;
    fontTable = {};
    tempI = 2;
// console.log(tokens);

    // build the font block
    if ( (tokens[0].type === "openBlock") && (tokens[1].value === "fonttbl") ) {
      openBlockIndex = tokens[0].value;

      while ( ((tokens[tempI].type !== "closeBlock") && (tokens[tempI].value !== openBlockIndex)) ) {
        fontTable[tokens[tempI].value] = (tokens[tempI+2].value).substring(0, (tokens[tempI+2].value).length-1);
        tempI = tempI + 3;
      }

      tempI++;
    }

    colorTable = {};
    colorTableIndex = 0;

    // build the color block
    if ( (tokens[tempI].type === "openBlock") && (tokens[tempI+1].value === "colortbl") ) {
      openBlockIndex = tokens[tempI++].value;

      tempI++;

      while ( ((tokens[tempI].type !== "closeBlock") && (tokens[tempI].value !== openBlockIndex)) ) {
        // \red###\green###\blue###;
        r = parseInt(tokens[tempI++].value.substring(3)).toString(16);
        g = parseInt(tokens[tempI++].value.substring(5)).toString(16);
        b = parseInt(tokens[tempI++].value.substring(4)).toString(16);

        // colors separator
        if (tokens[tempI].value === ";") {
          tempI++;
        }

        // #rrggbb
        colorTable[colorTableIndex++] = "#" + ((r.length < 2)? "0"+r : r) + ((g.length < 2)? "0"+g : g) + ((b.length < 2)? "0"+b : b);
      }

      tempI++;
    }

    lastDynamicNode = null;
    lastMatrixNode = null;
    lastPartsNode = null;
    descartesFormula = false;
    dynamicText = false;
    setDecimals = false;
    setType = false;
    setRows = false;
    setColumns = false;
    setParts = false;
    currentBlock = [];
    styleStack = [ new richTextEditor.TextStyle() ];
    styleStackTop = styleStack[0];

    blockNum = -1;
    formulaBlock = -1;
    formulaStack = [];

    // arquimedes rft components
    descartesComponentNumCtrl = false;
    descartesComponentSpace = false;
    descartesHyperLink = false;

    // initial nodes
    newNode = rootNode =  new richTextEditor.TextNode("", "textBlock", styleStackTop); // root
    lastNode = new richTextEditor.TextNode("", "textLineBlock", styleStackTop); // first line
    newNode.addChild(lastNode);
    rootNode.stableWidth = true;
    rootNode.hasFormula = false;


    // build the nodes
    for (var i=tempI, l=tokens.length; i<l; i++) {
      ////////////////////////////////////////////////////
      // controlWord elements
      ////////////////////////////////////////////////////
      if (tokens[i].type == "controlWord") {
        // font type
        if (fontTable[tokens[i].value]) {
          styleStackTop.set({ fontType: fontTable[tokens[i].value] });
        }

        // font size
        else if (tokens[i].value.match(/^fs(\d+)/)) {
          styleStackTop.set({ fontSize: parseInt(((tokens[i].value.match(/^fs(\d+)/))[1])/2) });
        }

        // init bold text
        else if (tokens[i].value == "b") {
          styleStackTop.set({ textBold: true });
          if (formulaStack.length > 0) {
            formulaStack[formulaStack.length-1].style.set({ textBold: true });
          }
        }

        // end bold text
        else if (tokens[i].value == "b0") {
          styleStackTop.set({ textBold: false });
          if (formulaStack.length > 0) {
            formulaStack[formulaStack.length-1].style.set({ textBold: false });
          }
        }

        // init italic text
        else if (tokens[i].value == "i") {
          styleStackTop.set({ textItalic: true });
          if (formulaStack.length > 0) {
            formulaStack[formulaStack.length-1].style.set({ textItalic: true });
          }
        }

        // end italic text
        else if (tokens[i].value == "i0") {
          styleStackTop.set({ textItalic: false });
          if (formulaStack.length > 0) {
            formulaStack[formulaStack.length-1].style.set({ textItalic: false });
          }
        }

        // init underline text
        else if (tokens[i].value == "ul") {
          styleStackTop.set({ textUnderline: true });
          if (formulaStack.length > 0) {
            formulaStack[formulaStack.length-1].style.set({ textUnderline: true });
          }
        }

        // end underline text
        else if (tokens[i].value == "ulnone") {
          styleStackTop.set({ textUnderline: false });
          if (formulaStack.length > 0) {
            formulaStack[formulaStack.length-1].style.set({ textUnderline: false });
          }
        }

        // init overline text
        else if (tokens[i].value == "ol") {
          styleStackTop.set({ textOverline: true });
          if (formulaStack.length > 0) {
            formulaStack[formulaStack.length-1].style.set({ textOverline: true });
          }
        }

        // end overline text
        else if (tokens[i].value == "olnone") {
          styleStackTop.set({ textOverline: false });
          if (formulaStack.length > 0) {
            formulaStack[formulaStack.length-1].style.set({ textOverline: false });
          }
        }

        // color text
        else if (tokens[i].value.match(/^cf(\d+)/)) {
          styleStackTop.set({ textColor: colorTable[parseInt(tokens[i].value.substring(2))] });
          if (formulaStack.length > 0) {
            formulaStack[formulaStack.length-1].style.textColor = styleStackTop.textColor;
          }
        }

        // a new line
        else if (tokens[i].value == "par") {
          // is not necesary to add the new line node, because a new textLineBlock is added
          // lastNode.addChild( new richTextEditor.TextNode("", "newLine", styleStackTop.clone()) );

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
        }

        // descartes formula
        else if (tokens[i].value == "mjaformula") {
          rootNode.hasFormula = true;
          formulaBlock = blockNum;
          descartesFormula = true;

          newNode = new richTextEditor.TextNode("", "formula", styleStackTop.clone());
          lastNode.addChild(newNode);
          lastNode = newNode;

          formulaStack[formulaStack.length-1] = newNode;
        }

        // fraction, sum, integral and limit
        else if ((tokens[i].value == "fraction") ||
                 (tokens[i].value == "radicand") ||
                 (tokens[i].value == "radical") ||
                 (tokens[i].value == "what") ||
                 (tokens[i].value == "sum") ||
                 (tokens[i].value == "integral") ||
                 (tokens[i].value == "limit")
                ) {
          var tmpStyle = formulaStack[formulaStack.length-2].style.clone();

          newNode = new richTextEditor.TextNode("",  tokens[i].value, tmpStyle);

          // add the new node to the element previous to the top, because the top contains the new element to add
          formulaStack[formulaStack.length-2].addChild(newNode);

          // the new element is the stack top
          formulaStack[formulaStack.length-1] = newNode;
        }

        // root index, limits of sum and integral
        else if (tokens[i].value == "index") {
          var tmpStyle = formulaStack[formulaStack.length-2].style.clone();

          // the size of the font can not be less than 8
          tmpStyle.fontSize = mathMax( parseInt(tmpStyle.fontSize - tmpStyle.fontSize*0.5), 8 );

          newNode = new richTextEditor.TextNode("", tokens[i].value, tmpStyle);

          // add the new node to the element previous to the top, because the top contains the new element to add
          formulaStack[formulaStack.length-2].addChild(newNode);

          // the new element is the stack top
          formulaStack[formulaStack.length-1] = newNode;
        }

        // root index, limits of sum and integral
        else if (
          (tokens[i].value == "to") ||
          (tokens[i].value == "from") 
        ) {
          var tmpStyle = formulaStack[formulaStack.length-2].style.clone();

          // the size of the font can not be less than 8
          tmpStyle.fontSize = mathMax( parseInt(tmpStyle.fontSize - tmpStyle.fontSize*0.2), 8 );

          newNode = new richTextEditor.TextNode("", tokens[i].value, tmpStyle);

          // add the new node to the element previous to the top, because the top contains the new element to add
          formulaStack[formulaStack.length-2].addChild(newNode);

          // the new element is the stack top
          formulaStack[formulaStack.length-1] = newNode;
        }

        // numerator or denominator of a fraction
        else if ((tokens[i].value == "num") || (tokens[i].value == "den")) {
          var tmpStyle = formulaStack[formulaStack.length-2].style.clone();

          // the size of the font can not be less than 8
          tmpStyle.fontSize = mathMax( Math.round(tmpStyle.fontSize - tmpStyle.fontSize*0.1), 8 );

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
        }

        // subindex or superindex
        else if ((tokens[i].value == "subix") || (tokens[i].value == "supix")) {
          var tmpStyle = formulaStack[formulaStack.length-2].style.clone();

          // the size of the font can not be less than 8
          tmpStyle.fontSize = mathMax( Math.floor(tmpStyle.fontSize - tmpStyle.fontSize*0.33), 8 );

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
        }

        // defparts, a matrix or an element
        else if ( (tokens[i].value == "defparts") || (tokens[i].value == "matrix") || (tokens[i].value == "element") ) {
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
            lastMatrixNode.matrix_type = 0;
          }
        }

        // number of parts
        else if (tokens[i].value == "parts") {
          setParts = true;
        }

        // 
        else if (tokens[i].value == "type") {
          setType = true;
        }

        // number of rows
        else if (tokens[i].value == "rows") {
          setRows = true;
        }

        // number of columns
        else if (tokens[i].value == "columns") {
          setColumns = true;
        }

        // dynamic text
        else if (tokens[i].value == "expr") {
          rootNode.stableWidth = false;
          dynamicText = true;
        }

        // number of decimals in the text
        else if (tokens[i].value == "decimals") {
          setDecimals = true;
        }

        // fixed representation activated
        else if (tokens[i].value == "fixed1") {
          lastDynamicNode.fixed = true;
        }

        // fixed representation desactivated
        else if (tokens[i].value == "fixed0") {
          lastDynamicNode.fixed = false;
        }

        // a component
        else if (tokens[i].value == "component") { }

        // a control component
        else if (tokens[i].value == "NumCtrl") {
          descartesComponentNumCtrl = true;
        }

        // a space component
        else if (tokens[i].value == "Space") {
          descartesComponentSpace = true;
        }

        // hyperlink
        else if (tokens[i].value == "hyperlink") {
          descartesHyperLink = true;
        }
      }

      ////////////////////////////////////////////////////
      // text elements
      ////////////////////////////////////////////////////
      if (tokens[i].type == "text") {
        // set the number of parts
        if (setParts) {
          lastPartsNode.parts = (parseInt(tokens[i].value));
          setParts = false;
        }

        //
        else if (setType) {
          lastMatrixNode.matrix_type = (parseInt(tokens[i].value));
          setType = false;
        }

        // set the number of rows
        else if (setRows) {
          lastMatrixNode.rows = (parseInt(tokens[i].value));
          setRows = false;
        }

        // set the number of columns
        else if (setColumns) {
          lastMatrixNode.columns = (parseInt(tokens[i].value));
          setColumns = false;
        }

        // set the number of decimals
        else if (setDecimals) {
          lastDynamicNode.decimals = tokens[i].value;
          setDecimals = false;
        }

        // hyperlink content
        else if (descartesHyperLink) {
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
        }

        // a control component content
        else if (descartesComponentNumCtrl) {
          newNode = new richTextEditor.TextNode(tokens[i].value, "componentNumCtrl", styleStackTop.clone());

          lastNode.addChild(newNode);

          descartesComponentNumCtrl = false;
        }

        // a space component content
        else if (descartesComponentSpace) {
          newNode = new richTextEditor.TextNode(tokens[i].value, "componentSpace", styleStackTop.clone());

          lastNode.addChild(newNode);

          descartesComponentSpace = false;
        }

        // dynamic text content
        else if (dynamicText) {
          var tmpStyle = formulaStack[formulaStack.length-2].style.clone();

          textContent = tokens[i].value;

          newNode = new richTextEditor.TextNode(textContent, "dynamicText", tmpStyle);

          // add the new node to the element previous to the top, because the top contains the new element to add
          formulaStack[formulaStack.length-2].addChild(newNode);

          // the new element is the stack top
          formulaStack[formulaStack.length-1] = newNode;

          // save the reference to the last dynamic node, to asign the number of decimals and the fixed representation
          lastDynamicNode = newNode;

          dynamicText = false;
        }

        // no formula text
        else if ((!dynamicText) && (!descartesFormula)) {
          textContent = tokens[i].value;

          newNode = new richTextEditor.TextNode(textContent, "text", styleStackTop.clone());

          if (lastNode.nodeType != "textLineBlock") {
            lastNode = lastNode.parent;

            while (lastNode.nodeType != "textLineBlock") {
              lastNode = lastNode.parent;
            }
          }

          lastNode.addChild(newNode);
        }

        // formula text
        else if ((!dynamicText) && (descartesFormula)) {
          textContent = tokens[i].value;

          newNode = new richTextEditor.TextNode(textContent, "text", formulaStack[formulaStack.length-1].style.clone());

          // add the new node to the top of the formulas stack
          formulaStack[formulaStack.length-1].addChild(newNode);
        }
      }

      ////////////////////////////////////////////////////
      // other elements
      ////////////////////////////////////////////////////

      // init a rtf block, expression or formula
      else if (tokens[i].type == "openBlock") {
        blockNum = tokens[i].value;

        styleStackTop = styleStackTop.clone();
        styleStack.push(styleStackTop);

        formulaStack.push(null);
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
      }

      // mathematical symbols parentheses
      else if ( (tokens[i].type == "(") || (tokens[i].type == ")") ) {
        var tmpStyle = formulaStack[formulaStack.length-1].style.clone();
        tmpStyle.textItalic = "";

        newNode = new richTextEditor.TextNode(tokens[i].type, "mathSymbol", tmpStyle);

        // add the new node to the top of the formulas stack
        formulaStack[formulaStack.length-1].addChild(newNode);
      }

      // mathematical symbols +, -, *,  =
      else if ( (tokens[i].type == "+") || (tokens[i].type == "-") || (tokens[i].type == "*") || (tokens[i].type == "=") ) {
        newNode = new richTextEditor.TextNode(tokens[i].type, "mathSymbol", formulaStack[formulaStack.length-1].style.clone());

        // add the new node to the top of the formulas stack
        formulaStack[formulaStack.length-1].addChild(newNode);
      }

      // unknown elements
      else {
//         console.log("Desconocido ", tokens[i]);
      }
    }
   
    return rootNode.normalize();
  }

  /**
   * Aux function
   */
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
  function plainTextToRTF(txt, defaultStyle) {
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

    // replace needed to convert the new simple text to rtf nodes
    // txt = txt.replace(/\\/g, "\\\\").replace(/\\\\n/g, "\\n").replace(/{/g, "\\{").replace(/}/g, "\\}");
    txt = txt.replace(/\\n/g, "\\n").replace(/{/g, "\\{").replace(/}/g, "\\}");

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
        textElements.push( "{\\*\\mjaformula{\\expr "+ txt.substring(lastPos+1, pos) +"\\decimals "+ defaultStyle.decimals +"\\fixed"+ ((defaultStyle.fixed) ? 1 : 0) +"}}")
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
