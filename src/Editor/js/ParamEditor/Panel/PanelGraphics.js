/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var paramEditor = (function(paramEditor) {

  /**
   *
   */
  paramEditor.PanelGraphics = function(type) {
    var self = this;
    paramEditor.panelName = "Graphics";
    this.container = document.createElement("div"),
    this.container.setAttribute("class", "panel");
    this.components = {};

    // info component
    this.components.info = new paramEditor.LabelTextfield("info", 100, "");
    this.container.appendChild(this.components.info.domObj);

    // space component
    this.components.space = new paramEditor.LabelMenu("space", 22, [], "");
    this.container.appendChild(this.components.space.domObj);

    // background component
    this.components.background = new paramEditor.LabelCheckbox("background", 12, false);
    this.container.appendChild(this.components.background.domObj);

    // color component
    this.components.color = new paramEditor.LabelColor("color", 13, "");
    this.container.appendChild(this.components.color.domObj);

    // trace component
    this.components.trace = new paramEditor.CheckboxLabelColor("trace", 20, "");
    this.container.appendChild(this.components.trace.domObj);

    // drawif component
    this.components.drawif = new paramEditor.LabelTextfield("drawif", 81, 1);
    this.container.appendChild(this.components.drawif.domObj);

    // abs_coord component
    this.components.abs_coord = new paramEditor.LabelCheckbox("abs_coord", 16, false);
    this.container.appendChild(this.components.abs_coord.domObj);

    // expression component
    this.components.expression = new paramEditor.LabelTextfield("expression", 100, "");
    this.container.appendChild(this.components.expression.domObj);

    // center component
    this.components.center = new paramEditor.LabelTextfield("center", 48, "(0,0)");
    this.container.appendChild(this.components.center.domObj);

    // radius component
    this.components.radius = new paramEditor.LabelTextfield("radius", 48, 1);
    this.container.appendChild(this.components.radius.domObj);

    // init component
    this.components.init = new paramEditor.LabelTextfield("init", 36, 0);
    this.container.appendChild(this.components.init.domObj);

    // end component
    this.components.end = new paramEditor.LabelTextfield("end", 36, 90);
    this.container.appendChild(this.components.end.domObj);

    // vectors component
    this.components.vectors = new paramEditor.LabelCheckbox("vectors", 20, false);
    this.container.appendChild(this.components.vectors.domObj);

    // useFamily component
    this.components.useFamily = new paramEditor.LabelCheckbox("useFamily", 10, false);
    this.container.appendChild(this.components.useFamily.domObj);
    this.components.useFamily.checkbox.addEventListener("change", function(evt) {
      self.enableElements(this.checked);
    });

    // family component
    this.components.family = new paramEditor.LabelTextfield("family", 17, "s");
    this.container.appendChild(this.components.family.domObj);

    // family_interval component
    this.components.family_interval = new paramEditor.LabelTextfield("family_interval", 29, "[0,1]");
    this.container.appendChild(this.components.family_interval.domObj);

    // family_steps component
    this.components.family_steps = new paramEditor.LabelTextfield("family_steps", 27, 8);
    this.container.appendChild(this.components.family_steps.domObj);

    // parameter component
    this.components.parameter = new paramEditor.LabelTextfield("parameter", 21, "s");
    this.container.appendChild(this.components.parameter.domObj);

    // parameter_interval component
    this.components.parameter_interval = new paramEditor.LabelTextfield("parameter_interval", 43, "[0,1]");
    this.container.appendChild(this.components.parameter_interval.domObj);

    // parameter_steps component
    this.components.parameter_steps = new paramEditor.LabelTextfield("parameter_steps", 29, 8);
    this.container.appendChild(this.components.parameter_steps.domObj);

    // file component
    this.components.file = new paramEditor.LabelTextfield("file", 46, "");
    this.container.appendChild(this.components.file.domObj);

    // text component
    this.components.text = new paramEditor.LabelTextfieldTexteditor("text", 100, "");
    this.container.appendChild(this.components.text.domObj);

    // font_family component
    this.components.font_family = new paramEditor.LabelMenu("font_family", 28, ["SansSerif", "Serif", "Monospaced"], "SansSerif");
    this.container.appendChild(this.components.font_family.domObj);

    // font_size component
    this.components.font_size = new paramEditor.LabelTextfield("font_size", 40, "12");
    this.container.appendChild(this.components.font_size.domObj);

    // bold component
    this.components.bold = new paramEditor.LabelCheckbox("bold", 14, false);
    this.container.appendChild(this.components.bold.domObj);

    // italics component
    this.components.italics = new paramEditor.LabelCheckbox("italics", 14, false);
    this.container.appendChild(this.components.italics.domObj);

    // decimals component
    this.components.decimals = new paramEditor.LabelTextfield("decimals", 46, 2);
    this.container.appendChild(this.components.decimals.domObj);

    // fixed component
    this.components.fixed = new paramEditor.LabelCheckbox("fixed", 46, false);
    this.container.appendChild(this.components.fixed.domObj);

    // align component
    this.components.align = new paramEditor.LabelMenu("align", 38, ["a_left", "a_center", "a_right"], "left");
    this.container.appendChild(this.components.align.domObj);

    // anchor component
    this.components.anchor = new paramEditor.LabelMenu("anchor", 54, ["a_top_left", "a_top_center", "a_top_right", "a_center_left", "a_center_center", "a_center_right", "a_bottom_left", "a_bottom_center", "a_bottom_right"], "a_top_left");
    this.container.appendChild(this.components.anchor.domObj);

    // fill component
    this.components.fill = new paramEditor.CheckboxLabelColor("fill", 22, "");
    this.container.appendChild(this.components.fill.domObj);

    // fillP component
    this.components.fillP = new paramEditor.CheckboxLabelColor("fillP", 46, "");
    this.container.appendChild(this.components.fillP.domObj);

    // fillM component
    this.components.fillM = new paramEditor.CheckboxLabelColor("fillM", 46, "");
    this.container.appendChild(this.components.fillM.domObj);

    // size component
    this.components.size = new paramEditor.LabelTextfield("size", 46, 2);
    this.container.appendChild(this.components.size.domObj);

    // width component
    this.components.width = new paramEditor.LabelTextfield("width", 43, 1);
    this.container.appendChild(this.components.width.domObj);

    // border_radius component
    this.components.border_radius = new paramEditor.LabelTextfield("border_radius", 46, 1);
    this.container.appendChild(this.components.border_radius.domObj);

    // spear component
    this.components.spear = new paramEditor.LabelTextfield("spear", 46, 8);
    this.container.appendChild(this.components.spear.domObj);

    // arrow component
    this.components.arrow = new paramEditor.LabelColor("arrow", 46, "");
    this.container.appendChild(this.components.arrow.domObj);

    // visible component
    this.components.visible = new paramEditor.LabelCheckbox("visible", 19, false);
    this.container.appendChild(this.components.visible.domObj);

    // editable component
    this.components.editable = new paramEditor.LabelCheckbox("editable", 19, false);
    this.container.appendChild(this.components.editable.domObj);

    // range component
    this.components.range = new paramEditor.LabelTextfield("range", 46, "[1,100]");
    this.container.appendChild(this.components.range.domObj);

    // inirot component
    this.components.inirot = new paramEditor.LabelTextfield("inirot", 46, "0");
    this.container.appendChild(this.components.inirot.domObj);

    // inipos component
    this.components.inipos = new paramEditor.LabelTextfield("inipos", 46, "[0,0]");
    this.container.appendChild(this.components.inipos.domObj);

    // name component
    this.components.name = new paramEditor.LabelTextfield("name", 46, "");
    this.container.appendChild(this.components.name.domObj);

    // border component
    this.components.border = new paramEditor.CheckboxLabelColor("border", 46, "");
    this.container.appendChild(this.components.border.domObj);

    // opacity component
    this.components.opacity = new paramEditor.LabelTextfield("opacity", 46, "");
    this.container.appendChild(this.components.opacity.domObj);

    // lineDash component
    this.components.lineDash = new paramEditor.LabelMenu("lineDash", 31, ["solid", "dot", "dash"], "solid");
    this.container.appendChild(this.components.lineDash.domObj);
  }

  /**
   *
   */
  paramEditor.PanelGraphics.prototype.updateSpaceList = function(model) {
    var spaceList = model.data.spaces;
    var spaceNames = [];
    for (var i=0, l=spaceList.length; i<l; i++) {
      if (spaceList[i].data.type == "R2") {
        spaceNames.push(spaceList[i].data.id);
      }
    }

    this.components.space.makeOptions(spaceNames);
   }

  /**
   *
   */
  paramEditor.PanelGraphics.prototype.enableElements = function(checked) {
    if (checked) {
      this.components.family.enable();
      this.components.family_interval.enable();
      this.components.family_steps.enable();
    }
    else {
      this.components.family.disable();
      this.components.family_interval.disable();
      this.components.family_steps.disable();
    }
  }

  /**
   *
   */
  paramEditor.PanelGraphics.prototype.setEditPanel = function(panel) {
    this.editPanel = panel;
  }

  /**
   *
   */
  paramEditor.PanelGraphics.prototype.setModelObj = function(objModel) {
    this.objModel = objModel;

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

    this.enableElements(this.components.useFamily.checkbox.checked);
  }

  return paramEditor;
})(paramEditor || {});
