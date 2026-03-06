/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var editor = (function(editor) {

  let w, h, imagesDefs, imagesDefsIds;

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

    let evaluator = editor.scenes[0].iframe.contentWindow.descartesJS.apps[0].evaluator;

    let txt = "";
    let spaces;
    let graphic;
    let tmpSpaceCtx;
    let allGraphics;

    // iterate over the scenes in the descartes app
    for (let i_scene of editor.scenes) {
      // iterate over the spaces in the scene
      for (let space_i of i_scene.iframe.contentWindow.descartesJS.apps[0].spaces) {
        // init the text in the graphics
        editor.SVGExporter.graphicTxt = "";

        if (space_i.type == "2D") {
          // store the context (space)
          tmpSpaceCtx = space_i.backCtx;

          // replace the context (space)
          space_i.backCtx = new SVGContext(space_i);
          space_i.backCtx.measureText = tmpSpaceCtx.measureText;

          allGraphics = [];

          if (space_i.drawIfValue) {
            // init the space export
            txt += exportSpace(space_i, evaluator);

            space_i.drawBackground();

            allGraphics = (space_i.backGraphics).concat(space_i.graphics);
          }

          // for each graphic in space, replace the context for a SVGContext
          for (let i_graphic=0, l_graphic=allGraphics.length; i_graphic<l_graphic; i_graphic++) {
            graphic = allGraphics[i_graphic];

            // no export the graphic fill or macro
            if ((graphic.type !== "fill") && (graphic.type !== "macro")) {
              // store the original context (graphic)
              tmpGraphicCtx = graphic.ctx;

              // replace the context (graphic)
              graphic.ctx = new SVGContext(space_i);

              // draw the graphics with the new context
              graphic.draw();

              // restore the original context (graphic)
              graphic.ctx = tmpGraphicCtx;
            }
          }

          // restore que original context (space)
          space_i.backCtx = tmpSpaceCtx;
        }

        else if (space_i.type == "3D") {
          // store the context (space)
          tmpSpaceCtx = space_i.ctx;

          // replace the context (space)
          space_i.ctx = new SVGContext(space_i);

          if (space_i.drawIfValue) {
            // init the space export
            txt += exportSpace(space_i, evaluator);

            // draw the graphics
            space_i.draw();
          }

          // restore que original context (space)
          space_i.ctx = tmpSpaceCtx;
        }

        txt += editor.SVGExporter.graphicTxt;
        if ((space_i.drawIfValue) && ((/2D|3D|R2|R3/).test(space_i.type))) {
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
      this.descImgTrn = 'translate('+ tx +' '+ ty +') ';

      this.matrixTrans[this.currentMT] = [
        this.matrixTrans[this.currentMT][0], this.matrixTrans[this.currentMT][1], this.matrixTrans[this.currentMT][0]*tx + this.matrixTrans[this.currentMT][1]*ty + this.matrixTrans[this.currentMT][2],
        this.matrixTrans[this.currentMT][3], this.matrixTrans[this.currentMT][4], this.matrixTrans[this.currentMT][3]*tx + this.matrixTrans[this.currentMT][4]*ty + this.matrixTrans[this.currentMT][5],
        0, 0, 1
      ];
    };

    this.rotate = function(theta) {
      this.descImgRot = 'rotate('+ radToDeg(theta) +') ';

      let cos = Math.cos(-theta),
          sin = Math.sin(-theta);

      this.matrixTrans[this.currentMT] = [
        this.matrixTrans[this.currentMT][0]*cos - this.matrixTrans[this.currentMT][1]*sin, this.matrixTrans[this.currentMT][0]*sin + this.matrixTrans[this.currentMT][1]*cos, this.matrixTrans[this.currentMT][2],
        this.matrixTrans[this.currentMT][3]*cos - this.matrixTrans[this.currentMT][4]*sin, this.matrixTrans[this.currentMT][3]*sin + this.matrixTrans[this.currentMT][4]*cos, this.matrixTrans[this.currentMT][5],
        0, 0, 1
      ];
    };

    this.scale = function(sx, sy) {
      this.descImgScl = 'scale('+ sx +' '+ sy +') ';
    };

    this.setTransform = function() {};

    this.clearRect = function() {};

    this.fillRect = function(x, y, w, h) {
      let pos = this.applymatrixTrans(x, y);
      x = pos.x + space.x;
      y = pos.y + space.y;

      fillStyle = getColor(this.fillStyle);

      editor.SVGExporter.graphicTxt += '\t<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" fill="'+ fillStyle.color + '" fill-opacity="'+ fillStyle.opacity +'" stroke="none" />\n';
    };

    this.rect = function(x, y, w, h) {
      let pos = this.applymatrixTrans(x, y);
      x = pos.x + space.x;
      y = pos.y + space.y;

      this.obj.push({
        type: "path",
        position: [ {x:x, y:y}, {x:x+w, y:y}, {x:x+w, y:y+h}, {x:x, y:y+h}, {x:x, y:y} ],
      });
    };

    this.bezierCurveTo = function(c1x, c1y, c2x, c2y, x, y) {
      let pos = this.applymatrixTrans(c1x, c1y);
      c1x = pos.x + space.x;
      c1y = pos.y + space.y;
      pos = this.applymatrixTrans(c2x, c2y);
      c2x = pos.x + space.x;
      c2y = pos.y + space.y;
      pos = this.applymatrixTrans(x, y);
      x = pos.x + space.x;
      y = pos.y + space.y;
    
      let i = this.obj.length-1;
      if ((this.obj.length > 0) && (this.obj[i].type === "path")) {
        this.obj[i].position.push( { path:"C " + c1x + "," + c1y + " " + c2x + "," + c2y + " " + x + "," + y + " " } );
      }
    };

    this.createPattern = function() {};

    this.beginPath = function() {
      this.obj = [];
    };

    this.closePath = function() {
      let i = this.obj.length-1;
      this.obj[i].position.push(this.obj[i].position[0]);
    };

    this.drawImage = function(img, x, y, w, h) {
      w = (w || img.width);
      h = (h || img.height);

      trans = 'transform="' + ("translate(" + space.x + " " + space.y + ") ") + (this.descImgTrn || "") + (this.descImgRot || "") + (this.descImgScl || "") + ("translate(" + x + " " + y + ")") + '"';

      let canvas = document.createElement("canvas");
      canvas.setAttribute("width", w);
      canvas.setAttribute("height", h);
      let ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);

      let id;
      if (img.src) {
        id = path.basename(img.src).replace(/\./g, "_");
      }
      else {
        id = img.getAttribute("id");
      }

      // add the image to the definition list
      addImageDef(id, '\t<image id="'+ id +'" xlink:href="'+ canvas.toDataURL() +'" width="'+ w +'px" height="'+ h +'px" />\n')

      // add an use graphic to show the image
      editor.SVGExporter.graphicTxt += '\t<use xlink:href="#'+ id +'" width="'+ w +'px" height="'+ h +'px" '+ trans +'/>\n';
    };

    this.arc = function(x, y, r, sAngle, eAngle, counterclockwise) {
      let pos = this.applymatrixTrans(x, y);
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
      let tmpObj;
      let fillStyle;

      // draw svg path
      if (paramPath) {
        fillStyle = getColor(this.fillStyle);
        editor.SVGExporter.graphicTxt += '\t<path transform="' + this.descImgTrn + ' ' + this.descImgScl + '" fill="' + fillStyle.color + '" fill-opacity="'+ fillStyle.opacity + '" stroke="none" d="'+ paramPath.svgData +'" />\n';
      }
      else {
        for (let i=0, l=this.obj.length; i<l; i++) {
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
              let path = "";
              for (let pi=0, pl=tmpObj.position.length; pi<pl; pi++) {
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

              editor.SVGExporter.graphicTxt += '\t<path fill="'+ fillStyle.color + '" fill-opacity="'+ fillStyle.opacity +'" stroke="none" d="'+ path +'" />\n';
            }
          }
        }
      }
    };

    this.stroke = function() {
      let tmpObj;
      let strokeStyle;
      for (let i=0, l=this.obj.length; i<l; i++) {
        tmpObj = this.obj[i];

        strokeStyle = getColor(this.strokeStyle);
        
        let dashed = "";
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
            let path = "";
            for (let pi=0, pl=tmpObj.position.length; pi<pl; pi++) {
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
              editor.SVGExporter.graphicTxt += '\t<path fill="none" stroke="'+ strokeStyle.color + '" stroke-opacity="'+ strokeStyle.opacity +'" stroke-width="'+ this.lineWidth +'" d="'+ path +'" '+ dashed +'/>\n';
            }
          }
        }
      }
    };

    this.moveTo = function(x, y) {
      let pos = this.applymatrixTrans(x, y);
      x = pos.x + space.x;
      y = pos.y + space.y;

      this.obj.push({
        type: "path",
        position: [ {x:x, y:y} ],
      });
    };

    this.lineTo = function(x, y) {
      let pos = this.applymatrixTrans(x, y);
      x = pos.x + space.x;
      y = pos.y + space.y;

      let i = this.obj.length-1;
      if ((this.obj.length > 0) && (this.obj[i].type === "path")) {
        this.obj[i].position.push( {x:x, y:y} );
      }
    };

    this.quadraticCurveTo = function(cpx, cpy, x, y) {
      let pos = this.applymatrixTrans(x, y);
      x = pos.x + space.x;
      y = pos.y + space.y;
      pos = this.applymatrixTrans(cpx, cpy);
      cpx = pos.x + space.x;
      cpy = pos.y + space.y;

      let i = this.obj.length-1;
      if ((this.obj.length > 0) && (this.obj[i].type === "path")) {
        this.obj[i].position.push( {x:x, y:y, cpx:cpx, cpy:cpy} );
      }
    };

    this.fillText = function(text, x, y) {
      let pos = this.applymatrixTrans(x, y);
      x = pos.x + space.x;
      y = pos.y + space.y;

      let fillStyle = getColor(this.fillStyle);

      if ((text !== undefined) && (text.toString().trim() !== "")) {
        editor.SVGExporter.graphicTxt += '\t<text fill="'+ fillStyle.color + '" fill-opacity="'+ fillStyle.opacity +'" x="'+ x +'" y="'+ y +'" '+ getStyleProperties(this.font) +'>' + text + ' </text>\n';
      }
    };

    this.strokeText = function(text, x, y) { 
      let pos = this.applymatrixTrans(x, y);
      x = pos.x + space.x;
      y = pos.y + space.y;

      let strokeStyle = getColor(this.strokeStyle);

      if ((text !== undefined) && (text.toString().trim() !== "")) {
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
    let prop = 'style="';

    let fontsize = font.substring(0, font.indexOf("px"));
    let lastIndexOfBlank = fontsize.lastIndexOf(" ");
    if (lastIndexOfBlank >= 0) {
      fontsize = fontsize.substring(lastIndexOfBlank);
    }

    let fontfamily = "descartesJS_monospace,Courier,'Courier New',Monospace";

    if ((/sansserif/i).test(font)) {
      fontfamily = "descartesJS_sansserif,Arial,Helvetica,Sans-serif"; 
    }
    else if ((/serif/i).test(font)) {
      fontfamily = "descartesJS_serif,Times,'Times New Roman',serif";
    }

    let style = "";
    if ( font.match(/bold/i) ) {
      style += "font-weight:bold; "
    }    
    if ( font.match(/oblique/i) || font.match(/italic/i) ) {
      style += "font-style:italic; "
    }

    return prop + 'font-size:'+ fontsize +'px; font-family:'+ fontfamily +'; '+ style +'"';
  }

  /**
   *
   */
  function getColor(color) {
    let outColor = { color:"#000000", opacity:1 };

    if (color) {
      // HTML
      if (color.charAt(0) == "#") {
        outColor = { color:color, opacity:1 };
      }
      // RGB
      else if (color.match(/^rgba/)) {
        color = color.substring(5, color.length-1);
        color = color.split(",");

        let r = parseInt(color[0]).toString(16);
        r = (r.length < 2) ? "0"+r : r;
        let g = parseInt(color[1]).toString(16);
        g = (g.length < 2) ? "0"+g : g;
        let b = parseInt(color[2]).toString(16);
        b = (b.length < 2) ? "0"+b : b;
        let a = parseFloat(color[3]);

        outColor = { color:("#" + r + g + b), opacity:reduceDigits(a) };
      }
    }

    return outColor;
  }

  //////////////////////////////////////////////////////////////////////////////////////////
  // aux functions to draw arcs
  //////////////////////////////////////////////////////////////////////////////////////////
  function polarToCartesian(centerX, centerY, radius, angleInDegrees) {
    let angleInRadians = (angleInDegrees) * Math.PI / 180.0;

    return {
      x: centerX + (radius * Math.cos(angleInRadians)),
      y: centerY + (radius * Math.sin(angleInRadians))
    };
  }
  function describeArc(x, y, radius, startAngle, endAngle) {
      let start = polarToCartesian(x, y, radius, endAngle), 
          end = polarToCartesian(x, y, radius, startAngle), 
          arcSweep = endAngle - startAngle <= 180 ? "0" : "1";

      let d = [
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
    let txt = '<?xml version="1.0" encoding="UTF-8" standalone="no"?>\n\n' +
              '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="'+ w +'" height="'+ h +'" viewBox="0 0 '+ w +' '+ h +'">\n\n';
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
    let txt = '<defs id="imagenes">\n' + imagesDefs.join("\n") + '</defs>\n\n';

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
    let fillStyle = getColor( space.background.getColor() );

    let txt = '<defs>\n' + 
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
