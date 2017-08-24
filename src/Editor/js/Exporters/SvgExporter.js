/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var editor = (function(editor) {

  var w, h, imagesDefs, imagesDefsIds;

  /**
   *
   */
  editor.SVGExporter = { };

  /**
   *
   */
  editor.SVGExporter.export = function(filename) {
    w = editor.scenes[0].iframe.getAttribute("width");
    h = editor.scenes[0].iframe.getAttribute("height");
    imagesDefs = [];
    imagesDefsIds = [];

    var evaluator = editor.scenes[0].iframe.contentWindow.descartesJS.apps[0].evaluator;

    var txt = "", 
        spaces, 
        graphic, 
        tmpSpaceCtx, 
        allGraphics;

    // iterate over the scenes in the descartes app
    for (var i_scene=0, l_scene=editor.scenes.length; i_scene<l_scene; i_scene++) {
      spaces = editor.scenes[i_scene].iframe.contentWindow.descartesJS.apps[0].spaces;

      // iterate over the spaces in the scene
      for (var i_space=0, l_space=spaces.length; i_space<l_space; i_space++) {
        // init the text in the graphics
        editor.SVGExporter.graphicTxt = "";

        if (spaces[i_space].type == "R2") {
          // store the context (space)
          tmpSpaceCtx = spaces[i_space].backCtx;

          // replace the context (space)
          spaces[i_space].backCtx = new SVGContext(spaces[i_space]);
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
            if ((graphic.type !== "fill") && (graphic.type !== "macro")) {
              // store que original context (graphic)
              tmpGraphicCtx = graphic.ctx;

              // replace the context (graphic)
              graphic.ctx = new SVGContext(spaces[i_space]);

              // draw the graphics with the new context
              graphic.draw();

              // restore the original context (graphic)
              graphic.ctx = tmpGraphicCtx;
            }
          }

          // restore que original context (space)
          spaces[i_space].backCtx = tmpSpaceCtx;
        }

        else if (spaces[i_space].type == "R3") {
          // store the context (space)
          tmpSpaceCtx = spaces[i_space].ctx;

          // replace the context (space)
          spaces[i_space].ctx = new SVGContext(spaces[i_space]);

          if (spaces[i_space].drawIfValue) {
            // init the space export
            txt += exportSpace(spaces[i_space], evaluator);

            // draw the graphics
            spaces[i_space].draw();
          }

          // restore que original context (space)
          spaces[i_space].ctx = tmpSpaceCtx;
        }

        txt += editor.SVGExporter.graphicTxt;
        if ((spaces[i_space].drawIfValue) && ((spaces[i_space].type == "R2") || (spaces[i_space].type == "R3"))) {
          txt += '</g>\n\n';
        }
      }

    }
    txt = makeHeader(w, h) + makeImageDefs() + txt + makeFooter();

    fs.writeFileSync(filename, txt, "utf-8");
  }

  /**
   *
   */
  SVGContext = function(space) {
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
      this.descImgTrn = 'translate('+ tx +', '+ ty +') ';

      this.matrixTrans[this.currentMT] = [
        this.matrixTrans[this.currentMT][0], this.matrixTrans[this.currentMT][1], this.matrixTrans[this.currentMT][0]*tx + this.matrixTrans[this.currentMT][1]*ty + this.matrixTrans[this.currentMT][2],
        this.matrixTrans[this.currentMT][3], this.matrixTrans[this.currentMT][4], this.matrixTrans[this.currentMT][3]*tx + this.matrixTrans[this.currentMT][4]*ty + this.matrixTrans[this.currentMT][5],
        0, 0, 1
      ]
    };

    this.rotate = function(theta) {
      this.descImgRot = 'rotate('+ radToDeg(theta) +') ';

      var cos = Math.cos(-theta),
          sin = Math.sin(-theta);

      this.matrixTrans[this.currentMT] = [
        this.matrixTrans[this.currentMT][0]*cos - this.matrixTrans[this.currentMT][1]*sin, this.matrixTrans[this.currentMT][0]*sin + this.matrixTrans[this.currentMT][1]*cos, this.matrixTrans[this.currentMT][2],
        this.matrixTrans[this.currentMT][3]*cos - this.matrixTrans[this.currentMT][4]*sin, this.matrixTrans[this.currentMT][3]*sin + this.matrixTrans[this.currentMT][4]*cos, this.matrixTrans[this.currentMT][5],
        0, 0, 1
      ]
    };

    this.scale = function(sx, sy) {
      this.descImgScl = 'scale('+ sx +', '+ sy +') ';
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

    this.drawImage = function(img, x, y, w, h) {
      x = x + space.x;
      y = y + space.y;

      w = (w || img.width);
      h = (h || img.height);

      var trans = (this.descImgTrn || "") + (this.descImgRot || "") + (this.descImgScl || "")
      if (trans !== "") {
        trans = 'transform="' + trans + '"';
      }

      var canvas = document.createElement("canvas");
      canvas.setAttribute("width", w);
      canvas.setAttribute("height", h);
      var ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);

      var id = path.basename(img.src).replace(".", "_");

      // add the image to the definition list
      addImageDef(id, '\t<image id="'+ id +'" xlink:href="'+ canvas.toDataURL() +'" x="0" y="0" width="'+ w +'px" height="'+ h +'px" />\n')

      // add an use graphic to show the image
      editor.SVGExporter.graphicTxt += '\t<use xlink:href="#'+ id +'" x="'+ x +'" y="'+ y +'" width="'+ w +'px" height="'+ h +'px" '+ trans +'/>\n';
    };

    this.arc = function(x, y, r, sAngle, eAngle, counterclockwise) {
      var pos = this.applymatrixTrans(x, y);
      x = pos.x + space.x;
      y = pos.y + space.y;

      if (Math.abs(Math.abs(eAngle-sAngle)-Math.PI*2)<0.001) {
        this.obj.push({
          type: "point",
          position: [ {x:x, y:y} ],
          r: reduceDigits(r)
        });
      }
      else {
        this.obj.push({
          type: "arc",
          position: [ {x:x, y:y} ],
          r: reduceDigits(r),
          sAngle: reduceDigits(radToDeg(sAngle)),
          eAngle: reduceDigits(radToDeg(eAngle))
        });
      }
    };

    this.fill = function() {
      var tmpObj;
      var fillStyle;
      for (var i=0, l=this.obj.length; i<l; i++) {
        tmpObj = this.obj[i];

        fillStyle = getColor(this.fillStyle);

        if (tmpObj.type === "point") {
          if (tmpObj.r > 0) {
            editor.SVGExporter.graphicTxt += '\t<circle cx="'+ tmpObj.position[0].x +'" cy="'+ tmpObj.position[0].y +'" r="'+ tmpObj.r +'" stroke="none" fill="'+ fillStyle.color + '" fill-opacity="'+ fillStyle.opacity +'" />\n';
          }
        }
        else if (tmpObj.type === "arc") {
          editor.SVGExporter.graphicTxt += '\t<path fill="'+ fillStyle.color + '" fill-opacity="'+ fillStyle.opacity +'" stroke="none" d="M '+ tmpObj.position[0].x +' '+ tmpObj.position[0].y +' L '+ describeArc(tmpObj.position[0].x, tmpObj.position[0].y, tmpObj.r, tmpObj.sAngle, tmpObj.eAngle) +'" />\n';
        }
        else if (tmpObj.type === "path") {
          if (tmpObj.position.length > 1) {
            var path = "";
            for (var pi=0, pl=tmpObj.position.length; pi<pl; pi++) {
              path += ((pi==0)?"M ":"L ") + tmpObj.position[pi].x + " " + tmpObj.position[pi].y + " ";
            }

            editor.SVGExporter.graphicTxt += '\t<path fill="'+ fillStyle.color + '" fill-opacity="'+ fillStyle.opacity +'" stroke="none" d="'+ path +'" />\n';
          }
        }
      }
    };

    this.stroke = function() {
      var tmpObj;
      var strokeStyle;
      for (var i=0, l=this.obj.length; i<l; i++) {
        tmpObj = this.obj[i];

        strokeStyle = getColor(this.strokeStyle);
        
        var dashed = "";
        if ((this._dashArray) && (this._dashArray[0] != undefined) && (this._dashArray[1] != undefined)) {
          dashed = 'stroke-linecap="butt" stroke-dasharray="'+ this._dashArray[0] +','+ this._dashArray[1] +'" ';
        }

        if (tmpObj.type === "point") {
          editor.SVGExporter.graphicTxt += '\t<circle cx="'+ tmpObj.position[0].x +'" cy="'+ tmpObj.position[0].y +'" r="'+ tmpObj.r +'" stroke="'+ strokeStyle.color + '" stroke-opacity="'+ strokeStyle.opacity +'" stroke-width="'+ this.lineWidth +'" fill="none" '+ dashed +' />\n';
        }
        else if (tmpObj.type === "arc") {
          editor.SVGExporter.graphicTxt += '\t<path fill="none" stroke="'+ strokeStyle.color + '" stroke-opacity="'+ strokeStyle.opacity +'" stroke-width="'+ this.lineWidth +'" d="M '+ describeArc(tmpObj.position[0].x, tmpObj.position[0].y, tmpObj.r, tmpObj.sAngle, tmpObj.eAngle) +'" '+ dashed +'/>\n';
        }
        else if (tmpObj.type === "path") {
          if (tmpObj.position.length > 1) {
            var path = "";
            for (var pi=0, pl=tmpObj.position.length; pi<pl; pi++) {
              path += ((pi==0)?"M ":"L ") + tmpObj.position[pi].x + " " + tmpObj.position[pi].y + " ";
            }
            if (parseInt(this.lineWidth) > 0) {
              editor.SVGExporter.graphicTxt += '\t<path fill="none" stroke="'+ strokeStyle.color + '" stroke-opacity="'+ strokeStyle.opacity +'" stroke-width="'+ this.lineWidth +'" d="'+ path +'" '+ dashed +'/>\n';
            }
          }
        }
      }
    };

    this.moveTo = function(x, y) {
      var pos = this.applymatrixTrans(x, y);
      x = pos.x + space.x;
      y = pos.y + space.y;

      this.obj.push({
        type: "path",
        position: [ {x:x, y:y} ],
      });
    };

    this.lineTo = function(x, y) {
      var pos = this.applymatrixTrans(x, y);
      x = pos.x + space.x;
      y = pos.y + space.y;

      var i = this.obj.length-1;
      if ((this.obj.length > 0) && (this.obj[i].type === "path")) {
        this.obj[i].position.push( {x:x, y:y} );
      }
    };

    this.fillText = function(text, x, y) {
      var pos = this.applymatrixTrans(x, y);
      x = pos.x + space.x;
      y = pos.y + space.y;

      var fillStyle = getColor(this.fillStyle);

      if (text.trim() !== "") {
        editor.SVGExporter.graphicTxt += '\t<text fill="'+ fillStyle.color + '" fill-opacity="'+ fillStyle.opacity +'" x="'+ x +'" y="'+ y +'" '+ getStyleProperties(this.font) +'>' + text + ' </text>\n';
      }
    };

    this.strokeText = function(text, x, y) { 
      var pos = this.applymatrixTrans(x, y);
      x = pos.x + space.x;
      y = pos.y + space.y;

      var strokeStyle = getColor(this.strokeStyle);

      if (text.trim() !== "") {
        editor.SVGExporter.graphicTxt += '\t<text stroke="'+ strokeStyle.color + '" stroke-opacity="'+ strokeStyle.opacity +'" stroke-width="'+ this.lineWidth +'" x="'+ x +'" y="'+ y +'" '+ getStyleProperties(this.font) +'>' + text + ' </text>\n';
      }
    };

    this.setLineDash = function(dashArray) {
      this._dashArray = dashArray;
    };
  }

  /**
   *
   */
  function getStyleProperties(font) {
    var prop = 'style="';

    var fontsize = font.substring(0, font.indexOf("px"));
    var lastIndexOfBlank = fontsize.lastIndexOf(" ");
    if (lastIndexOfBlank >= 0) {
      fontsize = fontsize.substring(lastIndexOfBlank);
    }

    var fontfamily = '';
    if ( font.match(/descartesJS_serif/) ) {
      fontfamily = "descartesJS_serif,Times,'Times New Roman', serif";
    }
    else if ( font.match(/descartesJS_sansserif/) ) {
      fontfamily = "descartesJS_sansserif,Arial,Helvetica,Sans-serif";
    }
    else if ( font.match(/descartesJS_monospace/) ) {
      fontfamily = "descartesJS_monospace,Courier,'Courier New',Monospace";
    }

    var fontstyle = "";
    if ( font.match(/bold/i) ) {
      fontstyle += "font-weight:bold; "
    }    
    if ( font.match(/oblique/i) || font.match(/italic/i) ) {
      fontstyle += "font-style:italic; "
    }

    return prop + 'font-size:'+ fontsize +'px; font-family:'+ fontfamily +'; '+ fontstyle +'"';
  }

  /**
   *
   */
  function getColor(color) {
    var outColor = { color:"#000000", opacity:1 };

    if (color) {
      // HTML
      if (color.charAt(0) == "#") {
        outColor = { color:color, opacity:1 };
      }
      // RGB
      else if (color.match(/^rgba/)) {
        color = color.substring(5, color.length-1);
        color = color.split(",");

        var r = parseInt(color[0]).toString(16);
        r = (r.length < 2) ? "0"+r : r;
        var g = parseInt(color[1]).toString(16);
        g = (g.length < 2) ? "0"+g : g;
        var b = parseInt(color[2]).toString(16);
        b = (b.length < 2) ? "0"+b : b;
        var a = parseFloat(color[3]);

        outColor = { color:("#" + r + g + b), opacity:reduceDigits(a) };
      }
    }

    return outColor;
  }

  //////////////////////////////////////////////////////////////////////////////////////////
  // aux functions to draw arcs
  //////////////////////////////////////////////////////////////////////////////////////////
  function polarToCartesian(centerX, centerY, radius, angleInDegrees) {
    var angleInRadians = (angleInDegrees) * Math.PI / 180.0;

    return {
      x: centerX + (radius * Math.cos(angleInRadians)),
      y: centerY + (radius * Math.sin(angleInRadians))
    };
  }
  function describeArc(x, y, radius, startAngle, endAngle) {
      var start = polarToCartesian(x, y, radius, endAngle), 
          end = polarToCartesian(x, y, radius, startAngle), 
          arcSweep = endAngle - startAngle <= 180 ? "0" : "1";

      var d = [
          // "M", start.x, start.y, 
          start.x, start.y, 
          "A", radius, radius, 0, arcSweep, 0, end.x, end.y
      ].join(" ");

      return d;
  }
  //////////////////////////////////////////////////////////////////////////////////////////

  /**
   *
   */
  function makeHeader(w, h) {
    var txt = '<?xml version="1.0" encoding="UTF-8" standalone="no"?>\n\n' +
              '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink= "http://www.w3.org/1999/xlink" width="'+ w +'" height="'+ h +'" viewBox="0 0 '+ w +' '+ h +'">\n\n';
    return txt;
  }

  /**
   *
   */
  function makeFooter() {
    return '\n</svg>\n';
  }

  /**
   *
   */
  function makeImageDefs() {
    var txt = '<defs id="imagenes">\n' + imagesDefs.join("\n") + '</defs>\n\n';

    if (imagesDefs.length == 0) {
      txt = "";
    }

    return txt;
  }
  function addImageDef(id, img) {
    if (imagesDefsIds.indexOf(id) == -1) {
      imagesDefsIds.push(id);
      imagesDefs.push(img);
    }
  }

  /**
   *
   */
  function exportSpace(space, evaluator) {
    var fillStyle = getColor( space.background.getColor() );

    var txt = '<defs>\n' + 
              '\t<clipPath id="clipPath_'+ space.id +'">\n' +
              '\t\t<rect x="'+ space.x +'" y="'+ space.y +'" width="'+ space.w +'" height="'+ space.h +'" />\n' +
              '\t</clipPath>\n' +
              '</defs>\n\n' +
              '<g style="clip-path: url(#clipPath_'+ space.id  +');" stroke-linecap="round">\n' +
              '\t<rect x="'+ space.x +'" y="'+ space.y +'" width="'+ space.w +'" height="'+ space.h +'" fill="'+ fillStyle.color + '" fill-opacity="'+ fillStyle.opacity +'"/>\n'
    return txt;
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
