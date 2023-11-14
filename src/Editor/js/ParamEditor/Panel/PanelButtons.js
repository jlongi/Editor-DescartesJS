/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var paramEditor = (function(paramEditor) {

  /**
   *
   */
  paramEditor.PanelButtons = function() {
    paramEditor.panelName = "Buttons";
    this.components = {};
    this.container = document.createElement("div");
    this.container.setAttribute("class", "panel");

    // width component
    this.components.width = new paramEditor.LabelTextfield("width", 48, 970);
    this.container.appendChild(this.components.width.domObj);

    // height component
    this.components.height = new paramEditor.LabelTextfield("height", 48, 550);
    this.container.appendChild(this.components.height.domObj);

    this.container.appendChild(document.createElement("br"));

    // about component
    this.components.about = new paramEditor.LabelCheckbox("about", 23, false);
    this.container.appendChild(this.components.about.domObj);

    // config component
    this.components.config = new paramEditor.LabelCheckbox("config", 23, false);
    this.container.appendChild(this.components.config.domObj);

    // init component
    this.components.init = new paramEditor.LabelCheckbox("init", 23, false);
    this.container.appendChild(this.components.init.domObj);

    // clear component
    this.components.clear = new paramEditor.LabelCheckbox("clear", 23, false);
    this.container.appendChild(this.components.clear.domObj);

    // rowsNorth component
    this.components.rowsNorth = new paramEditor.LabelTextfield("rowsNorth", 48, 0);
    this.container.appendChild(this.components.rowsNorth.domObj);

    // rowsSouth component
    this.components.rowsSouth = new paramEditor.LabelTextfield("rowsSouth", 48, 0);
    this.container.appendChild(this.components.rowsSouth.domObj);

    // widthWest component
    this.components.widthWest = new paramEditor.LabelTextfield("widthWest", 30, 150);
    this.container.appendChild(this.components.widthWest.domObj);

    // widthEast component
    this.components.widthEast = new paramEditor.LabelTextfield("widthEast", 30, 150);
    this.container.appendChild(this.components.widthEast.domObj);

    // heightRow component
    this.components.heightRows = new paramEditor.LabelTextfield("heightRows", 30, 40);
    this.container.appendChild(this.components.heightRows.domObj);

    // decimal_symbol
    this.components.decimal_symbol = new paramEditor.LabelMenu("decimal_symbol", 22, [",", "."], ",");
    this.container.appendChild(this.components.decimal_symbol.domObj);

    // language
    this.components.language = new paramEditor.LabelMenu("language", 22, ["español", "english"], "español");
    this.container.appendChild(this.components.language.domObj);

    // editable component
    this.components.editable = new paramEditor.LabelCheckbox("editable", 21, false, "_buttons");
    this.container.appendChild(this.components.editable.domObj);

    // expand component
    this.components.expand = new paramEditor.LabelMenu("expand", 24, ["", "cover", "fit"], "");
    this.container.appendChild(this.components.expand.domObj);

    // image_loader component
    this.components.image_loader = new paramEditor.LabelTextfield("image_loader", 100, "");
    this.container.appendChild(this.components.image_loader.domObj);
  }

  /**
   *
   */
  paramEditor.PanelButtons.prototype.setModelObj = function(objModel) {
    // traverse the values of the components to assign the object model
    for (var propName in this.components) {
      // verify the own properties of the object
      if (this.components.hasOwnProperty(propName)) {

        // show only the attributes of the object
        if (objModel[propName] !== undefined) {
          if (this.components[propName].setModelObj) {
            this.components[propName].setModelObj(objModel);
            this.components[propName].domObj.style.display = paramEditor.displayProperty;
            this.container.appendChild(this.container.removeChild(this.components[propName].domObj));
          }
        }
        else {
          if ((objModel.buttons.data[propName]) && (this.components[propName].setModelObj)) {
            this.components[propName].setModelObj(objModel.buttons.data);
            this.components[propName].domObj.style.display = paramEditor.displayProperty;
            this.container.appendChild(this.container.removeChild(this.components[propName].domObj));
          }
        }
      }
    }

    // console.log(objModel)
  }

  return paramEditor;
})(paramEditor || {});