/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var paramEditor = (function(paramEditor) {

  var graphicsTransList = ["type", "background", "abs_coord", "visible", "editable", "fixed", "vectors", "split", "edges", "model", "bold", "italics"];

  /**
   *
   */
  paramEditor.ModelGraphic3D = function(values) {
    var tmpType = "point";

    for(var i=0, l=values.length; i<l; i++) {
      if (babel[values[i].name] == "type") {
        tmpType = babel[values[i].value] || values[i].value;
      }
    }

    var obj;

    // if the type is point
    if (tmpType == "point") {
      obj = {
        name:            "",
        space:           "E0",
        type:            "point",
        background:      "false",
        color:           "eeffaa",
        backcolor:       "6090a0",
        drawif:          "",
        expression:       "(0,0,0)",
        useFamily:       "false",
        family:          "",
        family_interval: "[0,1]",
        family_steps:    "8",
        inirot:          "(0,0,0)",
        inipos:          "(0,0,0)",
        endrot:          "(0,0,0)",
        endpos:          "(0,0,0)",
        split:           "false",
        text:            "",
        bold:            "false",
        italics:         "false",
        font_family:     "SansSerif",
        font_size:       "18",
        decimals:        "2",
        fixed:           "true",
        width:           "1",
        offset_dist:     "10",
        offset_angle:    "270",
        info:            ""
      };
    }
    // if the type is segment, polygon, curve
    else if ( (tmpType == "segment") || (tmpType == "polygon") ) {
      obj = {
        name:            "",
        space:           "E0",
        type:            tmpType,
        background:      "false",
        color:           "eeffaa",
        drawif:          "",
        expression:       "",
        useFamily:       "false",
        family:          "",
        family_interval: "[0,1]",
        family_steps:    "8",
        inirot:          "(0,0,0)",
        inipos:          "(0,0,0)",
        endrot:          "(0,0,0)",
        endpos:          "(0,0,0)",
        split:           "false",
        width:           "1",
        Nu:              "7",
        info:            ""
      };

      if (tmpType == "segment") {
        obj.expression = "(0,0,0)(1,1,1)";
        // obj.lineDash = "solid";
      }
      else if (tmpType == "polygon") {
        obj.expression = "(0,0,0)(1,0,0)(1,1,0)(1,1,1)";
      }
      else {
        obj.expression = "x=cos(4*pi*u) y=sen(4*pi*u) z=2*u-1";
      }
    }
    // if the type is segment, polygon, curve
    else if (tmpType == "curve") {
      obj = {
        name:            "",
        space:           "E0",
        type:            tmpType,
        background:      "false",
        color:           "eeffaa",
        fill:            "",
        drawif:          "",
        expression:       "",
        useFamily:       "false",
        family:          "",
        family_interval: "[0,1]",
        family_steps:    "8",
        inirot:          "(0,0,0)",
        inipos:          "(0,0,0)",
        endrot:          "(0,0,0)",
        endpos:          "(0,0,0)",
        split:           "false",
        width:           "1",
        Nu:              "7",
        info:            ""
      };

      obj.expression = "x=cos(4*pi*u) y=sen(4*pi*u) z=2*u-1";
    }
    // if the type is triangle
    else if ( (tmpType == "triangle") || (tmpType == "face") ) {
      obj = {
        name:            "",
        space:           "E0",
        type:            tmpType,
        background:      "false",
        color:           "eeffaa",
        backcolor:       "6090a0",
        drawif:          "",
        expression:       "",
        useFamily:       "false",
        family:          "",
        family_interval: "[0,1]",
        family_steps:    "8",
        inirot:          "(0,0,0)",
        inipos:          "(0,0,0)",
        endrot:          "(0,0,0)",
        endpos:          "(0,0,0)",
        split:           "false",
        edges:           "false",
        model:           "color",
        info:            ""
      };

      if (tmpType == "triangle") {
        obj.expression = "(1,0,0)(0,1,0)(0,0,1)";
      }
      else {
        obj.expression = "(0,0)(0,1)(1,1)";
      }
    }
    // if the type is polireg
    else if (tmpType == "polireg") {
      obj = {
        name:            "",
        space:           "E0",
        type:            "polireg",
        background:      "false",
        color:           "eeffaa",
        backcolor:       "6090a0",
        drawif:          "",
        expression:       "Polireg",
        useFamily:       "false",
        family:          "",
        family_interval: "[0,1]",
        family_steps:    "8",
        inirot:          "(0,0,0)",
        inipos:          "(0,0,0)",
        endrot:          "(0,0,0)",
        endpos:          "(0,0,0)",
        split:           "false",
        edges:           "false",
        model:           "color",
        width:           "2",
        length:          "2",
        Nu:              "7",
        info:            ""
      };
    }
    // if the type is surface
    else if (tmpType == "surface") {
      obj = {
        name:            "",
        space:           "E0",
        type:            "surface",
        background:      "false",
        color:           "eeffaa",
        backcolor:       "6090a0",
        drawif:          "",
        expression:       "x=2*u-1 y=2*v-1 z=x^2-y^2",
        useFamily:       "false",
        family:          "",
        family_interval: "[0,1]",
        family_steps:    "8",
        inirot:          "(0,0,0)",
        inipos:          "(0,0,0)",
        endrot:          "(0,0,0)",
        endpos:          "(0,0,0)",
        split:           "false",
        edges:           "false",
        model:           "color",
        Nu:              "7",
        Nv:              "7",
        info:            ""
      };
    }
    // if the type is text
    else if (tmpType == "text") {
      obj = {
        name:            "",
        space:           "E0",
        type:            "face",
        background:      "false",
        color:           "eeffaa",
        drawif:          "",
        expression:       "[20,20]",
        useFamily:       "false",
        family:          "",
        family_interval: "[0,1]",
        family_steps:    "8",
        // inirot:          "(0,0,0)",
        // inipos:          "(0,0,0)",
        text:            "",
        decimals:        "2",
        fixed:           "true",
        width:           "1",
        border:          "",
        bold:            "false",
        italics:         "false",
        font_family:     "SansSerif",
        font_size:       "18",
        align:           "left",
        anchor:          "top_left",
        border_size:     "0",
        shadowColor:     "false",
        shadowBlur:      "0",
        shadowOffsetX:   "0",
        shadowOffsetY:   "0",
        info:            ""
      };
    }
    // if the type is torus
    else if (tmpType == "torus") {
      obj = {
        name:            "",
        space:           "E0",
        type:            "torus",
        background:      "false",
        color:           "eeffaa",
        backcolor:       "6090a0",
        drawif:          "",
        expression:       "torus",
        useFamily:       "false",
        family:          "",
        family_interval: "[0,1]",
        family_steps:    "8",
        inirot:          "(0,0,0)",
        inipos:          "(0,0,0)",
        endrot:          "(0,0,0)",
        endpos:          "(0,0,0)",
        split:           "false",
        edges:           "false",
        model:           "color",
        R:               "2",
        r:               "1",
        Nu:              "7",
        Nv:              "7",
        info:            ""
      };
    }
    // if the type is box
    else if (tmpType == "box") {
      obj = {
        name:            "",
        space:           "E0",
        type:            "box",
        background:      "false",
        color:           "eeffaa",
        backcolor:       "6090a0",
        drawif:          "",
        expression:       "Paralelep\u00edpedo",
        useFamily:       "false",
        family:          "",
        family_interval: "[0,1]",
        family_steps:    "8",
        inirot:          "(0,0,0)",
        inipos:          "(0,0,0)",
        endrot:          "(0,0,0)",
        endpos:          "(0,0,0)",
        split:           "false",
        edges:           "false",
        model:           "color",
        width:           "2",
        length:          "2",
        height:          "2",
        info:            ""
      };
    }
    // if the type is cube, tetrahedron, octahedron, dodecahedron, icosahedron
    else if ( (tmpType == "cube") || (tmpType == "tetrahedron") || (tmpType == "octahedron") || (tmpType == "dodecahedron") || (tmpType == "icosahedron") ) {
      obj = {
        name:            "",
        space:           "E0",
        type:            tmpType,
        background:      "false",
        color:           "eeffaa",
        backcolor:       "6090a0",
        drawif:          "",
        expression:       "",
        useFamily:       "false",
        family:          "",
        family_interval: "[0,1]",
        family_steps:    "8",
        inirot:          "(0,0,0)",
        inipos:          "(0,0,0)",
        endrot:          "(0,0,0)",
        endpos:          "(0,0,0)",
        split:           "false",
        edges:           "false",
        model:           "color",
        width:           "2",
        info:            ""
      };

      if (tmpType == "cube") {
        obj.expression = "Cubo";
      }
      else if (tmpType == "tetrahedron") {
        obj.expression = "Tetraedro";
      }
      else if (tmpType == "octahedron") {
        obj.expression = "Octaedro";
      }
      else if (tmpType == "dodecahedron") {
        obj.expression = "Dodecaedro";
      }
      else {
        obj.expression = "Icosaedro";
      }
    }
    // if the type is sphere
    else if (tmpType == "sphere") {
      obj = {
        name:            "",
        space:           "E0",
        type:            "sphere",
        background:      "false",
        color:           "eeffaa",
        backcolor:       "6090a0",
        drawif:          "",
        expression:       "Esfera",
        useFamily:       "false",
        family:          "",
        family_interval: "[0,1]",
        family_steps:    "8",
        inirot:          "(0,0,0)",
        inipos:          "(0,0,0)",
        endrot:          "(0,0,0)",
        endpos:          "(0,0,0)",
        split:           "false",
        edges:           "false",
        model:           "color",
        width:           "2",
        Nu:              "7",
        Nv:              "7",
        info:            ""
      };
    }
    // if the type is ellipsoid, cone, cylinder
    else if ( (tmpType == "ellipsoid") || (tmpType == "cone") || (tmpType == "cylinder") ) {
      obj = {
        name:            "",
        space:           "E0",
        type:            tmpType,
        background:      "false",
        color:           "eeffaa",
        backcolor:       "6090a0",
        drawif:          "",
        expression:       "",
        useFamily:       "false",
        family:          "",
        family_interval: "[0,1]",
        family_steps:    "8",
        inirot:          "(0,0,0)",
        inipos:          "(0,0,0)",
        endrot:          "(0,0,0)",
        endpos:          "(0,0,0)",
        split:           "false",
        edges:           "false",
        model:           "color",
        width:           "2",
        length:          "2",
        height:          "2",
        Nu:              "7",
        Nv:              "7",
        info:            ""
      };

      if (tmpType == "ellipsoid") {
        obj.expression = "Elipsoide";
      }
      else if (tmpType == "cone") {
        obj.expression = "Cono";
      }
      else {
        obj.expression = "Cilindro";
      }
    }
    // if the type is macro
    else if (tmpType == "macro") {
      obj = {
        name:            "",
        space:           "E0",
        type:            "macro",
        background:      "false",
        drawif:          "",
        expression:       "mi_macro",
        useFamily:       "false",
        family:          "",
        family_interval: "[0,1]",
        family_steps:    "8",
        inirot:          "(0,0,0)",
        inipos:          "(0,0,0)",
        endrot:          "(0,0,0)",
        endpos:          "(0,0,0)",
        info:            ""
      };
    }

    var family = null;
    var parameter = (obj.type === "curve") ? "t" : null;
    var value;
    var tmpFont;
    
    for(var i=0, l=values.length; i<l; i++) {

      if ((babel[values[i].name] == "edges") && (babel[values[i].value] == "true")) {
        values[i].value = "808080";
      }

      if (babel[values[i].name] == "font") {
        tmpFont = paramEditor.getFontValues(values[i].value);
        obj.font_family = tmpFont.font_family;
        obj.font_size = tmpFont.font_size;
        obj.bold = tmpFont.bold;
        obj.italics = tmpFont.italics;
      }

      if (babel[values[i].name] == "family") {
        family = values[i].value;
        obj.useFamily = true;
      }

      if (babel[values[i].name] == "parameter") {
        parameter = values[i].value;
      }

      if ((family) && (values[i].name.substring(0, family.length) == family) && (babel[values[i].name.substring(family.length+1)])) {
        obj["family_" + babel[values[i].name.substring(family.length+1)]] = values[i].value;
      }
      else if ((parameter) && (values[i].name.substring(0, parameter.length) == parameter) && (babel[values[i].name.substring(parameter.length+1)])) {
        obj["parameter_" + babel[values[i].name.substring(parameter.length+1)]] = values[i].value;
      }
      else {
        if ( (values[i].name) && (babel[values[i].name]) && (obj[babel[values[i].name]] !== undefined) ) {
          value = values[i].value;

          if (graphicsTransList.indexOf(babel[values[i].name]) >= 0) {
            value = babel[values[i].value] || value;
          }
          
          obj[babel[values[i].name]] = value.replace(/\&squot;/g, "'");
        }
      }
    }

    // the default family value
    if (!family) {
      obj.family = "s";
    }

    this.data = obj;
  }

  /**
   *
   */
  paramEditor.ModelGraphic3D.prototype.toString = function() {
    var str = "";
    var value;
    // traverse the values to replace the defaults values of the object
    for (var propName in this.data) {
      // verify the own properties of the object
      if (this.data.hasOwnProperty(propName)) {
        value = this.data[propName];

        // dont add the trace value if is false
        if (propName == "trace") {
          if (value == "false") {
            continue;
          }
          else {
            value = (value.charAt(0) == "#") ? value.substring(1) : value;
          }
        }

        // add family values
        if (propName == "useFamily") {
          continue;
        }
        if (propName == "family") {
          if ((this.data.useFamily == "false") || (this.data.useFamily == false)) {
            continue;
          }
        }
        if (propName == "family_interval") {
          if ((this.data.useFamily == "true") || (this.data.useFamily == true)) {
            str+= this.data.family + "." + babel.trans("interval") + "='" + value + "' ";
          }
          continue;
        }
        if (propName == "family_steps") {
          if ((this.data.useFamily == "true") || (this.data.useFamily == true)) {
            str+= this.data.family + "." + babel.trans("steps") + "='" + value + "' ";
          }
          continue;
        }

        // add parameter values
        if (propName == "parameter_interval") {
          if (this.data.parameter) {
            str+= this.data.parameter + "." + babel.trans("interval") + "='" + value + "' ";
          }
          continue;
        }
        if (propName == "parameter_steps") {
          if (this.data.parameter) {
            str+= this.data.parameter + "." + babel.trans("steps") + "='" + value + "' ";
          }
          continue;
        }

        //
        if (
          ((propName == "background") && (value == "false")) ||
          ((propName == "drawif") && (value == "1")) ||
          ((propName == "inirot") && (value == "(0,0,0)")) ||
          ((propName == "inipos") && (value == "(0,0,0)")) ||
          ((propName == "endrot") && (value == "(0,0,0)")) ||
          ((propName == "endpos") && (value == "(0,0,0)")) ||
          ((propName == "split") && (value == "false")) ||
          ((propName == "edges") && (value == "false")) ||
          ((propName == "fixed") && (value == "true")) ||
          ((propName == "border_radius") && (value == "0")) ||
          ((propName == "font_family") && (value == "SansSerif")) ||
          ((propName == "font_size") && (value == "18")) ||
          ((propName == "bold") && (value == "false")) ||
          ((propName == "italics") && (value == "false")) ||
          ((propName == "border_size") && (value == "0")) ||
          ((propName == "shadowColor") && (value == "false")) ||
          ((propName == "shadowBlur") && (value == "0")) ||
          ((propName == "shadowOffsetX") && (value == "0")) ||
          ((propName == "shadowOffsetY") && (value == "0"))
        ) {
          continue;
        }
        //

        // translate the value
        if (graphicsTransList.indexOf(propName) >= 0) {
          value = babel.trans(value) || value;
        }

        if (value) {
          str+= babel.trans(propName) + "='" + value.replace(/'/g, "&squot;") + "' ";
        }
      }
    }

    return str;
  }

  return paramEditor;
})(paramEditor || {});
