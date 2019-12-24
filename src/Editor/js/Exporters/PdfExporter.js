/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var editor = (function(editor) {

  /**
   *
   */
  editor.PdfExporter = { };

  /**
   *
   */
  editor.PdfExporter.export = function(filename) {
    var w = parseInt( editor.scenes[0].iframe.getAttribute("width") ), 
        h = parseInt( editor.scenes[0].iframe.getAttribute("height") ), 
        evaluator = editor.scenes[0].iframe.contentWindow.descartesJS.apps[0].evaluator, 
        txt = "", 
        spaces, 
        graphic, 
        tmpSpaceCtx, 
        allGraphics;

    editor.PdfExporter.w = w;
    editor.PdfExporter.h = h;

    // create the pdf document
    editor.PdfExporter.pdfDoc = new PDFDoc( { size: [w, h], margin: 0 } );
    // create a write stream to the file
    editor.PdfExporter.pdfDoc.pipe( fs.createWriteStream(filename) );

    // iterate over the scenes in the descartes app
    for (var i_scene=0, l_scene=editor.scenes.length; i_scene<l_scene; i_scene++) {
      spaces = editor.scenes[i_scene].iframe.contentWindow.descartesJS.apps[0].spaces;

      // iterate over the spaces in the scene
      for (var i_space=0, l_space=spaces.length; i_space<l_space; i_space++) {
        if (spaces[i_space].type == "2D") {
          // store the context (space)
          tmpSpaceCtx = spaces[i_space].backCtx;

          // replace the context (space)
          spaces[i_space].backCtx = new PdfContext(spaces[i_space]);
          spaces[i_space].backCtx.measureText = tmpSpaceCtx.measureText;

          allGraphics = [];

          if (spaces[i_space].drawIfValue) {
            // init the space export
            txt += exportSpace(spaces[i_space], evaluator);

            spaces[i_space].drawBackground();

            allGraphics = (spaces[i_space].backGraphics).concat(spaces[i_space].graphics);
          }

          // for each graphic in space, replace the context for a PdfContext
          for (var i_graphic=0, l_graphic=allGraphics.length; i_graphic<l_graphic; i_graphic++) {
            graphic = allGraphics[i_graphic];

            // no export the graphic fill, image or macro
            if ((graphic.type !== "fill") && (graphic.type !== "macro")) {
              // store que original context (graphic)
              tmpGraphicCtx = graphic.ctx;

              // replace the context (graphic)
              graphic.ctx = new PdfContext(spaces[i_space]);

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
          spaces[i_space].ctx = new PdfContext(spaces[i_space]);

          if (spaces[i_space].drawIfValue) {
            // init the space export
            txt += exportSpace(spaces[i_space], evaluator);

            // draw the graphics
            spaces[i_space].draw();
          }

          // restore que original context (space)
          spaces[i_space].ctx = tmpSpaceCtx;
        }

        // txt += editor.PdfExporter.pdfDoc;
        if (spaces[i_space].drawIfValue) {
          editor.PdfExporter.pdfDoc.restore();
        }
      }

    }

    editor.PdfExporter.pdfDoc.end();
  }

  /**
   *
   */
  PdfContext = function(space) {
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
      this.descImgTrn = { tx:tx, ty:ty };

      this.matrixTrans[this.currentMT] = [
        this.matrixTrans[this.currentMT][0], this.matrixTrans[this.currentMT][1], this.matrixTrans[this.currentMT][0]*tx + this.matrixTrans[this.currentMT][1]*ty + this.matrixTrans[this.currentMT][2],
        this.matrixTrans[this.currentMT][3], this.matrixTrans[this.currentMT][4], this.matrixTrans[this.currentMT][3]*tx + this.matrixTrans[this.currentMT][4]*ty + this.matrixTrans[this.currentMT][5],
        0, 0, 1
      ];
    };

    this.rotate = function(theta) {
      this.descImgRot = { theta: radToDeg(theta) };

      var cos = Math.cos(-theta),
          sin = Math.sin(-theta);

      this.matrixTrans[this.currentMT] = [
        this.matrixTrans[this.currentMT][0]*cos - this.matrixTrans[this.currentMT][1]*sin, this.matrixTrans[this.currentMT][0]*sin + this.matrixTrans[this.currentMT][1]*cos, this.matrixTrans[this.currentMT][2],
        this.matrixTrans[this.currentMT][3]*cos - this.matrixTrans[this.currentMT][4]*sin, this.matrixTrans[this.currentMT][3]*sin + this.matrixTrans[this.currentMT][4]*cos, this.matrixTrans[this.currentMT][5],
        0, 0, 1
      ];
    };

    this.scale = function(sx, sy) {
      this.descImgScl = { sx:sx, sy:sy };
    };

    this.setTransform = function() {};

    this.clearRect = function() {};

    this.fillRect = function(x, y, w, h) {
      var pos = this.applymatrixTrans(x, y);
      x = pos.x + space.x;
      y = pos.y + space.y;

      var color = getColor(this.fillStyle);
      var fillColor = color.color;
      var opacity = color.opacity;

      editor.PdfExporter.pdfDoc.rect(x, y, w, h).fillColor(fillColor, opacity).fill();
    };

    this.rect = function(x, y, w, h) {
      var pos = this.applymatrixTrans(x, y);
      x = pos.x + space.x;
      y = pos.y + space.y;

      this.obj.push({
        type: "path",
        position: [ {x:x, y:y}, {x:x+w, y:y}, {x:x+w, y:y+h}, {x:x, y:y+h}, {x:x, y:y} ],
      });
    };
    
    this.bezierCurveTo = function(c1x, c1y, c2x, c2y, x, y) {
      var pos = this.applymatrixTrans(c1x, c1y);
      c1x = pos.x + space.x;
      c1y = pos.y + space.y;
      pos = this.applymatrixTrans(c2x, c2y);
      c2x = pos.x + space.x;
      c2y = pos.y + space.y;
      pos = this.applymatrixTrans(x, y);
      x = pos.x + space.x;
      y = pos.y + space.y;
    
      var i = this.obj.length-1;
      if ((this.obj.length > 0) && (this.obj[i].type === "path")) {
        this.obj[i].position.push( { path: " C " + c1x + " " + c1y + " " + c2x + " " + c2y + " " + x + " " + y + " " } );
      }
    };

    this.createPattern = function() {};

    this.beginPath = function() {
      this.obj = [];
    };

    this.closePath = function() {
      editor.PdfExporter.pdfDoc.closePath();
    };

    this.drawImage = function(img, x, y, w, h) {
      w = (w || img.width);
      h = (h || img.height);

      var canvas = document.createElement("canvas");
      canvas.setAttribute("width", w);
      canvas.setAttribute("height", h);
      var ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);

      editor.PdfExporter.pdfDoc.save()
                               .translate(space.x, space.y)
                               .translate(this.descImgTrn.tx, this.descImgTrn.ty)
                               .rotate(this.descImgRot.theta, {origin:[0,0]})
                               .transform(this.descImgScl.sx, 0, 0, this.descImgScl.sy, 0, 0)
                               .translate(x, y)
                               .image( new Buffer(canvas.toDataURL().replace('data:image/png;base64,',''), 'base64'), 0, 0, w, h )
                               .restore();
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

    this.fill = function(paramPath) {
      var tmpObj;
      var color = getColor(this.fillStyle);
      var fillColor = color.color;
      var opacity = color.opacity;
 
      // draw svg path
      if (paramPath) {
        editor.PdfExporter.pdfDoc.save()
                                 .translate(space.x, space.y)
                                 .translate(this.descImgTrn.tx, this.descImgTrn.ty)
                                 .transform(this.descImgScl.sx, 0, 0, this.descImgScl.sy, 0, 0)
                                 .path(paramPath.svgData)
                                 .fillColor(fillColor, opacity)
                                 .fill()
                                 .restore();
      }
      else {
        for (var i=0, l=this.obj.length; i<l; i++) {
          tmpObj = this.obj[i];

          if (tmpObj.type === "point") {
            if (tmpObj.r > 0) {
              editor.PdfExporter.pdfDoc.circle(tmpObj.position[0].x, tmpObj.position[0].y, tmpObj.r).fillColor(fillColor, opacity).fill();
            }
          }
          else if (tmpObj.type === "arc") {
            editor.PdfExporter.pdfDoc.path('M '+ tmpObj.position[0].x +' '+ tmpObj.position[0].y +' L '+ describeArc(tmpObj.position[0].x, tmpObj.position[0].y, tmpObj.r, tmpObj.sAngle, tmpObj.eAngle)).fillColor(fillColor, opacity).fill();
          }
          else if (tmpObj.type === "path") {
            if (tmpObj.position.length > 1) {
              var path = "";
              for (var pi=0, pl=tmpObj.position.length; pi<pl; pi++) {
                if (tmpObj.position[pi].cpx !== undefined) {
                  path += "Q " + tmpObj.position[pi].cpx + " " + tmpObj.position[pi].cpy + " " + tmpObj.position[pi].x + " " + tmpObj.position[pi].y + " ";
                }
                else if (tmpObj.position[pi].path !== undefined) {
                  // path += tmpObj.position[pi].path;
                }
                else {
                  path += ((pi==0)?"M ":"L ") + tmpObj.position[pi].x + " " + tmpObj.position[pi].y + " ";
                }
              }

              editor.PdfExporter.pdfDoc.path(path).fillColor(fillColor, opacity).fill();
            }
          }
        }
      }
    };

    this.stroke = function() {
      var tmpObj;
      var color = getColor(this.strokeStyle);
      var strokeColor = color.color;
      var opacity = color.opacity;

      for (var i=0, l=this.obj.length; i<l; i++) {
        tmpObj = this.obj[i];

        if ((this._dashArray) && (this._dashArray[0]) && (this._dashArray[1])) {
          editor.PdfExporter.pdfDoc.lineCap("butt").dash(this._dashArray[0], {space: this._dashArray[1]});
        }

        if (tmpObj.type === "point") {
          editor.PdfExporter.pdfDoc.lineWidth(this.lineWidth).circle(tmpObj.position[0].x, tmpObj.position[0].y, tmpObj.r).strokeColor(strokeColor, opacity).stroke();
        }
        else if (tmpObj.type === "arc") {
          editor.PdfExporter.pdfDoc.lineWidth(this.lineWidth).path('M '+ describeArc(tmpObj.position[0].x, tmpObj.position[0].y, tmpObj.r, tmpObj.sAngle, tmpObj.eAngle)).strokeColor(strokeColor, opacity).stroke();
        }
        else if (tmpObj.type === "path") {
          if (tmpObj.position.length > 1) {
            var path = "";
            for (var pi=0, pl=tmpObj.position.length; pi<pl; pi++) {
              if (tmpObj.position[pi].cpx !== undefined) {
                path += "Q " + tmpObj.position[pi].cpx + " " + tmpObj.position[pi].cpy + " " + tmpObj.position[pi].x + " " + tmpObj.position[pi].y + " ";
              }
              else if (tmpObj.position[pi].path !== undefined) {
                path += tmpObj.position[pi].path;
              }
              else {
                path += ((pi==0)?"M ":"L ") + tmpObj.position[pi].x + " " + tmpObj.position[pi].y + " ";
              }
            }
            if (parseInt(this.lineWidth) > 0) {
              editor.PdfExporter.pdfDoc.lineWidth(this.lineWidth).path(path).strokeColor(strokeColor, opacity).stroke();
            }
          }
        }
      }
    };

    this.moveTo = function(x, y) {
      var pos = this.applymatrixTrans(x, y);
      x = pos.x + space.x;
      y = pos.y + space.y;

      // editor.PdfExporter.pdfDoc.moveTo(x, y);

      this.obj.push({
        type: "path",
        position: [ {x:x, y:y} ],
      });
    };

    this.lineTo = function(x, y) {
      var pos = this.applymatrixTrans(x, y);
      x = pos.x + space.x;
      y = pos.y + space.y;

      // editor.PdfExporter.pdfDoc.lineTo(x, y);

      var i = this.obj.length-1;
      if ((this.obj.length > 0) && (this.obj[i].type === "path")) {
        this.obj[i].position.push( {x:x, y:y} );
      }
    };

    this.quadraticCurveTo = function(cpx, cpy, x, y) {
      var pos = this.applymatrixTrans(x, y);
      x = pos.x + space.x;
      y = pos.y + space.y;
      pos = this.applymatrixTrans(cpx, cpy);
      cpx = pos.x + space.x;
      cpy = pos.y + space.y;

      editor.PdfExporter.pdfDoc.quadraticCurveTo(cpx, cpy, x, y);

      var i = this.obj.length-1;
      if ((this.obj.length > 0) && (this.obj[i].type === "path")) {
        this.obj[i].position.push( {x:x, y:y, cpx:cpx, cpy:cpy} );
      }
    };

    this.fillText = function(text, x, y) {
      var pos = this.applymatrixTrans(x, y);
      x = pos.x + space.x;
      y = pos.y + space.y;

      if ( (x >= 0) && (x <= editor.PdfExporter.w) && (y >= 0) && (y <= editor.PdfExporter.h) ) {
        var color = getColor(this.fillStyle);
        var fillColor = color.color;
        var opacity = color.opacity;

        var font = getStyleProperties(this.font);
        editor.PdfExporter.pdfDoc.fontSize(font.fontsize).font(font.fontfamily).fillColor(fillColor, opacity).text(text, x, y -(editor.PdfExporter.pdfDoc._font.ascender/ 1000*font.fontsize));
      }
    };    

    this.strokeText = function(text, x, y) { 
      var pos = this.applymatrixTrans(x, y);
      x = pos.x + space.x;
      y = pos.y + space.y;

      if ( (x >= 0) && (x <= editor.PdfExporter.w) && (y >= 0) && (y <= editor.PdfExporter.h) ) {
        var color = getColor(this.strokeStyle);
        var strokeColor = color.color;
        var opacity = color.opacity;

        var font = getStyleProperties(this.font);
        editor.PdfExporter.pdfDoc.lineWidth(this.lineWidth).fontSize(font.fontsize).font(font.fontfamily).strokeColor(strokeColor, opacity).text(text, x, y -(editor.PdfExporter.pdfDoc._font.ascender/ 1000*font.fontsize), {stroke:true});
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
    var prop = {};

    prop.fontsize = font.substring(0, font.indexOf("px"));
    var lastIndexOfBlank = prop.fontsize.lastIndexOf(" ");

    if (lastIndexOfBlank >= 0) {
      prop.fontsize = prop.fontsize.substring(lastIndexOfBlank);
    }
    prop.fontsize = reduceDigits(parseFloat(prop.fontsize)-1);

    prop.fontfamily = "";
    if ( font.match(/sansserif/i) ) {
      prop.fontfamily = "Arimo-";
    }
    else if ( font.match(/serif/i) ) {
      prop.fontfamily = "Tinos-";
    }
    else if ( font.match(/monospace/i) ) {
      prop.fontfamily = "Cousine-";
    }

    var format = "Regular";
    if ( font.match(/bold/i) ) {
      format = "Bold";
    }
    if ( font.match(/oblique/i) || font.match(/italic/i) ) {
      if (format == "Bold") {
        format = "BoldItalic";
      }
      else {
        format = "Italic";
      }
    }

    prop.fontfamily = path.normalize(__dirname + "/../pdfkit_fonts/" + prop.fontfamily + format + ".ttf");

    return prop;
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
      var start = polarToCartesian(x, y, radius, endAngle);
      var end = polarToCartesian(x, y, radius, startAngle);

      var arcSweep = endAngle - startAngle <= 180 ? "0" : "1";

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
  function exportSpace(space) {
    editor.PdfExporter.pdfDoc.save();
    editor.PdfExporter.pdfDoc.rect(space.x, space.y, space.w, space.h).clip();

    var color = getColor(space.background.getColor());
    var fillColor = color.color;
    var opacity = color.opacity;

    editor.PdfExporter.pdfDoc.lineJoin("round").lineCap("round").rect(space.x, space.y, space.w, space.h).fillColor(fillColor, opacity).fill();
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

  /**
   *
   */
  function radToDeg(r) {
    return reduceDigits( r*(180/Math.PI) );
  }

  /**
   *
   */
  function reduceDigits(num) {
    return parseFloat( num.toFixed(8) );
  }


  return editor;
})(editor || {});
