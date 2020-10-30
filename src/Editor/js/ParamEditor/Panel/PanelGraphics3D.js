/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var paramEditor = (function(paramEditor) {

  /**
   *
   */
  paramEditor.PanelGraphics3D = function(type) {
    var self = this;
    paramEditor.panelName = "Graphics3D";
    this.container = document.createElement("div"),
    this.container.setAttribute("class", "panel");
    this.components = {};

    // info component
    this.components.info = new paramEditor.LabelTextfield("info", 100, "");
    this.container.appendChild(this.components.info.domObj);

    // space component
    this.components.space = new paramEditor.LabelMenu("space", 28, [], "");
    this.container.appendChild(this.components.space.domObj);

    // // background component
    // this.components.background = new paramEditor.LabelCheckbox("background", false);
    // this.container.appendChild(this.components.background.domObj);

    // color component
    this.components.color = new paramEditor.LabelColor("color", 17, "");
    this.container.appendChild(this.components.color.domObj);

    // backcolor component
    this.components.backcolor = new paramEditor.LabelColor("backcolor", 24, "");
    this.container.appendChild(this.components.backcolor.domObj);

    // fill curve component
    this.components.fill = new paramEditor.CheckboxLabelColor("fill", 24, "");
    this.container.appendChild(this.components.fill.domObj);

    // model component
    this.components.model = new paramEditor.LabelMenu("model", 25, ["color", "light", "metal", "wire"], "color");
    this.container.appendChild(this.components.model.domObj);

    // // name component
    this.components.name = new paramEditor.LabelTextfield("name", 26, "");
    this.container.appendChild(this.components.name.domObj);

    // drawif component
    this.components.drawif = new paramEditor.LabelTextfield("drawif", 100, 1);
    this.container.appendChild(this.components.drawif.domObj);

    // expression component
    this.components.expression = new paramEditor.LabelTextfieldCode("expression", 100, "");
    this.container.appendChild(this.components.expression.domObj);

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

    // inirot component
    this.components.inirot = new paramEditor.LabelTextfield("inirot", 46, "(0,0,0)");
    this.container.appendChild(this.components.inirot.domObj);

    // inipos component
    this.components.inipos = new paramEditor.LabelTextfield("inipos", 46, "(0,0,0)");
    this.container.appendChild(this.components.inipos.domObj);

    // endrot component
    this.components.endrot = new paramEditor.LabelTextfield("endrot", 46, "(0,0,0)");
    this.container.appendChild(this.components.endrot.domObj);

    // endpos component
    this.components.endpos = new paramEditor.LabelTextfield("endpos", 46, "(0,0,0)");
    this.container.appendChild(this.components.endpos.domObj);

    // split component
    this.components.split = new paramEditor.LabelCheckbox("split", 31, false);
    this.container.appendChild(this.components.split.domObj);

    // edges component
    this.components.edges = new paramEditor.CheckboxLabelColor("edges", 31, "");
    this.container.appendChild(this.components.edges.domObj);

    // width component
    this.components.width = new paramEditor.LabelTextfield("width", 31, 1);
    this.container.appendChild(this.components.width.domObj);

    // depth component
    this.components.depth = new paramEditor.LabelTextfield("depth", 31, 2);
    this.container.appendChild(this.components.depth.domObj);

    // length component
    this.components.length = new paramEditor.LabelTextfield("length", 31, 2);
    this.container.appendChild(this.components.length.domObj);

    // height component
    this.components.height = new paramEditor.LabelTextfield("height", 31, 2);
    this.container.appendChild(this.components.height.domObj);

    // R component
    this.components.R = new paramEditor.LabelTextfield("R", 31, 1);
    this.container.appendChild(this.components.R.domObj);

    // r component
    this.components.r = new paramEditor.LabelTextfield("r", 31, 1);
    this.container.appendChild(this.components.r.domObj);

    // Nu component
    this.components.Nu = new paramEditor.LabelTextfield("Nu", 31, 7);
    this.container.appendChild(this.components.Nu.domObj);

    // Nv component
    this.components.Nv = new paramEditor.LabelTextfield("Nv", 31, 7);
    this.container.appendChild(this.components.Nv.domObj);

    // lineDash component
    // this.components.lineDash = new paramEditor.LabelMenu("lineDash", 39, ["solid", "dot", "dash", "dash_dot"], "solid");
    // this.container.appendChild(this.components.lineDash.domObj);

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
    this.components.align = new paramEditor.LabelMenu("align", 38, ["a_left", "a_center", "a_right", "a_justify"], "a_left");
    this.container.appendChild(this.components.align.domObj);

    // anchor component
    this.components.anchor = new paramEditor.LabelMenu("anchor", 54, ["a_top_left", "a_top_center", "a_top_right", "a_center_left", "a_center_center", "a_center_right", "a_bottom_left", "a_bottom_center", "a_bottom_right"], "a_top_left");
    this.container.appendChild(this.components.anchor.domObj);

    // width component
    this.components.width = new paramEditor.LabelTextfield("width", 40, 1);
    this.container.appendChild(this.components.width.domObj);

    // border component
    this.components.border = new paramEditor.CheckboxLabelColor("border", 29, "");
    this.container.appendChild(this.components.border.domObj);

    // border_size component
    this.components.border_size = new paramEditor.LabelTextfield("border_size", 29, "");
    this.container.appendChild(this.components.border_size.domObj);

    // offset_dist component
    this.components.offset_dist = new paramEditor.LabelTextfield("offset_dist", 41, "");
    this.container.appendChild(this.components.offset_dist.domObj);

    // offset_angle component
    this.components.offset_angle = new paramEditor.LabelTextfield("offset_angle", 41, "");
    this.container.appendChild(this.components.offset_angle.domObj);

    // shadowColor component
    this.components.shadowColor = new paramEditor.CheckboxLabelColor("shadowColor", 46, "");
    this.container.appendChild(this.components.shadowColor.domObj);

    // shadowBlur component
    this.components.shadowBlur = new paramEditor.LabelTextfield("shadowBlur", 46, "");
    this.container.appendChild(this.components.shadowBlur.domObj);

    // shadowOffsetX component
    this.components.shadowOffsetX = new paramEditor.LabelTextfield("shadowOffsetX", 46, "");
    this.container.appendChild(this.components.shadowOffsetX.domObj);

    // shadowOffsetY component
    this.components.shadowOffsetY = new paramEditor.LabelTextfield("shadowOffsetY", 46, "");
    this.container.appendChild(this.components.shadowOffsetY.domObj);
  }

  /**
   *
   */
  paramEditor.PanelGraphics3D.prototype.updateSpaceList = function(model) {
    var spaceList = model.data.spaces;
    var spaceNames = [];

    for (var i=0, l=spaceList.length; i<l; i++) {
      if (spaceList[i].data.type == "R3") {
        spaceNames.push(spaceList[i].data.id);
      }
    }

    this.components.space.makeOptions(spaceNames);
   }

  /**
   *
   */
  paramEditor.PanelGraphics3D.prototype.enableElements = function(checked) {
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
  paramEditor.PanelGraphics3D.prototype.setEditPanel = function(panel) {
    this.editPanel = panel;
  }

  /**
   *
   */
  paramEditor.PanelGraphics3D.prototype.setModelObj = function(objModel) {
    this.objModel = objModel;

    // traverse the values of the components to asign the object model
    for (var propName in this.components) {
      // verify the own properties of the object
      if (this.components.hasOwnProperty(propName)) {
        // show only the attributes of the object
        this.components[propName].domObj.style.display = (objModel.data[propName] !== undefined) ? paramEditor.displayProperty : "none";

        // hide the expression parameter for some 3D objetcs
        if ((propName === "expression") && (objModel.data.type) && (objModel.data.type.match(/polireg|cube|box|tetrahedron|octahedron|dodecahedron|icosahedron|sphere|ellipsoid|cone|cylinder|torus/gi))) {
          this.components[propName].domObj.style.display = "none";
        }

        // hide the name parameter except for the macro object
        if ((propName === "name") && (objModel.data.type) && (objModel.data.type != "macro")) {
          this.components[propName].domObj.style.display = "none";
        }

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
