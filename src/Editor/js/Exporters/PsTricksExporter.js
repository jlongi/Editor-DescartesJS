/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var editor = (function(editor) {

  var colorIndex,
      colorTable = {},
      w, 
      h,
      grayscale = false,
      whiteBackground = false;

  /**
   *
   */
  editor.PsTricksExporter = { };

  /**
   *
   */
  editor.PsTricksExporter.export = function(filename) {
    grayscale = editor.PsTricksExportOptions_grayscale;
    whiteBackground = editor.PsTricksExportOptions_whiteBackground;

    colorIndex = 0;
    colorTable = {};

    w = editor.scenes[0].iframe.getAttribute("width");
    h = editor.scenes[0].iframe.getAttribute("height");
    var evaluator = editor.scenes[0].iframe.contentWindow.descartesJS.apps[0].evaluator;

    var txt = "", 
        spaces, graphic, 
        tmpSpaceCtx, 
        allGraphics;

    // iterate over the scenes in the descartes app
    for (var i_scene=0, l_scene=editor.scenes.length; i_scene<l_scene; i_scene++) {
      spaces = editor.scenes[i_scene].iframe.contentWindow.descartesJS.apps[0].spaces;

      // iterate over the spaces in the scene
      for (var i_space=0, l_space=spaces.length; i_space<l_space; i_space++) {
          // init the text in the graphics
          editor.PsTricksExporter.graphicTxt = "";

        if (spaces[i_space].type == "2D") {
          // store the context (space)
          tmpSpaceCtx = spaces[i_space].backCtx;

          // replace the context (space)
          spaces[i_space].backCtx = new PstricksContext(spaces[i_space]);
          spaces[i_space].backCtx.measureText = tmpSpaceCtx.measureText;

          allGraphics = [];

          if (spaces[i_space].drawIfValue) {
            // init the space export
            txt += exportSpace(spaces[i_space], evaluator);

            spaces[i_space].drawBackground();

            allGraphics = (spaces[i_space].backGraphics).concat(spaces[i_space].graphics);
          }

          // for each graphic in space, replace the context for a SVGContext
          for (var i_graphic=0, l_graphic=allGraphics.length; i_graphic<l_graphic; i_graphic++) {
            graphic = allGraphics[i_graphic];

            // no export the graphic fill, image or macro
            if ((graphic.type !== "fill") && (graphic.type !== "image") && (graphic.type !== "macro")) {
              // store que original context (graphic)
              tmpGraphicCtx = graphic.ctx;

              // replace the context (graphic)
              graphic.ctx = new PstricksContext(spaces[i_space]);

              // draw the graphics with the new context
              graphic.draw();

              // restore the original context (graphic)
              graphic.ctx = tmpGraphicCtx;
            }
          }

          // restore que original context (space)
          spaces[i_space].backCtx = tmpSpaceCtx;
        }

        if (spaces[i_space].type == "3D") {
          // store the context (space)
          tmpSpaceCtx = spaces[i_space].ctx;

          // replace the context (space)
          spaces[i_space].ctx = new PstricksContext(spaces[i_space]);

          if (spaces[i_space].drawIfValue) {
            // init the space export
            txt += exportSpace(spaces[i_space], evaluator);

            // draw the graphics
            spaces[i_space].draw();
          }

          // restore que original context (space)
          spaces[i_space].ctx = tmpSpaceCtx;
        }


        txt += editor.PsTricksExporter.graphicTxt;
        if ((spaces[i_space].drawIfValue) && ((spaces[i_space].type == "R2") || (spaces[i_space].type == "R3"))) {
          txt += "\n\\endpsclip\n}\n\n";
        }
      }

    }
    txt = makeHeader(w, h) + txt + makeFooter();

    fs.writeFileSync(filename, txt, "utf-8");
  }

  /**
   *
   */
  PstricksContext = function(space) {
    this.lastPoint = null;

    this.currentMT = 0;
    this.matrixTrans = [
      [
        1, 0, 0,
        0, 1, 0,
        0, 0, 1
      ]
    ];
    this.applymatrixTrans = function(x, y) {
      return {
        x: this.matrixTrans[this.currentMT][0]*x + this.matrixTrans[this.currentMT][1]*y + this.matrixTrans[this.currentMT][2],
        y: this.matrixTrans[this.currentMT][3]*x + this.matrixTrans[this.currentMT][4]*y + this.matrixTrans[this.currentMT][5]
      }
    }

    this.save = function() {
      this.matrixTrans.push(this.matrixTrans[this.currentMT]);
      this.currentMT++;
    };

    this.restore = function() {
      this.matrixTrans.pop();
      this.currentMT--;
    };

    this.translate = function(tx, ty) {
      this.matrixTrans[this.currentMT] = [
        this.matrixTrans[this.currentMT][0], this.matrixTrans[this.currentMT][1], this.matrixTrans[this.currentMT][0]*tx + this.matrixTrans[this.currentMT][1]*ty + this.matrixTrans[this.currentMT][2],
        this.matrixTrans[this.currentMT][3], this.matrixTrans[this.currentMT][4], this.matrixTrans[this.currentMT][3]*tx + this.matrixTrans[this.currentMT][4]*ty + this.matrixTrans[this.currentMT][5],
        0, 0, 1
      ]
    };

    this.rotate = function(theta) {
      var cos = Math.cos(-theta), 
          sin = Math.sin(-theta);

      this.matrixTrans[this.currentMT] = [
        this.matrixTrans[this.currentMT][0]*cos - this.matrixTrans[this.currentMT][1]*sin, this.matrixTrans[this.currentMT][0]*sin + this.matrixTrans[this.currentMT][1]*cos, this.matrixTrans[this.currentMT][2],
        this.matrixTrans[this.currentMT][3]*cos - this.matrixTrans[this.currentMT][4]*sin, this.matrixTrans[this.currentMT][3]*sin + this.matrixTrans[this.currentMT][4]*cos, this.matrixTrans[this.currentMT][5],
        0, 0, 1
      ]
    };

    this.setTransform = function() {};

    this.clearRect = function() {};

    this.fillRect = function() {};

    this.createPattern = function() {};

    this.beginPath = function() {
      this.obj = [];
    };

    this.closePath = function() {
      var i = this.obj.length-1;
      this.obj[i].position.push(this.obj[i].position[0]);
    };

    this.drawImage = function() {};

    this.arc = function(x, y, r, sAngle, eAngle, counterclockwise) {
      var pos = this.applymatrixTrans(x, y);
      x = pos.x -0.5;
      y = pos.y -0.5;

      if (Math.abs(Math.abs(eAngle-sAngle)-Math.PI*2) < 0.001) {
        this.obj.push({
          type: "point",
          position: ["("+ reduceDigits(x) +","+ reduceDigits(space.h-y) +")"],
          r: reduceDigits(r),
          sAngle: reduceDigits(-radToDeg(sAngle)),
          eAngle: reduceDigits(-radToDeg(eAngle))
        });
      }
      else {
        this.obj.push({
          type: "arc",
          position: ["("+ reduceDigits(x) +","+ reduceDigits(space.h-y) +")"],
          r: reduceDigits(r),
          sAngle: reduceDigits(-radToDeg(sAngle)),
          eAngle: reduceDigits(-radToDeg(eAngle))
        });
      }
    };

    this.fill = function() {
      var tmpObj;
      for (var i=0, l=this.obj.length; i<l; i++) {
        tmpObj = this.obj[i];

        var fillcolor = addToColorTable( getLatexColor(this.fillStyle) );

        if (tmpObj.type === "point") {
          if (tmpObj.r > 0) {
            this.lastPoint = tmpObj;
            editor.PsTricksExporter.graphicTxt += "\\psdot[dotstyle=o,dotsize="+ (2*tmpObj.r) +"pt,linecolor="+ fillcolor +",fillcolor="+ fillcolor +"]"+ tmpObj.position.join("") +"\n";
          }
        }
        else if (tmpObj.type === "arc") {
          editor.PsTricksExporter.graphicTxt += "\\pswedge[fillstyle=solid,linestyle=none,fillcolor="+ fillcolor +"]"+ tmpObj.position.join("") +"{"+ tmpObj.r +"}{"+ tmpObj.eAngle +"}{"+ tmpObj.sAngle +"}\n";
        }
        else if (tmpObj.type === "path") {
          if (tmpObj.position.length > 1) {
            editor.PsTricksExporter.graphicTxt += "\\pspolygon[fillstyle=solid,linestyle=none,fillcolor="+ fillcolor +"]"+ tmpObj.position.join("") +"\n";
          }
        }
      }
    };

    this.stroke = function() {
      // inside a text dont draw segments
      if (this.textNode) {
        return;
      }

      var tmpObj;
      for (var i=0, l=this.obj.length; i<l; i++) {
        tmpObj = this.obj[i];

        var strokecolor = addToColorTable( getLatexColor(this.strokeStyle) );

        if (tmpObj.type === "point") {
          if (tmpObj.r > 0) {
            if ( (this.lastPoint) && (this.lastPoint.r === tmpObj.r) && (this.lastPoint.position === tmpObj.position) ) {
              var prevLines = editor.PsTricksExporter.graphicTxt.split("\n");
              var lastLine = prevLines[prevLines.length-2];
              var fillcolor = lastLine.substring(lastLine.indexOf("fillcolor=")+10);
              fillcolor = fillcolor.substring(0, fillcolor.indexOf("]"));

              prevLines[prevLines.length-2] = "\\psdot[dotstyle=o,dotsize="+ (2*tmpObj.r) +"pt,linewidth="+ this.lineWidth +"pt,linecolor="+ strokecolor +",fillcolor="+ fillcolor +"]"+ tmpObj.position.join("");

              editor.PsTricksExporter.graphicTxt = prevLines.join("\n");
            }
            else {
              editor.PsTricksExporter.graphicTxt += "\\psarc[fillstyle=none,linestyle=solid,linewidth="+ this.lineWidth +"pt,linecolor="+ strokecolor +"]"+ tmpObj.position.join("") +"{"+ tmpObj.r +"}{"+ tmpObj.eAngle +"}{"+ tmpObj.sAngle +"}\n";
            }
          }
        }
        else if (tmpObj.type === "arc") {
          if (tmpObj.r > 0) {
            editor.PsTricksExporter.graphicTxt += "\\psarc[fillstyle=none,linestyle=solid,linewidth="+ this.lineWidth +"pt,linecolor="+ strokecolor +"]"+ tmpObj.position.join("") +"{"+ tmpObj.r +"}{"+ tmpObj.eAngle +"}{"+ tmpObj.sAngle +"}\n";
          }
        }
        else if (tmpObj.type === "path") {
          if (tmpObj.position.length > 1) {
            if (parseInt(this.lineWidth) > 0) {
              editor.PsTricksExporter.graphicTxt += "\\psline[fillstyle=none,linestyle=solid,linewidth="+ this.lineWidth +"pt,linecolor="+ strokecolor +"]"+ tmpObj.position.join("") +"\n";
            }
          }
        }
      }
    };

    this.moveTo = function(x, y) {
      var pos = this.applymatrixTrans(x, y);
      x = pos.x -0.5;
      y = pos.y -0.5;

      this.obj.push({
        type: "path",
        position: ["("+ reduceDigits(x) +","+ reduceDigits(space.h-y) +")"]
      });
    };

    this.lineTo = function(x, y) {
      var pos = this.applymatrixTrans(x, y);
      x = pos.x -0.5;
      y = pos.y -0.5;

      var i = this.obj.length-1;
      if ((this.obj.length > 0) && (this.obj[i].type === "path")) {
        this.obj[i].position.push( "("+ reduceDigits(x) +","+ reduceDigits(space.h-y) +")" );
      }
    };

    this.fillText = function(text, x, y) {
      if (this.textNode != this.oldTextNode) {
        var pos = this.applymatrixTrans(x, y);
        x = pos.x -0.5;
        y = pos.y -0.5;

        var fillcolor = addToColorTable( getLatexColor(this.fillStyle) );
        var prop = getStyleProperties(this.font);

        // draw simple text
        if (this.textNode.type != "rtfNode") {
          if (text) {
            editor.PsTricksExporter.graphicTxt += "\\rput[Bl]("+ reduceDigits(x) +","+ reduceDigits(space.h-y) +"){{"+ prop.format +"\\color{"+ fillcolor +"}\\fontsize{"+ prop.fontsize +"}{"+ prop.baselineskip +"}"+ prop.fontfamily +"\\selectfont "+ escapeMathText(text) + prop.closeFormat +"}}\n";
          }
        }
        // draw rft text
        else {
          this.oldTextNode = this.textNode;
          var txt = rtfNodeToLatex(this.textNode, this.fillStyle);
          editor.PsTricksExporter.graphicTxt += "\\rput[Bl]("+ reduceDigits(this.textNode.pos.x+6) +","+ reduceDigits(space.h-this.textNode.pos.y) +"){\\parbox[t]["+ (this.textNode.children[0].baseline) +"pt][t]{\\textwidth}{"+ txt +"}}\n";
        }
      }
    };

    this.strokeText = function(text, x, y) { };

    this.setLineDash = function(dashArray) {

    };
    
  }

  /**
   *
   */
  function getStyleProperties(font) {
    var prop = {};

    prop.fontsize = font.substring(0, font.indexOf("px"));
    var lastIndexOfBlank = prop.fontsize.lastIndexOf(" ");

    if (lastIndexOfBlank >= 0) {
      prop.fontsize = prop.fontsize.substring(lastIndexOfBlank);
    }
    prop.fontsize = reduceDigits(parseFloat(prop.fontsize) -0.2);
    prop.baselineskip = reduceDigits(prop.fontsize*1.2);

    //  \fontfamily{lmr}  // font family lmodern (serif)
    //  \fontfamily{lmss} // font family lmodern (sans serif)
    //  \fontfamily{lmtt} // font family lmodern (monospace)
    //  \fontfamily{ptm} // font family times (serif)
    //  \fontfamily{phv} // font family helveltica (sans serif)
    //  \fontfamily{pcr} // font family courier (monospace)
    prop.fontfamily = "";
    var useSimilar = true;
    if (useSimilar) {
      prop.fontfamily = "\\fontfamily{ptm}";
      if ( font.match(/descartesJS_sansserif/) ) {
        prop.fontfamily = "\\fontfamily{phv}";
      }
      else if ( font.match(/descartesJS_monospace/) ) {
        prop.fontfamily = "\\fontfamily{pcr}";
      }
    }
    else {
      if ( font.match(/descartesJS_serif/) ) {
        prop.fontfamily = "\\fontfamily{lmr}";
      }
      else if ( font.match(/descartesJS_sansserif/) ) {
        prop.fontfamily = "\\fontfamily{lmss}";
      }
      else if ( font.match(/descartesJS_monospace/) ) {
        prop.fontfamily = "\\fontfamily{lmtt}";
      }
    }

    prop.format = "";
    prop.closeFormat = ""
    if ( font.match(/bold/i) ) {
      prop.format += "\\textbf{";
      prop.closeFormat += "}";
    }
    if ( font.match(/oblique/i) || font.match(/italic/i) ) {
      prop.format += "\\textit{";
      prop.closeFormat += "}";
    }

    return prop;
  }

  /**
   *
   */
  function rtfNodeToLatex(rtfNode, generalColor) {
    var latexString = "";

    if ( (rtfNode.nodeType === "textLineBlock") || (rtfNode.nodeType === "textBlock") ) {
      for (var i=0, l=rtfNode.children.length; i<l; i++) {
        latexString = latexString + rtfNodeToLatex(rtfNode.children[i], generalColor);
      }
    }
    else if (rtfNode.nodeType === "text") {
      if (rtfNode.value) {
        var fillcolor = addToColorTable( getLatexColor(rtfNode.color || generalColor) );
        var prop = getStyleProperties(rtfNode.styleString);
        var textlined = "";
        var closeTextlined = "";
        if (rtfNode.underline) { textlined = "\\underline{"; closeTextlined = "}"; };

        latexString = "{"+ prop.format +"\\color{"+ fillcolor +"}\\fontsize{"+ prop.fontsize +"}{"+ prop.baselineskip +"}"+ prop.fontfamily +"\\selectfont "+ textlined +escapeMathText( rtfNode.value ) + closeTextlined + prop.closeFormat +"} ";
      }
    }
    else if (rtfNode.nodeType === "newLine") {
      latexString = "\\\\\\\\";
    }
    else if (rtfNode.nodeType === "formula") {
      var fillcolor = addToColorTable( getLatexColor(rtfNode.color || generalColor) );
      var prop = getStyleProperties(rtfNode.styleString);
      latexString = "{"+ prop.format +"\\color{"+ fillcolor +"}\\fontsize{"+ (prop.fontsize-2) +"}{"+ ((prop.fontsize-2)*1.2) +"}"+ prop.fontfamily +"\\selectfont  $\\displaystyle " + formulaRtfNodeToLatex(rtfNode) + "$ " + prop.closeFormat +"}";
    }
    else if (rtfNode.nodeType === "hyperlink") {
//      latexString = "<span " + this.style.toCSS() + "> <a target='_blank' href='" + this.URL + "'>"+ this.value + "</a></span>";
    }
    else {
      console.log(">>> comando no reconocido <<<");
    }

    return latexString;
  }

  function formulaRtfNodeToLatex(formula) {
    var latexString = "";
    var children_i;

    for (var i=0; i<formula.children.length; i++) {
      children_i = formula.children[i];
      if (children_i.nodeType === "text") {
        latexString += escapeMathText(children_i.value);
      }
      else if (children_i.nodeType === "dynamicText") {
        var decimals = 0;
        var fixed = children_i.fixed;

        try { decimals = children_i.evaluator.eval(children_i.decimals); } catch(e) {};

        var value = children_i.evaluator.eval(children_i.value);
        if (typeof(value) == "number") {
          value = value.toFixed(decimals);
          if (!fixed) {
            value = parseFloat(value);
          }
        }
        latexString += value;
      }
      else if (children_i.nodeType === "mathSymbol") {
        latexString += children_i.value.replace(/\(/g, "\\left(").replace(/\)/g, "\\right)");
      }
      else if (children_i.nodeType === "superIndex") {
        latexString += "^{" + formulaRtfNodeToLatex(children_i) + "}";
      }
      else if (children_i.nodeType === "subIndex") {
        latexString += "_{" + formulaRtfNodeToLatex(children_i) + "}";
      }
      else if (children_i.nodeType === "fraction") {
        latexString += "\\frac{" + formulaRtfNodeToLatex(children_i.children[0]) + "}{" + formulaRtfNodeToLatex(children_i.children[1]) + "}";
      }
      else if (children_i.nodeType === "radical") {
        latexString += "\\sqrt[" + formulaRtfNodeToLatex(children_i.children[0]) + "]{" + formulaRtfNodeToLatex(children_i.children[1]) + "}";
      }
      else if (children_i.nodeType === "sum") {
        latexString += "\\sum_{" + formulaRtfNodeToLatex(children_i.children[0]) + "}^{" + formulaRtfNodeToLatex(children_i.children[1]) + "}{" + formulaRtfNodeToLatex(children_i.children[2]) + "}";
      }
      else if (children_i.nodeType === "integral") {
        latexString += "\\int_{" + formulaRtfNodeToLatex(children_i.children[0]) + "}^{" + formulaRtfNodeToLatex(children_i.children[1]) + "}{" + formulaRtfNodeToLatex(children_i.children[2]) + "}";
      }
      else if (children_i.nodeType === "limit") {
        latexString += "\\lim_{" + formulaRtfNodeToLatex(children_i.children[0]) + " \\to " + formulaRtfNodeToLatex(children_i.children[1]) + "}{" + formulaRtfNodeToLatex(children_i.children[2]) + "}";
      }
      else if (children_i.nodeType === "matrix") {
        latexString += "\\begin{bmatrix}"
        for (var ci=0; ci<children_i.rows; ci++) {
          for (var cj=0; cj<children_i.columns; cj++) {
            latexString += formulaRtfNodeToLatex(children_i.children[cj +ci*children_i.columns]) + " &";
          }
          latexString = latexString.substring(0, latexString.length-2) + "\\\\";
        }
        latexString += "\\end{bmatrix}";
      }
      else if (children_i.nodeType === "defparts") {
        latexString += "\\begin{cases}"
        for (var ci=0; ci<children_i.parts; ci++) {
          latexString += formulaRtfNodeToLatex(children_i.children[ci]) + " \\\\";
        }
        latexString += "\\end{cases}";
      }
      else {
        console.log(children_i, ">>> nodo no reconocido <<<");
      }
    }

    return latexString;
  }

  /**
   *
   */
  function addToColorTable(newColor) {
    var colorId = null;

    // find the color in the color table
    for (var color in colorTable) {
      if (colorTable.hasOwnProperty(color)) {
        if (colorTable[color] == newColor) {
          colorId = color;
        }
      }
    }

    if (colorId === null) {
      colorId = "color_" + colorIndex++;
      colorTable[colorId] = newColor;
    }

    return colorId;
  }
  /**
   *
   */
  function makeColorTable() {
    var txt = "";
    var type = "";
    for (var color in colorTable) {
      if (colorTable.hasOwnProperty(color)) {
        // type = (colorTable[color].indexOf(",") >= 0) ? "RGB" : "HTML"
        // txt += "\\definecolor{"+ color +"}{" + type + "}{"+ colorTable[color] +"}\n";
        txt += "\\definecolor{"+ color +"}{rgb}{"+ colorTable[color] +"}\n";
      }
    }

    return txt;
  }

  /**
   *
   */
  function makeHeader(w, h) {
    var txt = "\\documentclass{article}\n" +
              "\\usepackage[T1]{fontenc}\n" +
              "\\usepackage{textcomp}\n" +
              "\\usepackage{ucs}\n" +
              "\\usepackage[utf8x]{inputenc}\n" +
              "\\SetUnicodeOption{warnunknown}\n" +
//              "\\usepackage{lmodern}\n" +
              "\\usepackage{pstricks}\n" +
              "\\usepackage{pst-all}\n" +
              "\\usepackage{color}\n" +
              "\\usepackage{amsmath}\n" +
              "\\usepackage{amssymb}\n" +
              "\\usepackage[vcentering,dvips]{geometry}\n" +
              "\\geometry{papersize={"+ w +"pt,"+ h + "pt},total={"+ w +"pt,"+ h + "pt}}\n" +
              "\\parindent=0pt\n\n";

    txt += makeColorTable() + "\n";
    txt += "\\begin{document}\n\n";
    txt += "\\psset{unit=1pt,linecap=1}\n\n"
    txt += "\\begin{pspicture}(" + w + "pt," + h +"pt)\n\n"

    return txt;
  }

  /**
   *
   */
  function makeFooter() {
    return "\\end{pspicture}\n\n\\end{document}\n";
  }

  /**
   *
   */
  function exportSpace(space, evaluator) {
    var fillcolor;
    var fillRect = "*";
    var color = space.background.getColor();
    var tmpColor;

    if (color.match(/^rgba/)) {
      tmpColor = color.substring(5, color.length-1);
      tmpColor = tmpColor.split(",");

      if (tmpColor[3] == 0) {
        fillRect = "";
      }
    }

    if (whiteBackground) {
      fillcolor = addToColorTable( getLatexColor("#ffffff") );
    }
    else {
      fillcolor = addToColorTable( getLatexColor(color) );
    }

    var txt = "%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%\n% ";
    txt += space.id;
    txt += "\n%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%\n";
    txt += "\\rput("+ space.x +","+ (h - space.y - space.h) +"){\n";
    txt += "\\psclip{ \\psframe"+ fillRect +"[linecolor="+ fillcolor +",linestyle=none](0,0)("+ space.w +","+ space.h +") }\n";

    return txt;
  }

  /**
   *
   */
  function getLatexColor(color) {
    var r = 0;
    var g = 0;
    var b = 0;

    if (color) {
	    // HTML
	    if (color.charAt(0) == "#") {
	      color = color.substring(1).toUpperCase();

	      r = parseInt("0x"+color.substring(0,2), 16)/255;
	      g = parseInt("0x"+color.substring(2,4), 16)/255;
	      b = parseInt("0x"+color.substring(4,6), 16)/255;
	    }
	    // RGB
	    else if (color.match(/^rgba/)) {
	      color = color.substring(5, color.lastIndexOf(","));
	      color = color.split(",");

	      r = color[0]/255;
	      g = color[1]/255;
	      b = color[2]/255;
	    }

	    // to grayscale
	    if (grayscale) {
	      r = g = b = 0.2126*r + 0.7152*g + 0.0722*b;
	    }
	}
	
    return reduceDigits(r) + ',' + reduceDigits(g) + ',' + reduceDigits(b);
  }

  /**
   *
   */
  function escapeMathText(txt) {
    txt = txt.replace(/α/g, "$\\alpha$")
             .replace(/β/g, "$\\beta$")
             .replace(/γ/g, "$\\gamma$")
             .replace(/δ/g, "$\\delta$")
             .replace(/ε/g, "$\\epsilon$")
             .replace(/ζ/g, "$\\zeta$")
             .replace(/η/g, "$\\eta$")
             .replace(/θ/g, "$\\theta$")
             .replace(/κ/g, "$\\kappa$")
             .replace(/λ/g, "$\\lambda$")
             .replace(/μ/g, "$\\mu$")
             .replace(/ν/g, "$\\nu$")
             .replace(/ξ/g, "$\\xi$")
             .replace(/ο/g, "$o$")
             .replace(/π/g, "$\\pi$")
             .replace(/ρ/g, "$\\rho$")
             .replace(/ς/g, "$\\varsigma$")
             .replace(/σ/g, "$\\sigma$")
             .replace(/τ/g, "$\\tau$")
             .replace(/υ/g, "$\\upsilon$")
             .replace(/φ/g, "$\\varphi$")
             .replace(/χ/g, "$\\chi$")
             .replace(/ψ/g, "$\\psi$")
             .replace(/ω/g, "$\\omega$")
             .replace(/Γ/g, "$\\Gamma$")
             .replace(/Δ/g, "$\\Delta$")
             .replace(/Θ/g, "$\\Theta$")
             .replace(/Λ/g, "$\\Lambda$")
             .replace(/Ξ/g, "$\\Xi$")
             .replace(/Π/g, "$\\Pi$")
             .replace(/Σ/g, "$\\Sigma$")
             .replace(/Υ/g, "$\\Upsilon$")
             .replace(/Φ/g, "$\\Phi$")
             .replace(/Ψ/g, "$\\Psi$")
             .replace(/Ω/g, "$\\Omega$")
             .replace(/↺/g, "$\\circlearrowleft$")
             .replace(/↻/g, "$\\circlearrowright$")

    return replaceUnicode(txt);
  }

 /**
  * 
  */
  function replaceUnicode(txt) {
    var newText = "";
    var charAt;

    for (var i=0, l=txt.length; i<l; i++) {
      charAt = txt.charAt(i);

      // fuera de rango
      if (charAt > "ϯ") {
        newText += '\\unichar{"'+ txt.charCodeAt(i).toString(16) +'}';
      }
      else {
        newText += charAt;
      }
    }

    return newText;
  }

  /**
   *
   */
  function radToDeg(r) {
    return r*(180/Math.PI);
  }

  /**
   *
   */
  function reduceDigits(num) {
    return parseFloat( num.toFixed(4) );
  }


  return editor;
})(editor || {});
