/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var paramEditor = (function(paramEditor) {

  /**
   *
   */
  paramEditor.PanelControls = function(type) {
    var self = this;
    paramEditor.panelName = "Controls";
    this.container = document.createElement("div"),
    this.container.setAttribute("class", "panel");
    this.components = {};

    // info component
    this.components.info = new paramEditor.LabelTextfield("info", 100, "");
    this.container.appendChild(this.components.info.domObj);

    ////////////////////////////////////////////////////////////////////////////////////////////
    // NUMERIC CONTROLS
    ////////////////////////////////////////////////////////////////////////////////////////////
    // id component
    this.components.id = new paramEditor.LabelTextfield("id", 48, "n1");
    this.container.appendChild(this.components.id.domObj);
    
    // name component
    this.components.name = new paramEditor.LabelTextfield("name", 48, "n1");
    this.container.appendChild(this.components.name.domObj);

    // gui component
    this.components.gui = new paramEditor.LabelMenu("gui", 39, ["spinner", "textfield", "menu", "scrollbar", "button"], "spinner");
    this.container.appendChild(this.components.gui.domObj);

    // region component
    if (paramEditor.editor.isArquimedes) {
      this.components.region = new paramEditor.LabelMenu("region", 48, ["south", "north", "east", "west", "external", "interior", "scenario"], "south");
    }
    else {
      this.components.region = new paramEditor.LabelMenu("region", 48, ["south", "north", "east", "west", "external", "interior"], "south");
    }
    this.container.appendChild(this.components.region.domObj);
    this.components.region.menu.addEventListener("change", function(evt) {
      self.enableElements(this.value);
    });

    // space component
    this.components.space = new paramEditor.LabelMenu("space", 48, [], "");
    this.container.appendChild(this.components.space.domObj);

    // change the type of the control
    this.components.gui.menu.addEventListener("change", function(evt) {
      var vals = [];
      // copy the values of the control to clone it
      for (var propName in self.objModel.data) {
        // verify the own properties of the object
        if (self.objModel.data.hasOwnProperty(propName)) {
          vals.push(
            {
              name: propName,
              value: self.objModel.data[propName]
            }
          );
        }
      }

      // remove the old values of the control
      for (var propName in self.objModel.data) {
        delete self.objModel.data[propName];
      }

      // create a new control
      var tmpModel = new paramEditor.ModelControl(vals);

      // copy the new values to the old control
      for (var propName in tmpModel.data) {
        self.objModel.data[propName] = tmpModel.data[propName];
      }

      tmpModel = null;

      // set the new model
      self.setModelObj(self.objModel);
    });


    // drawif component
    this.components.drawif = new paramEditor.LabelTextfield("drawif", 48, 1);
    this.container.appendChild(this.components.drawif.domObj);

    // activeif component
    this.components.activeif = new paramEditor.LabelTextfield("activeif", 48, 1);
    this.container.appendChild(this.components.activeif.domObj);

    // spinner only
    this.components.btn_pos = new paramEditor.LabelMenu("btn_pos", 48, ["v_left", "v_right", "h_left", "h_right", "h_left_right"], "v_left");
    this.container.appendChild(this.components.btn_pos.domObj);

    this.components.image_dec = new paramEditor.LabelTextfield("image_dec", 48, "");
    this.container.appendChild(this.components.image_dec.domObj);

    this.components.image_inc = new paramEditor.LabelTextfield("image_inc", 48, "");
    this.container.appendChild(this.components.image_inc.domObj);
    // spinner only

    // expression component
    this.components.expression = new paramEditor.LabelTextfield("expression", 80, "(0,0)");
    this.container.appendChild(this.components.expression.domObj);

    // position component
    this.components.position = new paramEditor.LabelMenu("position", 33, ["a_right", "a_left"], "a_right");
    this.container.appendChild(this.components.position.domObj);

    ////////////////////////////////////////////////////////////////////////////////////////////
    // GRAPHIC CONTROLS
    ////////////////////////////////////////////////////////////////////////////////////////////
    // size component
    this.components.size = new paramEditor.LabelTextfield("size", 18, "");
    this.container.appendChild(this.components.size.domObj);
    ////////////////////////////////////////////////////////////////////////////////////////////
    // GRAPHIC CONTROLS
    ////////////////////////////////////////////////////////////////////////////////////////////

    // value component
    this.components.value = new paramEditor.LabelTextfield("value", 35, "0");
    this.container.appendChild(this.components.value.domObj);


////////
    ////////////////////////////////////////////////////////////////////////////////////
    // next components are only for button controls
    ////////////////////////////////////////////////////////////////////////////////////
    // color component
    this.components.color = new paramEditor.LabelColor("color", 20, "");
    this.container.appendChild(this.components.color.domObj);

    // borderColor component
    this.components.borderColor = new paramEditor.CheckboxLabelColor("borderColor", 25, "");
    this.container.appendChild(this.components.borderColor.domObj);

    // colorInt component
    this.components.colorInt = new paramEditor.LabelColor("colorInt", 22, "");
    this.container.appendChild(this.components.colorInt.domObj);

    // flat component
    // this.components.flat = new paramEditor.LabelCheckbox("flat", 19, false);
    // this.container.appendChild(this.components.flat.domObj);

    // font_family component
    this.components.font_family = new paramEditor.LabelMenu("font_family", 24, ["SansSerif", "Serif", "Monospaced"], "SansSerif");
    this.container.appendChild(this.components.font_family.domObj);

    // font_size component
    this.components.font_size = new paramEditor.LabelTextfield("font_size", 20, "12");
    this.container.appendChild(this.components.font_size.domObj);

    // bold component
    this.components.bold = new paramEditor.LabelCheckbox("bold", 17, false);
    this.container.appendChild(this.components.bold.domObj);

    // italics component
    this.components.italics = new paramEditor.LabelCheckbox("italics", 17, false);
    this.container.appendChild(this.components.italics.domObj);

    // underlined component
    this.components.underlined = new paramEditor.LabelCheckbox("underlined", 17, false);
    this.container.appendChild(this.components.underlined.domObj);

    // text_align component
    this.components.text_align = new paramEditor.LabelMenu("text_align", 36.3, ["a_top_left", "a_top_center", "a_top_right", "a_center_left", "a_center_center", "a_center_right", "a_bottom_left", "a_bottom_center", "a_bottom_right"], "a_top_left");
    this.container.appendChild(this.components.text_align.domObj);

    // image component
    this.components.image = new paramEditor.LabelTextfield("image", 60, "");
    this.container.appendChild(this.components.image.domObj);

    // image_align component
    this.components.image_align = new paramEditor.LabelMenu("image_align", 36, ["a_top_left", "a_top_center", "a_top_right", "a_center_left", "a_center_center", "a_center_right", "a_bottom_left", "a_bottom_center", "a_bottom_right"], "a_top_left");
    this.container.appendChild(this.components.image_align.domObj);

    ////////////////////////////////////////////////////////////////////////////////////
    // previous components are only for button controls
    ////////////////////////////////////////////////////////////////////////////////////
////////

    // label_color component
    this.components.label_color = new paramEditor.LabelColor("label_color", 27, "");
    this.container.appendChild(this.components.label_color.domObj);

    // label_color component
    this.components.label_text_color = new paramEditor.LabelColor("label_text_color", 27, "");
    this.container.appendChild(this.components.label_text_color.domObj);


    // decimals component
    this.components.decimals = new paramEditor.LabelTextfield("decimals", 31, "2");
    this.container.appendChild(this.components.decimals.domObj);

    // fixed component
    this.components.fixed = new paramEditor.LabelCheckbox("fixed", 10, true);
    this.container.appendChild(this.components.fixed.domObj);

    // exponentialif component
    this.components.exponentialif = new paramEditor.LabelTextfield("exponentialif", 33, "");
    this.container.appendChild(this.components.exponentialif.domObj);

    // visible component
    this.components.visible = new paramEditor.LabelCheckbox("visible", 16, true);
    this.container.appendChild(this.components.visible.domObj);    

    // radioGroup component
    this.components.radio_group = new paramEditor.LabelTextfield("radio_group", 30, "0");
    this.container.appendChild(this.components.radio_group.domObj);
        
    // discrete component
    this.components.discrete = new paramEditor.LabelCheckbox("discrete", 17, false);
    this.container.appendChild(this.components.discrete.domObj);

    // incr component
    this.components.incr = new paramEditor.LabelTextfield("incr", 26, "0.1");
    this.container.appendChild(this.components.incr.domObj);

    // min component
    this.components.min = new paramEditor.LabelTextfield("min", 26, "");
    this.container.appendChild(this.components.min.domObj);

    // max component
    this.components.max = new paramEditor.LabelTextfield("max", 26, "");
    this.container.appendChild(this.components.max.domObj);

    ////////////////////////////////////////////////////////////////////////////////////
    // next components are only for choice controls
    ////////////////////////////////////////////////////////////////////////////////////
    // options component
    this.components.options = new paramEditor.LabelTextfield("options", 100, "");
    this.container.appendChild(this.components.options.domObj);
    ////////////////////////////////////////////////////////////////////////////////////
    // previous components are only for choice controls
    ////////////////////////////////////////////////////////////////////////////////////


    ////////////////////////////////////////////////////////////////////////////////////////////
    // GRAPHIC CONTROLS
    ////////////////////////////////////////////////////////////////////////////////////////////
    // constraint component
    this.components.constraint = new paramEditor.LabelTextfield("constraint", 100, "");
    this.container.appendChild(this.components.constraint.domObj);




    // action component
    this.components.action = new paramEditor.LabelMenu("action", 26, ["", "calculate", "init", "clear", "animate", "openURL", "openScene", "playAudio"], "");
    this.container.appendChild(this.components.action.domObj);

    // parameter component
    this.components.parameter = new paramEditor.LabelTextfieldCode("parameter", 70, "");
    this.container.appendChild(this.components.parameter.domObj);

    // extra_style component
    this.components.extra_style = new paramEditor.LabelTextfield("extra_style", 60, "");
    this.container.appendChild(this.components.extra_style.domObj);

    // cssClass component
  //  this.components.cssClass = new paramEditor.LabelTextfield("cssClass", 100, "");
  //  this.container.appendChild(this.components.cssClass.domObj);

    ////////////////////////////////////////////////////////////////////////////////////
    // next components are only for textfield controls
    ////////////////////////////////////////////////////////////////////////////////////
    // onlyText component
    this.components.onlyText = new paramEditor.LabelCheckbox("onlyText", 21, false);
    this.container.appendChild(this.components.onlyText.domObj);

    // evaluate component
    this.components.evaluate = new paramEditor.LabelCheckbox("evaluate", 18, false);
    this.container.appendChild(this.components.evaluate.domObj);

    // answer component
    this.components.answer = new paramEditor.LabelTextfield("answer", 58, "");
    this.container.appendChild(this.components.answer.domObj);

    // weight component
    this.components.weight = new paramEditor.LabelTextfield("weight", 5, "");
    this.container.appendChild(this.components.weight.domObj);
    ////////////////////////////////////////////////////////////////////////////////////
    // previous components are only for textfield controls
    ////////////////////////////////////////////////////////////////////////////////////

    // tooltip component
    this.components.tooltip = new paramEditor.LabelTextfield("tooltip", 90, "");
    this.container.appendChild(this.components.tooltip.domObj);

    ////////////////////////////////////////////////////////////////////////////////////////////
    // TEXT CONTROLS (maybe removed)
    ////////////////////////////////////////////////////////////////////////////////////////////
    // ToDo: posiblemente cambiar a un componente que permita aumentar el area para editar su valor
    // text component
    this.components.text = new paramEditor.LabelTextfield("text", 250, "");
    this.container.appendChild(this.components.text.domObj);

    // Buttons component
    // this.components.Buttons = new paramEditor.LabelCheckbox("Buttons", 19, false);
    // this.container.appendChild(this.components.Buttons.domObj);


    ////////////////////////////////////////////////////////////////////////////////////////////
    // AUDIO & VIDEO CONTROLS (maybe removed)
    ////////////////////////////////////////////////////////////////////////////////////////////
    // file component
    this.components.file = new paramEditor.LabelTextfield("file", 100, "");
    this.container.appendChild(this.components.file.domObj);
  }

  /**
   *
   */
   paramEditor.PanelControls.prototype.updateSpaceList = function(model) {
     var spaceList = model.data.spaces;
     var spaceNames = [];

     for (var i=0, l=spaceList.length; i<l; i++) {
       spaceNames.push(spaceList[i].data.id);
     }

     this.components.space.makeOptions(spaceNames);
   }

  /**
   *
   */
  paramEditor.PanelControls.prototype.enableElements = function(value) {
    if (value === "interior") {
      this.components.space.enable();
      this.components.expression.enable();
    }
    else {
      this.components.space.disable();
      this.components.expression.disable();
    }
  }

  /**
   *
   */
  paramEditor.PanelControls.prototype.setEditPanel = function(panel) {
    this.editPanel = panel;
  }

  /**
   *
   */
  paramEditor.PanelControls.prototype.setModelObj = function(objModel) {
    this.objModel = objModel;

    this.components.region.menu.value = "interior";

    // traverse the values of the components to asign the object model
    for (var propName in this.components) {
      // verify the own properties of the object
      if (this.components.hasOwnProperty(propName)) {
        // show only the attributes of the object
        this.components[propName].domObj.style.display = (objModel.data[propName] !== undefined) ? paramEditor.displayProperty : "none";

        // verify the own properties of the object
        if ((this.components[propName].setModelObj) && (objModel.data[propName] !== undefined)) {
          this.components[propName].setModelObj(objModel.data, this.editPanel);
        }
      }
    }

    this.enableElements(this.components.region.menu.value);
  }

  return paramEditor;
})(paramEditor || {});
