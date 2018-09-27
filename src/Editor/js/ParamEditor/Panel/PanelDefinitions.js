/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var paramEditor = (function(paramEditor) {

  /**
   *
   */
  paramEditor.PanelDefinitions = function(type) {
    var self = this;
    paramEditor.panelName = "Definitions";
    this.container = document.createElement("div");
    this.container.setAttribute("class", "panel");
    this.components = {};

    // info component
    this.components.info = new paramEditor.LabelTextfield("info", 100, "");
    this.container.appendChild(this.components.info.domObj);

    // id component
    this.components.id = new paramEditor.LabelTextfield("id", 30, "");
    this.container.appendChild(this.components.id.domObj);

    this.components.equalsign = { domObj: document.createElement("span") };
    this.components.equalsign.domObj.innerHTML = " = ";
    this.components.equalsign.domObj.setAttribute("style", "display:none; padding-top:15px;");
    this.container.appendChild(this.components.equalsign.domObj);

    // evaluate component
    this.components.evaluate = new paramEditor.LabelMenu("evaluate", 33, ["onlyOnce"], "onlyOnce");
    this.container.appendChild(this.components.evaluate.domObj);

    // size component
    this.components.size = new paramEditor.LabelTextfield("size", 18, "");
    this.container.appendChild(this.components.size.domObj);

    // columns component
    this.components.columns = new paramEditor.LabelTextfield("columns", 48, "");
    this.container.appendChild(this.components.columns.domObj);

    // rows component
    this.components.rows = new paramEditor.LabelTextfield("rows", 48, "");
    this.container.appendChild(this.components.rows.domObj);

    // expression component
    this.components.expression = new paramEditor.LabelTextarea("expression", 48, 28, "", true);
    this.container.appendChild(this.components.expression.domObj);

    // file component
    this.components.file = new paramEditor.LabelTextfield("file", 100, "");
    this.container.appendChild(this.components.file.domObj);
    // broadcast the change in the file
    this.components.file.textfield.addEventListener("change", function(evt) {
      if (self.objModel.data.type === "library") {
        paramEditor.updateLibraryList();
      }
    });


    // range component
    this.components.range = new paramEditor.LabelTextfield("range", 70, "");
    this.container.appendChild(this.components.range.domObj);

    // algorithm component
    this.components.algorithm = new paramEditor.LabelCheckbox("algorithm", 20, false);
    this.container.appendChild(this.components.algorithm.domObj);
    this.components.algorithm.checkbox.addEventListener("change", function(evt) {
      self.enableElements(this.checked);
    });

    // local component
    this.components.local = new paramEditor.LabelTextfield("local", 100, "");
    this.container.appendChild(this.components.local.domObj);

    // init component
    this.components.init = new paramEditor.LabelTextfieldCode("init", 100, "");
    this.container.appendChild(this.components.init.domObj);

    // doExpr component
    this.components.doExpr = new paramEditor.LabelTextarea("doExpr", 100, 225, "");
    this.container.appendChild(this.components.doExpr.domObj);

    // whileExpr component
    this.components.whileExpr = new paramEditor.LabelTextfield("whileExpr", 100, "");
    this.container.appendChild(this.components.whileExpr.domObj);

    // doc component
    this.components.doc = new paramEditor.LabelTextarea("doc", 100, 394, "");
    this.container.appendChild(this.components.doc.domObj);    
  }

  /**
   *
   */
  paramEditor.PanelDefinitions.prototype.enableElements = function(checked) {
    if (checked) {
      this.components.local.enable();
      this.components.init.enable();
      this.components.doExpr.enable();
      this.components.whileExpr.enable();
    }
    else {
      this.components.local.disable();
      this.components.init.disable();
      this.components.doExpr.disable();
      this.components.whileExpr.disable();
    }
  }

  /**
   *
   */
  paramEditor.PanelDefinitions.prototype.setEditPanel = function(panel) {
    this.editPanel = panel;
  }

  /**
   *
   */
  paramEditor.PanelDefinitions.prototype.setModelObj = function(objModel) {
    this.objModel = objModel;

    // traverse the values of the components to asign the object model
    for (var propName in this.components) {
      // verify the own properties of the object
      if (this.components.hasOwnProperty(propName)) {
        // show only the attributes of the object
        this.components[propName].domObj.style.display = ((objModel.data[propName] !== undefined) || ((propName == "equalsign") && ((objModel.data.type == "variable") || (objModel.data.type == "function")))) ? paramEditor.displayProperty : "none";

        // verify the own properties of the object
        if ((this.components[propName].setModelObj) && (objModel.data[propName] !== undefined)) {
          this.components[propName].setModelObj(objModel.data, this.editPanel);
        }
      }
    }
    if (objModel.data.type === "function") {
      this.enableElements(this.components.algorithm.checkbox.checked);
    }
  }

  return paramEditor;
})(paramEditor || {});