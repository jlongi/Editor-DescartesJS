/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var paramEditor = (function(paramEditor) {

  var spaceTransList = ["fixed", "bg_display", "background", "net", "net10", "axes", "text", "numbers", "sensitive_to_mouse_movements", "R3", "render", "split", "borderColor"];

  /**
   *
   */
  paramEditor.ModelSpace = function(values) {
    var tmpType = "R2";

    for(var i=0, l=values.length; i<l; i++) {
      if (babel[values[i].name] == "type") {
        tmpType = babel[values[i].value] || values[i].value;
      }
    }

    var obj;

    if (tmpType === "R2") {
      obj = {
        type:       "R2",
        id:         "E0",
        cID:        "",
        x:          "0",
        y:          "0",
        width:      "100%",
        height:     "100%",
        drawif:     "1",
        fixed:      "false",
        scale:      "48",
        "O.x":      "0",
        "O.y":      "0",
        image:      "",
        bg_display: "topleft",
        background: "ffffff",
        net:        "b8c4c8",
        net10:      "889498",
        axes:       "405860",
        text:       "false",
        numbers:    "false",
        x_axis:     "",
        y_axis:     "",
        resizable:  "false",
        sensitive_to_mouse_movements: "false",
        border_width:  "0",
        border_color:   "000000",
        border_radius: "0",
        info:       "" 
      };
    }
    else if (tmpType === "R3") {
      obj = {
        type:       "R3",
        R3:         "true",
        id:         "E0",
        x:          "0",
        y:          "0",
        width:      "100%",
        height:     "100%",
        drawif:     "1",
        fixed:      "false",
        scale:      "48",
        "O.x":      "0",
        "O.y":      "0",
        image:      "",
        bg_display: "topleft",
        background: "ffffff",
        render:     "sort",
        split:      "false",
        resizable:  "false",
        sensitive_to_mouse_movements: "false",
        border_width:  "0",
        border_color:   "000000",
        border_radius: "0",
        info:       "" 
      }
    }
    else {
      obj = {
        type:       "HTMLIFrame",
        id:         "E0",
        x:          "0",
        y:          "0",
        width:      "100%",
        height:     "100%",
        drawif:     "1",
        file:       "",
        info:       "" 
      }
    }

    var value;
    for(var i=0, l=values.length; i<l; i++) {
      if ( (values[i].name) && (babel[values[i].name]) && (obj[babel[values[i].name]] !== undefined) ) {
        value = values[i].value;

        if (spaceTransList.indexOf(babel[values[i].name]) >= 0) {
          value = babel[values[i].value] || value;
        }

        obj[babel[values[i].name]] = value.replace(/\&squot;/g, "'");
      }
    }

    this.data = obj;
  }

  /**
   *
   */
  paramEditor.ModelSpace.prototype.toString = function() {
    var str = "";
    var value;
    // traverse the values to replace the defaults values of the object

    for (var propName in this.data) {
      // verify the own properties of the object
      if (this.data.hasOwnProperty(propName)) {
        value = this.data[propName];

        //
        if (
          ((propName == "width") && (value == "100%")) ||
          ((propName == "height") && (value == "100%")) ||
          ((propName == "x") && (value == "0")) ||
          ((propName == "y") && (value == "0")) ||
          ((propName == "drawif") && (value == "1")) ||
          ((propName == "fixed") && (value == "false")) ||
          ((propName == "scale") && (value == "48")) ||
          ((propName == "O.x") && (value == "0")) ||
          ((propName == "O.y") && (value == "0")) ||
          ((propName == "bg_display") && (value == "topleft")) ||
          ((propName == "background") && (value == "ffffff")) ||
          ((propName == "net") && (value == "b8c4c8")) ||
          ((propName == "net10") && (value == "889498")) ||
          ((propName == "scale") && (value == "48")) ||
          ((propName == "axes") && (value == "405860")) ||
          ((propName == "text") && (value == "false")) ||
          ((propName == "numbers") && (value == "false")) ||
          ((propName == "resizable") && (value == "false")) ||
          ((propName == "sensitive_to_mouse_movements") && (value == "false")) ||
          ((propName == "border_width") && (value == "0")) ||
          ((propName == "border_color") && (value == "000000")) ||
          ((propName == "border_radius") && (value == "0")) ||
          
          ((propName == "render") && (value == "sort")) ||
          ((propName == "split") && (value == "false"))
        ) {
          continue;
        }
        //

        // translate the value
        if (spaceTransList.indexOf(propName) >= 0) {
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
