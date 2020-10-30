/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var paramEditor = (function(paramEditor) {

  var graphicsTransList = ["type", "background", "abs_coord", "visible", "editable", "fixed", "vectors", "split", "edges", "model", "bold", "italics"];

  /**
   *
   */
  paramEditor.ModelGraphic = function(values) {
    var tmpType = "equation";

    for(var i=0, l=values.length; i<l; i++) {
      if (babel[values[i].name] == "type") {
        tmpType = babel[values[i].value] || values[i].value;
      }
    }

    var obj;

    // if the type is equation
    if (tmpType == "equation") {
      obj = {
        space:           "E0",
        type:            "equation",
        background:      "false",
        color:           "20303a",
        drawif:          "",
        abs_coord:       "false",
        expression:       "y=x",
        trace:           "false",
        useFamily:       "false",
        family:          "",
        family_interval: "[0,1]",
        family_steps:    "8",
        fillP:           "",
        fillM:           "",
        width:           "1",
        visible:         "false",
        editable:        "false",
        info:            ""
      };
    }
    // if the type is curve
    else if (tmpType == "curve") {
      obj = {
        space:           "E0",
        type:            "curve",
        background:      "false",
        color:           "20303a",
        drawif:          "",
        abs_coord:       "false",
        expression:       "(t,t)",
        trace:           "false",
        useFamily:       "false",
        family:          "",
        family_interval: "[0,1]",
        family_steps:    "8",
        parameter:       "t",
        parameter_interval: "[0,1]",
        parameter_steps: "8",
        fill:            "",
        width:           "1",
        visible:         "false",
        editable:        "false",
        lineDash:        "solid",
        info:            ""
      };
    }
    // if the type is sequence
    else if (tmpType == "sequence") {
      obj = {
        space:           "E0",
        type:            "sequence",
        background:      "false",
        color:           "20303a",
        drawif:          "",
        abs_coord:       "false",
        expression:       "(n,1/n)",
        trace:           "false",
        useFamily:       "false",
        family:          "",
        family_interval: "[0,1]",
        family_steps:    "8",
        size:            "2",
        visible:         "false",
        editable:        "false",
        range:           "[1,100]",
        info:            ""
      };
    }
    // if the type is point
    else if (tmpType == "point") {
      obj = {
        space:           "E0",
        type:            "point",
        background:      "false",
        color:           "20303a",
        drawif:          "",
        abs_coord:       "false",
        expression:       "(0,0)",
        trace:           "false",
        useFamily:       "false",
        family:          "",
        family_interval: "[0,1]",
        family_steps:    "8",
        text:            "",
        decimals:        "2",
        fixed:           "true",
        size:            "2",
        bold:            "false",
        italics:         "false",
        font_family:     "SansSerif",
        font_size:       "18",
        info:            ""
      };
    }
    // if the type is segment
    else if (tmpType == "segment") {
      obj = {
        space:           "E0",
        type:            "segment",
        background:      "false",
        color:           "20303a",
        drawif:          "",
        abs_coord:       "false",
        expression:       "(0,0)(1,1)",
        trace:           "false",
        useFamily:       "false",
        family:          "",
        family_interval: "[0,1]",
        family_steps:    "8",
        text:            "",
        decimals:        "2",
        fixed:           "true",
        size:            "2",
        width:           "1",
        bold:            "false",
        italics:         "false",
        font_family:     "SansSerif",
        font_size:       "18",
        lineDash:        "solid",
        info:            ""
      };
    }
    // if the type is arrow
    else if (tmpType == "arrow") {
      obj = {
        space:           "E0",
        type:            "arrow",
        background:      "false",
        color:           "20303a",
        drawif:          "",
        abs_coord:       "false",
        expression:       "(0,0)(1,1)",
        trace:           "false",
        useFamily:       "false",
        family:          "",
        family_interval: "[0,1]",
        family_steps:    "8",
        text:            "",
        decimals:        "2",
        fixed:           "true",
        width:           "5",
        spear:           "8",
        arrow:           "ee0022",
        bold:            "false",
        italics:         "false",
        font_family:     "SansSerif",
        font_size:       "18",
        info:            ""
      };
    }
    // if the type is polygon
    else if (tmpType == "polygon") {
      obj = {
        space:           "E0",
        type:            "polygon",
        background:      "false",
        color:           "20303a",
        drawif:          "",
        abs_coord:       "false",
        expression:       "(0,0)(1,1)(2,-1)",
        trace:           "false",
        useFamily:       "false",
        family:          "",
        family_interval: "[0,1]",
        family_steps:    "8",
        fill:            "",
        width:           "1",
        lineDash:        "solid",
        info:            ""
      };
    }
    // if the type is rectangle
    else if (tmpType == "rectangle") {
      obj = {
        space:           "E0",
        type:            "rectangle",
        background:      "false",
        color:           "20303a",
        drawif:          "",
        abs_coord:       "false",
        expression:       "(0,0,2,1)",
        trace:           "false",
        useFamily:       "false",
        family:          "",
        family_interval: "[0,1]",
        family_steps:    "8",
        fill:            "",
        width:           "1",
        border_radius:   "0",       
        lineDash:        "solid",
        info:            ""
      };
    }
    // if the type is arc
    else if (tmpType == "arc") {
      obj = {
        space:           "E0",
        type:            "arc",
        background:      "false",
        color:           "20303a",
        drawif:          "",
        abs_coord:       "false",
        center:          "(0,0)",
        radius:          "1",
        init:            "0",
        end:             "90",
        vectors:         "false",
        trace:           "false",
        useFamily:       "false",
        family:          "",
        family_interval: "[0,1]",
        family_steps:    "8",
        text:            "",
        decimals:        "2",
        fixed:           "true",
        fill:            "",
        width:           "1",
        bold:            "false",
        italics:         "false",
        font_family:     "SansSerif",
        font_size:       "18",
        lineDash:        "solid",
        info:            ""
      };
    }
    // if the type is fill
    else if (tmpType == "fill") {
      obj = {
        space:           "E0",
        type:            "fill",
        background:      "false",
        color:           "20303a",
        drawif:          "",
        abs_coord:       "false",
        expression:       "(0,0)",
        trace:           "false",
        useFamily:       "false",
        family:          "",
        family_interval: "[0,1]",
        family_steps:    "8",
        info:            ""
      };
    }
    // if the type is text
    else if (tmpType == "text") {
      obj = {
        space:           "E0",
        type:            "text",
        background:      "false",
        color:           "20303a",
        drawif:          "",
        abs_coord:       "true",
        expression:       "(20,20)",
        trace:           "false",
        useFamily:       "false",
        family:          "",
        family_interval: "[0,1]",
        family_steps:    "8",
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
    // if the type is image
    else if (tmpType == "image") {
      obj = {
        space:           "E0",
        type:            "image",
        background:      "false",
        drawif:          "",
        abs_coord:       "false",
        expression:       "(0,0)",
        trace:           "false",
        useFamily:       "false",
        family:          "",
        family_interval: "[0,1]",
        family_steps:    "8",
        file:            "",
        inirot:          "0",
        opacity:         "1",
        info:            ""
      };
    }
    // if the type is macro
    else if (tmpType == "macro") {
      obj = {
        space:           "E0",
        type:            "macro",
        background:      "false",
        drawif:          "",
        abs_coord:       "false",
        name:            "",
        expression:       "",
        useFamily:       "false",
        family:          "",
        family_interval: "[0,1]",
        family_steps:    "8",
        inirot:          "0",
        inipos:          "[0,0]",
        info:            ""
      };
    }

    var family = null;
    var parameter = (obj.type === "curve") ? "t" : null;
    var value;
    var tmpFont;

    for(var i=0, l=values.length; i<l; i++) {
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
  paramEditor.ModelGraphic.prototype.toString = function() {
    var str = "";
    var value;
    // traverse the values to replace the defaults values of the object
    for (var propName in this.data) {
      // verify the own properties of the object
      if (this.data.hasOwnProperty(propName)) {
        value = this.data[propName];

        // do not add the trace value if is false
        if (propName == "trace") {
          if ((value === "false") || (value === false)) {
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
          if ((this.data.useFamily === "false") || (this.data.useFamily === false)) {
            continue;
          }
        }
        if (propName == "family_interval") {
          if ((this.data.useFamily === "true") || (this.data.useFamily === true)) {
            str+= this.data.family + "." + babel.trans("interval") + "='" + value + "' ";
          }
          continue;
        }
        if (propName == "family_steps") {
          if ((this.data.useFamily === "true") || (this.data.useFamily === true)) {
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

        if (propName == "font") {
          continue;
        }


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
