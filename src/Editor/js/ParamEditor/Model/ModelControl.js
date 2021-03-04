/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

const krypto = new paramEditor.Krypto();

var paramEditor = (function(paramEditor) {

  var controlTransList = ["type", "gui", "region", "discrete", "fixed", "visible", "horizontal", "onlyText", "evaluate", "bold", "italics", "underlined", "Buttons", "action", "borderColor", "flat"];

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
        label_color: "e0e4e8",
        label_text_color: "000000",
        font_family: "SansSerif",
        font_size:   "0",
        bold:        "false",
        italics:     "false",
        image_inc:  "",
        image_dec:  "",
        btn_pos:    "v_left",
        info:       "" 
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
        label_color: "e0e4e8",
        label_text_color: "000000",
        font_family: "SansSerif",
        font_size:   "0",
        bold:        "false",
        italics:     "false",
        info:       ""
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
        label_color: "e0e4e8",
        label_text_color: "000000",
        font_family: "SansSerif",
        font_size:   "0",
        bold:        "false",
        italics:     "false",
        info:       ""
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
        visible:    "false",
        action:     "",
        parameter:  "",
        drawif:     "",
        activeif:   "",
        label_color: "e0e4e8",
        label_text_color: "000000",
        font_family: "SansSerif",
        font_size:   "0",
        bold:        "false",
        italics:     "false",
        info:       ""
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
        extra_style: "",
        tooltip:     "",
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
        label_color: "e0e4e8",
        label_text_color: "000000",
        font_family: "SansSerif",
        font_size:   "0",
        bold:        "false",
        italics:     "false",
        position:    "a_right",
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
    for (var i=0, l=values.length; i<l; i++) {
      if ( (values[i].name) && (babel[values[i].name]) && (obj[babel[values[i].name]] !== undefined) ) {
        value = values[i].value;

        if (controlTransList.indexOf(babel[values[i].name]) >= 0) {
          value = babel[values[i].value] || value;
        }

        if (babel[values[i].name] === "answer") {
          if (value.match(/^krypto_/)) {
            value = krypto.decode(value.substring(7));
          }
        }

        obj[babel[values[i].name]] = value.replace(/\&squot;/g, "'");
      }
    }

    if (tmpType == "button") {
      if (obj.image.trim().match("^_STYLE_")) {
        obj.extra_style = obj.image.trim().substring(8);
        obj.image = "vacio.gif";
      }
      if (obj.flat == "true") {
        obj.extra_style = "flat=1|" + obj.extra_style;
        obj.flat = "";
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

        //
        if (
          ((propName == "fixed") && (value == "true")) ||
          ((propName == "font_size") && (value == "0")) ||
          ((propName == "font_family") && (value == "SansSerif")) ||
          ((propName == "bold") && (value == "false")) ||
          ((propName == "italics") && (value == "false")) ||
          ((propName == "underlined") && (value == "false")) ||
          ((propName == "label_color") && (value == "e0e4e8")) ||
          ((propName == "label_text_color") && (value == "000000")) ||
          ((propName == "decimals") && (value == "2")) ||
          ((propName == "btn_pos") && (value == "v_left")) ||
          ((propName == "discrete") && (value == "false")) ||
          ((propName == "incr") && (value == "0.1")) ||
          ((propName == "value") && (value == "0")) ||
          ((propName == "borderColor") && (value == "false")) ||
          ((propName == "color") && (value == "222222")) ||
          ((propName == "colorInt") && (value == "f0f8ff")) ||
          ((propName == "text_align") && (value == "a_center_center")) ||
          ((propName == "image_align") && (value == "a_center_center")) ||
          ((propName == "flat") && (value == "false")) ||
          ((propName == "onlyText") && (value == "false")) ||
          ((propName == "evaluate") && (value == "false"))
        ) {
          continue;
        }
        //

        // translate the value
        if (controlTransList.indexOf(propName) >= 0) {
          value = babel.trans(value) || value;
        }

        if (propName === "answer") {
          if (value) {
            value = "krypto_" + krypto.encode(value);
          }
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
