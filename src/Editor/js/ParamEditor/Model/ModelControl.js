/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var paramEditor = (function(paramEditor) {

  var controlTransList = ["type", "gui", "region", "discrete", "fixed", "visible", "onlyText", "evaluate", "bold", "italics", "underlined", "Buttons", "action", "borderColor", "flat"];

  /**
   *
   */
  paramEditor.ModelControl = function(values, tmpType) {
    tmpType = tmpType || "spinner";

    for(var i=0, l=values.length; i<l; i++) {
      if (babel[values[i].name] == "gui") {
        tmpType = babel[values[i].value] || values[i].value;
      }
      else if ( (babel[values[i].name] == "type") && (babel[values[i].value] != "numeric") ) {
        tmpType = babel[values[i].value] || values[i].value;
      }
    }

    var obj;

    // if the type is spinner
    if (tmpType == "spinner") {
      obj = {
        id:         "n1",
        cID:        "",
        type:       "numeric",
        gui:        "spinner",
        region:     "sur",
        space:      "E0",
        name:       "",
        expression: "(0,0)",
        value:      "0",
        incr:       "0.1",
        min:        "",
        max:        "",
        discrete:   "false",
        decimals:   "2",
        fixed:      "true",
        exponentialif: "",
        visible:    "true",
        action:     "",
        parameter:  "",
        drawif:     "",
        activeif:   "",
        info:       "" 
        // evaluate:   "false",
        // answer:     "",
        // weight:     ""
      };
    }
    // if the type is textfield
    else if (tmpType == "textfield") {
      obj = {
        cID:        "",
        id:         "n1",
        type:       "numeric",
        gui:        "textfield",
        onlyText:   "false",
        region:     "sur",
        space:      "E0",
        name:       "",
        expression: "(0,0)",
        value:      "0",
        // incr:       "0.1",
        min:        "",
        max:        "",
        discrete:   "false",
        decimals:   "2",
        fixed:      "true",
        exponentialif: "",
        visible:    "true",
        action:     "",
        parameter:  "",
        drawif:     "",
        activeif:   "",
        evaluate:   "false",
        answer:     "",
        info:       ""
        // weight:     ""
      };
    }
    // if the type is menu
    else if (tmpType == "menu") {
      obj = {
        cID:        "",
        id:         "n1",
        type:       "numeric",
        gui:        "menu",
        region:     "sur",
        space:      "E0",
        name:       "",
        expression: "(0,0)",
        value:      "0",
        decimals:   "2",
        fixed:      "true",
        exponentialif: "",
        visible:    "false",
        options:    "op1,op2,op3",
        action:     "",
        parameter:  "",
        drawif:     "",
        activeif:   "",
        info:       ""
        // evaluate:   "false",
        // answer:     "",
        // weight:     ""
      };
    }
    // if the type is scrollbar
    else if (tmpType == "scrollbar") {
      obj = {
        cID:        "",
        id:         "n1",
        type:       "numeric",
        gui:        "scrollbar",
        region:     "sur",
        space:      "E0",
        name:       "",
        expression: "(0,0)",
        value:      "0",
        incr:       "0.1",
        min:        "0",
        max:        "100",
        discrete:   "false",
        decimals:   "2",
        fixed:      "true",
        // exponentialif: "",
        visible:    "false",
        action:     "",
        parameter:  "",
        drawif:     "",
        activeif:   "",
        info:       ""
        // evaluate:   "false",
        // answer:     "",
        // weight:     ""
      };
    }
    // if the type is button
    else if (tmpType == "button") {
      obj = {
        cID:        "",
        id:          "n1",
        gui:         "button",
        type:        "numeric",
        region:      "sur",
        space:       "E0",
        name:        "",
        expression:  "(0,0)",
        value:       "0",
        // visible:     "true",
        color:       "222222",
        borderColor: "false",
        colorInt:    "f0f8ff",
        flat:        "false",
        text_align:  "a_center_center",
        image_align: "a_center_center",
        bold:        "false",
        italics:     "false",
        underlined:  "false",
        font_family: "SansSerif",
        font_size:   "19",
        image:       "",
        action:      "",
        parameter:   "",
        drawif:      "",
        activeif:    "",
        cssClass:    "",
        info:        ""
      };
    }
    // if the type is graphic
    else if (tmpType == "graphic") {
      obj = {
        id:         "g1",
        type:       "graphic",
        space:      "E0",
        color:      "222222",
        colorInt:   "f0f8ff",
        size:       "4",
        expression: "(0,0)",
        constraint: "",
        image:      "",
        drawif:     "",
        activeif:   "",
        info:       ""
      };
    }
    // if the type is text
    else if (tmpType == "text") {
      obj = {
        cID:        "",
        id:         "t1",
        type:       "text",
        space:      "E0",
        expression: "(0,0)",
        font_family: "Monospaced",
        font_size:   "12",
        text:       "",
        answer:     "",
        drawif:     "",
        activeif:   "",
        info:       ""
      };
    }
    // if the type is audio
    else if (tmpType == "checkbox") {
      obj = {
        cID:        "",
        id:         "chk1",
        type:       "checkbox",
        region:     "sur",
        space:      "E0",
        name:       "",
        expression: "(0,0,40,40)",
        value:      "0",
        radio_group: "",
        action:     "",
        parameter:  "",
        drawif:     "",
        activeif:   "",
        info:       ""
      };
    }
    // if the type is audio
    else if (tmpType == "audio") {
      obj = {
        cID:        "",
        id:         "a1",
        type:       "audio",
        space:      "E0",
        expression: "(0,0)",
        drawif:     "",
        file:       "",
        info:       ""
      };
    }
    // if the type is video
    else {
      obj = {
        cID:        "",
        id:         "v1",
        type:       "video",
        space:      "E0",
        expression: "(0,0)",
        drawif:     "",
        file:       "",
        info:       ""
      };
    }

    var value;
    for(var i=0, l=values.length; i<l; i++) {
      if ( (values[i].name) && (babel[values[i].name]) && (obj[babel[values[i].name]] !== undefined) ) {
        value = values[i].value;

        if (controlTransList.indexOf(babel[values[i].name]) >= 0) {
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
  paramEditor.ModelControl.prototype.toString = function() {
    var str = "";
    var value;
    // traverse the values to replace the defaults values of the object
    for (var propName in this.data) {
      // verify the own properties of the object
      if (this.data.hasOwnProperty(propName)) {
        value = this.data[propName];

        // translate the value
        if (controlTransList.indexOf(propName) >= 0) {
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
