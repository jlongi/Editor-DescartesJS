/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var paramEditor = (function(paramEditor) {

  /**
   *
   */
  paramEditor.PanelSpaces = function(type) {
    var self = this;
    paramEditor.panelName = "Spaces";
    this.components = {};
    this.container = document.createElement("div");
    this.container.setAttribute("class", "panel");

    // info component
    this.components.info = new paramEditor.LabelTextfield("info", 100, "");
    this.container.appendChild(this.components.info.domObj);

    // id component
    this.components.id = new paramEditor.LabelTextfield("id", 25, "E1");
    this.container.appendChild(this.components.id.domObj);

    // broadcast the change in the space id
    this.components.id.textfield.addEventListener("change", function(evt) {
      paramEditor.updateSpaceList();
    });

    // drawif component
    this.components.drawif = new paramEditor.LabelTextfield("drawif", 73, 1);
    this.container.appendChild(this.components.drawif.domObj);


    // x component
    this.components.x = new paramEditor.LabelTextfield("x", 48, 0);
    this.container.appendChild(this.components.x.domObj);

    // y component
    this.components.y = new paramEditor.LabelTextfield("y", 48, 0);
    this.container.appendChild(this.components.y.domObj);

    // width component
    this.components.width = new paramEditor.LabelTextfield("width", 36, "100%");
    this.container.appendChild(this.components.width.domObj);

    // height component
    this.components.height = new paramEditor.LabelTextfield("height", 36, "100%");
    this.container.appendChild(this.components.height.domObj);

    // resizable component
    this.components.resizable = new paramEditor.LabelCheckbox("resizable", 23, false);
    this.container.appendChild(this.components.resizable.domObj);

    ////////////////////////////////////////////////////////////////////////////////////
    // next components are only for R2 & R3 spaces
    ////////////////////////////////////////////////////////////////////////////////////
    // fixed component
    this.components.fixed = new paramEditor.LabelCheckbox("fixed", 11, false);
    this.container.appendChild(this.components.fixed.domObj);

    // scale component
    this.components.scale = new paramEditor.LabelTextfield("scale", 28, 48);
    this.container.appendChild(this.components.scale.domObj);

    // Ox component
    this.components["O.x"] = new paramEditor.LabelTextfield("O.x", 28, 0);
    this.container.appendChild(this.components["O.x"].domObj);

    // Oy component
    this.components["O.y"] = new paramEditor.LabelTextfield("O.y", 28, 0);
    this.container.appendChild(this.components["O.y"].domObj);
    ////////////////////////////////////////////////////////////////////////////////////
    // previous components are only for R2 & R3 spaces
    ////////////////////////////////////////////////////////////////////////////////////

    // image component
    this.components.image = new paramEditor.LabelTextfield("image", 54, "");
    this.container.appendChild(this.components.image.domObj);

    // bg_display component
    this.components.bg_display = new paramEditor.LabelMenu("bg_display", 42, ["topleft", "stretch", "patch", "imgcenter"], "topleft");
    this.container.appendChild(this.components.bg_display.domObj);

    // background component
    this.components.background = new paramEditor.LabelColor("background", 24, "");
    this.container.appendChild(this.components.background.domObj);

    ////////////////////////////////////////////////////////////////////////////////////
    // next components are only for R2 spaces
    ////////////////////////////////////////////////////////////////////////////////////
    // axes component
    this.components.axes = new paramEditor.CheckboxLabelColor("axes", 24, "");
    this.container.appendChild(this.components.axes.domObj);

    // net component
    this.components.net = new paramEditor.CheckboxLabelColor("net", 24, "");
    this.container.appendChild(this.components.net.domObj);

    // net10 component
    this.components.net10 = new paramEditor.CheckboxLabelColor("net10", 24, "");
    this.container.appendChild(this.components.net10.domObj);

    // text component
    this.components.text = new paramEditor.CheckboxLabelColor("text", 22, "");
    this.container.appendChild(this.components.text.domObj);

    // numbers component
    this.components.numbers = new paramEditor.LabelCheckbox("numbers", 17, false);
    this.container.appendChild(this.components.numbers.domObj);

    // x_axis component
    this.components.x_axis = new paramEditor.LabelTextfield("x_axis", 28, "");
    this.container.appendChild(this.components.x_axis.domObj);

    // y_axis component
    this.components.y_axis = new paramEditor.LabelTextfield("y_axis", 28, "");
    this.container.appendChild(this.components.y_axis.domObj);
    ////////////////////////////////////////////////////////////////////////////////////
    // previous components are only for R2 spaces
    ////////////////////////////////////////////////////////////////////////////////////

    ////////////////////////////////////////////////////////////////////////////////////
    // next components are only for R3 spaces
    ////////////////////////////////////////////////////////////////////////////////////
    // render component
    // this.components.render = new paramEditor.LabelMenu("render", 46, ["sort", "painter", "raytrace"], "sort");
    this.components.render = new paramEditor.LabelMenu("render", 46, ["sort", "painter"], "sort");
    this.container.appendChild(this.components.render.domObj);

    // split component
    this.components.split = new paramEditor.LabelCheckbox("split", 23, false);
    this.container.appendChild(this.components.split.domObj);
    ////////////////////////////////////////////////////////////////////////////////////
    // previous components are only for R3 spaces
    ////////////////////////////////////////////////////////////////////////////////////

    ////////////////////////////////////////////////////////////////////////////////////
    // next components are only for R2 & R3 spaces
    ////////////////////////////////////////////////////////////////////////////////////
    
    // sensitive_to_mouse_movements component
    // this.components.sensitive_to_mouse_movements = new paramEditor.LabelCheckbox("sensitive_to_mouse_movements", 48, false);
    // this.container.appendChild(this.components.sensitive_to_mouse_movements.domObj);
    ////////////////////////////////////////////////////////////////////////////////////
    // previous components are only for R2 & R3 spaces
    ////////////////////////////////////////////////////////////////////////////////////

    ////////////////////////////////////////////////////////////////////////////////////
    // next components are only for App & HTMLIfrae spaces
    ////////////////////////////////////////////////////////////////////////////////////
    // file component
    this.components.file = new paramEditor.LabelTextfield("file", 70, "");
    this.container.appendChild(this.components.file.domObj);
    ////////////////////////////////////////////////////////////////////////////////////
    // previous components are only for App & HTMLIfrae spaces
    ////////////////////////////////////////////////////////////////////////////////////
  }

  /**
   *
   */
  paramEditor.PanelSpaces.prototype.setEditPanel = function(panel) {
    this.editPanel = panel;
  }

  /**
   *
   */
  paramEditor.PanelSpaces.prototype.setModelObj = function(objModel) {
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
  }

  return paramEditor;
})(paramEditor || {});
